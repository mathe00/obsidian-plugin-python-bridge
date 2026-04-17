# --- obsidian_python_bridge/_notes.py ---
"""
Note-related API methods.

This mixin provides methods for reading and modifying note content,
frontmatter, and paths — both for the *active* note and arbitrary notes
identified by their vault-relative path.
"""

from __future__ import annotations

import os
import sys
from typing import Any

from ._exceptions import ObsidianCommError


class NotesMixin:
    """Mixin: note content, frontmatter, path, and script-settings methods.

    Requires the host class to expose ``_send_receive(action, payload)``
    and ``modify_note_content(file_path, content)``.
    """

    # ------------------------------------------------------------------
    # Script settings
    # ------------------------------------------------------------------

    def get_script_settings(self) -> dict[str, Any]:  # type: ignore[misc]
        """Retrieve the current user-configured values for this script's settings.

        The script's relative path is read from the
        ``OBSIDIAN_SCRIPT_RELATIVE_PATH`` environment variable that the
        Obsidian plugin sets when spawning the script.

        Returns:
            A dict mapping setting keys to their current values.
            Empty dict if no settings are defined or the path is unknown.

        Raises:
            ObsidianCommError: If the request fails or the env var is missing.
        """
        if not self.script_relative_path:  # type: ignore[attr-defined]
            raise ObsidianCommError(
                "Cannot get script settings: OBSIDIAN_SCRIPT_RELATIVE_PATH "
                "environment variable is missing. "
                "Ensure the script is run via the Obsidian plugin.",
                action="get_script_settings",
            )

        payload = {"scriptPath": self.script_relative_path}  # type: ignore[attr-defined]
        settings_values = self._send_receive("get_script_settings", payload)  # type: ignore[attr-defined]

        if not isinstance(settings_values, dict):
            print(
                f"WARNING: get_script_settings received non-dict data from plugin: "
                f"{type(settings_values)}. Returning empty dict.",
                file=sys.stderr,
            )
            return {}
        return settings_values

    # ------------------------------------------------------------------
    # Active note
    # ------------------------------------------------------------------

    def get_active_note_content(self, return_format: str = "string") -> str | list[str]:  # type: ignore[misc]
        """Retrieve the full Markdown content of the currently active note.

        Args:
            return_format: ``"string"`` (default) or ``"lines"``.

        Returns:
            The note content as a string or a list of line strings.

        Raises:
            ValueError: If *return_format* is invalid.
            ObsidianCommError: If no active note or the request fails.
        """
        if return_format not in ("string", "lines"):
            raise ValueError("return_format must be either 'string' or 'lines'.")
        return self._send_receive("get_active_note_content", {"return_format": return_format})  # type: ignore[attr-defined]

    def get_active_note_frontmatter(self) -> dict[str, Any] | None:  # type: ignore[misc]
        """Return the parsed YAML frontmatter of the active note, or ``None``."""
        return self._send_receive("get_active_note_frontmatter")  # type: ignore[attr-defined]

    def get_active_note_absolute_path(self) -> str:  # type: ignore[misc]
        """Return the absolute filesystem path of the active note."""
        return self._send_receive("get_active_note_absolute_path")  # type: ignore[attr-defined]

    def get_active_note_relative_path(self) -> str:  # type: ignore[misc]
        """Return the vault-relative path of the active note."""
        return self._send_receive("get_active_note_relative_path")  # type: ignore[attr-defined]

    def get_active_note_title(self) -> str:  # type: ignore[misc]
        """Return the title (filename without extension) of the active note."""
        return self._send_receive("get_active_note_title")  # type: ignore[attr-defined]

    # ------------------------------------------------------------------
    # All notes
    # ------------------------------------------------------------------

    def get_all_note_paths(self, absolute: bool = False) -> list[str]:  # type: ignore[misc]
        """Return paths of all ``.md`` files in the vault.

        Args:
            absolute: If ``True``, return absolute filesystem paths;
                      otherwise return vault-relative paths.
        """
        note_paths = self._send_receive("get_all_note_paths", {"absolute": absolute})  # type: ignore[attr-defined]
        if not isinstance(note_paths, list):
            raise ObsidianCommError(
                f"Expected a list of paths, but received: {type(note_paths)}",
                action="get_all_note_paths",
            )
        return note_paths

    def get_all_note_titles(self) -> list[str]:  # type: ignore[misc]
        """Return the titles of all Markdown notes in the vault."""
        note_paths = self.get_all_note_paths(absolute=False)
        return [os.path.splitext(os.path.basename(p))[0] for p in note_paths]

    # ------------------------------------------------------------------
    # Arbitrary note by path
    # ------------------------------------------------------------------

    def get_note_content(self, path: str) -> str:  # type: ignore[misc]
        """Return the full content of a note by its vault-relative path."""
        if not path:
            raise ValueError("Path cannot be empty.")
        return self._send_receive("get_note_content", {"path": path})  # type: ignore[attr-defined]

    def get_note_frontmatter(self, path: str) -> dict[str, Any] | None:  # type: ignore[misc]
        """Return the parsed frontmatter of a note by its vault-relative path."""
        if not path:
            raise ValueError("Path cannot be empty.")
        return self._send_receive("get_note_frontmatter", {"path": path})  # type: ignore[attr-defined]

    def modify_note_content(self, file_path: str, content: str) -> None:  # type: ignore[misc]
        """Replace the entire content of a note using its absolute path.

        .. note::
            This uses the legacy ``modify_note_content`` action which accepts
            an absolute path.  The plugin side converts it to a relative path
            internally.  For new code consider using
            ``modify_note_content_by_path`` with a vault-relative path instead.
        """
        if not os.path.isabs(file_path):
            raise ValueError(f"file_path must be absolute. Received: '{file_path}'")
        self._send_receive("modify_note_content", {"filePath": file_path, "content": content})  # type: ignore[attr-defined]
        print(f"Note modification request sent for: {file_path}")

    def open_note(self, path: str, new_leaf: bool = False) -> None:  # type: ignore[misc]
        """Open a note in Obsidian using its vault-relative link path.

        Args:
            path: Link path **without** the ``.md`` extension
                  (e.g. ``"Folder/My Note"``).
            new_leaf: Open in a new tab/split if ``True``.
        """
        if not path:
            raise ValueError("Path cannot be empty.")
        self._send_receive("open_note", {"path": path, "new_leaf": new_leaf})  # type: ignore[attr-defined]
        print(f"Request sent to open note link: {path} (new_leaf: {new_leaf})")
