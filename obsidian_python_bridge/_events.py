# --- obsidian_python_bridge/_events.py ---
"""
Module-level event state and parsing.

When the Obsidian plugin triggers a script in response to a vault event
(e.g. note modification), it sets two environment variables before spawning
the Python process:

* ``OBSIDIAN_EVENT_NAME``  — the Obsidian event identifier (e.g. ``"vault-modify"``)
* ``OBSIDIAN_EVENT_PAYLOAD`` — a JSON string with event-specific data

This module parses those variables **at import time** so the state is
available immediately.  User scripts can check :func:`is_handling_event`
early in their ``__main__`` guard to decide whether to process the event
or exit.
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any

# ---------------------------------------------------------------------------
# Module-level event state (set once at import time)
# ---------------------------------------------------------------------------

_is_handling_event: bool = False
_event_name: str | None = None
_event_payload: dict[str, Any] | None = None

# ---------------------------------------------------------------------------
# Parse event environment variables at import time
# ---------------------------------------------------------------------------

_event_name_from_env: str | None = os.environ.get("OBSIDIAN_EVENT_NAME")
if _event_name_from_env:
    _is_handling_event = True
    _event_name = _event_name_from_env

    _payload_str: str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        _event_payload = json.loads(_payload_str)
    except json.JSONDecodeError:
        print(
            f"ERROR: Failed to parse event payload JSON for event '{_event_name}'. Payload: '{_payload_str}'",
            file=sys.stderr,
        )
        _event_payload = {
            "error": "Failed to parse payload",
            "raw_payload": _payload_str,
        }


# ---------------------------------------------------------------------------
# Public accessors
# ---------------------------------------------------------------------------


def is_handling_event() -> bool:
    """Return ``True`` if the current process was spawned by an Obsidian event trigger."""
    return _is_handling_event


def get_event_name() -> str | None:
    """Return the Obsidian event name that triggered this process, or ``None``."""
    return _event_name


def get_event_payload() -> dict[str, Any] | None:
    """Return the parsed event payload dictionary, or ``None``."""
    return _event_payload
