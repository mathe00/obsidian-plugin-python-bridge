# --- ObsidianPluginDevPythonToJS.py ---
"""
Obsidian Python Bridge Client Library (HTTP Version)

Backward-compatible shim — all public symbols are re-exported from the
internal ``obsidian_python_bridge`` package so that existing user scripts
continue to work unchanged::

    from ObsidianPluginDevPythonToJS import (
        ObsidianPluginDevPythonToJS,
        ObsidianCommError,
        define_settings,
        _handle_cli_args,
    )

**Do not add new code here.**  The real implementation lives in the
``obsidian_python_bridge/`` package directory.
"""

# Trigger module-level side effects (event env parsing) on import.
# This must happen before anything else so that the global event state
# is available to user scripts immediately.
import obsidian_python_bridge._events  # noqa: F401

# Re-export the public API that user scripts depend on.
from obsidian_python_bridge._client import ObsidianPluginDevPythonToJS
from obsidian_python_bridge._exceptions import ObsidianCommError
from obsidian_python_bridge._settings import _handle_cli_args, define_settings

__all__ = [
    "ObsidianCommError",
    "ObsidianPluginDevPythonToJS",
    "_handle_cli_args",
    "define_settings",
]
