# Obsidian Python Bridge - Python Client Library Documentation

This document provides instructions and API reference for using the `ObsidianPluginDevPythonToJS.py` client library to interact with the Obsidian Python Bridge plugin from your Python scripts.

## Overview

This library facilitates communication between your Python scripts and the Obsidian Python Bridge plugin running inside Obsidian. It uses HTTP requests (via the `requests` library) to send commands to the plugin and receive data back, allowing you to interact with your Obsidian vault programmatically, define script-specific settings, and more.

## Prerequisites

1.  **Python 3.x:** Ensure you have a working Python 3 installation accessible from your system's PATH. The library uses `argparse` for handling command-line flags, which is included in standard Python 3 distributions.
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

The easiest way to use the library is to **place the `ObsidianPluginDevPythonToJS.py` file in the same folder as your own Python scripts**. This allows for a simple direct import.

```python
# Your script (e.g., my_script.py) located in the same folder
# as ObsidianPluginDevPythonToJS.py

import sys
import os # Needed for environment variable check
import json # Needed for parsing event payload
import traceback

# --- Check for event trigger FIRST ---
# This is crucial for the event listening system
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
is_handling_event = bool(event_name_from_env)
event_payload = None

if is_handling_event:
    # Load payload if handling event
    payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        event_payload = json.loads(payload_str)
    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse event payload JSON. Payload: '{payload_str}'", file=sys.stderr)
        event_payload = {"error": "Failed to parse payload", "raw_payload": payload_str}

# --- Now import the library ---
try:
    from ObsidianPluginDevPythonToJS import (
        ObsidianPluginDevPythonToJS,
        ObsidianCommError,
        define_settings,      # <-- Import if defining settings
        _handle_cli_args      # <-- Import to handle settings discovery
    )
except ImportError:
    print("ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    print("Ensure ObsidianPluginDevPythonToJS.py is in the same folder as this script.", file=sys.stderr)
    sys.exit(1)


# --- Event Handling Logic (if triggered) ---
if is_handling_event:
    print(f"--- Script launched by Event: {event_name_from_env} ---")
    # Add your event handling logic here based on event_name_from_env
    # Example:
    # if event_name_from_env == "vault-modify":
    #     file_path = event_payload.get("path")
    #     print(f"Note modified: {file_path}")
    #     # Initialize client only if needed for response (e.g., notification)
    #     try:
    #         obsidian_client = ObsidianPluginDevPythonToJS(request_timeout=5.0)
    #         obsidian_client.show_notification(f"Handled modify event for {file_path}")
    #         # Optionally unregister
    #         # obsidian_client.unregister_event_listener("vault-modify")
    #     except Exception as e_handle:
    #         print(f"Error initializing client or handling event: {e_handle}", file=sys.stderr)

    # --- IMPORTANT: Exit after handling the event ---
    print("--- Event handling finished. Exiting. ---")
    sys.exit(0)


# --- Main Script Logic (Only runs if NOT triggered by an event) ---
else:
    print("--- Script running in normal mode (not event triggered) ---")
    # --- Define Settings (if any) ---
    # MY_SETTINGS = [ ... ]
    # define_settings(MY_SETTINGS)

    # --- Handle Settings Discovery ---
    # !!! IMPORTANT: Call this EARLY, before main logic !!!
    _handle_cli_args() # Checks for --get-settings-json

    # --- Main Script Logic ---
    try:
        # Your script logic here...
        obsidian = ObsidianPluginDevPythonToJS()

        # Example: Register listener on first run
        # try:
        #     print("Registering listener for vault-modify...")
        #     obsidian.register_event_listener("vault-modify")
        #     obsidian.show_notification("Listening for note modifications...")
        # except ObsidianCommError as e_reg:
        #     print(f"Failed to register listener: {e_reg}", file=sys.stderr)

        # Get settings values if needed
        # settings = obsidian.get_script_settings()
        # api_key = settings.get("api_key", "default_value")

        obsidian.show_notification("Normal script execution started!")
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

If you store `ObsidianPluginDevPythonToJS.py` in a central location, you need to add that directory to Python's `sys.path` *before* the `from ObsidianPluginDevPythonToJS import ...` line. This is generally less convenient.

```python
import sys
import os
import json # Needed for parsing event payload
import traceback

# --- Check for event trigger FIRST ---
# This is crucial for the event listening system
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
is_handling_event = bool(event_name_from_env)
event_payload = None

if is_handling_event:
    # Load payload if handling event
    payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        event_payload = json.loads(payload_str)
    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse event payload JSON. Payload: '{payload_str}'", file=sys.stderr)
        event_payload = {"error": "Failed to parse payload", "raw_payload": payload_str}

# --- Configuration ---
# Path to the *directory* containing ObsidianPluginDevPythonToJS.py
# !! ADJUST THIS PATH IF NEEDED !!
library_directory = "/path/to/your/plugin/folder/obsidian-python-bridge/" # Example path

# Add the library directory to sys.path if it's not already there
if library_directory not in sys.path:
    sys.path.insert(0, library_directory) # Use insert(0, ...) for higher priority

# --- Now import the library components ---
try:
    from ObsidianPluginDevPythonToJS import (
        ObsidianPluginDevPythonToJS,
        ObsidianCommError,
        define_settings,
        _handle_cli_args
    )
except ImportError:
    print(f"ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    print(f"Ensure '{library_directory}' is correct and contains the .py file.", file=sys.stderr)
    sys.exit(1)

# --- Event Handling Logic (if triggered) ---
if is_handling_event:
    print(f"--- Script launched by Event: {event_name_from_env} ---")
    # Add your event handling logic here
    # ... (similar logic as in the recommended method example) ...
    print("--- Event handling finished. Exiting. ---")
    sys.exit(0)

# --- Main Script Logic (Only runs if NOT triggered by an event) ---
else:
    print("--- Script running in normal mode (not event triggered) ---")
    # --- Define Settings (if any) ---
    # ...
    # define_settings(...)

    # --- Handle Settings Discovery ---
    _handle_cli_args()

    # --- Main Script Logic ---
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

To start interacting with Obsidian, create an instance of the `ObsidianPluginDevPythonToJS` class **after** handling the settings discovery (`_handle_cli_args()` if used) and **only if the script is NOT being run for an event**.

```python
# Must be called AFTER _handle_cli_args() if settings are defined
# And typically within the 'else' block after checking for event triggers
obsidian = ObsidianPluginDevPythonToJS(http_port=None, connect_timeout=2.0, request_timeout=10.0)
```

**Constructor Parameters:**

*   `http_port` (`int`, optional): The port number the Obsidian plugin's HTTP server is listening on.
    *   **Default (`None`):** Reads the `OBSIDIAN_HTTP_PORT` environment variable (set by the plugin when running scripts, reflects the *actual* listening port, even if dynamic port 0 was configured). If the variable is not set, it falls back to `27123`. You usually **do not need** to set this manually when running scripts via the plugin.
*   `connect_timeout` (`float`, optional, default: `2.0`): Timeout in seconds for the initial connection test performed during initialization.
*   `request_timeout` (`float`, optional, default: `10.0`): Default timeout in seconds for waiting for a response from Obsidian for most API calls.

**Initialization Behavior:**

*   The constructor attempts a quick connection test to the determined URL (`http://127.0.0.1:PORT/`).
*   It reads the `OBSIDIAN_SCRIPT_RELATIVE_PATH` environment variable (set by the plugin) to identify the current script. This is needed for the `get_script_settings()` and event listener registration methods. If the variable is missing (e.g., running the script outside Obsidian), a warning is printed, and `get_script_settings()` / event methods will fail.
*   **Raises:**
    *   `ValueError`: If `http_port` (if provided manually) is not a valid integer between 1 and 65535.
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

## Script-Specific Settings

You can define configuration settings for your Python script that users can manage directly within the Obsidian "Python Bridge" settings tab.

**Workflow:**

1.  **Define Settings (in your Python script):**
    *   Import the `define_settings` helper function.
    *   Create a list of dictionaries describing each setting.
    *   Call `define_settings(your_settings_list)` **at the beginning** of your script (before `_handle_cli_args`).
2.  **Handle Discovery (in your Python script):**
    *   Import the `_handle_cli_args` helper function.
    *   Call `_handle_cli_args()` **immediately after** `define_settings()`, before any other script logic. This function checks for `--get-settings-json` and also handles the initial event check.
3.  **Plugin Discovers Settings:** Obsidian runs scripts with `--get-settings-json` flag.
4.  **User Configures Values:** User sets values in Obsidian settings UI.
5.  **Script Retrieves Values:** Call `obsidian.get_script_settings()` in your main logic (when not handling an event).

**Settings Definition Structure:**

Each dictionary in the list passed to `define_settings` should have: `key` (str), `type` (str: 'text', 'textarea', 'number', 'toggle', 'dropdown', 'slider'), `label` (str), `description` (str), `default` (Any), `options` (Optional for dropdown), `min`/`max`/`step` (Optional for number/slider). (See README or previous examples for full details).

**Example (`my_configurable_script.py`):**

```python
# (See full example in main README.md or previous documentation)
import sys
import os # Needed for event check
import json # Needed for event check
import traceback
# ... other imports ...

# --- Event Check ---
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
is_handling_event = bool(event_name_from_env)
event_payload = None
if is_handling_event:
    payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try: event_payload = json.loads(payload_str)
    except: pass # Handle error below if needed

# --- Library Import ---
try:
    from ObsidianPluginDevPythonToJS import (
        ObsidianPluginDevPythonToJS, ObsidianCommError,
        define_settings, _handle_cli_args
    )
except ImportError:
    print("ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    sys.exit(1)

# --- Event Handling ---
if is_handling_event:
    print(f"Handling event: {event_name_from_env}")
    # ... handle event logic ...
    sys.exit(0)

# --- Normal Execution ---
else:
    # 1. Define
    MY_SETTINGS = [
        {"key": "api_key", "type": "text", "label": "API Key", "default": ""},
        # ... more settings ...
    ]
    define_settings(MY_SETTINGS)

    # 2. Handle Discovery (also checks events, but we already did)
    _handle_cli_args()

    # 3. Main Logic
    try:
        obsidian = ObsidianPluginDevPythonToJS()
        # 4. Get Values
        settings = obsidian.get_script_settings()
        api_key = settings.get("api_key", MY_SETTINGS[0]["default"])
        # ... use settings ...
    except Exception as e:
        # ... error handling ...
        print(f"Error in main logic: {e}", file=sys.stderr)

```

## API Reference

All methods below may raise `ObsidianCommError` if communication with the Obsidian plugin fails or if the plugin reports an error for the requested action.

---

### Library Helper Functions (Import directly)

#### `define_settings(settings_list: List[Dict[str, Any]]) -> None`

Registers the settings definitions for the current script. **Must be called once at the beginning of the script (before `_handle_cli_args`).**

*   **Parameters:**
    *   `settings_list` (`List[Dict[str, Any]]`): A list of dictionaries defining settings.
*   **Returns:** `None`

#### `_handle_cli_args() -> None`

Checks for `--get-settings-json` argument. If present, prints settings JSON and exits. **Must be called immediately after `define_settings()` and before main script logic.** *Note: This function is essential for settings discovery by the plugin.*

*   **Parameters:** None
*   **Returns:** `None` (or exits the script)

---

### `ObsidianPluginDevPythonToJS` Class Methods

#### `get_script_settings() -> Dict[str, Any]`

Retrieves the current values of the settings defined by *this specific script*, as configured by the user in Obsidian.

*   **Parameters:** None
*   **Returns:** (`Dict[str, Any]`) Dictionary of setting keys and their current values.
*   **Raises:** `ObsidianCommError` if request fails or script path env var is missing.

---

### UI Interaction

#### `show_notification(content: str, duration: int = 4000) -> None`

Displays a notification message within Obsidian.

*   **Parameters:**
    *   `content` (`str`): Message text. Cannot be empty.
    *   `duration` (`int`, optional, default: `4000`): Duration in milliseconds.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `content` is empty.

#### `request_user_input(script_name: str, input_type: str, message: str, validation_regex: Optional[str] = None, min_value: Optional[Union[int, float]] = None, max_value: Optional[Union[int, float]] = None, step: Optional[Union[int, float]] = None, **kwargs) -> Any`

Requests user input via a modal dialog in Obsidian. **Blocks** script execution.

*   **Parameters:**
    *   `script_name` (`str`): Name shown in modal title.
    *   `input_type` (`str`): `'text'`, `'textarea'`, `'number'`, `'range'`, `'slider'`, `'boolean'`/`'checkbox'`, `'date'`.
    *   `message` (`str`): Prompt message.
    *   `validation_regex` (`Optional[str]`): Regex for `'text'` validation.
    *   `min_value`, `max_value`, `step`: Optional for number/range/slider.
    *   `**kwargs`: Future parameters.
*   **Returns:** (`Any`) User input (type depends on `input_type`). Returns `None` if user cancels (raises `ObsidianCommError`).
*   **Raises:** `ValueError` for invalid args. `ObsidianCommError` if user cancels or request fails.

---

### Active Note Operations

Operate on the currently focused note. Raise `ObsidianCommError` if no Markdown note is active.

#### `get_active_note_content() -> str`

Retrieves the full Markdown content of the active note.

*   **Returns:** (`str`) Note content.

#### `get_active_note_frontmatter() -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of the active note.

*   **Returns:** (`Optional[Dict[str, Any]]`) Frontmatter dictionary, or `None`.

#### `get_active_note_absolute_path() -> str`

Retrieves the absolute filesystem path of the active note.

*   **Returns:** (`str`) Absolute path.

#### `get_active_note_relative_path() -> str`

Retrieves the vault-relative path of the active note.

*   **Returns:** (`str`) Vault-relative path (e.g., `folder/note.md`).

#### `get_active_note_title() -> str`

Retrieves the title (filename without extension) of the active note.

*   **Returns:** (`str`) Note title.

---

### Specific Note/Path Operations

#### `get_note_content(path: str) -> str`

Retrieves the full content of a specific note.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** (e.g., `"Folder/My Note.md"`).
*   **Returns:** (`str`) Note content.
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if not found.

#### `get_note_frontmatter(path: str) -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of a specific note.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path**.
*   **Returns:** (`Optional[Dict[str, Any]]`) Frontmatter dictionary, or `None`.
*   **Raises:** `ValueError` if `path` is empty.

#### `modify_note_content(file_path: str, content: str) -> None`

Modifies the entire content of a specific note using Obsidian's API.

*   **Parameters:**
    *   `file_path` (`str`): **Absolute filesystem path** to the note.
    *   `content` (`str`): New full content.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `file_path` is not absolute. `ObsidianCommError` if file not in vault or modification fails.

#### `open_note(path: str, new_leaf: bool = False) -> None`

Opens a specific note in Obsidian using its link path.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path**, **WITHOUT `.md` extension** (e.g., `"Folder/My Note"`).
    *   `new_leaf` (`bool`, optional, default: `False`): Open in new leaf.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if note cannot be opened.

#### `create_note(path: str, content: str = '') -> None`

*(New)* Creates a new note in the vault.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** for the new note (e.g., `"Folder/New Note.md"`). Must include `.md` extension.
    *   `content` (`str`, optional): Initial content. Defaults to empty.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if creation fails (e.g., path exists).

#### `check_path_exists(path: str) -> bool`

*(New)* Checks if a file or folder exists at the given vault-relative path.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** to check.
*   **Returns:** (`bool`) `True` if the path exists, `False` otherwise.
*   **Raises:** `ValueError` if `path` is empty.

#### `delete_path(path: str, permanently: bool = False) -> None`

*(New)* Deletes a note or folder (moves to trash by default).

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** of the item to delete.
    *   `permanently` (`bool`, optional, default: `False`): If `True`, delete permanently. **Use with caution!**
*   **Returns:** `None`
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if deletion fails.

#### `rename_path(old_path: str, new_path: str) -> None`

*(New)* Renames or moves a note or folder within the vault.

*   **Parameters:**
    *   `old_path` (`str`): Current **vault-relative path**.
    *   `new_path` (`str`): Desired new **vault-relative path**.
*   **Returns:** `None`
*   **Raises:** `ValueError` if paths are empty. `ObsidianCommError` if rename fails.

#### `create_folder(path: str) -> None`

*(New)* Creates a new folder at the specified vault-relative path.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** for the new folder (e.g., `"New Folder"` or `"Parent/New Folder"`).
*   **Returns:** `None`
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if creation fails.

#### `list_folder(path: str) -> Dict[str, List[str]]`

*(New)* Lists the files and subfolders within a specified vault folder.

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** of the folder to list. Use `""` (empty string) for the vault root.
*   **Returns:** (`Dict[str, List[str]]`) Dictionary with keys `'files'` and `'folders'`, each containing a list of relative paths within that folder.
*   **Raises:** `ValueError` if `path` is `None`. `ObsidianCommError` if listing fails.

#### `get_links(path: str, type: str = 'outgoing') -> List[str]`

*(New)* Retrieves links associated with a note. Currently only supports 'outgoing' links (including embeds).

*   **Parameters:**
    *   `path` (`str`): **Vault-relative path** of the note.
    *   `type` (`str`, optional, default: `'outgoing'`): Type of links ('outgoing').
*   **Returns:** (`List[str]`) List of outgoing link paths.
*   **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if note not found.

#### `get_backlinks(path: str, use_cache_if_available: bool = True, cache_mode: str = 'fast') -> Dict[str, List[Dict[str, Any]]]`

*(New)* Retrieves backlinks (incoming links) for a specific note.

Optionally utilizes the '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' community plugin if installed and enabled in Obsidian for potentially faster results, especially in large vaults.

*   **Parameters:**
    *   `path` (`str`): The **vault-relative path** of the note (e.g., `"Folder/My Note.md"`).
    *   `use_cache_if_available` (`bool`, optional, default: `True`): If `True`, attempts to use the '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' plugin if available. If `False`, or if the plugin is not available/enabled, uses Obsidian's native method (which relies on an undocumented Obsidian function and might be less stable).
    *   `cache_mode` (`str`, optional, default: `'fast'`): Specifies which mode to use if the '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' plugin is used. Must be `'fast'` or `'safe'`. `'safe'` ensures all recent changes are processed but might be slightly slower than `'fast'`. Ignored if the cache plugin is not used.
*   **Returns:** (`Dict[str, List[Dict[str, Any]]]`) A dictionary where keys are the absolute paths of the notes containing the backlinks, and values are lists of link information dictionaries for each link found in that source note. The structure mirrors Obsidian's `LinkCache`. Returns an empty dictionary if no backlinks are found.
*   **Raises:**
    *   `ValueError`: If `path` is empty or `cache_mode` is not `'fast'` or `'safe'`.
    *   `ObsidianCommError`: If the request fails (e.g., note not found by Obsidian, communication error).

---

### Editor Operations (Active Note)

Operate on the editor of the currently active Markdown note.

#### `get_selected_text() -> str`

Retrieves the currently selected text in the active editor.

*   **Returns:** (`str`) Selected text, or `""` if none.
*   **Raises:** `ObsidianCommError` if no Markdown editor active.

#### `replace_selected_text(replacement: str) -> None`

Replaces selected text or inserts at cursor.

*   **Parameters:**
    *   `replacement` (`str`): Text to insert/replace with.
*   **Returns:** `None`
*   **Raises:** `ObsidianCommError` if no Markdown editor active.

#### `get_editor_context() -> Dict[str, Any]`

*(New)* Retrieves context information about the active editor.

*   **Returns:** (`Dict[str, Any]`) Dictionary potentially containing `cursor` (`{'line': int, 'ch': int}`), `line_count` (`int`). Returns empty dict or null if no editor active.
*   **Raises:** `ObsidianCommError` if request fails.

---

### Vault Operations

#### `get_current_vault_absolute_path() -> str`

Retrieves the absolute filesystem path of the current vault.

*   **Returns:** (`str`) Absolute path to vault root.

#### `get_all_note_paths(absolute: bool = False) -> List[str]`

Retrieves paths of all Markdown notes (`.md`) in the vault.

*   **Parameters:**
    *   `absolute` (`bool`, optional, default: `False`): Return absolute or vault-relative paths.
*   **Returns:** (`List[str]`) List of note paths.

#### `get_all_note_titles() -> List[str]`

Retrieves titles (filenames without extensions) of all Markdown notes.

*   **Returns:** (`List[str]`) List of note titles.

#### `get_vault_name() -> str`

*(New)* Retrieves the name of the currently open vault.

*   **Returns:** (`str`) The name of the vault.
*   **Raises:** `ObsidianCommError` if request fails.

#### `get_all_tags() -> List[str]`

*(Temporarily Disabled)* Retrieves a list of all unique tags in the vault.
*Note: This method is currently disabled due to plugin-side build issues.*

*   **Returns:** (`List[str]`) List of unique tags (e.g., `['#tag1', '#tag/nested']`).
*   **Raises:** `ObsidianCommError` if request fails.

---

### Obsidian Operations

#### `get_obsidian_language() -> str`

*(New)* Retrieves the language code currently configured in Obsidian.

*   **Returns:** (`str`) Language code (e.g., 'en', 'fr').
*   **Raises:** `ObsidianCommError` if request fails.

#### `get_theme_mode() -> str`

*(New)* Retrieves the current theme mode ('light' or 'dark').

*   **Returns:** (`str`) 'light' or 'dark'.
*   **Raises:** `ObsidianCommError` if request fails.

#### `run_obsidian_command(command_id: str) -> None`

*(Temporarily Disabled)* Executes an Obsidian command by its ID.
*Note: This method is currently disabled due to plugin-side build issues.*

*   **Parameters:**
    *   `command_id` (`str`): ID of the command (e.g., `"editor:toggle-bold"`).
*   **Returns:** `None`
*   **Raises:** `ValueError` if `command_id` is empty. `ObsidianCommError` if command fails.

---

### Frontmatter Property Management (Requires PyYAML)

Directly manipulate YAML frontmatter. Require `PyYAML`.

#### `manage_properties_key(...) -> Dict[str, Any]`

Manages top-level keys in frontmatter ('add', 'remove', 'rename'). (See details in previous docs or code).

#### `manage_properties_value(...) -> Dict[str, Any]`

Manages values associated with a key ('add', 'remove', 'update'). (See details in previous docs or code).

---

### Event Listening (Reacting to Obsidian Events)

Your Python scripts can react to things happening inside Obsidian (like modifying a note, deleting a file, etc.) by registering event listeners.

**How it Works (Important Concept):**

Unlike typical Python event listeners that run continuously in the background, this system works differently due to the bridge architecture:

1.  **Registration:** Your script runs once (e.g., triggered by a command) and calls `obsidian.register_event_listener("event-name")`. This tells the Obsidian plugin "Hey, if 'event-name' happens, run me again!". Your script then finishes its initial execution.
2.  **Event Occurs:** Something happens in Obsidian (e.g., you modify a note).
3.  **Plugin Action:** The Obsidian plugin detects the event. It checks its list of registered scripts for that event.
4.  **Script Re-Execution:** The plugin **runs your Python script again from the beginning**, but this time it adds special **environment variables**:
    *   `OBSIDIAN_EVENT_NAME`: The name of the event that occurred (e.g., `"vault-modify"`).
    *   `OBSIDIAN_EVENT_PAYLOAD`: A JSON string containing data about the event (e.g., `'{"path": "My Note.md"}'`).
5.  **Your Script's Responsibility:** Your script **must check for `os.environ.get("OBSIDIAN_EVENT_NAME")` right at the start**.
    *   If the variable exists, it means the script was run *because* of an event. Your script should then:
        *   Parse the `OBSIDIAN_EVENT_PAYLOAD` (using `json.loads`).
        *   Perform the action needed for that specific event.
        *   Optionally call `obsidian.unregister_event_listener()` if it should only react once.
        *   **Exit immediately using `sys.exit(0)`** to prevent the rest of the script (like the registration part) from running again.
    *   If the variable *doesn't* exist, the script was run normally (e.g., by you via a command), and it should proceed with its normal logic (like registering the listener).

**Supported Event Names (Initial List):**

*   `"vault-modify"`: A file's content has been modified.
    *   Payload: `{"path": "relative/path/to/file.md"}`
*   `"vault-delete"`: A file or folder has been deleted.
    *   Payload: `{"path": "relative/path/to/item", "type": "file" | "folder"}`
*   `"vault-rename"`: A file or folder has been renamed/moved.
    *   Payload: `{"path": "new/relative/path", "oldPath": "old/relative/path", "type": "file" | "folder"}`
*   `"metadata-changed"`: A file's metadata (frontmatter, tags, links) has changed.
    *   Payload: `{"path": "relative/path/to/file.md"}`
*   `"layout-change"`: The overall workspace layout has changed (e.g., split opened/closed).
    *   Payload: `{}` (Empty for now)
*   `"active-leaf-change"`: The currently focused tab/pane (leaf) has changed.
    *   Payload: `{"path": "relative/path/to/active/note.md" | null}` (Path is null if the active leaf isn't a Markdown note)

*(More events might be added in the future based on the Obsidian API.)*

#### `register_event_listener(event_name: str) -> None`

Registers the current script to be executed when a specific Obsidian event occurs.

*   **Parameters:**
    *   `event_name` (`str`): The name of the event to listen for (see list above).
*   **Returns:** `None`
*   **Raises:** `ValueError` if `event_name` is empty. `ObsidianCommError` if registration fails or the script path couldn't be determined.

#### `unregister_event_listener(event_name: str) -> None`

Unregisters the current script from listening to a specific Obsidian event.

*   **Parameters:**
    *   `event_name` (`str`): The name of the event to stop listening to.
*   **Returns:** `None`
*   **Raises:** `ValueError` if `event_name` is empty. `ObsidianCommError` if unregistration fails or the script path couldn't be determined.

**Example Script (`react_on_modify.py`):**

```python
# react_on_modify.py
import sys
import os
import json
import time
import traceback

# --- Check for event trigger FIRST ---
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
is_handling_event = bool(event_name_from_env)
event_payload = None

if is_handling_event:
    # Load payload if handling event
    payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        event_payload = json.loads(payload_str)
    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse event payload JSON. Payload: '{payload_str}'", file=sys.stderr)
        event_payload = {"error": "Failed to parse payload", "raw_payload": payload_str}

# --- Now import the library ---
try:
    # Assuming ObsidianPluginDevPythonToJS.py is in the same folder or accessible via PYTHONPATH
    from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
except ImportError:
    print("ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    sys.exit(1)

# --- Configuration ---
EVENT_TO_LISTEN_FOR = "vault-modify"

# --- Global client instance ---
obsidian = None

# --- Event Handling Logic ---
if is_handling_event:
    try:
        obsidian = ObsidianPluginDevPythonToJS(request_timeout=5.0) # Init client for handling

        if event_name_from_env == EVENT_TO_LISTEN_FOR:
            file_path = event_payload.get("path", "N/A")
            print(f"Detected modification of: {file_path}")
            obsidian.show_notification(f"Detected modification:\n{file_path}", 4000)
            # Optional: Unregister if you only want to react once per script run
            # try:
            #     obsidian.unregister_event_listener(EVENT_TO_LISTEN_FOR)
            #     obsidian.show_notification(f"Stopped listening for {EVENT_TO_LISTEN_FOR}", 3000)
            # except Exception as e_unreg:
            #     print(f"Error unregistering: {e_unreg}", file=sys.stderr)
        else:
             obsidian.show_notification(f"Ignoring event: {event_name_from_env}", 3000)

    except Exception as e_event:
         print(f"ERROR during event handling: {e_event}", file=sys.stderr)
         # Avoid showing notification if client init failed
         if obsidian:
             try: obsidian.show_notification(f"❌ Error handling event: {e_event}", 6000)
             except: pass

    # --- IMPORTANT: Exit after handling ---
    sys.exit(0)

# --- Main Script Logic (Registration) ---
else:
    try:
        obsidian = ObsidianPluginDevPythonToJS(request_timeout=10.0)
        print(f"--- Registering Listener for: {EVENT_TO_LISTEN_FOR} ---")
        obsidian.register_event_listener(EVENT_TO_LISTEN_FOR)
        obsidian.show_notification(f"👂 Now listening for {EVENT_TO_LISTEN_FOR}...", 5000)
        print(f"--- Registered. Modify a note to trigger this script. ---")

    except Exception as e_main:
        print(f"❌ ERROR during registration: {e_main}", file=sys.stderr)
        if obsidian:
             try: obsidian.show_notification(f"❌ Registration Error: {e_main}", 8000)
             except: pass
        sys.exit(1)

```
