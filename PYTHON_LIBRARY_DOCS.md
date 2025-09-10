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

The Obsidian Python Bridge plugin is designed to make importing its client library (`ObsidianPluginDevPythonToJS.py`) as straightforward as possible.

**Recommended Method (Default Plugin Behavior):**

The plugin has a setting named "**Auto-set PYTHONPATH for Library**" which is **enabled by default**.

- When this setting is active, the plugin automatically configures the Python environment when it runs your scripts. This means the `ObsidianPluginDevPythonToJS.py` library (which is part of the plugin's installation) is made available to your scripts.
- You can then directly use `from ObsidianPluginDevPythonToJS import ...` in your Python scripts without needing to copy the `ObsidianPluginDevPythonToJS.py` file into your scripts folder or manually modify `sys.path`.

**Alternative Method (If "Auto-set PYTHONPATH for Library" is Disabled):**

If you have disabled the "Auto-set PYTHONPATH for Library" option in the plugin settings, you will need to ensure Python can find the `ObsidianPluginDevPythonToJS.py` library file. Options include:

1.  **Copy the Library File:**
    - Copy `ObsidianPluginDevPythonToJS.py` from the plugin's repository into the **same folder** as your Python scripts.
2.  **Modify `sys.path` in Your Script (More Complex):**
    - Store `ObsidianPluginDevPythonToJS.py` in a known location.
    - In your script, _before_ the `from ObsidianPluginDevPythonToJS import ...` line, add the directory containing the library to `sys.path`.
    ```python
    # import sys
    # library_directory = "/path/to/library_location/"
    # if library_directory not in sys.path:
    #     sys.path.insert(0, library_directory)
    ```

For most users interacting with scripts _through the Obsidian plugin_, relying on the **"Auto-set PYTHONPATH for Library"** setting is the easiest and recommended way.

## Important: Script Structure for Settings Discovery

When the Obsidian Python Bridge plugin starts or when you manually "Refresh Definitions" in its settings, it runs each of your Python scripts with a special `--get-settings-json` argument. This is done to discover any settings your script might define.

**It is strongly recommended that all your scripts, even those without custom settings, correctly handle this discovery process.** The easiest way is to use the `define_settings()` and `_handle_cli_args()` helper functions from this library at the beginning of your script, _before_ initializing the `ObsidianPluginDevPythonToJS` client:

```python
# At the beginning of your script:
from ObsidianPluginDevPythonToJS import define_settings, _handle_cli_args
# ... other imports ...

# (Optional: Event handling code here, exiting if event_name_from_env is set)

MY_SCRIPT_SETTINGS: list = [] # Use an empty list if no settings
define_settings(MY_SCRIPT_SETTINGS)
_handle_cli_args() # This will exit if --get-settings-json is passed

# Your main script logic and ObsidianPluginDevPythonToJS() initialization
# should come AFTER _handle_cli_args().
```

If a script does not use `_handle_cli_args()` to exit during discovery:

- It might execute its main logic unintentionally during plugin startup/refresh.
- If it initializes `ObsidianPluginDevPythonToJS` and attempts API calls, these calls will be **blocked** by the library (raising an `ObsidianCommError`) because the library detects it's in "discovery mode". This is a safeguard but will result in errors in your script's `stderr` log.
- Settings discovery for that script will likely fail.

Using the `define_settings([])` and `_handle_cli_args()` pattern ensures your script behaves correctly during discovery, even if it doesn't have any settings to define. See the "Script-Specific Settings" section for a more complete example.

## Initialization

To start interacting with Obsidian, create an instance of the `ObsidianPluginDevPythonToJS` class. This should **always** be done **after** handling settings discovery (`_handle_cli_args()`) and event checks, typically within your main execution block (`if __name__ == "__main__": ...`).

```python
# Typically within the main execution block, after _handle_cli_args()
if __name__ == "__main__" and not os.environ.get("OBSIDIAN_EVENT_NAME"):
    try:
        obsidian = ObsidianPluginDevPythonToJS(http_port=None, connect_timeout=2.0, request_timeout=10.0)
        # ... rest of your script ...
    except ObsidianCommError as e:
        print(f"Error: {e}", file=sys.stderr)
```

**Constructor Parameters:**

- `http_port` (`int`, optional): The port number the Obsidian plugin's HTTP server is listening on.
  - **Default (`HTTP_PORT` constant):** Reads the `OBSIDIAN_HTTP_PORT` environment variable (set by the plugin when running scripts, reflects the _actual_ listening port, even if dynamic port 0 was configured). If the variable is not set, it falls back to `27123`. You usually **do not need** to set this manually when running scripts via the plugin.
- `connect_timeout` (`float`, optional, default: `2.0`): Timeout in seconds for the initial connection test performed during initialization.
- `request_timeout` (`float`, optional, default: `10.0`): Default timeout in seconds for waiting for a response from Obsidian for most API calls.

**Initialization Behavior:**

- The constructor attempts a quick connection test to the determined URL (`http://127.0.0.1:PORT/`).
- It reads the `OBSIDIAN_SCRIPT_RELATIVE_PATH` environment variable (set by the plugin) to identify the current script. This is needed for the `get_script_settings()` and event listener registration methods. If the variable is missing (e.g., running the script outside Obsidian), a warning is printed, and `get_script_settings()` / event methods will fail.
- It reads the `OBSIDIAN_BRIDGE_MODE` environment variable to determine if running in "discovery" mode and disable API calls if necessary.
- **Raises:**
  - `ValueError`: If `http_port` (if provided manually) is not a valid integer between 1024 and 65535.
  - `ObsidianCommError`: If the initial connection test fails (e.g., timeout, connection refused, Obsidian not running, plugin inactive, wrong port) OR if initialized in "discovery" mode (API calls will be blocked).

## Error Handling

Most communication issues or errors reported by the Obsidian plugin will raise an `ObsidianCommError`. While the examples in this documentation are simplified, it's **highly recommended** to wrap your API calls in `try...except ObsidianCommError as e:` blocks in your production scripts to handle these gracefully.

```python
# Recommended error handling pattern for production scripts:
try:
    content = obsidian.get_active_note_content()
    print("Got content successfully.")
except ObsidianCommError as e:
    print(f"Failed to get note content: {e}", file=sys.stderr)
    # e.action might contain the failed action name (e.g., 'get_active_note_content')
    # e.status_code might contain the HTTP status code if available
except Exception as general_e:
    print(f"An unexpected Python error occurred: {general_e}", file=sys.stderr)
```

Other standard Python exceptions like `ValueError` (for invalid arguments) or `NameError` (if `PyYAML` is missing for property methods) might also be raised. Remember that API calls will raise `ObsidianCommError` if attempted during settings discovery mode.

## Script-Specific Settings

You can define configuration settings for your Python script that users can manage directly within the Obsidian "Python Bridge" settings tab.

**Workflow:**

1.  **Define Settings (in your Python script):**
    - Import the `define_settings` helper function.
    - Create a list of dictionaries describing each setting.
    - Call `define_settings(your_settings_list)` **at the beginning** of your script (before `_handle_cli_args`). Use `[]` if no settings.
2.  **Handle Discovery (in your Python script):**
    - Import the `_handle_cli_args` helper function.
    - Call `_handle_cli_args()` **immediately after** `define_settings()`, before any other script logic or client initialization. This function checks for `--get-settings-json` and exits if found.
3.  **Plugin Discovers Settings:** Obsidian runs scripts with the `--get-settings-json` flag during startup or manual refresh.
4.  **User Configures Values:** User sets values in Obsidian settings UI.
5.  **Script Retrieves Values:** Call `obsidian.get_script_settings()` in your main logic (when not handling an event or discovery).

**Settings Definition Structure:**

Each dictionary in the list passed to `define_settings` should have: `key` (str), `type` (str: 'text', 'textarea', 'number', 'toggle', 'dropdown', 'slider'), `label` (str), `description` (str), `default` (Any), `options` (Optional for dropdown), `min`/`max`/`step` (Optional for number/slider).

**Example (`my_configurable_script.py`):**

```python
import sys
import os
import json
from ObsidianPluginDevPythonToJS import (
    ObsidianPluginDevPythonToJS, ObsidianCommError,
    define_settings, _handle_cli_args
)

# --- Event Check (Recommended) ---
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
if event_name_from_env:
    print(f"Event triggered: {event_name_from_env}. Exiting settings example.")
    sys.exit(0)

# --- Settings Definition & Discovery Handling (Recommended) ---
# 1. Define Settings
MY_SCRIPT_SETTINGS = [
    {"key": "api_key", "type": "text", "label": "Your API Key", "default": "", "description": "Enter the API key for the service."},
    {"key": "enable_feature_x", "type": "toggle", "label": "Enable Feature X", "default": True, "description": "Toggle Feature X on or off."}
]
define_settings(MY_SCRIPT_SETTINGS)

# 2. Handle Settings Discovery (MUST be called after define_settings)
_handle_cli_args() # This will exit if --get-settings-json is passed

# --- Main Script Logic (only runs if not discovery and not event) ---
if __name__ == "__main__":
    print("--- Configurable script running ---")
    try:
        # 3. Initialize Client
        obsidian = ObsidianPluginDevPythonToJS()

        # 4. Get User-Configured Values
        settings = obsidian.get_script_settings()
        api_key = settings.get("api_key", MY_SCRIPT_SETTINGS[0]["default"]) # Use default from definition if not found
        feature_x_enabled = settings.get("enable_feature_x", MY_SCRIPT_SETTINGS[1]["default"])

        obsidian.show_notification(f"API Key: '{api_key}', Feature X: {feature_x_enabled}")

        if feature_x_enabled:
            print("Feature X is enabled and running...")
        else:
            print("Feature X is disabled.")

    except ObsidianCommError as e:
         print(f"Error: {e}", file=sys.stderr)
    except Exception as e:
         print(f"Unexpected Python error: {e}", file=sys.stderr)

```

## API Reference

All methods below may raise `ObsidianCommError` if communication with the Obsidian plugin fails, if the plugin reports an error for the requested action, or if called during settings discovery mode. Robust `try-except` blocks are recommended for production use.

---

### Library Helper Functions (Import directly)

#### `define_settings(settings_list: List[Dict[str, Any]]) -> None`

Registers the settings definitions for the current script. **Must be called once at the beginning of the script (before `_handle_cli_args`).** Use an empty list `[]` if the script has no settings.

- **Parameters:**
  - `settings_list` (`List[Dict[str, Any]]`): A list of dictionaries defining settings.
- **Returns:** `None`

#### `_handle_cli_args() -> None`

Checks for `--get-settings-json` argument. If present, prints settings JSON (defined by `define_settings`) to stdout and exits the script using `sys.exit(0)`. **Must be called immediately after `define_settings()` and before main script logic or `ObsidianPluginDevPythonToJS` initialization.** This function is essential for settings discovery by the plugin.

- **Parameters:** None
- **Returns:** `None` (or exits the script)

---

### `ObsidianPluginDevPythonToJS` Class Methods

#### `get_script_settings() -> Dict[str, Any]`

Retrieves the current values of the settings defined by _this specific script_, as configured by the user in Obsidian.

- **Parameters:** None
- **Returns:** (`Dict[str, Any]`) Dictionary of setting keys and their current values.
- **Raises:** `ObsidianCommError` if request fails or script path env var is missing.

---

### UI Interaction

#### `show_notification(content: str, duration: int = 4000) -> None`

Displays a notification message within Obsidian.

- **Parameters:**
  - `content` (`str`): Message text. Cannot be empty.
  - `duration` (`int`, optional, default: `4000`): Duration in milliseconds.
- **Returns:** `None`
- **Raises:** `ValueError` if `content` is empty.

#### `request_user_input(script_name: str, input_type: str, message: str, validation_regex: Optional[str] = None, min_value: Optional[Union[int, float]] = None, max_value: Optional[Union[int, float]] = None, step: Optional[Union[int, float]] = None, **kwargs) -> Any`

Requests user input via a modal dialog in Obsidian. **Blocks** script execution.

- **Parameters:**
  - `script_name` (`str`): Name shown in modal title.
  - `input_type` (`str`): `'text'`, `'textarea'`, `'number'`, `'range'`, `'slider'`, `'boolean'`/`'checkbox'`, `'date'`.
  - `message` (`str`): Prompt message.
  - `validation_regex` (`Optional[str]`): Regex pattern for `'text'` input validation. The modal UI provides visual feedback if validation fails.
  - `min_value`, `max_value`, `step`: Optional for number/range/slider.
  - `**kwargs`: Future parameters.
- **Returns:** (`Any`) User input (type depends on `input_type`). Raises `ObsidianCommError` if user cancels.
- **Raises:** `ValueError` for invalid args. `ObsidianCommError` if user cancels or request fails.

---

### Active Note Operations

Operate on the currently focused note. Raise `ObsidianCommError` if no Markdown note is active.

#### `get_active_note_content(return_format: str = "string") -> Union[str, List[str]]`

Retrieves the full Markdown content of the active note.

- **Parameters:**
  - `return_format` (`str`, optional, default: `"string"`): Desired format: `"string"` (single string with newlines) or `"lines"` (list of strings, one per line).
- **Returns:** (`Union[str, List[str]]`) Note content in the specified format.
- **Raises:** `ValueError` if `return_format` is invalid.

#### `get_active_note_frontmatter() -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of the active note.

- **Returns:** (`Optional[Dict[str, Any]]`) Frontmatter dictionary, or `None`.

#### `get_active_note_absolute_path() -> str`

Retrieves the absolute filesystem path of the active note.

- **Returns:** (`str`) Absolute path.

#### `get_active_note_relative_path() -> str`

Retrieves the vault-relative path of the active note.

- **Returns:** (`str`) Vault-relative path (e.g., `folder/note.md`).

#### `get_active_note_title() -> str`

Retrieves the title (filename without extension) of the active note.

- **Returns:** (`str`) Note title.

---

### Specific Note/Path Operations

#### `get_note_content(path: str) -> str`

Retrieves the full content of a specific note.

- **Parameters:** `path` (`str`): **Vault-relative path** (e.g., `"Folder/My Note.md"`).
- **Returns:** (`str`) Note content.
- **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if not found.

#### `get_note_frontmatter(path: str) -> Optional[Dict[str, Any]]`

Retrieves the parsed YAML frontmatter of a specific note.

- **Parameters:** `path` (`str`): **Vault-relative path**.
- **Returns:** (`Optional[Dict[str, Any]]`) Frontmatter dictionary, or `None`.
- **Raises:** `ValueError` if `path` is empty.

#### `modify_note_content(file_path: str, content: str) -> None`

Modifies the entire content of a specific note using Obsidian's API.

- **Parameters:** `file_path` (`str`): **Absolute filesystem path** to the note. `content` (`str`): New full content.
- **Returns:** `None`
- **Raises:** `ValueError` if `file_path` is not absolute. `ObsidianCommError` if file not in vault or modification fails.

#### `open_note(path: str, new_leaf: bool = False) -> None`

Opens a specific note in Obsidian using its link path.

- **Parameters:** `path` (`str`): **Vault-relative path**, **WITHOUT `.md` extension** (e.g., `"Folder/My Note"`). `new_leaf` (`bool`, optional, default: `False`): Open in new leaf.
- **Returns:** `None`
- **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if note cannot be opened.

#### `create_note(path: str, content: str = '') -> None`

_(New)_ Creates a new note in the vault.

- **Parameters:** `path` (`str`): **Vault-relative path** (e.g., `"Folder/New Note.md"`). Must include `.md`. `content` (`str`, optional): Initial content.
- **Returns:** `None`
- **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if creation fails.

#### `check_path_exists(path: str) -> bool`

_(New)_ Checks if a file or folder exists at the given vault-relative path.

- **Parameters:** `path` (`str`): **Vault-relative path**.
- **Returns:** (`bool`) `True` if exists, `False` otherwise.
- **Raises:** `ValueError` if `path` is empty.

#### `delete_path(path: str, permanently: bool = False) -> None`

_(New)_ Deletes a note or folder.

- **Parameters:** `path` (`str`): **Vault-relative path**. `permanently` (`bool`, optional, default: `False`): If `True`, delete permanently. **Use with caution!**
- **Returns:** `None`
- **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if deletion fails.

#### `rename_path(old_path: str, new_path: str) -> None`

_(New)_ Renames or moves a note or folder.

- **Parameters:** `old_path` (`str`): Current **vault-relative path**. `new_path` (`str`): New **vault-relative path**.
- **Returns:** `None`
- **Raises:** `ValueError` if paths are empty. `ObsidianCommError` if rename fails.

#### `create_folder(path: str) -> None`

_(New)_ Creates a new folder.

- **Parameters:** `path` (`str`): **Vault-relative path** (e.g., `"New Folder"`).
- **Returns:** `None`
- **Raises:** `ValueError` if `path` is empty. `ObsidianCommError` if creation fails.

#### `list_folder(path: str) -> Dict[str, List[str]]`

_(New)_ Lists files and subfolders.

- **Parameters:** `path` (`str`): **Vault-relative path**. Use `""` for vault root.
- **Returns:** (`Dict[str, List[str]]`) `{'files': [...], 'folders': [...]}`.
- **Raises:** `ValueError` if `path` is `None`. `ObsidianCommError` if listing fails.

#### `get_links(path: str, type: str = 'outgoing') -> List[str]`

_(New)_ Retrieves links from a note (currently 'outgoing' only).

- **Parameters:** `path` (`str`): **Vault-relative path**. `type` (`str`, optional, default: `'outgoing'`).
- **Returns:** (`List[str]`) List of link paths.
- **Raises:** `ValueError` if `path` is empty.

#### `get_backlinks(path: str, use_cache_if_available: bool = True, cache_mode: str = 'fast') -> Dict[str, List[Dict[str, Any]]]`

_(New)_ Retrieves backlinks for a note.

- **Parameters:** `path` (`str`): **Vault-relative path**. `use_cache_if_available` (`bool`, default: `True`). `cache_mode` (`str`, default: `'fast'`).
- **Returns:** (`Dict[str, List[Dict[str, Any]]]`) Dictionary of source paths to `LinkCache` arrays.
- **Raises:** `ValueError` for invalid args.

---

### Editor Operations (Active Note)

#### `get_selected_text() -> str`

Retrieves selected text.

- **Returns:** (`str`) Selected text, or `""`.
- **Raises:** `ObsidianCommError` if no Markdown editor active.

#### `replace_selected_text(replacement: str) -> None`

Replaces selected text or inserts at cursor.

- **Parameters:** `replacement` (`str`).
- **Returns:** `None`
- **Raises:** `ObsidianCommError` if no Markdown editor active.

#### `get_editor_context() -> Dict[str, Any]`

_(New)_ Retrieves editor context (cursor, line count).

- **Returns:** (`Dict[str, Any]`) or `None`.
- **Raises:** `ObsidianCommError` if request fails.

---

### Theme Management

_(New)_ Methods to control Obsidian's appearance.

#### `set_theme_light() -> None`

Sets the Obsidian theme to light mode.

- **Parameters:** None
- **Returns:** `None`
- **Raises:** `ObsidianCommError` if the request fails or Obsidian reports an error.

#### `set_theme_dark() -> None`

Sets the Obsidian theme to dark mode.

- **Parameters:** None
- **Returns:** `None`
- **Raises:** `ObsidianCommError` if the request fails or Obsidian reports an error.

#### `toggle_theme() -> None`

Toggles the Obsidian theme between the currently active mode and the other (light/dark).

- **Parameters:** None
- **Returns:** `None`
- **Raises:** `ObsidianCommError` if the request fails or Obsidian reports an error.

---

### Vault Operations

#### `get_current_vault_absolute_path() -> str`

Retrieves absolute path of the current vault.

- **Returns:** (`str`) Absolute path.

#### `get_all_note_paths(absolute: bool = False) -> List[str]`

_(New)_ Retrieves paths of all Markdown notes.

- **Parameters:** `absolute` (`bool`, optional, default: `False`): If `True`, returns absolute filesystem paths, otherwise vault-relative paths.
- **Returns:** (`List[str]`) List of note paths.
- **Raises:** `ObsidianCommError` if paths cannot be retrieved or vault path is needed but unavailable.

#### `get_all_note_titles() -> List[str]`

Retrieves titles of all Markdown notes.

- **Returns:** (`List[str]`) List of note titles.

#### `get_vault_name() -> str`

_(New)_ Retrieves the name of the current vault.

- **Returns:** (`str`) Vault name.
- **Raises:** `ObsidianCommError` if request fails.

#### `get_all_tags() -> List[str]`

_(Temporarily Disabled)_ Retrieves all unique tags.

- **Returns:** (`List[str]`) e.g., `['#tag1', '#tag/nested']`.
- **Raises:** `ObsidianCommError` if request fails.

---

### Obsidian Operations

#### `get_obsidian_language() -> str`

_(New)_ Retrieves Obsidian's current language code.

- **Returns:** (`str`) e.g., 'en', 'fr'.
- **Raises:** `ObsidianCommError` if request fails.

#### `get_theme_mode() -> str`

_(New)_ Retrieves current theme mode ('light' or 'dark').

- **Returns:** (`str`) 'light' or 'dark'.
- **Raises:** `ObsidianCommError` if request fails.

#### `run_obsidian_command(command_id: str) -> None`

_(Temporarily Disabled)_ Executes an Obsidian command.

- **Parameters:** `command_id` (`str`) e.g., `"editor:toggle-bold"`.
- **Returns:** `None`
- **Raises:** `ValueError` if `command_id` is empty. `ObsidianCommError` if command fails.

---

### Frontmatter Property Management (Requires PyYAML)

Directly manipulate YAML frontmatter.

#### `manage_properties_key(file_path: str, action: str, key: Optional[str] = None, new_key: Optional[str] = None, use_vault_modify: bool = True) -> Dict[str, Any]`

Manages top-level keys in frontmatter ('add', 'remove', 'rename').

- **Parameters:** `file_path` (absolute), `action`, `key`, `new_key`, `use_vault_modify` (default `True` for API, `False` for direct write - risky).
- **Returns:** (`Dict[str, Any]`) `{'success': True}` or `{'success': False, 'error': '...'}`.
- **Raises:** `NameError` if PyYAML missing. `FileNotFoundError`. `ValueError`. `yaml.YAMLError`. `ObsidianCommError` (if `use_vault_modify=True`). `IOError` (if `use_vault_modify=False`).

#### `manage_properties_value(file_path: str, key: str, action: str, value: Any = None, new_value: Any = None, index: Optional[int] = None, use_vault_modify: bool = True) -> Dict[str, Any]`

Manages values for a key ('add', 'remove', 'update').

- **Parameters:** `file_path` (absolute), `key`, `action`, `value`, `new_value`, `index`, `use_vault_modify` (default `True`).
- **Returns:** (`Dict[str, Any]`) `{'success': True}` or `{'success': False, 'error': '...'}`.
- **Raises:** Similar to `manage_properties_key`, plus `IndexError`.

---

### Event Listening (Reacting to Obsidian Events)

Your Python scripts can react to events in Obsidian.

**How it Works:**

1.  **Registration:** Your script calls `obsidian.register_event_listener("event-name")` and then typically exits its main flow.
2.  **Event Occurs:** An event (e.g., note modification) happens in Obsidian.
3.  **Script Re-Execution:** The plugin **runs your Python script again from the beginning**, adding environment variables:
    - `OBSIDIAN_EVENT_NAME`: Name of the event (e.g., `"vault-modify"`).
    - `OBSIDIAN_EVENT_PAYLOAD`: JSON string with event data (e.g., `'{"path": "My Note.md"}'`).
4.  **Your Script's Responsibility:**
    - **At the start**, check `os.environ.get("OBSIDIAN_EVENT_NAME")`.
    - If it exists, parse `OBSIDIAN_EVENT_PAYLOAD`, perform event-specific actions.
    - Optionally call `obsidian.unregister_event_listener()` if it should only react once.
    - **Exit immediately using `sys.exit(0)`** to prevent normal script logic from running.
    - If the variable doesn't exist, proceed with normal script logic (like initial registration or handling settings discovery - see "Handling Settings Discovery" section).

**Supported Event Names (Initial List):**

- `"vault-modify"`: File content modified. Payload: `{"path": "relative/path/to/file.md"}`
- `"vault-delete"`: File/folder deleted. Payload: `{"path": "relative/path/to/item", "type": "file" | "folder"}`
- `"vault-rename"`: File/folder renamed/moved. Payload: `{"path": "new/relative/path", "oldPath": "old/relative/path", "type": "file" | "folder"}`
- `"metadata-changed"`: File metadata changed. Payload: `{"path": "relative/path/to/file.md"}`
- `"layout-change"`: Workspace layout changed. Payload: `{}`
- `"active-leaf-change"`: Focused tab/pane changed. Payload: `{"path": "relative/path/to/active/note.md" | null}`

#### `register_event_listener(event_name: str) -> None`

Registers the current script for an Obsidian event.

- **Parameters:** `event_name` (`str`).
- **Returns:** `None`
- **Raises:** `ValueError` if `event_name` empty. `ObsidianCommError` if registration fails.

#### `unregister_event_listener(event_name: str) -> None`

Unregisters the current script from an event.

- **Parameters:** `event_name` (`str`).
- **Returns:** `None`
- **Raises:** `ValueError` if `event_name` empty. `ObsidianCommError` if unregistration fails.

**Example Script (`react_on_modify.py` - Simplified):**

```python
# react_on_modify.py
import sys
import os
import json
# For production, add robust error handling (try-except) for imports and API calls.
from ObsidianPluginDevPythonToJS import (
    ObsidianPluginDevPythonToJS, ObsidianCommError,
    define_settings, _handle_cli_args # Import helpers
)

EVENT_TO_LISTEN_FOR = "vault-modify"

# --- Check for event trigger FIRST ---
event_name_from_env = os.environ.get("OBSIDIAN_EVENT_NAME")
if event_name_from_env:
    print(f"--- Script launched by Event: {event_name_from_env} ---")
    payload_str = os.environ.get("OBSIDIAN_EVENT_PAYLOAD", "{}")
    try:
        event_payload = json.loads(payload_str)
    except json.JSONDecodeError:
        event_payload = {"error": "Failed to parse payload"}

    if event_name_from_env == EVENT_TO_LISTEN_FOR:
        file_path = event_payload.get("path", "N/A")
        print(f"Detected modification of: {file_path}")
        # Initialize client only if needed for a response
        # try:
        #     obsidian_client = ObsidianPluginDevPythonToJS()
        #     obsidian_client.show_notification(f"Handled modify: {file_path}")
        # except ObsidianCommError as e:
        #     print(f"Error sending notification for event: {e}", file=sys.stderr)

    print("--- Event handling finished. Exiting. ---")
    sys.exit(0)

# --- Settings Definition & Discovery Handling (Recommended) ---
MY_SETTINGS: list = [] # No settings for this script
define_settings(MY_SETTINGS)
_handle_cli_args() # Handles --get-settings-json and exits if found

# --- Main Script Logic (Registration) ---
if __name__ == "__main__":
    print(f"--- Registering Listener for: {EVENT_TO_LISTEN_FOR} ---")
    try:
        obsidian = ObsidianPluginDevPythonToJS()
        obsidian.register_event_listener(EVENT_TO_LISTEN_FOR)
        obsidian.show_notification(f"👂 Now listening for {EVENT_TO_LISTEN_FOR}...", 5000)
        print(f"--- Registered. Modify a note to trigger this script. ---")
    except ObsidianCommError as e:
        print(f"Error during registration: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Unexpected Python error during registration: {e}", file=sys.stderr)
```
