import socket
import json
import os

SOCKET_PATH = "/tmp/obsidian-python.sock"

class ObsidianPluginDevPythonToJS:
    """
    This class provides a simplified interface to interact with the Obsidian plugin via Unix sockets.
    It encapsulates the socket communication and provides easy-to-use methods for sending notifications,
    retrieving active note content, frontmatter, and more.
    """

    def __init__(self, socket_path=SOCKET_PATH):
        """
        Initialize the plugin with the Unix socket path.

        :param socket_path: Path to the Unix socket file used for communication with Obsidian (default: /tmp/obsidian-python.sock)
        """
        if not os.path.exists(socket_path):
            raise FileNotFoundError(f"Socket path {socket_path} does not exist.")
        self.socket_path = socket_path

    def _send_request(self, request_data):
        """
        Sends a request to the Obsidian plugin via the Unix socket.

        :param request_data: Dictionary containing the request data.
        :return: The response from Obsidian, parsed as a dictionary.
        """
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client_socket:
                # Connect to the Unix socket
                client_socket.connect(self.socket_path)

                # Send the request as JSON
                client_socket.sendall(json.dumps(request_data).encode())

                # Receive the response
                response = client_socket.recv(4096)
                return self._parse_response(response)

        except (socket.error, socket.timeout) as socket_error:
            return {"error": f"Socket communication failed: {socket_error}"}

        except json.JSONDecodeError as json_error:
            return {"error": f"Failed to encode request data: {json_error}"}

    def _parse_response(self, response):
        """
        Parses the response received from the socket and decodes it as JSON.

        :param response: The raw byte response from the socket.
        :return: The parsed JSON response, or an error message if parsing fails.
        """
        try:
            decoded_response = response.decode()
            return json.loads(decoded_response)
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON response: {e}")
            return {"error": "Invalid JSON response"}

    def send_notification(self, content="Notification", duration=4000):
        """
        Sends a request to display a notification in Obsidian.

        :param content: The text content of the notification (default: "Notification")
        :param duration: The duration in milliseconds for the notification to stay visible (default: 4000)
        :return: The response from Obsidian as a dictionary.
        """
        if not content:
            return {"error": "Notification content cannot be empty."}

        request_data = {
            "action": "show_notification",
            "text_for_notif": content,
            "duration": duration
        }
        return self._send_request(request_data)

    def get_active_note_content(self):
        """
        Retrieves the content and title of the currently active note in Obsidian.

        :return: A dictionary containing the title and content of the active note, or an error message.
        """
        request_data = {
            "action": "get_active_note"
        }
        return self._send_request(request_data)

    def get_active_note_frontmatter(self):
        """
        Retrieves the frontmatter of the currently active note in Obsidian.

        :return: A dictionary containing the frontmatter of the active note, or an error message.
        """
        request_data = {
            "action": "get_frontmatter"
        }
        response = self._send_request(request_data)
        
        # If the response contains 'frontmatter', strip the unnecessary key
        if "frontmatter" in response:
            return response["frontmatter"]
        
        return response

    def get_vault_metadata(self):
        """
        Requests metadata about the vault, including titles and paths of all notes.

        :return: A dictionary containing metadata about the notes in the vault, or an error message.
        """
        request_data = {
            "action": "get_vault_metadata"
        }
        return self._send_request(request_data)

    def send_custom_request(self, action, **kwargs):
        """
        Sends a custom request to Obsidian with a specified action and optional parameters.

        :param action: The action to be performed by Obsidian (e.g., 'get_active_note', 'show_notification').
        :param kwargs: Additional parameters to be sent with the request.
        :return: The response from Obsidian as a dictionary.
        """
        if not action:
            return {"error": "Action must be specified for a custom request."}

        request_data = {
            "action": action
        }
        request_data.update(kwargs)

        return self._send_request(request_data)
