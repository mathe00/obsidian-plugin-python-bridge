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
import argparse # Needed for CLI argument parsing

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

# --- Global variable to store settings definitions ---
# This will be populated by the user script calling define_settings

# --- Global variable to store event handling status ---
_is_handling_event = False
_event_name = None
_event_payload = None

# --- Check for Event Trigger Environment Variables AT MODULE LEVEL ---
# This ensures these globals are set based on the environment *when the module is imported*.
_event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
if _event_name_from_env:
    _is_handling_event = True
    _event_name = _event_name_from_env
    _payload_str_from_env = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        _event_payload = json.loads(_payload_str_from_env)
    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse event payload JSON for event '{_event_name}'. Payload: '{_payload_str_from_env}'", file=sys.stderr)
        _event_payload = {"error": "Failed to parse payload", "raw_payload": _payload_str_from_env}
    # print(f"DEBUG: Module level event check: Name={_event_name}, Payload={_event_payload}", file=sys.stderr) # Optional debug

# --- Function for user scripts to define their settings ---
def define_settings(settings_list: List[Dict[str, Any]]):
    """
    Registers the settings definitions for the current script.

    This function should be called once at the beginning of the user script.
    The provided list should conform to the expected JSON structure.

    Args:
        settings_list (List[Dict[str, Any]]): A list of dictionaries,
            each defining a setting. Expected keys per dictionary:
            - key (str): Unique identifier for the setting.
            - type (str): UI control type ('text', 'textarea', 'number',
                          'toggle', 'dropdown', 'slider').
            - label (str): Display name in Obsidian settings.
            - description (str): Help text shown below the setting.
            - default (Any): Default value.
            - options (Optional[List[str]]): List of choices for 'dropdown'.
            - min (Optional[Union[int, float]]): Min value for 'number'/'slider'.
            - max (Optional[Union[int, float]]): Max value for 'number'/'slider'.
            - step (Optional[Union[int, float]]): Step value for 'number'/'slider'.
    """
    global _script_settings_definitions
    # Basic validation could be added here if desired
    _script_settings_definitions = settings_list
    # print(f"DEBUG: Settings definitions registered: {_script_settings_definitions}") # Optional debug

# --- Internal function to handle CLI arguments ---
def _handle_cli_args():
    """
    Checks for specific command-line arguments like --get-settings-json.

    If --get-settings-json is found, prints the registered settings definitions
    as JSON to stdout and exits the script immediately.

    This should be called early in the user script, after define_settings.
    """
    # Use ArgumentParser for robust argument handling
    parser = argparse.ArgumentParser(description="Obsidian Python Bridge Script Runner Helper")
    parser.add_argument(
        '--get-settings-json',
        action='store_true',
        help='If passed, print script settings definitions as JSON and exit.'
    )
    # Parse only known args defined above, ignore others that might be passed
    # This prevents errors if Obsidian or the user passes other args accidentally

    # --- Check for Event Trigger Environment Variables ---
    # This check happens AFTER parsing CLI args but BEFORE checking --get-settings-json
    # because event triggers should take precedence over settings discovery.
    global _is_handling_event, _event_name, _event_payload
    _event_name = os.environ.get("OBSIDIAN_EVENT_NAME")
    if _event_name:
        _is_handling_event = True
        payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
        try:
            _event_payload = json.loads(payload_str)
        except json.JSONDecodeError:
            print(f"ERROR: Failed to parse event payload JSON for event '{_event_name}'. Payload: '{payload_str}'", file=sys.stderr)
            _event_payload = {"error": "Failed to parse payload", "raw_payload": payload_str}
        # print(f"DEBUG: Script triggered by event: {_event_name}, Payload: {_event_payload}", file=sys.stderr) # Optional debug
        # --- IMPORTANT: Do NOT exit here. Let the main script logic check _is_handling_event ---

    if args.get_settings_json:
        # print("DEBUG: --get-settings-json flag detected.", file=sys.stderr) # Optional debug
        try:
            # Use the globally stored definitions populated by define_settings
            json_output = json.dumps(_script_settings_definitions) # No indent for production
            print(json_output) # Print JSON to stdout
            sys.exit(0) # Exit successfully, preventing rest of script execution
        except TypeError as e:
            # Error during JSON serialization (e.g., non-serializable default value)
            error_msg = {
                "status": "error",
                "error": f"Failed to serialize settings definitions to JSON: {e}. Check default values.",
                "definitions": _script_settings_definitions # Include definitions for debugging
            }
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1) # Exit with error
        except Exception as e:
            # Catch other unexpected errors during JSON dump or exit
            error_msg = {
                "status": "error",
                "error": f"Unexpected error during settings JSON export: {e}"
            }
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1) # Exit with error

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
    accessing note content/metadata, managing frontmatter properties,
    and retrieving script-specific settings.
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
        # Store script path for event listener registration payload
        self._script_relative_path_for_api: Optional[str] = None

        # --- Read script relative path from environment variable ---
        # This is crucial for the get_script_settings method.
        self.script_relative_path: Optional[str] = os.environ.get("OBSIDIAN_SCRIPT_RELATIVE_PATH")
        self._script_relative_path_for_api = self.script_relative_path # Store for API calls
        if not self.script_relative_path:
             # Log a warning but don't prevent initialization.
             # Only get_script_settings will fail later if called.
             print("WARNING: OBSIDIAN_SCRIPT_RELATIVE_PATH environment variable not set. "
                   "The get_script_settings() method will not work.", file=sys.stderr)

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
            response = self.session.post(
                self.base_url,
                json={"action": test_action, "payload": {}}, # Send minimal valid JSON
                timeout=self.connect_timeout
            )
            # Expecting an error response for the dummy action is success
            if 400 <= response.status_code < 600:
                 try:
                     error_data = response.json()
                     # Check if the error message matches known non-fatal errors for the ping
                     if "error" in error_data and (f"Unknown action: {test_action}" in error_data["error"] or "Not Found" in error_data["error"]):
                          print("Connection test successful (server responded as expected).")
                          return # Success
                 except requests.exceptions.JSONDecodeError:
                     # Server responded with an error status but non-JSON body, still counts as responding
                     pass
                 # If error is different or not JSON, still log partial success
                 print(f"Connection test partially successful (server responded with status {response.status_code}). Assuming OK.")
                 return # Treat as success for now

            # If status code is unexpected success (2xx) or other non-error code
            response.raise_for_status() # Raise HTTPError for bad status codes (e.g. 3xx redirection) not caught above
            print("Connection test successful (received unexpected 2xx/3xx status).")

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
             raise ObsidianCommError(f"HTTP Error {status_code}: {error_detail}", action=action, status_code=status_code) from e
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

    # --- Public API Methods ---

    # --- NEW: Get Script Settings ---
    def get_script_settings(self) -> Dict[str, Any]:
        """
        Retrieves the current values of the settings defined by this script,
        as configured by the user in the Obsidian Python Bridge settings tab.

        Reads the script's relative path from the OBSIDIAN_SCRIPT_RELATIVE_PATH
        environment variable set by the plugin when launching the script.

        Returns:
            Dict[str, Any]: A dictionary where keys are the setting 'key's
                            and values are the current setting values. Returns
                            an empty dictionary if no settings are defined,
                            no values are set, or the script path couldn't be determined.

        Raises:
            ObsidianCommError: If the request fails, Obsidian reports an error,
                               or the script path environment variable is missing.
        """
        if not self.script_relative_path:
            raise ObsidianCommError(
                "Cannot get script settings: OBSIDIAN_SCRIPT_RELATIVE_PATH environment variable is missing. "
                "Ensure the script is run via the Obsidian plugin.",
                action="get_script_settings"
            )

        payload = {"scriptPath": self.script_relative_path}
        settings_values = self._send_receive("get_script_settings", payload)

        # Ensure the received data is a dictionary, even if empty
        if not isinstance(settings_values, dict):
            print(f"WARNING: get_script_settings received non-dict data from plugin: {type(settings_values)}. Returning empty dict.", file=sys.stderr)
            return {}

        return settings_values

    # --- Existing Methods ---

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
        # NOTE: This uses the DEPRECATED action name in the plugin.
        # Should ideally use "modify_note_content_by_path" with a relative path.
        # For now, keeping it as is for backward compatibility, but the plugin
        # side handles the absolute path conversion.
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
        **kwargs # Allow passing future/other args easily
    ) -> Any:
        """
        Requests user input via a modal dialog shown within Obsidian. Blocks until user interaction.

        Args:
            script_name (str): Name of your script (shown in the modal title).
            input_type (str): Type of input field ('text', 'textarea', 'number', 'range',
                              'boolean'/'checkbox', 'date').
            message (str): The prompt message displayed to the user.
            validation_regex (Optional[str]): Regex pattern for 'text' input validation.
            min_value, max_value, step: Optional parameters for 'number', 'range', 'slider'.
            **kwargs: Additional parameters for future input types.

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
            # Include optional args only if they have a value
            **({"validationRegex": validation_regex} if validation_regex else {}),
            **({"minValue": min_value} if min_value is not None else {}),
            **({"maxValue": max_value} if max_value is not None else {}),
            **({"step": step} if step is not None else {}),
            **kwargs # Include any other passed arguments
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

    def get_note_content(self, path: str) -> str:
        """
        Retrieves the full content of a specific note.

        Args:
            path (str): The vault-relative path to the note (e.g., "Folder/My Note.md").

        Returns:
            str: The content of the note.

        Raises:
            ObsidianCommError: If the note is not found or the request fails.
            ValueError: If the path is empty.
        """
        if not path: raise ValueError("Path cannot be empty.")
        # Path should be relative to the vault for the plugin
        return self._send_receive("get_note_content", {"path": path})

    def get_note_frontmatter(self, path: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the parsed YAML frontmatter of a specific note.

        Args:
            path (str): The vault-relative path to the note.

        Returns:
            Optional[Dict[str, Any]]: Frontmatter dictionary, or None if none exists.

        Raises:
            ObsidianCommError: If the note is not found or the request fails.
            ValueError: If the path is empty.
        """
        if not path: raise ValueError("Path cannot be empty.")
        # Path should be relative to the vault
        return self._send_receive("get_note_frontmatter", {"path": path})

    def get_selected_text(self) -> str:
        """
        Retrieves the currently selected text in the active editor.

        Returns:
            str: The selected text (can be an empty string if nothing is selected).

        Raises:
            ObsidianCommError: If no Markdown editor is active or the request fails.
        """
        return self._send_receive("get_selected_text")

    def replace_selected_text(self, replacement: str) -> None:
        """
        Replaces the selected text in the active editor.
        If nothing is selected, inserts the text at the cursor position.

        Args:
            replacement (str): The text to insert or replace the selection with.

        Raises:
            ObsidianCommError: If no Markdown editor is active or the request fails.
        """
        # replacement can be an empty string to just delete selection
        self._send_receive("replace_selected_text", {"replacement": replacement})
        print(f"Selection replacement request sent.")

    def open_note(self, path: str, new_leaf: bool = False) -> None:
        """
        Opens a specific note in the Obsidian interface using its link path.

        This function uses Obsidian's internal link resolution mechanism.

        Args:
            path (str): The vault-relative path of the note to open, **WITHOUT the .md extension**.
                        For example: "Folder/My Note" or "My Note".
            new_leaf (bool): If True, attempts to open the note in a new leaf (tab/split).
                             Defaults to False.

        Raises:
            ObsidianCommError: If the note cannot be opened (e.g., path not resolved by Obsidian)
                               or the request fails.
            ValueError: If the path is empty.
        """
        if not path: raise ValueError("Path cannot be empty.")
        # Send the path without .md, as openLinkText expects a link path
        self._send_receive("open_note", {"path": path, "new_leaf": new_leaf})
        print(f"Request sent to open note link: {path} (new_leaf: {new_leaf})")


    # --- PROPERTY MANAGEMENT METHODS (Require PyYAML) ---
    # --- FULL IMPLEMENTATION RESTORED ---

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
            # Read the entire file content
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            # --- YAML Frontmatter Parsing ---
            parts = content.split('---', 2)
            if len(parts) < 3 or not parts[0].strip() == "": # Basic check for YAML block at the start
                 # If no frontmatter, treat as empty for 'add', error otherwise
                 if action == 'add':
                     frontmatter = {}
                     main_content = content # Use the whole content
                     print("DEBUG: No frontmatter found, creating new one for 'add'.")
                 else:
                     return {'success': False, 'error': "Could not find valid YAML frontmatter block (---) at the start of the file."}
            else:
                yaml_content_str = parts[1]
                main_content = parts[2] # The rest of the note content

                # Parse the YAML string
                try:
                    # Use safe_load to avoid arbitrary code execution
                    frontmatter = yaml.safe_load(yaml_content_str) or {} # Treat empty/null YAML as empty dict
                    if not isinstance(frontmatter, dict):
                         return {'success': False, 'error': "Frontmatter exists but is not a valid YAML dictionary."}
                except yaml.YAMLError as e:
                     return {'success': False, 'error': f"Failed to parse YAML frontmatter: {e}"}

            # --- Perform Action ---
            original_frontmatter = frontmatter.copy() # Keep a copy for comparison if needed

            if action == 'add':
                if key in frontmatter:
                    return {'success': False, 'error': f"Cannot add key '{key}': Key already exists."}
                # Add the key with a null value (common practice)
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
                     return {'success': False, 'error': "Cannot rename key: new_key is the same as the old key."}
                if new_key in frontmatter:
                    return {'success': False, 'error': f"Cannot rename to '{new_key}': Target key already exists."}
                # Rename by adding new key with old value and deleting old key
                frontmatter[new_key] = frontmatter.pop(key)
                print(f"DEBUG: Renamed key '{key}' to '{new_key}'.")

            # --- Reconstruct Content and Save ---
            # Only proceed if frontmatter actually changed
            if frontmatter != original_frontmatter:
                # If the frontmatter is now empty, don't write the '---' block
                if not frontmatter:
                    updated_full_content = main_content.lstrip() # Remove leading newline if any
                else:
                    try:
                        # Dump the modified frontmatter back to a YAML string
                        # allow_unicode=True preserves non-ASCII characters
                        # sort_keys=False preserves original key order as much as possible
                        # default_flow_style=False ensures block style for readability
                        updated_yaml_str = yaml.dump(frontmatter, allow_unicode=True, sort_keys=False, default_flow_style=False)
                    except yaml.YAMLError as e:
                         return {'success': False, 'error': f"Failed to serialize updated YAML frontmatter: {e}"}

                    # Reconstruct the full file content
                    # Ensure newline after closing '---' if main_content exists
                    separator = "\n" if main_content else ""
                    updated_full_content = f"---\n{updated_yaml_str.strip()}\n---{separator}{main_content}"


                # --- Save based on use_vault_modify flag ---
                if use_vault_modify:
                    print(f"DEBUG: Saving via Obsidian API (HTTP) for {file_path}")
                    # Use the Obsidian API via HTTP - this can raise ObsidianCommError
                    self.modify_note_content(file_path, updated_full_content)
                    print(f"DEBUG: modify_note_content request sent successfully.")
                else:
                    # Direct file write [RISKY]
                    print(f"DEBUG: [RISKY] Attempting direct file write to {file_path}")
                    try:
                        with open(file_path, 'w', encoding='utf-8') as file:
                            file.write(updated_full_content)
                        print(f"DEBUG: Direct file write successful.")
                    except IOError as e:
                        # Catch potential file writing errors
                        return {'success': False, 'error': f"Direct file write failed: {e}"}
            else:
                 print(f"DEBUG: No changes made to frontmatter for action '{action}' on key '{key}'.")
                 # If no changes were made, it's still technically a success
                 return {'success': True, 'message': 'No changes needed.'}

            # If we reached here without errors (either via API or direct write)
            return {'success': True}

        except FileNotFoundError:
             # Should be caught by initial check, but handle just in case
             return {'success': False, 'error': f"File not found during operation: {file_path}"}
        except ObsidianCommError as e:
             # Catch errors specifically from modify_note_content (now via HTTP)
             return {'success': False, 'error': f"Obsidian API error during save: {e}"}
        except Exception as e:
            # Catch any other unexpected errors during the process
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
        # --- Input Validation ---
        if 'yaml' not in sys.modules:
            raise NameError("PyYAML is required for manage_properties_value. Please install it (`pip install PyYAML`).")
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {'success': False, 'error': f"Invalid file path or not a .md file: {file_path}"}
        if not os.path.isabs(file_path):
             return {'success': False, 'error': f"File path must be absolute: {file_path}"}
        if not key:
             return {'success': False, 'error': "'key' argument is required."}
        if action not in ['add', 'remove', 'update']:
            return {'success': False, 'error': f"Invalid action '{action}'. Must be 'add', 'remove', or 'update'."}
        # Allow adding/removing None explicitly if desired.
        # if action in ['add', 'remove'] and value is None:
        #      return {'success': False, 'error': f"'value' argument is required for action '{action}'."}
        # Allow setting a key to None via update
        # if action == 'update' and new_value is None:
        #      pass # new_value can be None for update

        try:
            # --- Read File and Parse YAML ---
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            parts = content.split('---', 2)
            main_content = content # Default if no frontmatter
            frontmatter = {}      # Default if no frontmatter

            if len(parts) >= 3 and parts[0].strip() == "":
                yaml_content_str = parts[1]
                main_content = parts[2]
                try:
                    loaded_fm = yaml.safe_load(yaml_content_str)
                    if isinstance(loaded_fm, dict):
                        frontmatter = loaded_fm
                    elif loaded_fm is not None: # Frontmatter exists but isn't a dict
                         return {'success': False, 'error': "Frontmatter exists but is not a valid YAML dictionary."}
                    # If loaded_fm is None (e.g., '--- ---'), treat as empty dict {}
                except yaml.YAMLError as e:
                     return {'success': False, 'error': f"Failed to parse YAML frontmatter: {e}"}
            elif action != 'add':
                 # No frontmatter found, and action is not 'add'
                 return {'success': False, 'error': f"Key '{key}' not found (no frontmatter) for action '{action}'."}


            # Check if the target key exists before proceeding (except for 'add')
            if key not in frontmatter and action != 'add':
                 return {'success': False, 'error': f"Key '{key}' not found in frontmatter for action '{action}'."}

            # --- Perform Action ---
            original_frontmatter = frontmatter.copy() # For change detection

            if action == 'add':
                # If key doesn't exist, create it with the value
                if key not in frontmatter:
                    # If value is a list, add as list; otherwise, add as scalar
                    frontmatter[key] = value
                    print(f"DEBUG: Key '{key}' not found, created with provided value.")
                # If key exists and is a list, add to it
                elif isinstance(frontmatter[key], list):
                    current_list = frontmatter[key]
                    items_to_add = value if isinstance(value, list) else [value]
                    # Optional: Check for duplicates before adding
                    # unique_items_to_add = [item for item in items_to_add if item not in current_list]
                    # if not unique_items_to_add: return {'success': True, 'message': 'Value(s) already exist.'}
                    # current_list.extend(unique_items_to_add)
                    current_list.extend(items_to_add) # Simple extend
                    print(f"DEBUG: Added {items_to_add} to list key '{key}'.")
                # If key exists but is null, overwrite it
                elif frontmatter[key] is None:
                     frontmatter[key] = value
                     print(f"DEBUG: Set value for null key '{key}'.")
                # If key exists and is not a list or null, it's an error
                else:
                    return {'success': False, 'error': f"Cannot add value: Key '{key}' exists but is not a list or null (type: {type(frontmatter[key]).__name__}). Use 'update' to change scalar values."}

            elif action == 'remove':
                current_value_at_key = frontmatter.get(key) # Use .get() for safety
                if isinstance(current_value_at_key, list):
                    items_to_remove = value if isinstance(value, list) else [value]
                    original_length = len(current_value_at_key)
                    # Remove all occurrences of each item specified
                    new_list = [item for item in current_value_at_key if item not in items_to_remove]

                    if len(new_list) == original_length:
                         return {'success': False, 'error': f"Value(s) '{items_to_remove}' not found in the list for key '{key}'."}

                    frontmatter[key] = new_list
                    print(f"DEBUG: Removed value(s) '{items_to_remove}' from list key '{key}'.")
                    # Optional: Remove key if list becomes empty
                    # if not frontmatter[key]:
                    #     del frontmatter[key]
                    #     print(f"DEBUG: List for key '{key}' became empty, removed key.")

                elif current_value_at_key == value:
                     # Allow removing a scalar value if it matches exactly
                     # This effectively sets the key to None or removes it? Let's remove it.
                     del frontmatter[key]
                     print(f"DEBUG: Removed scalar key '{key}' because its value matched '{value}'.")
                else:
                    # Cannot remove from a non-list if value doesn't match
                    return {'success': False, 'error': f"Cannot remove value: Key '{key}' is not a list, and its value ('{current_value_at_key}') does not match the value to remove ('{value}')."}

            elif action == 'update':
                 current_value_at_key = frontmatter.get(key)
                 if isinstance(current_value_at_key, list):
                    if index is not None:
                        # Update by index
                        try:
                            # Allow negative indices
                            if not isinstance(index, int):
                                raise TypeError("Index must be an integer.")
                            # Check bounds after potential negative index resolution
                            if not (-len(current_value_at_key) <= index < len(current_value_at_key)):
                                 raise IndexError # Raise explicitly for unified handling below
                            current_value_at_key[index] = new_value
                            print(f"DEBUG: Updated index {index} of list key '{key}'.")
                        except IndexError:
                            return {'success': False, 'error': f"Index {index} is out of bounds for list key '{key}' (length {len(current_value_at_key)})."}
                        except TypeError as e:
                             return {'success': False, 'error': str(e)}
                    elif value is not None:
                        # Update by finding old value (first occurrence)
                        try:
                            idx_to_update = current_value_at_key.index(value) # Find first occurrence
                            current_value_at_key[idx_to_update] = new_value
                            print(f"DEBUG: Updated first occurrence of '{value}' in list key '{key}'.")
                        except ValueError:
                            return {'success': False, 'error': f"Value '{value}' to update not found in list key '{key}'."}
                    else:
                        # Need either index or old value to update a list element
                        return {'success': False, 'error': "For list update, provide either 'index' or the old 'value' to replace."}
                 else:
                    # Update scalar value - just overwrite
                    # Optional: Add check `if current_value_at_key == value:` if needed for safety
                    frontmatter[key] = new_value
                    print(f"DEBUG: Updated scalar key '{key}'.")

            # --- Reconstruct Content and Save (if changed) ---
            if frontmatter != original_frontmatter:
                 # If the frontmatter is now empty, don't write the '---' block
                if not frontmatter:
                    updated_full_content = main_content.lstrip() # Remove leading newline if any
                else:
                    try:
                        updated_yaml_str = yaml.dump(frontmatter, allow_unicode=True, sort_keys=False, default_flow_style=False)
                    except yaml.YAMLError as e:
                         return {'success': False, 'error': f"Failed to serialize updated YAML: {e}"}

                    separator = "\n" if main_content else ""
                    updated_full_content = f"---\n{updated_yaml_str.strip()}\n---{separator}{main_content}"


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
             # Catch errors specifically from modify_note_content (now via HTTP)
             return {'success': False, 'error': f"Obsidian API error during save: {e}"}
        except Exception as e:
            # Catch any other unexpected errors during the process
            print(f"ERROR: Unexpected error in manage_properties_value: {e}\n{traceback.format_exc()}", file=sys.stderr)
            return {'success': False, 'error': f"An unexpected error occurred: {e}"}

    def get_obsidian_language(self) -> str:
        """
        Retrieves the language code currently configured in Obsidian.

        Returns:
            str: The language code (e.g., 'en', 'fr').

        Raises:
            ObsidianCommError: If the request fails.
        """
        return self._send_receive("get_obsidian_language")

    def create_note(self, path: str, content: str = '') -> None:
        """
        Creates a new note in the vault.

        Args:
            path (str): The vault-relative path for the new note (e.g., "Folder/New Note.md").
                        Include the .md extension.
            content (str, optional): The initial content for the note. Defaults to empty.

        Raises:
            ValueError: If path is empty.
            ObsidianCommError: If the note creation fails (e.g., path already exists, invalid path).
        """
        if not path: raise ValueError("Path cannot be empty for create_note.")
        payload = {"path": path, "content": content}
        self._send_receive("create_note", payload)
        print(f"Request sent to create note: {path}")

    def check_path_exists(self, path: str) -> bool:
        """
        Checks if a file or folder exists at the given vault-relative path.

        Args:
            path (str): The vault-relative path to check.

        Returns:
            bool: True if the path exists, False otherwise.

        Raises:
            ValueError: If path is empty.
            ObsidianCommError: If the request fails.
        """
        if not path: raise ValueError("Path cannot be empty for check_path_exists.")
        payload = {"path": path}
        return self._send_receive("check_path_exists", payload)

    def delete_path(self, path: str, permanently: bool = False) -> None:
        """
        Deletes a note or folder (moves to system/Obsidian trash by default).

        Args:
            path (str): The vault-relative path of the item to delete.
            permanently (bool, optional): If True, delete permanently instead of moving
                                          to trash. Defaults to False. Use with caution!

        Raises:
            ValueError: If path is empty.
            ObsidianCommError: If the deletion fails (e.g., path not found).
        """
        if not path: raise ValueError("Path cannot be empty for delete_path.")
        payload = {"path": path, "permanently": permanently}
        self._send_receive("delete_path", payload)
        print(f"Request sent to delete path: {path} (Permanently: {permanently})")

    def rename_path(self, old_path: str, new_path: str) -> None:
        """
        Renames or moves a note or folder within the vault.

        Args:
            old_path (str): The current vault-relative path of the item.
            new_path (str): The desired new vault-relative path for the item.

        Raises:
            ValueError: If old_path or new_path are empty.
            ObsidianCommError: If the rename/move fails (e.g., old path not found, new path invalid).
        """
        if not old_path: raise ValueError("old_path cannot be empty for rename_path.")
        if not new_path: raise ValueError("new_path cannot be empty for rename_path.")
        payload = {"old_path": old_path, "new_path": new_path}
        self._send_receive("rename_path", payload)
        print(f"Request sent to rename path: {old_path} -> {new_path}")

    def run_obsidian_command(self, command_id: str) -> None:
        """
        Executes an Obsidian command by its ID.

        Args:
            command_id (str): The ID of the command to execute (e.g., "editor:toggle-bold").

        Raises:
            ValueError: If command_id is empty.
            ObsidianCommError: If the command execution fails (e.g., command ID not found).
        """
        if not command_id: raise ValueError("command_id cannot be empty for run_obsidian_command.")
        payload = {"command_id": command_id}
        self._send_receive("run_obsidian_command", payload)
        print(f"Request sent to run command: {command_id}")

    def get_all_tags(self) -> List[str]:
        """
        Retrieves a list of all unique tags present in the vault.
        Includes the '#' prefix.

        Returns:
            List[str]: A list of unique tags (e.g., ['#tag1', '#tag/nested']).

        Raises:
            ObsidianCommError: If the request fails.
        """
        return self._send_receive("get_all_tags")

    def get_vault_name(self) -> str:
        """
        Retrieves the name of the currently open vault.

        Returns:
            str: The name of the vault.

        Raises:
            ObsidianCommError: If the request fails.
        """
        return self._send_receive("get_vault_name")

    def get_theme_mode(self) -> str:
        """
        Retrieves the current theme mode ('light' or 'dark').

        Returns:
            str: 'light' or 'dark'.

        Raises:
            ObsidianCommError: If the request fails.
        """
        return self._send_receive("get_theme_mode")

    def create_folder(self, path: str) -> None:
        """
        Creates a new folder at the specified vault-relative path.

        Args:
            path (str): The vault-relative path for the new folder (e.g., "New Folder" or "Parent/New Folder").

        Raises:
            ValueError: If path is empty.
            ObsidianCommError: If folder creation fails (e.g., path already exists, invalid path).
        """
        if not path: raise ValueError("Path cannot be empty for create_folder.")
        payload = {"path": path}
        self._send_receive("create_folder", payload)
        print(f"Request sent to create folder: {path}")

    def list_folder(self, path: str) -> Dict[str, List[str]]:
        """
        Lists the files and subfolders within a specified vault folder.

        Args:
            path (str): The vault-relative path of the folder to list.
                        An empty string "" typically represents the vault root.

        Returns:
            Dict[str, List[str]]: A dictionary with keys 'files' and 'folders',
                                  each containing a list of relative paths within that folder.
                                  Example: {'files': ['Note.md'], 'folders': ['Subfolder']}

        Raises:
            ValueError: If path is None (use "" for root).
            ObsidianCommError: If listing fails (e.g., path not found, not a folder).
        """
        if path is None:
             raise ValueError("Path cannot be None for list_folder. Use an empty string \"\" for the vault root.")
        payload = {"path": path}
        return self._send_receive("list_folder", payload)

    def get_links(self, path: str, type: str = 'outgoing') -> List[str]:
        """
        Retrieves links associated with a note.
        Currently only supports 'outgoing' links (including embeds).

        Args:
            path (str): The vault-relative path of the note.
            type (str, optional): The type of links to retrieve. Currently only
                                  'outgoing' is reliably supported. Defaults to 'outgoing'.

        Returns:
            List[str]: A list of link paths (as strings) found in the note.

        Raises:
            ValueError: If path is empty.
            ObsidianCommError: If the request fails (e.g., note not found).
        """
        if not path: raise ValueError("Path cannot be empty for get_links.")
        # Basic validation for type, although only 'outgoing' is implemented server-side for now
        if type not in ['outgoing', 'incoming', 'all']:
             print(f"Warning: Link type '{type}' requested, but only 'outgoing' is currently implemented by the plugin.", file=sys.stderr)
             type = 'outgoing' # Default to outgoing if invalid type requested

        payload = {"path": path, "type": type}
        return self._send_receive("get_links", payload)

    def get_editor_context(self) -> Dict[str, Any]:
        """
        Retrieves context information about the active editor.

        Returns:
            Dict[str, Any]: A dictionary containing editor context, potentially including:
                            - cursor (Dict): {'line': int, 'ch': int}
                            - line_count (int): Total number of lines in the document.
                            (Structure may evolve). Returns empty dict if no editor active.

        Raises:
            ObsidianCommError: If the request fails.
        """
        return self._send_receive("get_editor_context")

    # --- NEW: Event Listener Methods ---

    def register_event_listener(self, event_name: str) -> None:
        """
        Registers this script to listen for a specific Obsidian event.

        When the event occurs in Obsidian, the plugin will execute this script again,
        providing the event details via environment variables:
        - OBSIDIAN_EVENT_NAME: The name of the event (e.g., "vault-modify").
        - OBSIDIAN_EVENT_PAYLOAD: A JSON string containing event data (e.g., '{"path": "Note.md"}').

        Your script should check for `os.environ.get("OBSIDIAN_EVENT_NAME")` at startup
        to handle these event triggers and typically exit afterwards using `sys.exit(0)`.

        Args:
            event_name (str): The name of the Obsidian event to listen for.
                              Supported events include: "vault-modify", "vault-delete",
                              "vault-rename", "metadata-changed", "layout-change",
                              "active-leaf-change".

        Raises:
            ObsidianCommError: If the registration request fails or the script path
                               could not be determined during initialization.
            ValueError: If event_name is empty.
        """
        if not event_name:
            raise ValueError("event_name cannot be empty.")
        if not self._script_relative_path_for_api:
             raise ObsidianCommError(
                 "Cannot register listener: Script path was not determined during initialization. "
                 "Ensure OBSIDIAN_SCRIPT_RELATIVE_PATH environment variable is set.",
                 action="register_event_listener"
             )
        payload = {"eventName": event_name, "scriptPath": self._script_relative_path_for_api}
        self._send_receive("register_event_listener", payload)
        print(f"Event listener registration request sent for: {event_name}")

    def unregister_event_listener(self, event_name: str) -> None:
        """
        Unregisters this script from listening to a specific Obsidian event.

        Args:
            event_name (str): The name of the Obsidian event to stop listening to.

        Raises:
            ObsidianCommError: If the unregistration request fails or the script path
                               could not be determined during initialization.
            ValueError: If event_name is empty.
        """
        if not event_name:
            raise ValueError("event_name cannot be empty.")
        if not self._script_relative_path_for_api:
             raise ObsidianCommError(
                 "Cannot unregister listener: Script path was not determined during initialization. "
                 "Ensure OBSIDIAN_SCRIPT_RELATIVE_PATH environment variable is set.",
                 action="unregister_event_listener"
             )
        payload = {"eventName": event_name, "scriptPath": self._script_relative_path_for_api}
        self._send_receive("unregister_event_listener", payload)
        print(f"Event listener unregistration request sent for: {event_name}")

    def get_backlinks(self, path: str, use_cache_if_available: bool = True, cache_mode: str = 'fast') -> Dict[str, List[Dict[str, Any]]]:
        """
        Retrieves backlinks (incoming links) for a specific note.

        Optionally utilizes the 'obsidian-backlink-cache' plugin if installed
        and enabled in Obsidian for potentially faster results, especially in
        large vaults.

        Args:
            path (str): The vault-relative path of the note (e.g., "Folder/My Note.md").
            use_cache_if_available (bool, optional): If True (default), attempts
                to use the 'obsidian-backlink-cache' plugin if available. If False,
                or if the plugin is not available, uses Obsidian's native method.
            cache_mode (str, optional): Specifies which mode to use if the
                'obsidian-backlink-cache' plugin is used. Must be 'fast' (default)
                or 'safe'. 'safe' ensures all recent changes are processed but might
                be slightly slower than 'fast'. Ignored if the cache plugin is not used.

        Returns:
            Dict[str, List[Dict[str, Any]]]: A dictionary where keys are the
                absolute paths of the notes containing the backlinks, and values
                are lists of link information dictionaries for each link found
                in that source note. The structure mirrors Obsidian's LinkCache.
                Example:
                {
                    '/abs/path/to/linking_note.md': [
                        {'link': 'Target Note', 'original': '[[Target Note]]', ...},
                        # ... other links in linking_note.md
                    ],
                    # ... other linking notes
                }
                Returns an empty dictionary if no backlinks are found.

        Raises:
            ValueError: If path is empty or cache_mode is invalid.
            ObsidianCommError: If the request fails (e.g., note not found by Obsidian).
        """
        if not path:
            raise ValueError("Path cannot be empty for get_backlinks.")
        if cache_mode not in ['fast', 'safe']:
            raise ValueError("cache_mode must be either 'fast' or 'safe'.")

        payload = {
            "path": path,
            "use_cache_if_available": use_cache_if_available,
            "cache_mode": cache_mode,
        }
        # The plugin side will return the structured dictionary or raise an error
        backlinks_data = self._send_receive("get_backlinks", payload)

        # Basic validation of the returned structure (optional but good practice)
        if not isinstance(backlinks_data, dict):
             raise ObsidianCommError(
                 f"Received unexpected data type from get_backlinks: {type(backlinks_data)}. Expected dict.",
                 action="get_backlinks"
             )
        # Further validation could check if values are lists of dicts, etc.

        return backlinks_data
