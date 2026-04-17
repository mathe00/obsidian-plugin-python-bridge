# --- obsidian_python_bridge/_editor.py ---
"""
Editor-related API methods.

This mixin provides methods for interacting with the active Markdown
editor: reading or replacing the selection, getting/setting the cursor,
reading or replacing individual lines, and scrolling ranges into view.
"""

from __future__ import annotations

from typing import Any


class EditorMixin:
    """Mixin: active editor manipulation methods.

    Requires the host class to expose ``_send_receive(action, payload)``.
    """

    # ------------------------------------------------------------------
    # Selection
    # ------------------------------------------------------------------

    def get_selected_text(self) -> str:  # type: ignore[misc]
        """Return the currently selected text in the active editor (may be empty)."""
        return self._send_receive("get_selected_text")  # type: ignore[attr-defined]

    def replace_selected_text(self, replacement: str) -> None:  # type: ignore[misc]
        """Replace the selected text (or insert at cursor if nothing is selected)."""
        self._send_receive("replace_selected_text", {"replacement": replacement})  # type: ignore[attr-defined]
        print("Selection replacement request sent.")

    # ------------------------------------------------------------------
    # Context
    # ------------------------------------------------------------------

    def get_editor_context(self) -> dict[str, Any]:  # type: ignore[misc]
        """Return context information about the active editor.

        May include ``cursor`` (``{line, ch}``), ``line_count``, etc.
        Returns an empty dict if no editor is active.
        """
        return self._send_receive("get_editor_context")  # type: ignore[attr-defined]

    # ------------------------------------------------------------------
    # Cursor / line / range
    # ------------------------------------------------------------------

    def set_cursor(self, line: int, ch: int) -> None:  # type: ignore[misc]
        """Set the cursor position in the active editor (0-based)."""
        self._send_receive("set_cursor", {"line": line, "ch": ch})  # type: ignore[attr-defined]

    def get_line(self, line_number: int) -> str:  # type: ignore[misc]
        """Return the content of a specific line (0-based)."""
        return self._send_receive("get_line", {"line_number": line_number})  # type: ignore[attr-defined]

    def set_line(self, line_number: int, text: str) -> None:  # type: ignore[misc]
        """Replace the entire content of a specific line (0-based)."""
        self._send_receive("set_line", {"line_number": line_number, "text": text})  # type: ignore[attr-defined]

    def replace_range(  # type: ignore[misc]
        self,
        replacement: str,
        from_line: int,
        from_ch: int,
        to_line: int | None = None,
        to_ch: int | None = None,
    ) -> None:
        """Replace text in a specific range of the active editor.

        Args:
            replacement: The text to insert.
            from_line: Start line (0-based).
            from_ch: Start character (0-based).
            to_line: End line (0-based). Defaults to *from_line*.
            to_ch: End character (0-based). Defaults to *from_ch*.
        """
        payload: dict[str, Any] = {
            "replacement": replacement,
            "from_line": from_line,
            "from_ch": from_ch,
        }
        if to_line is not None:
            payload["to_line"] = to_line
        if to_ch is not None:
            payload["to_ch"] = to_ch
        self._send_receive("replace_range", payload)  # type: ignore[attr-defined]

    def scroll_into_view(  # type: ignore[misc]
        self,
        from_line: int,
        from_ch: int,
        to_line: int | None = None,
        to_ch: int | None = None,
        center: bool = False,
    ) -> None:
        """Scroll a specific range into view in the active editor.

        Args:
            from_line: Start line (0-based).
            from_ch: Start character (0-based).
            to_line: End line (0-based). Defaults to *from_line*.
            to_ch: End character (0-based). Defaults to *from_ch*.
            center: Center the range in the viewport if ``True``.
        """
        payload: dict[str, Any] = {
            "from_line": from_line,
            "from_ch": from_ch,
            "center": center,
        }
        if to_line is not None:
            payload["to_line"] = to_line
        if to_ch is not None:
            payload["to_ch"] = to_ch
        self._send_receive("scroll_into_view", payload)  # type: ignore[attr-defined]
