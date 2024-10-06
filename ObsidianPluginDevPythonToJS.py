import socket
import os

SOCKET_PATH = "/tmp/obsidian-python.sock"  # Put your socket path here for the moment

class ObsidianPluginDevPythonToJS:
    """
    This class provides a simplified interface to interact with the Obsidian plugin via Unix sockets.
    It encapsulates the socket communication and provides easy-to-use methods for sending notifications,
    retrieving active note content, frontmatter, and more.
    """

    def __init__(self, socket_path=SOCKET_PATH):
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


    def send_notification(self, content="Notification", duration=4000):
        """
        Sends a request to display a notification in Obsidian.
        """
        if not content:
            return {"error": "Notification content cannot be empty."}
        
        # Sending notification with text content (ignoring `duration` since it's not handled in plain text mode)
        return self._send_request("show_notification", content)


    def get_active_note_content(self):
        """
        Retrieves the content of the currently active note in Obsidian.
        """
        return self._send_request("get_active_note_content")


    def get_active_note_frontmatter(self):
        """
        Retrieves the frontmatter of the currently active note in Obsidian.
        """
        response = self._send_request("get_frontmatter")
        
        if "content" in response:
            return response["content"]
        return response


    def get_vault_metadata(self):
        """
        Requests metadata about the vault, including titles and paths of all notes.
        """
        return self._send_request("get_vault_metadata")
    
    
    def request_user_input(self, script_name, input_type, message, validation_regex=None, min_value=None, max_value=None, step=None):
        """
        Sends a request to display a user input pop-up in Obsidian.
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
