# --- obsidian_python_bridge/_exceptions.py ---
"""
Custom exception classes for the Obsidian Python Bridge client library.
"""


class ObsidianCommError(Exception):
    """Raised when communication with the Obsidian plugin HTTP server fails.

    Carries optional context about the action that failed and the HTTP
    status code, making it easier for callers to produce meaningful error
    messages or retry logic.
    """

    def __init__(
        self,
        message: str,
        action: str | None = None,
        status_code: int | None = None,
    ) -> None:
        self.action = action
        self.status_code = status_code

        # Build a human-readable message that includes the optional context.
        full_message = f"Action '{action}': " if action else ""
        full_message += f"HTTP {status_code}: " if status_code else ""
        full_message += message

        super().__init__(full_message)
