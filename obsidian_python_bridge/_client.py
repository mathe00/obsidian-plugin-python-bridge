# --- obsidian_python_bridge/_client.py ---
"""
Main client class — composed from mixins.

The :class:`ObsidianPluginDevPythonToJS` class inherits from all domain
mixins so that every public API method is available on a single flat
object, preserving the original interface that user scripts rely on::

    obsidian = ObsidianPluginDevPythonToJS()
    obsidian.show_notification("Hello!")
    content = obsidian.get_active_note_content()

The ``__init__`` method handles port validation, ``requests.Session``
creation, execution-mode detection, script-path discovery, and an early
connection test.  All subsequent HTTP communication is delegated to
:func:`~obsidian_python_bridge._transport.send_receive`.
"""

from __future__ import annotations

import os
import sys
from typing import Any

import requests

from ._config import HTTP_PORT
from ._editor import EditorMixin
from ._events_api import EventsMixin
from ._frontmatter import FrontmatterMixin
from ._links import LinksMixin
from ._notes import NotesMixin
from ._transport import send_receive, test_connection
from ._ui import UIMixin
from ._vault import VaultMixin


class ObsidianPluginDevPythonToJS(
    NotesMixin,
    EditorMixin,
    VaultMixin,
    UIMixin,
    EventsMixin,
    FrontmatterMixin,
    LinksMixin,
):
    """Client library to interact with the Obsidian Python Bridge plugin via HTTP.

    Provides methods for notifications, note access/modification, frontmatter
    management, editor operations, vault management, event listening, and more.

    Usage::

        from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS
        obsidian = ObsidianPluginDevPythonToJS()
        obsidian.show_notification("Hello from Python!")
    """

    def __init__(
        self,
        http_port: int = HTTP_PORT,
        connect_timeout: float = 2.0,
        request_timeout: float = 10.0,
    ) -> None:
        # --- Port validation ---
        if not isinstance(http_port, int) or not (1024 <= http_port <= 65535):
            raise ValueError(f"http_port must be an integer between 1024 and 65535. Received: {http_port}")

        self.http_port = http_port
        self.base_url = f"http://127.0.0.1:{self.http_port}/"
        self.connect_timeout = connect_timeout
        self.request_timeout = request_timeout

        # Connection pooling via requests.Session
        self.session = requests.Session()

        # --- Execution mode (normal or discovery) ---
        self._execution_mode = os.environ.get("OBSIDIAN_BRIDGE_MODE", "normal")
        if self._execution_mode == "discovery":
            print(
                "INFO: ObsidianPluginDevPythonToJS: Initialized in settings discovery mode. "
                "API calls will be disabled.",
                file=sys.stderr,
            )

        # --- Script relative path (set by the Obsidian plugin) ---
        self.script_relative_path: str | None = os.environ.get("OBSIDIAN_SCRIPT_RELATIVE_PATH")
        self._script_relative_path_for_api = self.script_relative_path
        if not self.script_relative_path:
            print(
                "WARNING: OBSIDIAN_SCRIPT_RELATIVE_PATH environment variable not set. "
                "The get_script_settings() method will not work.",
                file=sys.stderr,
            )

        print(f"Initializing Obsidian client for URL: {self.base_url}")

        # --- Early connection test (fail fast) ---
        test_connection(self.session, self.base_url, self.connect_timeout)

    # ------------------------------------------------------------------
    # Internal: bridge to the transport layer
    # ------------------------------------------------------------------

    def _send_receive(
        self,
        action: str,
        payload: dict[str, Any] | None = None,
        timeout: float | None = None,
    ) -> Any:
        """Delegate to the module-level transport function.

        This is the single method that all mixins call to communicate
        with the Obsidian plugin.
        """
        return send_receive(
            self.session,
            self.base_url,
            action,
            payload,
            timeout if timeout is not None else self.request_timeout,
            execution_mode=self._execution_mode,
        )
