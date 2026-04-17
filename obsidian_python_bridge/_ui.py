# --- obsidian_python_bridge/_ui.py ---
"""
User-interface API methods.

This mixin provides methods for displaying notifications, requesting user
input via Obsidian modals, and toggling the Obsidian theme.
"""

from __future__ import annotations

from typing import Any


class UIMixin:
    """Mixin: notifications, user-input modals, and theme toggle.

    Requires the host class to expose ``_send_receive(action, payload)``.
    """

    # ------------------------------------------------------------------
    # Notifications
    # ------------------------------------------------------------------

    def show_notification(self, content: str, duration: int = 4000) -> None:  # type: ignore[misc]
        """Display a notification in the Obsidian interface.

        Args:
            content: The message text.
            duration: How long the notification stays visible, in
                      milliseconds (default 4 000 ms).
        """
        if not content:
            raise ValueError("Notification content cannot be empty.")
        self._send_receive("show_notification", {"content": content, "duration": duration})  # type: ignore[attr-defined]
        print(f"Notification request sent: '{content}' (duration: {duration}ms)")

    # ------------------------------------------------------------------
    # User input (modal dialogs)
    # ------------------------------------------------------------------

    def request_user_input(  # type: ignore[misc]
        self,
        script_name: str,
        input_type: str,
        message: str,
        validation_regex: str | None = None,
        min_value: int | float | None = None,
        max_value: int | float | None = None,
        step: int | float | None = None,
        **kwargs: Any,
    ) -> Any:
        """Open a modal dialog in Obsidian to collect user input.

        Blocks until the user submits or cancels.

        Args:
            script_name: Displayed in the modal title.
            input_type: One of ``'text'``, ``'textarea'``, ``'number'``,
                        ``'range'``, ``'boolean'``, ``'date'``.
            message: The prompt message.
            validation_regex: Optional regex for text validation.
            min_value / max_value / step: For numeric types.
            **kwargs: Forward-compatibility — passed through to the plugin.

        Returns:
            The value entered by the user (type depends on *input_type*).

        Raises:
            ValueError: If required args are missing.
            ObsidianCommError: If the user cancels or the request fails.
        """
        if not all([script_name, input_type, message]):
            raise ValueError("script_name, input_type, and message are required arguments.")

        payload: dict[str, Any] = {
            "scriptName": script_name,
            "inputType": input_type,
            "message": message,
        }
        # Only include optional fields when they have a value
        if validation_regex:
            payload["validationRegex"] = validation_regex
        if min_value is not None:
            payload["minValue"] = min_value
        if max_value is not None:
            payload["maxValue"] = max_value
        if step is not None:
            payload["step"] = step
        payload.update(kwargs)

        return self._send_receive("request_user_input", payload)  # type: ignore[attr-defined]

    # ------------------------------------------------------------------
    # Theme
    # ------------------------------------------------------------------

    def toggle_theme(self) -> None:  # type: ignore[misc]
        """Toggle Obsidian between light and dark mode."""
        self._send_receive("toggle_theme")  # type: ignore[attr-defined]
        print("Request sent to toggle theme.")
