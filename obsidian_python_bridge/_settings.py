# --- obsidian_python_bridge/_settings.py ---
"""
Settings discovery protocol helpers.

User scripts call :func:`define_settings` (optionally) and **must** call
:func:`_handle_cli_args` near the top of their script — *after*
``define_settings`` but *before* any main logic.  When the Obsidian plugin
needs to discover a script's settings it re-executes the script with
``--get-settings-json``; ``_handle_cli_args`` detects that flag, prints
the registered definitions as JSON to stdout, and exits.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any

# ---------------------------------------------------------------------------
# Global registry populated by user scripts via define_settings()
# ---------------------------------------------------------------------------

_script_settings_definitions: list[dict[str, Any]] = []


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


def define_settings(settings_list: list[dict[str, Any]]) -> None:
    """Register the settings definitions for the current script.

    Call this once at the top of your script, before :func:`_handle_cli_args`.

    Each element of *settings_list* is a ``dict`` with keys such as
    ``key``, ``type``, ``label``, ``description``, ``default``, and
    optionally ``options``, ``min``, ``max``, ``step``.
    """
    global _script_settings_definitions
    _script_settings_definitions = settings_list


def _handle_cli_args() -> None:
    """Check for ``--get-settings-json`` and handle settings discovery.

    If the flag is present, the registered settings definitions are printed
    as JSON to **stdout** and the process exits with code 0.  This is how
    the Obsidian plugin discovers per-script settings at runtime.

    Must be called *after* :func:`define_settings`.
    """
    parser = argparse.ArgumentParser(
        description="Obsidian Python Bridge Script Runner Helper",
    )
    parser.add_argument(
        "--get-settings-json",
        action="store_true",
        help="Print script settings definitions as JSON and exit.",
    )
    # parse_known_args avoids failures if Obsidian or the user passes extra args
    args, _unknown = parser.parse_known_args()

    # Re-read event env vars here (idempotent with _events module, but
    # kept for backward compatibility — the original monolith did this).
    global _is_handling_event, _event_name, _event_payload
    _event_name = os.environ.get("OBSIDIAN_EVENT_NAME")
    if _event_name:
        _is_handling_event = True
        payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
        try:
            _event_payload = json.loads(payload_str)
        except json.JSONDecodeError:
            print(
                f"ERROR: Failed to parse event payload JSON for event '{_event_name}'. Payload: '{payload_str}'",
                file=sys.stderr,
            )
            _event_payload = {
                "error": "Failed to parse payload",
                "raw_payload": payload_str,
            }

    if not args.get_settings_json:
        return

    # --- Settings discovery mode: output JSON and exit ---
    definitions_to_output = _script_settings_definitions if "_script_settings_definitions" in globals() else []
    try:
        json_output = json.dumps(definitions_to_output)
        print(json_output)
        sys.exit(0)
    except TypeError as e:
        error_msg = {
            "status": "error",
            "error": f"Failed to serialize settings definitions to JSON: {e}. Check default values.",
            "definitions": definitions_to_output,
        }
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        error_msg = {
            "status": "error",
            "error": f"Unexpected error during settings JSON export: {e}",
        }
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)
