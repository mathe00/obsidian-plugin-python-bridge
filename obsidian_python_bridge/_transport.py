# --- obsidian_python_bridge/_transport.py ---
"""
Low-level HTTP transport used by the Obsidian Python Bridge client.

All communication with the companion Obsidian plugin goes through two
functions exposed here:

* :func:`test_connection` — quick liveness check performed during
  :class:`~obsidian_python_bridge._client.ObsidianPluginDevPythonToJS.__init__`.
* :func:`send_receive` — core request/response round-trip used by every
  public API method.

Both accept a ``requests.Session`` instance so that connection pooling is
shared across calls.
"""

from __future__ import annotations

import sys
import traceback
from typing import Any

import requests

from ._exceptions import ObsidianCommError

# ---------------------------------------------------------------------------
# Connection test
# ---------------------------------------------------------------------------


def test_connection(
    session: requests.Session,
    base_url: str,
    timeout: float,
) -> None:
    """Perform a quick liveness check against the Obsidian plugin HTTP server.

    Sends a dummy POST with action ``_test_connection_ping``.  The server
    will respond with an error (unknown action) — that is *expected* and
    treated as success.  Any other outcome (timeout, connection refused, …)
    is raised as :class:`ObsidianCommError`.

    Raises:
        ObsidianCommError: If the server cannot be reached.
    """
    test_action = "_test_connection_ping"
    print(f"Testing connection to {base_url}...")

    try:
        response = session.post(
            base_url,
            json={"action": test_action, "payload": {}},
            timeout=timeout,
        )

        # Any 4xx/5xx with the expected "unknown action" body means the
        # server is alive and routing correctly.
        if 400 <= response.status_code < 600:
            try:
                error_data = response.json()
                if "error" in error_data and (
                    f"Unknown action: {test_action}" in error_data["error"] or "Not Found" in error_data["error"]
                ):
                    print("Connection test successful (server responded as expected).")
                    return
            except requests.exceptions.JSONDecodeError:
                pass
            # Non-JSON error body — still means the server is up
            print(
                f"Connection test partially successful (server responded with "
                f"status {response.status_code}). Assuming OK.",
            )
            return

        # Unexpected 2xx/3xx
        response.raise_for_status()
        print("Connection test successful (received unexpected 2xx/3xx status).")

    except requests.exceptions.Timeout:
        raise ObsidianCommError(
            f"Connection to {base_url} timed out after {timeout}s. "
            "Is Obsidian running and the Python Bridge plugin active?",
            action=test_action,
        ) from None
    except requests.exceptions.ConnectionError as e:
        raise ObsidianCommError(
            f"Failed to connect to {base_url}. Check Obsidian status, plugin status, and firewall. Error: {e}",
            action=test_action,
        ) from e
    except requests.exceptions.RequestException as e:
        status_code = e.response.status_code if e.response is not None else None
        raise ObsidianCommError(
            f"HTTP connection test failed: {e}",
            action=test_action,
            status_code=status_code,
        ) from e


# ---------------------------------------------------------------------------
# Core request / response
# ---------------------------------------------------------------------------


def send_receive(
    session: requests.Session,
    base_url: str,
    action: str,
    payload: dict[str, Any] | None = None,
    timeout: float = 10.0,
    *,
    execution_mode: str = "normal",
) -> Any:
    """Send an action request to the Obsidian plugin and return the response data.

    This is the single entry-point used by *every* public API method.

    Args:
        session: A ``requests.Session`` for connection pooling.
        base_url: The plugin's HTTP root (e.g. ``http://127.0.0.1:27123/``).
        action: The action identifier understood by the plugin.
        payload: Optional dict of action-specific data.
        timeout: Per-request timeout in seconds.
        execution_mode: ``"normal"`` or ``"discovery"``.  In discovery mode
            all API calls are blocked to prevent unintended side-effects.

    Returns:
        The value of the ``"data"`` field from the plugin's JSON response.

    Raises:
        ObsidianCommError: On any communication, HTTP, or plugin-level error.
    """
    # Block API calls during settings discovery to prevent side-effects.
    if execution_mode == "discovery":
        raise ObsidianCommError(
            "API calls are disabled during settings discovery mode. "
            "Ensure your script handles the --get-settings-json argument "
            "(e.g., using _handle_cli_args() before initializing the client).",
            action=action,
        )

    request_data: dict[str, Any] = {
        "action": action,
        "payload": payload if payload is not None else {},
    }
    response_text = ""

    try:
        response = session.post(base_url, json=request_data, timeout=timeout)
        response_text = response.text

        # --- HTTP-level errors (4xx / 5xx) ---
        response.raise_for_status()

        # --- Parse JSON ---
        response_data = response.json()

        # --- Plugin-level status ---
        if isinstance(response_data, dict) and response_data.get("status") == "success":
            return response_data.get("data")
        if isinstance(response_data, dict) and response_data.get("status") == "error":
            error_message = response_data.get("error", "Unknown error reported by Obsidian.")
            raise ObsidianCommError(
                error_message,
                action=action,
                status_code=response.status_code,
            )

        raise ObsidianCommError(
            f"Invalid response format received: {response_data}",
            action=action,
            status_code=response.status_code,
        )

    # ------------------------------------------------------------------
    # Exception handling — map every requests error to ObsidianCommError
    # ------------------------------------------------------------------
    except ObsidianCommError:
        raise  # Preserve the context already attached above

    except requests.exceptions.Timeout:
        raise ObsidianCommError(
            f"Request timed out after {timeout}s waiting for response.",
            action=action,
        ) from None

    except requests.exceptions.ConnectionError as e:
        raise ObsidianCommError(
            f"HTTP connection failed: {e}",
            action=action,
        ) from e

    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code  # type: ignore[union-attr]
        error_detail: str = response_text
        try:
            error_json = e.response.json()  # type: ignore[union-attr]
            if isinstance(error_json, dict) and "error" in error_json:
                error_detail = error_json["error"]
        except (requests.exceptions.JSONDecodeError, AttributeError):
            pass
        raise ObsidianCommError(
            f"HTTP Error {status_code}: {error_detail}",
            action=action,
            status_code=status_code,
        ) from e

    except requests.exceptions.JSONDecodeError as e:
        raise ObsidianCommError(
            f"Failed to decode JSON response from Obsidian: {e}. Raw response: '{response_text}'",
            action=action,
        ) from e

    except requests.exceptions.RequestException as e:
        status_code = e.response.status_code if e.response is not None else None  # type: ignore[union-attr]
        raise ObsidianCommError(
            f"An unexpected HTTP request error occurred: {e}",
            action=action,
            status_code=status_code,
        ) from e

    except Exception as e:
        print(
            f"ERROR: Unexpected error in send_receive: {e}\n{traceback.format_exc()}",
            file=sys.stderr,
        )
        raise ObsidianCommError(
            f"An unexpected error occurred during communication: {e}",
            action=action,
        ) from e
