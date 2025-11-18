// --- src/lang/en.ts ---
// English translations (default)
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge Settings',
  SETTINGS_FOLDER_TITLE: 'Python scripts folder',
  SETTINGS_FOLDER_DESC:
    'Path to the folder containing your python scripts (absolute or relative to the vault).',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/to/your/scripts or ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP server port',
  SETTINGS_PORT_DESC:
    'Port for the local HTTP server (1024-65535). Requires restart or settings save to apply.',
  SETTINGS_CACHE_TITLE: 'Disable python cache (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Run python with the "-B" flag to prevent writing .pyc files.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python bridge', // Added for prefixing notices
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP port changed to',
  NOTICE_PORT_CHANGED_SUFFIX: 'Restarting server...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python bridge error:',
  NOTICE_PYTHON_MISSING_DESC:
    "Python executable not found in PATH.\nPlease install python and ensure it's added to your system's PATH environment variable for the plugin to run scripts.\nPlugin features requiring python will be unavailable.",
  NOTICE_REQUESTS_MISSING_TITLE: 'Python bridge error:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "The required python library 'requests' is not installed for", // {pythonCmd} will be inserted here
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\nPlease install it by running:\n{pythonCmd} -m pip install requests\nPlugin features requiring python will be unavailable until installed.', // {pythonCmd} will be inserted here
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Invalid HTTP port configured:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Server not started. Please configure a valid port (1-65535) in settings.',
  NOTICE_PORT_IN_USE_PREFIX: 'Port',
  NOTICE_PORT_IN_USE_SUFFIX:
    'is already in use. Please choose another port in settings or close the other application using it. Server not started.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Failed to start server on port',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.', // Original message had error details appended after this
  NOTICE_INVALID_PORT_RANGE:
    'Invalid port. Please enter a number between 0 and 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python bridge: HTTP port changed (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Script might target the old port if already running or launched externally.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'Python script not found or is not a file:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Error accessing script file:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Running python script:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Error running',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'with',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'failed with exit code',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Check console logs.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Could not find a valid python executable. Tried:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Please ensure python is installed and accessible via your system's PATH (or the 'py' launcher on Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Python scripts folder not found or invalid. Please check plugin settings.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Error reading scripts folder:',
  NOTICE_NO_SCRIPTS_FOUND:
    'No python scripts (.py) found in the configured folder.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Running',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'Python script(s)...',
  NOTICE_INPUT_VALIDATION_FAILED: 'Input does not match the required format.', // Added for UserInputModal

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Run a specific python script',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Run all python scripts in folder',

  // UserInputModal
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Submit',

  // ScriptSelectionModal (Placeholder - if needed later)
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Select a python script to run...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Script-specific settings',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Refresh script settings',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Rescan the scripts folder to discover or update settings defined within your python scripts.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Refresh definitions',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Refreshing...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Python scripts folder is not configured. Please set the path above.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "No scripts with definable settings found in the configured folder, or settings discovery failed. Click 'Refresh definitions' to try again.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Settings for:',
  SETTINGS_LANGUAGE_AUTO: 'Automatic (Match Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Cannot refresh settings: Python executable not found. Please ensure python is installed and in PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS:
    'Refreshing script settings definitions...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Script settings definitions refreshed successfully!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Failed to refresh script settings definitions. Check logs for details.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Cannot run script: Python executable not found. Please check installation and PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME:
    'Refresh python script settings definitions',
  SETTINGS_SECURITY_WARNING_TITLE: 'Security warning',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Executing arbitrary python scripts can be risky. Ensure you trust the source of any script you run, as they can access your system and data. The plugin author and script authors are not responsible for any data loss or security issues caused by scripts you choose to execute. Run scripts at your own risk.',
  SETTINGS_LANGUAGE_TITLE: 'Plugin Language',
  SETTINGS_LANGUAGE_DESC:
    "Choose the display language for the Python Bridge plugin interface. 'Automatic' follows Obsidian's language setting.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE:
    'Performance Tip: Backlink Cache',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "For improved performance when retrieving backlinks (using the get_backlinks function) in large vaults, consider installing the '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' community plugin by @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Invalid folder path. Please select a valid folder in settings.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Configured Python scripts folder path '{path}' is invalid or not found. Clearing setting.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Script Enabled',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Allow this script to be executed via commands, shortcuts, or 'Run All'.",
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Run on Startup',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Automatically run this script when Obsidian starts (only if 'Script Enabled' is also on).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Startup Delay (seconds)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Wait this many seconds after Obsidian starts before running the script (only applies if 'Run on Startup' is on). Use 0 for no delay.",
  NOTICE_SCRIPT_DISABLED:
    "Script '{scriptName}' is disabled in settings and cannot be executed.",

  // --- ADDED KEYS AT THE END ---
  SETTINGS_AUTO_PYTHONPATH_NAME: 'Auto-set PYTHONPATH for Library',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Automatically add the plugin directory to PYTHONPATH when running scripts, allowing direct import of the Python library (Recommended). If disabled, you must copy ObsidianPluginDevPythonToJS.py to your scripts folder or manage sys.path manually.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'Automatic PYTHONPATH disabled. Ensure ObsidianPluginDevPythonToJS.py is in your script folder or manage sys.path manually.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Python Executable Path',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Absolute path to your Python or uv executable. Leave empty for auto-detection (uv, py, python3, python). Requires plugin reload or restart to take full effect if changed.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'e.g., /usr/bin/python3 or C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Python executable path changed. Refreshing scripts...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Custom Python path is invalid, and no fallback executable was found. Scripts may not run.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'Custom Python Path Failed',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "The custom Python executable path '{path}' is invalid or could not be executed. Falling back to automatic detection.",

  // Audit Log Settings
  SETTINGS_AUDIT_LOG_TITLE: 'Audit Log',
  SETTINGS_AUDIT_LOG_ENABLE_NAME: 'Enable Audit Log',
  SETTINGS_AUDIT_LOG_ENABLE_DESC:
    'Enable audit logging for script executions and API actions for security monitoring and debugging.',
  SETTINGS_AUDIT_LOG_FILE_PATH_NAME: 'Audit Log File Path',
  SETTINGS_AUDIT_LOG_FILE_PATH_DESC:
    'Optional: Custom path for the audit log file. If not specified, defaults to a file in the plugin directory.',
  SETTINGS_AUDIT_LOG_FILE_PATH_PLACEHOLDER: 'e.g., /path/to/audit.log',
  SETTINGS_AUDIT_LOG_MAX_SIZE_NAME: 'Maximum Log File Size (MB)',
  SETTINGS_AUDIT_LOG_MAX_SIZE_DESC:
    'Maximum size of a single log file before rotation. Default: 10MB',
  SETTINGS_AUDIT_LOG_MAX_SIZE_PLACEHOLDER: '10',
  SETTINGS_AUDIT_LOG_MAX_FILES_NAME: 'Maximum Log Files',
  SETTINGS_AUDIT_LOG_MAX_FILES_DESC:
    'Maximum number of log files to keep during rotation. Default: 5',
  SETTINGS_AUDIT_LOG_MAX_FILES_PLACEHOLDER: '5',

  // Error Messages
  ERROR_UNKNOWN_INPUT_TYPE:
    "Error: Unknown input type '{inputType}' requested.",
  ERROR_INVALID_NUMBER_INPUT: 'Invalid number input.',
  ERROR_SCRIPT_DISCOVERY_FAILED:
    'Settings discovery failed for {count} script(s): {scripts}. Check console for details.',
  ERROR_UNKNOWN_SETTING_TYPE: 'Unknown setting type: {type}',

  // Fallback Messages
  SETTINGS_PYTHON_EXEC_PATH_TITLE_FALLBACK: 'Python Executable Path',
  SETTINGS_PYTHON_EXEC_PATH_DESC_FALLBACK:
    'Absolute path to your Python or uv executable. Leave empty for auto-detection (uv, py, python3, python). Requires plugin reload or restart to take full effect if changed.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER_FALLBACK:
    'e.g., /usr/bin/python3 or C:\\Python39\\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE_FALLBACK:
    'Custom Python Path Failed',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC_FALLBACK:
    'Path: {path}. Error: {error}. Falling back to auto-detection.',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_PLACEHOLDER: '0',

  // Activation Warning Modal
  ACTIVATION_WARNING_TITLE: 'Security Warning',
  ACTIVATION_WARNING_MESSAGE:
    'You are about to enable the Python script "{scriptName}".',
  ACTIVATION_WARNING_RISK_FILES: 'Access and modify files on your system',
  ACTIVATION_WARNING_RISK_NETWORK: 'Make network requests to external services',
  ACTIVATION_WARNING_RISK_SYSTEM:
    'Execute system commands and access system resources',
  ACTIVATION_WARNING_SECURITY_NOTE:
    'Only enable scripts from sources you trust. The plugin author is not responsible for any damage caused by malicious scripts.',
  ACTIVATION_WARNING_READMORE: 'Read more about security considerations',
  ACTIVATION_WARNING_CANCEL: 'Cancel',
  ACTIVATION_WARNING_ACTIVATE_ANYWAY: 'Activate Anyway',
};
