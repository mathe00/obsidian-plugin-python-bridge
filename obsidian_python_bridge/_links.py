# --- obsidian_python_bridge/_links.py ---
"""
Link and backlink API methods.

This mixin provides methods for retrieving outgoing links and incoming
backlinks for notes in the vault.
"""

from __future__ import annotations

import sys
from typing import Any

from ._exceptions import ObsidianCommError


class LinksMixin:
    """Mixin: outgoing links and backlinks.

    Requires the host class to expose ``_send_receive(action, payload)``.
    """

    def get_links(self, path: str, type: str = "outgoing") -> list[str]:  # type: ignore[misc]
        """Retrieve links associated with a note.

        Currently only ``'outgoing'`` links (including embeds) are reliably
        supported server-side.

        Args:
            path: Vault-relative path of the note.
            type: ``'outgoing'``, ``'incoming'``, or ``'all'``.
                  Only ``'outgoing'`` is currently implemented by the plugin.

        Returns:
            A list of link path strings found in the note.
        """
        if not path:
            raise ValueError("Path cannot be empty for get_links.")
        if type not in ("outgoing", "incoming", "all"):
            print(
                f"Warning: Link type '{type}' requested, but only 'outgoing' is currently implemented by the plugin.",
                file=sys.stderr,
            )
            type = "outgoing"

        return self._send_receive("get_links", {"path": path, "type": type})  # type: ignore[attr-defined]

    def get_backlinks(  # type: ignore[misc]
        self,
        path: str,
        use_cache_if_available: bool = True,
        cache_mode: str = "fast",
    ) -> dict[str, list[dict[str, Any]]]:
        """Retrieve backlinks (incoming links) for a note.

        Optionally uses the ``obsidian-backlink-cache`` community plugin
        for faster results in large vaults.

        Args:
            path: Vault-relative path of the note.
            use_cache_if_available: Try the cache plugin first if ``True``.
            cache_mode: ``'fast'`` (default) or ``'safe'``.

        Returns:
            A dict mapping absolute source-note paths to lists of link info
            dicts.  Empty dict if no backlinks exist.

        Raises:
            ValueError: If *path* is empty or *cache_mode* is invalid.
        """
        if not path:
            raise ValueError("Path cannot be empty for get_backlinks.")
        if cache_mode not in ("fast", "safe"):
            raise ValueError("cache_mode must be either 'fast' or 'safe'.")

        backlinks_data = self._send_receive(  # type: ignore[attr-defined]
            "get_backlinks",
            {
                "path": path,
                "use_cache_if_available": use_cache_if_available,
                "cache_mode": cache_mode,
            },
        )

        if not isinstance(backlinks_data, dict):
            raise ObsidianCommError(
                f"Received unexpected data type from get_backlinks: {type(backlinks_data)}. Expected dict.",
                action="get_backlinks",
            )
        return backlinks_data
