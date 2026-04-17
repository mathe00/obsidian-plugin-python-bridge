# --- obsidian_python_bridge/_vault.py ---
"""
Vault, folder, and file-management API methods.

This mixin provides methods for querying vault metadata, creating/renaming/
deleting notes and folders, running Obsidian commands, and retrieving
theme/language/tag information.
"""

from __future__ import annotations


class VaultMixin:
    """Mixin: vault info, file CRUD, folder ops, commands, theme, tags.

    Requires the host class to expose ``_send_receive(action, payload)``.
    """

    # ------------------------------------------------------------------
    # Vault metadata
    # ------------------------------------------------------------------

    def get_current_vault_absolute_path(self) -> str:  # type: ignore[misc]
        """Return the absolute filesystem path of the current vault root."""
        return self._send_receive("get_current_vault_absolute_path")  # type: ignore[attr-defined]

    def get_obsidian_language(self) -> str:  # type: ignore[misc]
        """Return the language code configured in Obsidian (e.g. ``'en'``, ``'fr'``)."""
        return self._send_receive("get_obsidian_language")  # type: ignore[attr-defined]

    def get_vault_name(self) -> str:  # type: ignore[misc]
        """Return the name of the currently open vault."""
        return self._send_receive("get_vault_name")  # type: ignore[attr-defined]

    def get_theme_mode(self) -> str:  # type: ignore[misc]
        """Return the current theme mode (``'light'`` or ``'dark'``)."""
        return self._send_receive("get_theme_mode")  # type: ignore[attr-defined]

    def get_all_tags(self) -> list[str]:  # type: ignore[misc]
        """Return a list of all unique tags in the vault (with ``#`` prefix)."""
        return self._send_receive("get_all_tags")  # type: ignore[attr-defined]

    # ------------------------------------------------------------------
    # Note CRUD
    # ------------------------------------------------------------------

    def create_note(self, path: str, content: str = "") -> None:  # type: ignore[misc]
        """Create a new note in the vault.

        Args:
            path: Vault-relative path including ``.md`` extension
                  (e.g. ``"Folder/New Note.md"``).
            content: Initial note content.
        """
        if not path:
            raise ValueError("Path cannot be empty for create_note.")
        self._send_receive("create_note", {"path": path, "content": content})  # type: ignore[attr-defined]
        print(f"Request sent to create note: {path}")

    def check_path_exists(self, path: str) -> bool:  # type: ignore[misc]
        """Check whether a file or folder exists at the given vault-relative path."""
        if not path:
            raise ValueError("Path cannot be empty for check_path_exists.")
        return self._send_receive("check_path_exists", {"path": path})  # type: ignore[attr-defined]

    def delete_path(self, path: str, permanently: bool = False) -> None:  # type: ignore[misc]
        """Delete a note or folder (moves to trash unless *permanently* is set)."""
        if not path:
            raise ValueError("Path cannot be empty for delete_path.")
        self._send_receive("delete_path", {"path": path, "permanently": permanently})  # type: ignore[attr-defined]
        print(f"Request sent to delete path: {path} (Permanently: {permanently})")

    def rename_path(self, old_path: str, new_path: str) -> None:  # type: ignore[misc]
        """Rename or move a note/folder within the vault."""
        if not old_path:
            raise ValueError("old_path cannot be empty for rename_path.")
        if not new_path:
            raise ValueError("new_path cannot be empty for rename_path.")
        self._send_receive("rename_path", {"old_path": old_path, "new_path": new_path})  # type: ignore[attr-defined]
        print(f"Request sent to rename path: {old_path} -> {new_path}")

    # ------------------------------------------------------------------
    # Folder operations
    # ------------------------------------------------------------------

    def create_folder(self, path: str) -> None:  # type: ignore[misc]
        """Create a new folder at the given vault-relative path."""
        if not path:
            raise ValueError("Path cannot be empty for create_folder.")
        self._send_receive("create_folder", {"path": path})  # type: ignore[attr-defined]
        print(f"Request sent to create folder: {path}")

    def list_folder(self, path: str) -> dict[str, list[str]]:  # type: ignore[misc]
        """List files and subfolders in a vault folder.

        Args:
            path: Vault-relative folder path (``""`` for the vault root).

        Returns:
            A dict with ``'files'`` and ``'folders'`` keys.
        """
        if path is None:
            raise ValueError('Path cannot be None for list_folder. Use "" for the vault root.')
        return self._send_receive("list_folder", {"path": path})  # type: ignore[attr-defined]

    # ------------------------------------------------------------------
    # Obsidian commands
    # ------------------------------------------------------------------

    def run_obsidian_command(self, command_id: str) -> None:  # type: ignore[misc]
        """Execute an Obsidian command by its ID (e.g. ``"editor:toggle-bold"``)."""
        if not command_id:
            raise ValueError("command_id cannot be empty for run_obsidian_command.")
        self._send_receive("run_obsidian_command", {"command_id": command_id})  # type: ignore[attr-defined]
        print(f"Request sent to run command: {command_id}")
