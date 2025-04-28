# --- ObsidianPluginDevPythonToJS.py ---
# -*- coding: utf-8 -*-
"""
Obsidian Python Bridge Client Library (HTTP Version)

This library provides a Python interface to interact with the companion
Obsidian plugin (obsidian-python-bridge) via a local HTTP server using
JSON messages.
"""

import os
import json
import sys
import traceback
from typing import Any, Dict, List, Optional, Union

# --- Dependencies ---
# Attempt to import requests, required for HTTP communication
try:
    import requests
except ImportError:
    print(
        "ERROR: The 'requests' library is not installed. This library requires it "
        "for HTTP communication with Obsidian.",
        file=sys.stderr
    )
    print(
        "Please install it using: pip install requests",
        file=sys.stderr
    )
    sys.exit(1) # Exit if requests is missing, as it's fundamental

# Attempt to import PyYAML, required for property management functions
try:
    import yaml
except ImportError:
    # Only print a warning, as these functions might not be used
    print(
        "WARNING: PyYAML is not installed. Functions 'manage_properties_key' and "
        "'manage_properties_value' will not work.",
        file=sys.stderr
    )
    print(
        "Install it if needed: pip install PyYAML",
        file=sys.stderr
    )
    # Let methods raise NameError if called without yaml installed

# --- Configuration ---
DEFAULT_HTTP_PORT = 27123
# Use environment variable if set, otherwise fall back to the default.
# Scripts using this library can override this in the constructor.
HTTP_PORT = int(os.environ.get("OBSIDIAN_HTTP_PORT", DEFAULT_HTTP_PORT))

# --- Custom Exception ---
class ObsidianCommError(Exception):
    """
    Custom exception for errors during communication with the Obsidian plugin via HTTP.
    Includes the action that failed, if known, and potentially status code.
    """
    def __init__(self, message: str, action: Optional[str] = None, status_code: Optional[int] = None):
        self.action = action
        self.status_code = status_code
        full_message = f"Action '{action}': " if action else ""
        full_message += f"HTTP {status_code}: " if status_code else ""
        full_message += message
        super().__init__(full_message)

# --- Main Client Class ---
class ObsidianPluginDevPythonToJS:
    """
    Client library to interact with the Obsidian Python Bridge plugin via HTTP.

    Handles communication over HTTP with JSON payloads.
    Provides methods for common Obsidian interactions like notifications,
    accessing note content/metadata, and managing frontmatter properties.
    """

    def __init__(self, http_port: int = HTTP_PORT, connect_timeout: float = 2.0, request_timeout: float = 10.0):
        """
        Initializes the client.

        Args:
            http_port (int): The port number the Obsidian plugin's HTTP server
                             is listening on. Defaults to the value of the
                             OBSIDIAN_HTTP_PORT environment variable or
                             DEFAULT_HTTP_PORT if the variable is not set.
            connect_timeout (float): Timeout in seconds for establishing the
                                     initial HTTP connection test.
            request_timeout (float): Default timeout in seconds for waiting for a
                                     response from the Obsidian plugin for most requests.

        Raises:
            ValueError: If http_port is invalid.
            ObsidianCommError: If the initial connection test fails (e.g., timeout,
                               connection refused, Obsidian not running/plugin inactive).
        """
        if not isinstance(http_port, int) or not (1024 <= http_port <= 65535):
             raise ValueError(f"http_port must be an integer between 1024 and 65535. Received: {http_port}")
        self.http_port = http_port
        self.base_url = f"http://127.0.0.1:{self.http_port}/"
        self.connect_timeout = connect_timeout
        self.request_timeout = request_timeout
        # Use a requests Session for potential performance benefits (connection pooling)
        self.session = requests.Session()
        print(f"Initializing Obsidian client for URL: {self.base_url}")
        # Perform a quick connection test on initialization to fail early
        self._test_connection()

    def _test_connection(self):
        """
        Performs a brief connection attempt to verify HTTP server availability.
        This helps catch configuration issues early.
        """
        print(f"Testing connection to {self.base_url}...")
        test_action = "_test_connection_ping" # Use a dummy action name for context
        try:
            # Send a dummy POST request to the base endpoint.
            # The server should ideally reject non-JSON or unknown actions gracefully.
            # We primarily care if the connection itself works.
            response = self.session.post(
                self.base_url,
                json={"action": test_action, "payload": {}}, # Send minimal valid JSON
                timeout=self.connect_timeout
            )
            # Check for specific error response indicating server is up but action is unknown
            if response.status_code == 500 or response.status_code == 404:
                 try:
                     error_data = response.json()
                     if "error" in error_data and f"Unknown action: {test_action}" in error_data["error"]:
                          print("Connection test successful (server responded as expected to dummy action).")
                          return # Success
                     elif "error" in error_data and "Not Found" in error_data["error"]:
                          print("Connection test successful (server responded 404, likely running).")
                          return # Success (server is up, endpoint might change later)

                 except requests.exceptions.JSONDecodeError:
                     # Server responded with non-JSON, but it responded.
                     print(f"Connection test partially successful (server responded with status {response.status_code}, but not valid JSON). Assuming OK.")
                     return # Treat as success for now

            # If status code is unexpected success (200) or other error
            response.raise_for_status() # Raise HTTPError for bad status codes (4xx or 5xx) not caught above
            print("Connection test successful.")

        except requests.exceptions.Timeout:
            raise ObsidianCommError(
                f"Connection to {self.base_url} timed out after {self.connect_timeout}s. "
                f"Is Obsidian running and the Python Bridge plugin active and listening on port {self.http_port}?",
                action=test_action
            ) from None # Use 'from None' to break the exception chain
        except requests.exceptions.ConnectionError as e:
            raise ObsidianCommError(
                f"Failed to connect to {self.base_url}. "
                f"Check Obsidian status, plugin status, port number ({self.http_port}), and firewall. Error: {e}",
                action=test_action
            ) from e
        except requests.exceptions.RequestException as e:
            # Catch other requests errors (like HTTPError from raise_for_status)
            status_code = e.response.status_code if e.response is not None else None
            raise ObsidianCommError(
                f"HTTP connection test failed: {e}",
                action=test_action,
                status_code=status_code
            ) from e

    def _send_receive(self, action: str, payload: Optional[Dict[str, Any]] = None, timeout: Optional[float] = None) -> Any:
        """
        Core private method to send a request and receive a response via HTTP POST.

        Handles JSON serialization, sending the request, receiving the response,
        JSON deserialization, and response status checking.

        Args:
            action (str): The command action identifier for the Obsidian plugin.
            payload (Optional[Dict[str, Any]]): A dictionary containing data for the action.
                                                Defaults to an empty dictionary if None.
            timeout (Optional[float]): Timeout in seconds for this specific request.
                                       Defaults to self.request_timeout.

        Returns:
            Any: The content of the 'data' field from the successful JSON response.

        Raises:
            ObsidianCommError: For communication failures (HTTP errors, timeouts),
                               JSON parsing errors, or if Obsidian returns a response
                               with status 'error'. Includes the failing action name.
            requests.exceptions.RequestException: For underlying HTTP request issues.
        """
        request_data = {"action": action, "payload": payload if payload is not None else {}}
        request_timeout = timeout if timeout is not None else self.request_timeout
        response_text = "" # Initialize for potential use in error reporting

        # print(f"DEBUG: Sending Action: {action}, Payload: {request_data['payload']}") # Verbose

        try:
            response = self.session.post(
                self.base_url,
                json=request_data, # requests handles JSON serialization and Content-Type header
                timeout=request_timeout
            )
            response_text = response.text # Store raw text for potential error reporting

            # Check for HTTP errors first (4xx, 5xx)
            response.raise_for_status() # Raises HTTPError for bad status codes

            # Attempt to parse the JSON response
            # print(f"DEBUG: Received response status {response.status_code}, text: {response_text}") # Verbose
            response_data = response.json() # Raises JSONDecodeError if parsing fails

            # Validate the response structure and status field
            if isinstance(response_data, dict) and response_data.get("status") == "success":
                # print(f"DEBUG: Success response received for '{action}'.") # Verbose
                return response_data.get("data") # Return the actual data payload
            elif isinstance(response_data, dict) and response_data.get("status") == "error":
                error_message = response_data.get("error", "Unknown error reported by Obsidian.")
                # print(f"DEBUG: Error response received for '{action}': {error_message}") # Verbose
                raise ObsidianCommError(error_message, action=action, status_code=response.status_code)
            else:
                # Handle cases where response is JSON but lacks expected structure
                # print(f"DEBUG: Invalid response format received for '{action}': {response_data}") # Verbose
                raise ObsidianCommError(f"Invalid response format received: {response_data}", action=action, status_code=response.status_code)

        # --- Exception Handling for _send_receive ---
        except requests.exceptions.Timeout:
             raise ObsidianCommError(f"Request timed out after {request_timeout}s waiting for response.", action=action) from None
        except requests.exceptions.ConnectionError as e:
             # Network problems (DNS failure, refused connection, etc)
             raise ObsidianCommError(f"HTTP connection failed: {e}", action=action) from e
        except requests.exceptions.HTTPError as e:
             # Bad HTTP status code (4xx/5xx)
             status_code = e.response.status_code
             # Try to get more specific error from response body if possible
             error_detail = response_text # Default to raw text
             try:
                 error_json = e.response.json()
                 if isinstance(error_json, dict) and "error" in error_json:
                     error_detail = error_json["error"]
             except requests.exceptions.JSONDecodeError:
                 pass # Keep raw text if JSON parsing fails
             raise ObsidianCommError(f"HTTP Error: {error_detail}", action=action, status_code=status_code) from e
        except requests.exceptions.JSONDecodeError as e:
            # Error parsing the JSON response from Obsidian
            raise ObsidianCommError(f"Failed to decode JSON response from Obsidian: {e}. Raw response: '{response_text}'", action=action) from e
        except requests.exceptions.RequestException as e:
             # Catch other potential requests library errors
             status_code = e.response.status_code if e.response is not None else None
             raise ObsidianCommError(f"An unexpected HTTP request error occurred: {e}", action=action, status_code=status_code) from e
        except ObsidianCommError:
             # Re-raise ObsidianCommErrors to preserve action/status context
             raise
        except Exception as e:
            # Catch any other unexpected errors during the process
            # Wrap in ObsidianCommError for consistent error handling
            print(f"ERROR: Unexpected error in _send_receive: {e}\n{traceback.format_exc()}", file=sys.stderr)
            raise ObsidianCommError(f"An unexpected error occurred during communication: {e}", action=action) from e

    # --- Public API Methods (Signatures and core logic remain the same) ---
    # --- They now rely on the HTTP-based _send_receive method ---

    def show_notification(self, content: str, duration: int = 4000) -> None:
        """
        Displays a notification message within the Obsidian interface.

        Args:
            content (str): The text message to display in the notification.
            duration (int): How long the notification should remain visible,
                            in milliseconds (default: 4000ms = 4 seconds).

        Raises:
            ValueError: If content is empty.
            ObsidianCommError: If the request fails or Obsidian reports an error.
        """
        if not content:
            raise ValueError("Notification content cannot be empty.")
        payload = {"content": content, "duration": duration}
        self._send_receive("show_notification", payload)
        print(f"Notification request sent: '{content}' (duration: {duration}ms)")

    def get_active_note_content(self) -> str:
        """
        Retrieves the full Markdown content of the currently active note in Obsidian.

        Returns:
            str: The content of the active note.

        Raises:
            ObsidianCommError: If there is no active note, the active file is not
                               a Markdown file, or the request fails.
        """
        return self._send_receive("get_active_note_content")

    def get_active_note_frontmatter(self) -> Optional[Dict[str, Any]]:
        """
        Retrieves the parsed YAML frontmatter of the currently active note.

        Returns:
            Optional[Dict[str, Any]]: A dictionary representing the frontmatter.
                                      Returns None if the note has no frontmatter.

        Raises:
            ObsidianCommError: If there is no active note or the request fails.
        """
        return self._send_receive("get_active_note_frontmatter")

    def modify_note_content(self, file_path: str, content: str) -> None:
        """
        Modifies the entire content of a specific note using Obsidian's API.

        Args:
            file_path (str): The absolute path to the Markdown note file (.md) to modify.
            content (str): The new, full content to write to the note.

        Raises:
            ValueError: If file_path is not an absolute path.
            ObsidianCommError: If the file is not found within the vault, modification fails,
                               or the request itself fails.
        """
        if not os.path.isabs(file_path):
             raise ValueError(f"file_path must be absolute. Received: '{file_path}'")
        payload = {"filePath": file_path, "content": content}
        self._send_receive("modify_note_content", payload)
        print(f"Note modification request sent for: {file_path}")

    def request_user_input(
        self,
        script_name: str,
        input_type: str,
        message: str,
        validation_regex: Optional[str] = None,
        min_value: Optional[Union[int, float]] = None,
        max_value: Optional[Union[int, float]] = None,
        step: Optional[Union[int, float]] = None,
    ) -> Any:
        """
        Requests user input via a modal dialog shown within Obsidian. Blocks until user interaction.

        Args:
            script_name (str): Name of your script (shown in the modal title).
            input_type (str): Type of input field ('text', 'number', 'range', 'boolean'/'checkbox', 'date').
            message (str): The prompt message displayed to the user.
            validation_regex (Optional[str]): Regex pattern for 'text' input validation.
            min_value, max_value, step: Optional parameters for 'number' or 'range'.

        Returns:
            Any: The value entered by the user (type depends on input_type).

        Raises:
            ValueError: If required arguments are missing.
            ObsidianCommError: If the user cancels the input modal in Obsidian,
                               or if the request fails.
        """
        if not all([script_name, input_type, message]):
             raise ValueError("script_name, input_type, and message are required arguments.")

        payload = {
            "scriptName": script_name,
            "inputType": input_type,
            "message": message,
            **({"validationRegex": validation_regex} if validation_regex else {}),
            **({"minValue": min_value} if min_value is not None else {}),
            **({"maxValue": max_value} if max_value is not None else {}),
            **({"step": step} if step is not None else {}),
        }
        # This call will raise ObsidianCommError if the user cancels (server returns status: error)
        return self._send_receive("request_user_input", payload)

    def get_active_note_absolute_path(self) -> str:
        """
        Retrieves the absolute filesystem path of the currently active note.

        Returns:
            str: The absolute path (e.g., '/home/user/vault/folder/note.md').

        Raises:
            ObsidianCommError: If no active note or path cannot be determined.
        """
        return self._send_receive("get_active_note_absolute_path")

    def get_active_note_relative_path(self) -> str:
        """
        Retrieves the path of the currently active note, relative to the vault root.

        Returns:
            str: The vault-relative path (e.g., 'folder/note.md').

        Raises:
            ObsidianCommError: If no active note or path cannot be determined.
        """
        return self._send_receive("get_active_note_relative_path")

    def get_active_note_title(self) -> str:
        """
        Retrieves the title (filename without extension) of the currently active note.

        Returns:
            str: The title of the note (e.g., 'note').

        Raises:
            ObsidianCommError: If no active note or title cannot be retrieved.
        """
        return self._send_receive("get_active_note_title")

    def get_current_vault_absolute_path(self) -> str:
        """
        Retrieves the absolute filesystem path of the currently open Obsidian vault.

        Returns:
            str: The absolute path to the vault's root directory.

        Raises:
            ObsidianCommError: If the vault path cannot be determined.
        """
        return self._send_receive("get_current_vault_absolute_path")

    def get_all_note_paths(self, absolute: bool = False) -> List[str]:
        """
        Retrieves the paths of all Markdown notes (.md files) within the vault.

        Args:
            absolute (bool): If True, returns absolute filesystem paths.
                             If False (default), returns vault-relative paths.

        Returns:
            List[str]: A list of note path strings.

        Raises:
            ObsidianCommError: If paths cannot be retrieved or vault path is needed but unavailable.
        """
        relative_paths = self._send_receive("get_all_note_paths")

        if not isinstance(relative_paths, list):
             raise ObsidianCommError(f"Expected a list of paths, but received: {type(relative_paths)}", action="get_all_note_paths")

        if absolute:
            vault_path = self.get_current_vault_absolute_path() # This itself uses _send_receive
            clean_vault_path = vault_path.rstrip(os.sep)
            absolute_paths = [os.path.join(clean_vault_path, p.lstrip(os.sep)) for p in relative_paths]
            return absolute_paths
        else:
            return relative_paths

    def get_all_note_titles(self) -> List[str]:
        """
        Retrieves the titles (filenames without extensions) of all Markdown notes.

        Returns:
            List[str]: A list of note title strings.

        Raises:
            ObsidianCommError: If the underlying call to `get_all_note_paths` fails.
        """
        note_paths = self.get_all_note_paths(absolute=False)
        note_titles = [os.path.splitext(os.path.basename(p))[0] for p in note_paths]
        return note_titles

    # --- PROPERTY MANAGEMENT METHODS (Require PyYAML) ---
    # These methods remain functionally the same but now use the HTTP _send_receive
    # for the `modify_note_content` call when use_vault_modify=True.

    def manage_properties_key(self, file_path: str, action: str, key: Optional[str] = None, new_key: Optional[str] = None, use_vault_modify: bool = True) -> Dict[str, Any]:
        """
        Manages top-level keys in a note's YAML frontmatter. Requires PyYAML.

        Args:
            file_path (str): Absolute path to the note file.
            action (str): 'add', 'remove', or 'rename'.
            key (Optional[str]): Key to act upon. Required.
            new_key (Optional[str]): New key name for 'rename'. Required for 'rename'.
            use_vault_modify (bool): True (default) uses Obsidian API via HTTP, False writes directly (RISKY).

        Returns:
            Dict[str, Any]: {'success': True} or {'success': False, 'error': '...'}.

        Raises:
            NameError: If PyYAML is not installed.
            FileNotFoundError: If file_path does not exist.
            ValueError: If action/parameters are invalid.
            yaml.YAMLError: If frontmatter parsing/dumping fails.
            ObsidianCommError: If use_vault_modify is True and the API call fails.
            IOError: If use_vault_modify is False and direct write fails.
        """
        if 'yaml' not in sys.modules:
            raise NameError("PyYAML is required for manage_properties_key. Install it (`pip install PyYAML`).")

        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {'success': False, 'error': f"Invalid file path or not a .md file: {file_path}"}
        if not os.path.isabs(file_path):
             return {'success': False, 'error': f"File path must be absolute: {file_path}"}

        if action not in ['add', 'remove', 'rename']:
            return {'success': False, 'error': f"Invalid action '{action}'. Must be 'add', 'remove', or 'rename'."}
        if not key:
             return {'success': False, 'error': "'key' argument is required."}
        if action == 'rename' and not new_key:
             return {'success': False, 'error': "'new_key' argument is required for 'rename'."}

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            parts = content.split('---', 2)
            if len(parts) < 3 or not parts[0].strip() == "":
                 return {'success': False, 'error': "Could not find valid YAML frontmatter block."}

            yaml_content_str = parts[1]
            main_content = parts[2]

            try:
                frontmatter = yaml.safe_load(yaml_content_str) or {}
                if not isinstance(frontmatter, dict):
                     return {'success': False, 'error': "Frontmatter is not a valid YAML dictionary."}
            except yaml.YAMLError as e:
                 return {'success': False, 'error': f"Failed to parse YAML frontmatter: {e}"}

            original_frontmatter = frontmatter.copy()

            if action == 'add':
                if key in frontmatter:
                    return {'success': False, 'error': f"Cannot add key '{key}': Key already exists."}
                frontmatter[key] = None
                print(f"DEBUG: Added key '{key}' to frontmatter.")
            elif action == 'remove':
                if key not in frontmatter:
                    return {'success': False, 'error': f"Cannot remove key '{key}': Key not found."}
                del frontmatter[key]
                print(f"DEBUG: Removed key '{key}' from frontmatter.")
            elif action == 'rename':
                if key not in frontmatter:
                    return {'success': False, 'error': f"Cannot rename key '{key}': Key not found."}
                if new_key == key:
                     return {'success': False, 'error': "new_key is the same as the old key."}
                if new_key in frontmatter:
                    return {'success': False, 'error': f"Cannot rename to '{new_key}': Target key already exists."}
                frontmatter[new_key] = frontmatter.pop(key)
                print(f"DEBUG: Renamed key '{key}' to '{new_key}'.")

            if frontmatter != original_frontmatter:
                try:
                    updated_yaml_str = yaml.dump(frontmatter, allow_unicode=True, sort_keys=False)
                except yaml.YAMLError as e:
                     return {'success': False, 'error': f"Failed to serialize updated YAML: {e}"}

                updated_full_content = f"---\n{updated_yaml_str}---\n{main_content}"

                if use_vault_modify:
                    print(f"DEBUG: Saving via Obsidian API (HTTP) for {file_path}")
                    # This now uses the HTTP _send_receive internally
                    self.modify_note_content(file_path, updated_full_content)
                    print(f"DEBUG: modify_note_content request sent successfully.")
                else:
                    print(f"DEBUG: [RISKY] Direct file write to {file_path}")
                    try:
                        with open(file_path, 'w', encoding='utf-8') as file:
                            file.write(updated_full_content)
                        print(f"DEBUG: Direct file write successful.")
                    except IOError as e:
                        return {'success': False, 'error': f"Direct file write failed: {e}"}
            else:
                 print(f"DEBUG: No changes made to frontmatter for action '{action}' on key '{key}'.")
                 return {'success': True, 'message': 'No changes needed.'}

            return {'success': True}

        except FileNotFoundError:
             return {'success': False, 'error': f"File not found during operation: {file_path}"}
        except ObsidianCommError as e:
             # Catch errors specifically from modify_note_content (now via HTTP)
             return {'success': False, 'error': f"Obsidian API error during save: {e}"}
        except Exception as e:
            print(f"ERROR: Unexpected error in manage_properties_key: {e}\n{traceback.format_exc()}", file=sys.stderr)
            return {'success': False, 'error': f"An unexpected error occurred: {e}"}

    def manage_properties_value(self, file_path: str, key: str, action: str, value: Any = None, new_value: Any = None, index: Optional[int] = None, use_vault_modify: bool = True) -> Dict[str, Any]:
        """
        Manages values associated with a key in YAML frontmatter. Requires PyYAML.

        Args:
            file_path (str): Absolute path to the note file.
            key (str): The frontmatter key to manage.
            action (str): 'add', 'remove', or 'update'.
            value (Any): Value to add/remove, or old value for list update by value.
            new_value (Any): New value for 'add' (if key null) or 'update'. Required for 'update'.
            index (Optional[int]): Index for list update.
            use_vault_modify (bool): True (default) uses Obsidian API via HTTP, False writes directly (RISKY).

        Returns:
            Dict[str, Any]: {'success': True} or {'success': False, 'error': '...'}.

        Raises:
            NameError: If PyYAML is not installed.
            FileNotFoundError: If file_path does not exist.
            ValueError: If action/parameters are invalid.
            yaml.YAMLError: If frontmatter parsing/dumping fails.
            IndexError: If index is out of bounds.
            ObsidianCommError: If use_vault_modify is True and the API call fails.
            IOError: If use_vault_modify is False and direct write fails.
        """
        if 'yaml' not in sys.modules:
            raise NameError("PyYAML is required for manage_properties_value. Install it (`pip install PyYAML`).")
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {'success': False, 'error': f"Invalid file path or not a .md file: {file_path}"}
        if not os.path.isabs(file_path):
             return {'success': False, 'error': f"File path must be absolute: {file_path}"}
        if not key:
             return {'success': False, 'error': "'key' argument is required."}
        if action not in ['add', 'remove', 'update']:
            return {'success': False, 'error': f"Invalid action '{action}'."}
        if action in ['add', 'remove'] and value is None:
             return {'success': False, 'error': f"'value' required for action '{action}'."}
        if action == 'update' and new_value is None:
             return {'success': False, 'error': "'new_value' required for action 'update'."}

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            parts = content.split('---', 2)
            if len(parts) < 3 or not parts[0].strip() == "":
                 return {'success': False, 'error': "Could not find valid YAML frontmatter block."}
            yaml_content_str = parts[1]
            main_content = parts[2]
            try:
                frontmatter = yaml.safe_load(yaml_content_str) or {}
                if not isinstance(frontmatter, dict):
                     return {'success': False, 'error': "Frontmatter is not a valid YAML dictionary."}
            except yaml.YAMLError as e:
                 return {'success': False, 'error': f"Failed to parse YAML frontmatter: {e}"}

            original_frontmatter = frontmatter.copy()

            if key not in frontmatter:
                if action == 'add':
                    frontmatter[key] = value
                    print(f"DEBUG: Key '{key}' not found, created with provided value.")
                else:
                    return {'success': False, 'error': f"Key '{key}' not found in frontmatter."}

            current_value = frontmatter.get(key)

            if action == 'add':
                if isinstance(current_value, list):
                    items_to_add = value if isinstance(value, list) else [value]
                    current_value.extend(items_to_add)
                    print(f"DEBUG: Added {items_to_add} to list key '{key}'.")
                elif current_value is None:
                     frontmatter[key] = value
                     print(f"DEBUG: Set value for null/new key '{key}'.")
                else:
                    return {'success': False, 'error': f"Cannot add value: Key '{key}' exists but is not a list (type: {type(current_value).__name__})."}
            elif action == 'remove':
                if isinstance(current_value, list):
                    try:
                        current_value.remove(value)
                        print(f"DEBUG: Removed value '{value}' from list key '{key}'.")
                    except ValueError:
                        return {'success': False, 'error': f"Value '{value}' not found in list for key '{key}'."}
                else:
                    return {'success': False, 'error': f"Cannot remove value: Key '{key}' is not a list."}
            elif action == 'update':
                if isinstance(current_value, list):
                    if index is not None:
                        try:
                            if not isinstance(index, int) or index < 0 or index >= len(current_value):
                                 raise IndexError(f"Index {index} out of bounds for list key '{key}' (length {len(current_value)}).")
                            current_value[index] = new_value
                            print(f"DEBUG: Updated index {index} of list key '{key}'.")
                        except IndexError as e:
                            return {'success': False, 'error': str(e)}
                    elif value is not None:
                        try:
                            idx_to_update = current_value.index(value)
                            current_value[idx_to_update] = new_value
                            print(f"DEBUG: Updated first occurrence of '{value}' in list key '{key}'.")
                        except ValueError:
                            return {'success': False, 'error': f"Value '{value}' to update not found in list key '{key}'."}
                    else:
                        return {'success': False, 'error': "For list update, provide 'index' or old 'value'."}
                else:
                    frontmatter[key] = new_value
                    print(f"DEBUG: Updated scalar key '{key}'.")

            if frontmatter != original_frontmatter:
                try:
                    updated_yaml_str = yaml.dump(frontmatter, allow_unicode=True, sort_keys=False)
                except yaml.YAMLError as e:
                     return {'success': False, 'error': f"Failed to serialize updated YAML: {e}"}

                updated_full_content = f"---\n{updated_yaml_str}---\n{main_content}"

                if use_vault_modify:
                    print(f"DEBUG: Saving via Obsidian API (HTTP) for {file_path}")
                    self.modify_note_content(file_path, updated_full_content) # Uses HTTP now
                    print(f"DEBUG: modify_note_content request sent.")
                else:
                    print(f"DEBUG: [RISKY] Direct file write to {file_path}")
                    try:
                        with open(file_path, 'w', encoding='utf-8') as file:
                            file.write(updated_full_content)
                        print(f"DEBUG: Direct file write successful.")
                    except IOError as e:
                        return {'success': False, 'error': f"Direct file write failed: {e}"}
            else:
                 print(f"DEBUG: No changes made to frontmatter for action '{action}' on key '{key}'.")
                 return {'success': True, 'message': 'No changes needed.'}

            return {'success': True}

        except FileNotFoundError:
             return {'success': False, 'error': f"File not found during operation: {file_path}"}
        except ObsidianCommError as e:
             return {'success': False, 'error': f"Obsidian API error during save: {e}"}
        except Exception as e:
            print(f"ERROR: Unexpected error in manage_properties_value: {e}\n{traceback.format_exc()}", file=sys.stderr)
            return {'success': False, 'error': f"An unexpected error occurred: {e}"}


# --- Example Usage (Entry point for testing) ---
if __name__ == "__main__":
    print("--- Obsidian Python Bridge Client Library (HTTP Version) ---")
    print(f"Attempting to use port: {HTTP_PORT} (Set OBSIDIAN_HTTP_PORT to override)")
    print("Requires the 'requests' library: pip install requests")
    if 'yaml' not in sys.modules:
        print("PyYAML not found, property management tests will be skipped.")
    print("This script is intended to be imported. Running example:")

    try:
        # Initialize with default/env port
        # You can override it: obsidian = ObsidianPluginDevPythonToJS(http_port=12345)
        obsidian = ObsidianPluginDevPythonToJS() # Uses HTTP_PORT
        print("\nInitialization and connection test successful!")

        # --- Basic API Tests ---
        print("\nTesting show_notification...")
        obsidian.show_notification("Hello from Python Bridge test script (HTTP Version)!", 5000)
        print(" -> show_notification request sent (check Obsidian).")

        print("\nTesting get_active_note_title...")
        try:
            title = obsidian.get_active_note_title()
            print(f" -> Active note title: {title}")
        except ObsidianCommError as e:
            print(f" -> Failed to get active note title: {e}")

        # --- Property Management Test (Requires PyYAML and a test file) ---
        # Create a dummy file path for testing property management
        # IMPORTANT: Adjust this path to a safe location for testing!
        # test_file_path = os.path.abspath("./test_note_for_props.md")
        # print(f"\n--- Property Management Tests (using file: {test_file_path}) ---")

        # if 'yaml' in sys.modules:
        #     # Ensure the test file exists with some initial content
        #     initial_content = "---\n" \
        #                       "tags: [test, initial]\n" \
        #                       "scalar_key: initial_value\n" \
        #                       "list_key: [a, b, c]\n" \
        #                       "---\n" \
        #                       "This is the main content.\n"
        #     try:
        #         with open(test_file_path, 'w', encoding='utf-8') as f:
        #             f.write(initial_content)
        #         print(f"Created/Reset test file: {test_file_path}")

        #         # Test manage_properties_key (using Obsidian API - recommended)
        #         print("\nTesting manage_properties_key (add 'new_key')...")
        #         result = obsidian.manage_properties_key(test_file_path, 'add', key='new_key', use_vault_modify=True)
        #         print(f" -> Result: {result}")

        #         # ... (other property tests remain the same conceptually) ...

        #     except Exception as prop_err:
        #          print(f"ERROR during property management tests: {prop_err}")
        # else:
        #      print("\nSkipping property management tests because PyYAML is not installed.")


        print("\n--- Test Script Finished ---")

    # --- Catch Specific Errors for Better User Feedback ---
    except ObsidianCommError as e:
        print(f"\n--- ERROR ---", file=sys.stderr)
        print(f"An error occurred communicating with Obsidian: {e}", file=sys.stderr)
        print("\nTroubleshooting:", file=sys.stderr)
        print("1. Is Obsidian running with the Python Bridge plugin enabled?", file=sys.stderr)
        print(f"2. Is the plugin's HTTP Port set correctly in Obsidian settings (script expects {HTTP_PORT})?", file=sys.stderr)
        print("3. Is another application using that port?", file=sys.stderr)
        print("4. Check Obsidian's developer console (Ctrl+Shift+I or Cmd+Opt+I) for related errors.", file=sys.stderr)
        sys.exit(1) # Exit with error code
    except NameError as e:
         # Catch missing PyYAML if property functions were called
         print(f"\n--- ERROR ---", file=sys.stderr)
         print(f"Missing dependency: {e}", file=sys.stderr)
         print("Install required libraries (e.g., pip install PyYAML requests)", file=sys.stderr)
         sys.exit(1)
    except Exception as e:
        # Catch any other unexpected errors
        print(f"\n--- UNEXPECTED ERROR ---", file=sys.stderr)
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        traceback.print_exc() # Print full traceback for debugging
        sys.exit(1) # Exit with error code

