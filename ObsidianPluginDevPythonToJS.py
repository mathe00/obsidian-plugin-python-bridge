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
        """
        if not action:
            return {"error": "Action must be specified for a custom request."}

        return self._send_request(action, content)
