import socket
import os
import yaml
import copy
import re
from datetime import datetime

# The default socket path, but it's better to specify the right socket path in your own scripts directly to avoid conflicts
# or errors (specifying the path of the socket with for example :
# obsidian = ObsidianPluginDevPythonToJS(socket_path="/tmp/my-special-obsidian-socket-path.sock"))
DEFAULT_SOCKET_PATH = "/tmp/obsidian-python.sock"  

class ObsidianPluginDevPythonToJS:
    """
    This class provides a simplified interface to interact with the Obsidian plugin via Unix sockets.
    It encapsulates the socket communication and provides easy-to-use methods for sending notifications,
    retrieving active note content, frontmatter, and more.
    """

    def __init__(self, socket_path=DEFAULT_SOCKET_PATH):
        """
        Initialize the plugin with the Unix socket path.
        """
        if not os.path.exists(socket_path):
            raise FileNotFoundError(f"Socket path {socket_path} does not exist.")
        self.socket_path = socket_path


    def _send_request(self, action, content=""):
        """
        Sends a request to the Obsidian plugin via the Unix socket using plain text format.

        :param action: The action to be performed.
        :param content: The content for the request (default: empty string).
        :return: The response from Obsidian, parsed as a plain text message.
        """
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client_socket:
                # Connect to the Unix socket
                client_socket.connect(self.socket_path)

                # Format the request as plain text
                request_data = f"---BEGIN-{action}-BEGIN---\n{content}\n---END-{action}-END---"
                client_socket.sendall(request_data.encode())

                # Receive the response
                response = client_socket.recv(4096).decode()
                return self._parse_response(response, action)

        except (socket.error, socket.timeout) as socket_error:
            return {"error": f"Socket communication failed: {socket_error}"}


    def _parse_response(self, response, action):
        """
        Parses the plain text response received from the socket.

        :param response: The raw response from the socket.
        :param action: The action associated with the request to help in parsing the response.
        :return: The parsed response content, or an error message if parsing fails.
        """
        try:
            # Match the response with the format `---BEGIN-<action>-BEGIN--- ... ---END-<action>-END---`
            start_tag = f"---BEGIN-{action}-BEGIN---"
            end_tag = f"---END-{action}-END---"

            if start_tag in response and end_tag in response:
                # Extract the content between the tags
                content = response.split(start_tag)[1].split(end_tag)[0].strip()
                return {"content": content}
            else:
                raise ValueError(f"Response format invalid for action: {action}")

        except Exception as e:
            print(f"An error occurred while parsing the response: {e}")
            return {"error": str(e)}


    def get_all_note_paths(self, absolute=False):
        """
        Retrieves all note paths from the vault, in chunks of 10 paths at a time.
        
        By default, the paths returned are relative to the vault root. If `absolute=True` is passed, the paths will
        be converted to absolute paths by prepending the vault's absolute path to each note's relative path.

        For example:
        If a note's relative path is '01-DAILY-NOTES/2024-10-06.md', and the vault's absolute path is 
        '/home/user/YourVault', the absolute path will be: '/home/user/YourVault/01-DAILY-NOTES/2024-10-06.md'.

        :param absolute: Boolean (optional). If True, returns absolute paths instead of relative ones. Default is False.
        :return: A list containing the paths of all notes in the vault, either relative or absolute based on the `absolute` flag.
        """
        try:
            # Create a Unix socket for communication with the Obsidian plugin
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client_socket:
                # Connect to the socket at the specified path
                client_socket.connect(self.socket_path)
                
                # Send the request for retrieving all note paths
                request_data = "---BEGIN-get_all_note_paths-BEGIN---\n\n---END-get_all_note_paths-END---"
                client_socket.sendall(request_data.encode())
                
                all_note_paths = []  # Initialize an empty list to store all note paths
                
                while True:
                    # Receive and decode the response from the socket
                    response = client_socket.recv(4096).decode()
                    
                    if '---BEGIN-get_all_note_paths-END---' in response:
                        # End of transmission indicated by 'END'
                        if 'END' in response:
                            break
                    elif '---BEGIN-get_all_note_paths-BEGIN---' in response:
                        # Extract the chunk of paths between the BEGIN and END markers
                        paths_chunk = response.split('---BEGIN-get_all_note_paths-BEGIN---\n')[1].split('\n---END-get_all_note_paths-END---')[0]
                        
                        # Split the chunk into individual note paths, separated by '||'
                        note_paths = paths_chunk.split('||')
                        
                        # Extend the main list with the current chunk of note paths
                        all_note_paths.extend(note_paths)
                    elif '---BEGIN-get_all_note_paths-ERROR---' in response:
                        # If an error message is returned by the plugin, extract and return it
                        error_message = response.split('---BEGIN-get_all_note_paths-ERROR---\n')[1].split('\n---END-get_all_note_paths-ERROR---')[0]
                        return {"error": f"Failed to retrieve note paths: {error_message}"}

            # If the user requested absolute paths, retrieve the absolute path of the vault and prepend it to each note path
            if absolute:
                # Get the vault's absolute path using the available method
                vault_absolute_path = self._send_request("get_current_vault_absolute_path")["content"]
                
                # Ensure there is a trailing slash in the vault path to avoid duplication
                vault_absolute_path = vault_absolute_path.rstrip('/') + '/'
                
                # Prepend the vault's absolute path to each relative note path
                all_note_paths = [os.path.join(vault_absolute_path, note_path).replace("//", "/") for note_path in all_note_paths]

            # Return the complete list of note paths (either relative or absolute)
            return all_note_paths

        except (socket.error, socket.timeout) as socket_error:
            # Handle socket communication issues and return an error
            return {"error": f"Socket communication failed: {socket_error}"}
        except Exception as e:
            # Catch any other exceptions and return an error message
            return {"error": f"An unexpected error occurred: {str(e)}"}


    def show_notification(self, content="Notification", duration=4000):
        """
        Sends a request to display a notification in Obsidian and returns a dictionary
        with success status and any potential error message.
        """
        if not content:
            return {"success": False, "error": "Notification content cannot be empty."}

        response = self._send_request("show_notification", content)

        # Parse the response to check for success or error
        response_content = response.get("content", "")
        
        if "success: true" in response_content:
            return {"success": True, "error": ""}
        elif "success: false" in response_content:
            # Ensure there is an error message after the "||error: " separator
            if "||error: " in response_content:
                error_message = response_content.split("||error: ")[1].strip()
                return {"success": False, "error": error_message or "Unknown error"}
            return {"success": False, "error": "Unexpected error format"}
        
        return {"success": False, "error": "Unexpected response format"}


    def get_active_note_content(self):
        """
        Retrieves the content of the currently active note in Obsidian.

        :return: The content of the active note if successful, or an error message if it fails.
        """
        # Send a request to get the active note content
        response = self._send_request("get_active_note_content")

        # If the response contains 'success: true', return the content
        if "success: true" in response.get("content", ""):
            return response.get("content")
        # If the response contains 'success: false', return the error message
        elif "success: false" in response.get("content", ""):
            error_message = response["content"].split("||error: ")[1].strip() if "||error: " in response["content"] else "Unknown error"
            return {"error": f"Failed to retrieve note content: {error_message}"}
        # Return an error if the format is unexpected
        return {"error": "Unexpected response format."}


    def get_active_note_frontmatter(self):
        """
        Retrieves the frontmatter of the currently active note in Obsidian.
        
        :return: A dictionary containing the YAML frontmatter of the active note.
                Returns None if the frontmatter is null, not a dictionary, or if the response
                doesn't contain the 'frontmatter' key.
        """
        response = self._send_request("get_active_note_frontmatter")
        
        # Check if the response contains valid frontmatter
        if isinstance(response, dict) and "frontmatter" in response and isinstance(response["frontmatter"], dict):
            return response["frontmatter"]
        print(f"debug response = {response}")
        return None  # Return None if the conditions are not met


    def modify_note_content(self, file_path, content):
        """
        Sends a content modification request to the Obsidian plugin.

        :param file_path: The path to the note file to be modified (str).
        :param content: The new content to write to the note (str).
        :return: A dictionary indicating success or failure (dict).
        """
        response = self._send_request("modify_note_content", f"{file_path}||{content}")
        if response.get("content") and "success: true" in response["content"]:
            return {'success': True}
        return {'success': False, 'error': response.get("error", "Unknown error in modify_note_content")}


    def manage_properties_key(self, file_path, action, key=None, new_key=None, use_vault_modify=True):
        """
        Manage YAML keys in the frontmatter.

        :param file_path: The path to the note file (str).
        :param action: The action to perform on the key (str). Options are 'add', 'remove', 'rename'.
        :param key: The key to manage (str).
        :param new_key: The new key name if renaming (str, optional).
        :param use_vault_modify: Flag to determine if modification should use vault method (bool, optional). Default is True.
        :return: A dictionary indicating success or failure (dict).
        """
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {'success': False, 'error': "Invalid file path or file type. Ensure it's a .md file."}
        
        try:
            with open(file_path, 'r') as file:
                content = file.read()

            yaml_frontmatter = yaml.safe_load(content.split('---')[1]) or {}

            if action == 'add':
                if key in yaml_frontmatter:
                    return {'success': False, 'error': f"Key '{key}' already exists."}
                yaml_frontmatter[key] = None
            elif action == 'remove':
                if key not in yaml_frontmatter:
                    return {'success': False, 'error': f"Key '{key}' not found."}
                del yaml_frontmatter[key]
            elif action == 'rename':
                if key not in yaml_frontmatter:
                    return {'success': False, 'error': f"Key '{key}' not found."}
                if new_key in yaml_frontmatter:
                    return {'success': False, 'error': f"Key '{new_key}' already exists."}
                yaml_frontmatter[new_key] = yaml_frontmatter.pop(key)
            else:
                return {'success': False, 'error': "Invalid action specified."}

            updated_content = '---\n' + yaml.dump(yaml_frontmatter) + '---\n' + content.split('---', 2)[2]
            if use_vault_modify:
                return self.modify_note_content(file_path, updated_content)
            else:
                with open(file_path, 'w') as file:
                    file.write(updated_content)
            return {'success': True}

        except Exception as e:
            return {'success': False, 'error': str(e)}


    def manage_properties_value(self, file_path, key, action, value=None, new_value=None, index=None, use_vault_modify=True):
        """
        Manage values within a YAML key in the frontmatter.

        :param file_path: The path to the note file (str).
        :param key: The key in the frontmatter to manage (str).
        :param action: The action to perform on the key's value (str). Options are 'add', 'remove', 'update'.
        :param value: The value to be added or removed (varies, optional).
        :param new_value: The new value to replace the current value (varies, optional).
        :param index: The index in the list if updating/removing (int, optional).
        :param use_vault_modify: Flag to determine if modification should use vault method (bool, optional). Default is True.
        :return: A dictionary indicating success or failure (dict).
        """
        def is_valid_date(date_str):
            try:
                datetime.strptime(date_str, '%Y-%m-%d')
                return True
            except ValueError:
                return False
        
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {'success': False, 'error': "Invalid file path or file type. Ensure it's a .md file."}
        
        try:
            with open(file_path, 'r') as file:
                content = file.read()

            yaml_frontmatter = yaml.safe_load(content.split('---')[1]) or {}

            if key not in yaml_frontmatter:
                return {'success': False, 'error': f"Key '{key}' not found in frontmatter."}

            current_value = yaml_frontmatter[key]

            if action == 'add':
                if isinstance(current_value, list):
                    if any(v in current_value for v in value):
                        return {'success': False, 'error': "One or more values already exist in the list."}
                    if not isinstance(value, list):
                        return {'success': False, 'error': f"Expected list for '{key}', got {type(value).__name__}."}
                    current_value.extend(value)
                elif current_value is None:
                    yaml_frontmatter[key] = value
                else:
                    return {'success': False, 'error': "Add operation only allowed for list or empty key values."}

            elif action == 'remove':
                if isinstance(current_value, list):
                    try:
                        current_value.remove(value)
                    except ValueError:
                        return {'success': False, 'error': f"Value '{value}' not found in list '{key}'."}
                else:
                    return {'success': False, 'error': "Remove operation only allowed for list values."}

            elif action == 'update':
                if key == 'ladatedujour' and not is_valid_date(new_value):
                    return {'success': False, 'error': "Invalid date format. Use YYYY-MM-DD."}

                if isinstance(current_value, list):
                    if index is not None and 0 <= index < len(current_value):
                        current_value[index] = new_value
                    elif value in current_value:
                        idx = current_value.index(value)
                        current_value[idx] = new_value
                    else:
                        return {'success': False, 'error': f"Value '{value}' not found in list '{key}'."}
                elif current_value == value:
                    yaml_frontmatter[key] = new_value
                else:
                    return {'success': False, 'error': "Current value doesn't match provided value for update."}

            else:
                return {'success': False, 'error': "Invalid action specified."}

            updated_content = '---\n' + yaml.dump(yaml_frontmatter) + '---\n' + content.split('---', 2)[2]
            if use_vault_modify:
                return self.modify_note_content(file_path, updated_content)
            else:
                with open(file_path, 'w') as file:
                    file.write(updated_content)
            return {'success': True}

        except Exception as e:
            return {'success': False, 'error': str(e)}


    def request_user_input(self, script_name, input_type, message, validation_regex=None, min_value=None, max_value=None, step=None):
        """
        Sends a request to display a user input pop-up in Obsidian.

        :param script_name: The name of the script requesting input (str).
        :param input_type: The type of input expected (str).
        :param message: The message to display in the input pop-up (str).
        :param validation_regex: Optional regex for input validation (str, optional).
        :param min_value: Minimum value for numeric inputs (varies, optional).
        :param max_value: Maximum value for numeric inputs (varies, optional).
        :param step: Step size for numeric inputs (varies, optional).
        :return: A dictionary containing user input if successful, or an error message (dict).
        """
        if not script_name or not input_type or not message:
            return {"error": "Script name, input type, and message are required.", "success": False}

        # Prepare the content with parameters separated by "||"
        content = f"{script_name}||{input_type}||{message}||{validation_regex or ''}||{min_value or ''}||{max_value or ''}||{step or ''}"
        
        response = self._send_request("request_user_input", content)

        if 'content' in response:
            return {"userInput": response['content'], "success": True}
        else:
            return {"success": False, "error": "User cancelled the input."}


    def get_active_note_absolute_path(self):
        """
        Retrieves the absolute path of the currently active note in Obsidian.

        This function sends a request to the Obsidian plugin to obtain the absolute file path
        of the note currently being edited or viewed.

        :return: A string representing the absolute path of the active note.
                Returns a dictionary with an error message if the request fails.
        """
        # Send the request to Obsidian to get the active note's absolute path
        response = self._send_request("get_active_note_absolute_path")

        # If the response contains 'content', return the absolute path
        if 'content' in response:
            return response['content']
        # If the response is invalid or an error occurred, return an error message
        else:
            return {"error": "Failed to retrieve active note absolute path."}


    def get_active_note_relative_path(self):
        """
        Retrieves the relative path of the currently active note in Obsidian.

        This function sends a request to the Obsidian plugin to obtain the path of the active note
        relative to the root of the vault.

        :return: A string representing the relative path of the active note.
                Returns a dictionary with an error message if the request fails.
        """
        # Send the request to Obsidian to get the active note's relative path
        response = self._send_request("get_active_note_relative_path")

        # If the response contains 'content', return the relative path
        if 'content' in response:
            return response['content']
        # If the response is invalid or an error occurred, return an error message
        else:
            return {"error": "Failed to retrieve active note relative path."}


    def get_active_note_title(self):
        """
        Retrieves the title of the currently active note in Obsidian.

        This function sends a request to the Obsidian plugin to obtain the title of the active note,
        which is typically the name of the file without the extension.

        :return: A string representing the title of the active note, or None if the title is null.
                Returns a dictionary with an error message if the request fails.
        """
        # Send the request to Obsidian to get the active note's title
        response = self._send_request("get_active_note_title")

        # If the response contains 'success: true', return the title of the active note
        if "success: true" in response.get("content", ""):
            return response.get("content")
        # If the response contains 'success: false', return None
        elif "success: false" in response.get("content", ""):
            return None
        # If there is an error or unexpected response, return an error message
        return {"error": "Failed to retrieve active note title."}


    def get_current_vault_absolute_path(self):
        """
        Retrieves the absolute path of the current vault in Obsidian.

        This function sends a request to the Obsidian plugin to obtain the absolute path of the vault
        that is currently open. The vault path is the root directory of all notes.

        :return: A string representing the absolute path of the current vault.
                Returns a dictionary with an error message if the request fails.
        """
        # Send the request to Obsidian to get the current vault's absolute path
        response = self._send_request("get_current_vault_absolute_path")

        # If the response contains 'content', return the absolute path of the vault
        if 'content' in response:
            return response['content']
        # If the response is invalid or an error occurred, return an error message
        else:
            return {"error": "Failed to retrieve current vault absolute path."}


    def get_all_note_titles(self):
        """
        Retrieves the titles of all notes in the vault.

        This function calls `get_all_note_paths()` to get all the note paths and extracts the titles from them 
        (i.e., the filenames without extensions).

        :return: A list of note titles if successful, or an error message if it fails.
        """
        # Call get_all_note_paths to retrieve all the paths of the notes
        note_paths = self.get_all_note_paths()

        # Check if the response contains an error
        if isinstance(note_paths, dict) and 'error' in note_paths:
            return note_paths  # Return the error message

        # Extract note titles by removing the directory path and '.md' extension from each note path
        note_titles = [os.path.splitext(os.path.basename(note_path))[0] for note_path in note_paths]

        # Return the list of note titles directly
        return note_titles


    def send_custom_request(self, action, content=""):
        """
        Sends a custom request to Obsidian with a specified action and optional content.
        
        WARNING: This function allows you to send arbitrary requests to Obsidian, which could lead to 
        unexpected behavior or errors if the action or content is not correctly handled. Use with caution 
        and ensure you understand the structure of requests expected by the Obsidian API.

        :param action: The action to be performed (required).
        :param content: Optional content for the request.
        :return: The response from Obsidian, or an error message if the request is invalid.
        """
        if not action:
            return {"error": "Action must be specified for a custom request."}

        return self._send_request(action, content)