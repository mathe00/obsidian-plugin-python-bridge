# --- obsidian_python_bridge/_events_api.py ---
"""
Event listener registration API methods.

This mixin allows a script to register or unregister itself for Obsidian
vault events (note modification, deletion, rename, etc.).  When an event
fires, the plugin re-executes the script with ``OBSIDIAN_EVENT_NAME`` and
``OBSIDIAN_EVENT_PAYLOAD`` environment variables set.
"""

from __future__ import annotations

from ._exceptions import ObsidianCommError


class EventsMixin:
    """Mixin: event listener registration / unregistration.

    Requires the host class to expose ``_send_receive(action, payload)``
    and ``_script_relative_path_for_api``.
    """

    def register_event_listener(self, event_name: str) -> None:  # type: ignore[misc]
        """Register this script to listen for an Obsidian vault event.

        Supported events include: ``"vault-modify"``, ``"vault-delete"``,
        ``"vault-rename"``, ``"metadata-changed"``, ``"layout-change"``,
        ``"active-leaf-change"``.

        Raises:
            ObsidianCommError: If the script path is unknown or the request fails.
            ValueError: If *event_name* is empty.
        """
        if not event_name:
            raise ValueError("event_name cannot be empty.")
        if not self._script_relative_path_for_api:  # type: ignore[attr-defined]
            raise ObsidianCommError(
                "Cannot register listener: Script path was not determined during "
                "initialization. Ensure OBSIDIAN_SCRIPT_RELATIVE_PATH environment "
                "variable is set.",
                action="register_event_listener",
            )
        self._send_receive(  # type: ignore[attr-defined]
            "register_event_listener",
            {
                "eventName": event_name,
                "scriptPath": self._script_relative_path_for_api,  # type: ignore[attr-defined]
            },
        )
        print(f"Event listener registration request sent for: {event_name}")

    def unregister_event_listener(self, event_name: str) -> None:  # type: ignore[misc]
        """Unregister this script from listening to a specific Obsidian event.

        Raises:
            ObsidianCommError: If the script path is unknown or the request fails.
            ValueError: If *event_name* is empty.
        """
        if not event_name:
            raise ValueError("event_name cannot be empty.")
        if not self._script_relative_path_for_api:  # type: ignore[attr-defined]
            raise ObsidianCommError(
                "Cannot unregister listener: Script path was not determined during "
                "initialization. Ensure OBSIDIAN_SCRIPT_RELATIVE_PATH environment "
                "variable is set.",
                action="unregister_event_listener",
            )
        self._send_receive(  # type: ignore[attr-defined]
            "unregister_event_listener",
            {
                "eventName": event_name,
                "scriptPath": self._script_relative_path_for_api,  # type: ignore[attr-defined]
            },
        )
        print(f"Event listener unregistration request sent for: {event_name}")
