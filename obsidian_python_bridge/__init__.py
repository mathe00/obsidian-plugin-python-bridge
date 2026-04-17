# --- obsidian_python_bridge/__init__.py ---
"""
Obsidian Python Bridge — client library package.

Public symbols are re-exported here for convenience, and also through the
backward-compatible shim ``ObsidianPluginDevPythonToJS.py`` at the
repository root so that existing user scripts continue to work unchanged.
"""

# Trigger module-level side effects (event env parsing) on import.
import obsidian_python_bridge._events  # noqa: F401

from ._client import ObsidianPluginDevPythonToJS
from ._exceptions import ObsidianCommError
from ._settings import _handle_cli_args, define_settings
from ._version import __version__

__all__ = [
    "ObsidianCommError",
    "ObsidianPluginDevPythonToJS",
    "__version__",
    "_handle_cli_args",
    "define_settings",
]
