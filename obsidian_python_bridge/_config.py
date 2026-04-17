# --- obsidian_python_bridge/_config.py ---
"""
Configuration constants for the Obsidian Python Bridge client library.

The ``HTTP_PORT`` value is resolved once at import-time from the
``OBSIDIAN_HTTP_PORT`` environment variable (set by the companion Obsidian
plugin when it spawns a script).  Callers can always pass an explicit port
to :class:`~obsidian_python_bridge._client.ObsidianPluginDevPythonToJS`
if they need to override this.
"""

import os

# Default port the Obsidian plugin listens on (localhost only).
DEFAULT_HTTP_PORT: int = 27123

# Effective port: env var wins, otherwise fall back to the default.
HTTP_PORT: int = int(os.environ.get("OBSIDIAN_HTTP_PORT", DEFAULT_HTTP_PORT))
