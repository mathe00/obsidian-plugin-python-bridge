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
import traceback

# --- MODIFIED: Import necessary components ---
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

# --- Define Settings (if any) ---
# See "Script-Specific Settings" section below
MY_SETTINGS = [
    # ... your setting definitions ...
]
define_settings(MY_SETTINGS)

# --- Handle Settings Discovery ---
# !!! IMPORTANT: Call this EARLY, before main logic !!!
_handle_cli_args()

# --- Main Script Logic ---
try:
    # Your script logic here...
    obsidian = ObsidianPluginDevPythonToJS()

    # Get settings values if needed
    # settings = obsidian.get_script_settings()
    # api_key = settings.get("api_key", "default_value")

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

If you store `ObsidianPluginDevPythonToJS.py` in a central location, you need to add that directory to Python's `sys.path` *before* the `from ObsidianPluginDevPythonToJS import ...` line. This is generally less convenient.

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

# --- Define Settings (if any) ---
# ...
define_settings(...)

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

To start interacting with Obsidian, create an instance of the `ObsidianPluginDevPythonToJS` class **after** handling the settings discovery (`_handle_cli_args()`):

```python
# Must be called AFTER _handle_cli_args()
obsidian = ObsidianPluginDevPythonToJS(http_port=None, connect_timeout=2.0, request_timeout=10.0)
```

**Constructor Parameters:**

*   `http_port` (`int`, optional): The port number the Obsidian plugin's HTTP server is listening on.
    *   **Default (`None`):** Reads the `OBSIDIAN_HTTP_PORT` environment variable (set by the plugin when running scripts, reflects the *actual* listening port, even if dynamic port 0 was configured). If the variable is not set, it falls back to `27123`. You usually **do not need** to set this manually when running scripts via the plugin.
*   `connect_timeout` (`float`, optional, default: `2.0`): Timeout in seconds for the initial connection test performed during initialization.
*   `request_timeout` (`float`, optional, default: `10.0`): Default timeout in seconds for waiting for a response from Obsidian for most API calls.

**Initialization Behavior:**

*   The constructor attempts a quick connection test to the determined URL (`http://127.0.0.1:PORT/`).
*   It reads the `OBSIDIAN_SCRIPT_RELATIVE_PATH` environment variable (set by the plugin) to identify the current script. This is needed for the `get_script_settings()` method. If the variable is missing (e.g., running the script outside Obsidian), a warning is printed, and `get_script_settings()` will fail.
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

## Script-Specific Settings (New Feature!)

You can now define configuration settings for your Python script that users can manage directly within the Obsidian "Python Bridge" settings tab.

**Workflow:**

1.  **Define Settings (in your Python script):**
    *   Import the `define_settings` helper function from the library.
    *   Create a list of dictionaries, where each dictionary describes one setting.
    *   Call `define_settings(your_settings_list)` **at the beginning** of your script.
2.  **Handle Discovery (in your Python script):**
    *   Import the `_handle_cli_args` helper function.
    *   Call `_handle_cli_args()` **immediately after** `define_settings()`, before any other script logic. This allows the Obsidian plugin to query your script for its settings definitions without executing the full script.
3.  **Plugin Discovers Settings:**
    *   When Obsidian starts or when you manually trigger the "Refresh Definitions" command/button, the plugin runs each `.py` script in your configured folder with the `--get-settings-json` flag.
    *   Scripts that correctly handle this flag (via `_handle_cli_args`) will print their settings definitions as JSON.
    *   The plugin parses this JSON and caches the definitions.
4.  **User Configures Values:**
    *   The plugin dynamically generates UI controls (text fields, toggles, dropdowns, etc.) in its settings tab based on the discovered definitions.
    *   The user interacts with these controls to set the desired values for each script. These values are saved by the Obsidian plugin.
5.  **Script Retrieves Values (in your Python script):**
    *   Inside your main script logic (after initializing `ObsidianPluginDevPythonToJS`), call the `obsidian.get_script_settings()` method.
    *   This method fetches the current values (as set by the user in Obsidian) for *your specific script* from the plugin.
    *   Use the returned dictionary to control your script's behavior.

**Settings Definition Structure:**

Each dictionary in the list passed to `define_settings` should have the following keys:

*   `key` (`str`): A unique identifier for this setting within the script. Used for retrieving the value.
*   `type` (`str`): The type of UI control to display in Obsidian. Supported types:
    *   `'text'`: Single-line text input.
    *   `'textarea'`: Multi-line text input.
    *   `'number'`: Number input (allows decimals). Use `min`, `max`, `step` for constraints.
    *   `'toggle'`: A boolean on/off switch.
    *   `'dropdown'`: A selection list. Requires the `options` key.
    *   `'slider'`: A number slider. Requires `min`, `max`, `step`.
*   `label` (`str`): The user-friendly name displayed next to the setting in Obsidian.
*   `description` (`str`): Help text displayed below the setting.
*   `default` (`Any`): The default value for the setting if the user hasn't configured one. The type should match the expected value type (e.g., `str` for text, `bool` for toggle, `int`/`float` for number/slider, `str` for dropdown).
*   `options` (`Optional[List[str | Dict[str, str]]]`, required for `dropdown`): A list defining the dropdown choices. Can be:
    *   A list of simple strings (e.g., `["option1", "option2"]`). The string is used as both the internal value and the display text.
    *   A list of dictionaries, each with `value` (string, internal value) and `display` (string, text shown to user) keys (e.g., `[{"value": "opt1", "display": "Option One"}, {"value": "opt2", "display": "Option Two"}]`).
*   `min` (`Optional[Union[int, float]]`, optional for `number`/`slider`): Minimum allowed value.
*   `max` (`Optional[Union[int, float]]`, optional for `number`/`slider`): Maximum allowed value.
*   `step` (`Optional[Union[int, float]]`, optional for `number`/`slider`): Increment step.

**Example Script (`my_configurable_script.py`):**

```python
import sys
import traceback
import os

try:
    from ObsidianPluginDevPythonToJS import (
        ObsidianPluginDevPythonToJS,
        ObsidianCommError,
        define_settings,
        _handle_cli_args
    )
except ImportError:
    print("ERROR: Could not import ObsidianPluginDevPythonToJS.", file=sys.stderr)
    sys.exit(1)

# 1. Define Settings
MY_SETTINGS = [
    {
        "key": "api_endpoint",
        "type": "text",
        "label": "API Endpoint URL",
        "description": "The URL of the API service to connect to.",
        "default": "https://api.example.com/v1"
    },
    {
        "key": "use_cache",
        "type": "toggle",
        "label": "Enable Caching",
        "description": "Cache API responses locally.",
        "default": True
    },
    {
        "key": "output_format",
        "type": "dropdown",
        "label": "Output Format",
        "description": "Select the desired output format.",
        "default": "markdown",
        "options": ["markdown", "json", "plaintext"]
    },
    {
        "key": "retry_attempts",
        "type": "number",
        "label": "Retry Attempts",
        "description": "Number of times to retry failed API calls.",
        "default": 3,
        "min": 0,
        "max": 10
    }
]

# 2. Register Settings
define_settings(MY_SETTINGS)

# 3. Handle Discovery Call
_handle_cli_args()

# 4. Main Logic
def main():
    print(f"--- Running {os.path.basename(__file__)} ---")
    try:
        obsidian = ObsidianPluginDevPythonToJS()

        # 5. Get Setting Values
        settings = obsidian.get_script_settings()
        print(f"Retrieved settings: {settings}")

        # Use settings with fallbacks to defaults defined above
        endpoint = settings.get("api_endpoint", MY_SETTINGS[0]["default"])
        caching = settings.get("use_cache", MY_SETTINGS[1]["default"])
        out_format = settings.get("output_format", MY_SETTINGS[2]["default"])
        retries = settings.get("retry_attempts", MY_SETTINGS[3]["default"])

        obsidian.show_notification(
            f"Config:\nEndpoint: {endpoint}\nCache: {caching}\nFormat: {out_format}\nRetries: {retries}",
            6000
        )

        # ... Your script logic using these variables ...
        print("Script logic would run here...")
        print(f"--- {os.path.basename(__file__)} finished ---")

    except ObsidianCommError as e:
        print(f"Obsidian Communication Error: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        traceback.print_exc()

if __name__ == "__main__":
    main()

```

## API Reference

All methods below may raise `ObsidianCommError` if communication with the Obsidian plugin fails or if the plugin reports an error for the requested action.

---

### Library Helper Functions (Import directly)

#### `define_settings(settings_list: List[Dict[str, Any]]) -> None`

Registers the settings definitions for the current script. **Must be called once at the beginning of the script.**

*   **Parameters:**
    *   `settings_list` (`List[Dict[str, Any]]`): A list of dictionaries, each defining a setting according to the structure described in the "Script-Specific Settings" section.
*   **Returns:** `None`

#### `_handle_cli_args() -> None`

Checks for the `--get-settings-json` command-line argument. If present, prints the registered settings definitions (from `define_settings`) as JSON to stdout and exits the script immediately. **Must be called immediately after `define_settings()` and before the main script logic.**

*   **Parameters:** None
*   **Returns:** `None` (or exits the script)

---

### `ObsidianPluginDevPythonToJS` Class Methods

#### `get_script_settings() -> Dict[str, Any]`

Retrieves the current values of the settings defined by *this specific script*, as configured by the user in the Obsidian settings tab. Relies on the `OBSIDIAN_SCRIPT_RELATIVE_PATH` environment variable being set by the plugin.

*   **Parameters:** None
*   **Returns:** (`Dict[str, Any]`) A dictionary where keys are the setting `key`s defined in `define_settings`, and values are the current setting values (including defaults if not set by the user). Returns an empty dictionary if no settings were defined or retrieved.
*   **Raises:** `ObsidianCommError` if the request fails, Obsidian reports an error, or the script path environment variable (`OBSIDIAN_SCRIPT_RELATIVE_PATH`) is missing.

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
    *   `input_type` (`str`): Type of input field. Supported types: `'text'`, `'textarea'`, `'number'`, `'range'`, `'slider'`, `'boolean'` (or `'checkbox'`), `'date'`.
    *   `message` (`str`): The prompt message displayed to the user.
    *   `validation_regex` (`Optional[str]`, optional): A regex pattern (as a string) for basic client-side validation of `'text'` input.
    *   `min_value` (`Optional[Union[int, float]]`, optional): Minimum allowed value for `'number'`, `'range'`, or `'slider'`.
    *   `max_value` (`Optional[Union[int, float]]`, optional): Maximum allowed value for `'number'`, `'range'`, or `'slider'`.
    *   `step` (`Optional[Union[int, float]]`, optional): Step increment for `'number'`, `'range'`, or `'slider'`.
    *   `**kwargs`: Allows passing additional parameters for potential future input types.
*   **Returns:** (`Any`) The value entered by the user. The type depends on `input_type`:
    *   `'text'`, `'textarea'`: `str`
    *   `'number'`, `'range'`, `'slider'`: `float` (or potentially `int` if step is an integer, but safer to expect float)
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

Modifies the entire content of a specific note using Obsidian's API. **Note:** This method expects an **absolute path**. The plugin internally converts this to a relative path for the preferred API call (`modify_note_content_by_path`).

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

*   **Returns:** (`List[str]`) A list of note title strings.

---

### Frontmatter Property Management (Requires PyYAML)

These methods directly manipulate the YAML frontmatter of a note file. They require the `PyYAML` library to be installed.

#### `manage_properties_key(file_path: str, action: str, key: Optional[str] = None, new_key: Optional[str] = None, use_vault_modify: bool = True) -> Dict[str, Any]`

Manages top-level keys in a note's YAML frontmatter.

*   **Parameters:**
    *   `file_path` (`str`): **Absolute path** to the note file (`.md`).
    *   `action` (`str`): `'add'`, `'remove'`, or `'rename'`.
    *   `key` (`Optional[str]`): Key to act upon. Required.
    *   `new_key` (`Optional[str]`): New key name for `'rename'`. Required for `'rename'`.
    *   `use_vault_modify` (`bool`, optional, default: `True`): If `True`, uses the Obsidian API via HTTP (`modify_note_content`) to save changes. If `False`, writes directly to the file (RISKY, bypasses Obsidian's file handling).
*   **Returns:** (`Dict[str, Any]`) A dictionary indicating success or failure: `{'success': True}` or `{'success': False, 'error': '...'}`.
*   **Raises:** `NameError` if PyYAML is not installed. `FileNotFoundError` if `file_path` does not exist. `ValueError` if action/parameters are invalid. `yaml.YAMLError` if frontmatter parsing/dumping fails. `ObsidianCommError` if `use_vault_modify` is True and the API call fails. `IOError` if `use_vault_modify` is False and direct write fails.

#### `manage_properties_value(file_path: str, key: str, action: str, value: Any = None, new_value: Any = None, index: Optional[int] = None, use_vault_modify: bool = True) -> Dict[str, Any]`

Manages values associated with a key in YAML frontmatter (scalars or lists).

*   **Parameters:**
    *   `file_path` (`str`): **Absolute path** to the note file (`.md`).
    *   `key` (`str`): The frontmatter key to manage.
    *   `action` (`str`): `'add'` (to a list or set initial value), `'remove'` (from a list or clear scalar if value matches), or `'update'` (scalar value or list element).
    *   `value` (`Any`, optional): Value to add/remove, or the *old* value to find when updating a list element by value.
    *   `new_value` (`Any`, optional): New value for `'add'` (if key doesn't exist or is null) or `'update'`. Required for `'update'`. Can be `None`.
    *   `index` (`Optional[int]`, optional): Index for updating or removing a specific element in a list.
    *   `use_vault_modify` (`bool`, optional, default: `True`): Same as in `manage_properties_key`.
*   **Returns:** (`Dict[str, Any]`) A dictionary indicating success or failure: `{'success': True}` or `{'success': False, 'error': '...'}`.
*   **Raises:** `NameError` if PyYAML is not installed. `FileNotFoundError` if `file_path` does not exist. `ValueError` if action/parameters are invalid. `yaml.YAMLError` if frontmatter parsing/dumping fails. `IndexError` if `index` is out of bounds. `ObsidianCommError` if `use_vault_modify` is True and the API call fails. `IOError` if `use_vault_modify` is False and direct write fails.

