# Obsidian Python Bridge - Python Client Library Documentation

This document provides instructions and API reference for using the `ObsidianPluginDevPythonToJS.py` client library to interact with the Obsidian Python Bridge plugin from your Python scripts.

## Overview

This library facilitates communication between your Python scripts and the Obsidian Python Bridge plugin running inside Obsidian. It uses HTTP requests (via the `requests` library) to send commands to the plugin and receive data back, allowing you to interact with your Obsidian vault programmatically.

## Prerequisites

1.  **Python 3.x:** Ensure you have a working Python 3 installation accessible from your system's PATH.
2.  **`requests` Library (Required):** This library is essential for HTTP communication. Install it if you haven't already:
    ```bash
    pip install requests
    # or
    python3 -m pip install requests
    ```
    The Obsidian plugin checks for this on startup, but your script will fail immediately without it.
3.  **`PyYAML` Library (Optional):** This library is only required if you intend to use the `manage_properties_key` or `manage_properties_value` methods for manipulating note frontmatter. Install it if needed:
    ```bash
    pip install PyYAML
    # or
    python3 -m pip install PyYAML
    ```
    If PyYAML is not installed, calling these specific methods will raise a `NameError`.

## Setup and Importing

**Recommended Method:**

The easiest way to use the library is to **place the `ObsidianPluginDevPythonToJS.py` file in the same folder as your own Python scripts**. This allows for a simple direct import:

```python
# Your script (e.g., my_script.py) located in the same folder
# as ObsidianPluginDevPythonToJS.py

import sys
import traceback
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError

try:
    # Your script logic here...
    obsidian = ObsidianPluginDevPythonToJS()
    obsidian.show_notification("Script started!")
    # ... more actions

except ObsidianCommError as e:
    # Handle communication errors with Obsidian specifically
    print(f"Error communicating with Obsidian: {e}", file=sys.stderr)
    traceback.print_exc() # Optional: print full traceback for debugging
except Exception as e:
    # Handle other potential errors in your script
    print(f"An unexpected error occurred: {e}", file=sys.stderr)
    traceback.print_exc()

```

**Alternative Method (If Library is Elsewhere):**

If you store `ObsidianPluginDevPythonToJS.py` in a central location (like the plugin's installation directory), you need to add that directory to Python's `sys.path` before importing. This is generally less convenient for script distribution.

```python
import sys
import os
import traceback

# --- Configuration ---
# Path to the *directory* containing ObsidianPluginDevPythonToJS.py
# !! ADJUST THIS PATH IF NEEDED !!
library_directory = "/path/to/your/plugin/folder/obsidian-python-bridge/" # Example path

# Add the library directory to sys.path if it's not already there
if library_directory not in sys.path:
    sys.path.append(library_directory)

try:
    from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
except ImportError:
    print(f"ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    print(f"Ensure '{library_directory}' is correct and contains the .py file.", file=sys.stderr)
    sys.exit(1)

try:
    # Your script logic here...
    obsidian = ObsidianPluginDevPythonToJS()
    # ...

except ObsidianCommError as e:
    print(f"Error communicating with Obsidian: {e}", file=sys.stderr)
    traceback.print_exc()
except Exception as e:
    print(f"An unexpected error occurred: {e}", file=sys.stderr)
    traceback.print_exc()
```

## Initialization

To start interacting with Obsidian, create an instance of the `ObsidianPluginDevPythonToJS` class:

```python
obsidian = ObsidianPluginDevPythonToJS(http_port=27123, connect_timeout=2.0, request_timeout=10.0)
```

**Constructor Parameters:**

*   `http_port` (`int`, optional): The port number the Obsidian plugin's HTTP server is listening on.
    *   **Default:** Reads the `OBSIDIAN_HTTP_PORT` environment variable (set by the plugin when running scripts). If the variable is not set, it defaults to `27123`. You usually don't need to set this manually unless running scripts outside the plugin's execution context or using multiple vaults with different ports.
*   `connect_timeout` (`float`, optional, default: `2.0`): Timeout in seconds for the initial connection test performed during initialization.
*   `request_timeout` (`float`, optional, default: `10.0`): Default timeout in seconds for waiting for a response from Obsidian for most API calls.

**Initialization Behavior:**

*   The constructor attempts a quick connection test to the specified URL (`http://127.0.0.1:http_port/`).
*   **Raises:**
    *   `ValueError`: If `http_port` is not a valid integer between 1024 and 65535.
    *   `ObsidianCommError`: If the initial connection test fails (e.g., timeout, connection refused, Obsidian not running, plugin inactive, wrong port).

## Error Handling

Most communication issues or errors reported by the Obsidian plugin will raise an `ObsidianCommError`. It's recommended to wrap your API calls in a `try...except ObsidianCommError` block.

```python
try:
    content = obsidian.get_active_note_content()
    print("Got content successfully.")
except ObsidianCommError as e:
    print(f"Failed to get note content: {e}", file=sys.stderr)
    # e.action might contain the failed action name (e.g., 'get_active_note_content')
    # e.status_code might contain the HTTP status code if available
```

Other standard Python exceptions like `ValueError` (for invalid arguments) or `NameError` (if `PyYAML` is missing for property methods) might also be raised.

## API Reference

All methods below may raise `ObsidianCommError` if communication with the Obsidian plugin fails or if the plugin reports an error for the requested action.

---

### UI Interaction

#### `show_notification(content: str, duration: int = 4000) -> None`

Displays a notification message within the Obsidian interface.

*   **Parameters:**
    *   `content` (`str`): The text message to display. Cannot be empty.
    *   `duration` (`int`, optional, default: `4000`): How long the notification should remain visible, in milliseconds.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `content` is empty.

#### `request_user_input(script_name: str, input_type: str, message: str, validation_regex: Optional[str] = None, min_value: Optional[Union[int, float]] = None, max_value: Optional[Union[int, float]] = None, step: Optional[Union[int, float]] = None, **kwargs) -> Any`

Requests user input via a modal dialog shown within Obsidian. This call **blocks** script execution until the user interacts with the modal (submits or cancels).

*   **Parameters:**
    *   `script_name` (`str`): Name of your script (shown in the modal title).
    *   `input_type` (`str`): Type of input field. Supported types: `'text'`, `'number'`, `'range'`, `'boolean'` (or `'checkbox'`), `'date'`.
    *   `message` (`str`): The prompt message displayed to the user.
    *   `validation_regex` (`Optional[str]`, optional): A regex pattern (as a string) for basic client-side validation of `'text'` input.
    *   `min_value` (`Optional[Union[int, float]]`, optional): Minimum allowed value for `'number'` or `'range'` input.
    *   `max_value` (`Optional[Union[int, float]]`, optional): Maximum allowed value for `'number'` or `'range'` input.
    *   `step` (`Optional[Union[int, float]]`, optional): Step increment for `'number'` or `'range'` input.
    *   `**kwargs`: Allows passing additional parameters for potential future input types.
*   **Returns:** (`Any`) The value entered by the user. The type depends on `input_type`:
    *   `'text'`: `str`
    *   `'number'`, `'range'`: `float`
    *   `'boolean'`, `'checkbox'`: `bool`
    *   `'date'`: `str` (in 'YYYY-MM-DD' format)
*   **Raises:**
    *   `ValueError`: If `script_name`, `input_type`, or `message` are empty.
    *   `ObsidianCommError`: If the user cancels the input modal in Obsidian (the plugin returns an error status in this case) or if the request itself fails.

---

### Active Note Operations

These methods operate on the currently focused note in the Obsidian workspace. They will raise an `ObsidianCommError` if no Markdown note is active.

#### `get_active_note_content() -> str`

Retrieves the full Markdown content of the currently active note.

*   **Returns:** (`str`) The content of the active note.

#### `get_active_note_frontmatter() -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of the currently active note.

*   **Returns:** (`Optional[Dict[str, Any]]`) A dictionary representing the frontmatter, or `None` if the note has no frontmatter.

#### `get_active_note_absolute_path() -> str`

Retrieves the absolute filesystem path of the currently active note.

*   **Returns:** (`str`) The absolute path (e.g., `/home/user/vault/folder/note.md` or `C:\Users\user\vault\folder\note.md`).

#### `get_active_note_relative_path() -> str`

Retrieves the path of the currently active note, relative to the vault root.

*   **Returns:** (`str`) The vault-relative path (e.g., `folder/note.md`).

#### `get_active_note_title() -> str`

Retrieves the title (filename without extension) of the currently active note.

*   **Returns:** (`str`) The title of the note (e.g., `note`).

---

### Specific Note Operations

These methods operate on a note specified by its path.

#### `get_note_content(path: str) -> str`

Retrieves the full content of a specific note.

*   **Parameters:**
    *   `path` (`str`): The **vault-relative path** to the note (e.g., `"Folder/My Note.md"`). Must include the `.md` extension.
*   **Returns:** (`str`) The content of the note.
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if the note is not found.

#### `get_note_frontmatter(path: str) -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of a specific note.

*   **Parameters:**
    *   `path` (`str`): The **vault-relative path** to the note (e.g., `"Folder/My Note.md"`). Must include the `.md` extension.
*   **Returns:** (`Optional[Dict[str, Any]]`) Frontmatter dictionary, or `None` if none exists or the note is not found.
*   **Raises:** `ValueError` if `path` is empty.

#### `modify_note_content(file_path: str, content: str) -> None`

Modifies the entire content of a specific note using Obsidian's API. **Note:** This method expects an **absolute path**. For vault-relative paths, consider using the underlying `modify_note_content_by_path` action via `_send_receive` if needed, or construct the absolute path first.

*   **Parameters:**
    *   `file_path` (`str`): The **absolute filesystem path** to the Markdown note file (`.md`) to modify.
    *   `content` (`str`): The new, full content to write to the note.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `file_path` is not an absolute path. `ObsidianCommError` if the file is not found within the vault, is outside the vault, or modification fails.

#### `open_note(path: str, new_leaf: bool = False) -> None`

Opens a specific note in the Obsidian interface using its link path (Obsidian's internal resolution).

*   **Parameters:**
    *   `path` (`str`): The **vault-relative path** of the note to open, **WITHOUT the `.md` extension**. Examples: `"Folder/My Note"`, `"My Note"`.
    *   `new_leaf` (`bool`, optional, default: `False`): If `True`, attempts to open the note in a new leaf (tab/split).
*   **Returns:** `None`
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if the note cannot be opened (e.g., path not resolved by Obsidian).

---

### Editor Operations (Active Note)

These methods operate on the editor of the currently active Markdown note.

#### `get_selected_text() -> str`

Retrieves the currently selected text in the active editor.

*   **Returns:** (`str`) The selected text. Returns an empty string (`""`) if nothing is selected.
*   **Raises:** `ObsidianCommError` if no Markdown editor is active.

#### `replace_selected_text(replacement: str) -> None`

Replaces the selected text in the active editor. If nothing is selected, inserts the text at the cursor position.

*   **Parameters:**
    *   `replacement` (`str`): The text to insert or replace the selection with. Can be an empty string to delete the selection.
*   **Returns:** `None`
*   **Raises:** `ObsidianCommError` if no Markdown editor is active.

---

### Vault Operations

#### `get_current_vault_absolute_path() -> str`

Retrieves the absolute filesystem path of the currently open Obsidian vault.

*   **Returns:** (`str`) The absolute path to the vault's root directory.

#### `get_all_note_paths(absolute: bool = False) -> List[str]`

Retrieves the paths of all Markdown notes (`.md` files) within the vault.

*   **Parameters:**
    *   `absolute` (`bool`, optional, default: `False`):
        *   If `False`, returns vault-relative paths (e.g., `["Folder/Note1.md", "Note2.md"]`).
        *   If `True`, returns absolute filesystem paths.
*   **Returns:** (`List[str]`) A list of note path strings.

#### `get_all_note_titles() -> List[str]`

Retrieves the titles (filenames without extensions) of all Markdown notes in the vault.

*   **Returns:** (`List[str]`) A list of note title strings 
