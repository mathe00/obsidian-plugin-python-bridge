// --- src/lang/en.ts ---
// English translations (default)
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge Settings",
	SETTINGS_FOLDER_TITLE: "Python Scripts Folder",
	SETTINGS_FOLDER_DESC:
		"Path to the folder containing your Python scripts (absolute or relative to the vault).",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts or ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP Server Port",
	SETTINGS_PORT_DESC:
		"Port for the local HTTP server (1024-65535). Requires restart or settings save to apply.",
	SETTINGS_CACHE_TITLE: "Disable Python Cache (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Run Python with the "-B" flag to prevent writing .pyc files.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge", // Added for prefixing notices
	NOTICE_PORT_CHANGED_PREFIX: "HTTP port changed to",
	NOTICE_PORT_CHANGED_SUFFIX: "Restarting server...",
	NOTICE_PYTHON_MISSING_TITLE: "Python Bridge Error:",
	NOTICE_PYTHON_MISSING_DESC: "Python executable not found in PATH.\nPlease install Python and ensure it's added to your system's PATH environment variable for the plugin to run scripts.\nPlugin features requiring Python will be unavailable.",
	NOTICE_REQUESTS_MISSING_TITLE: "Python Bridge Error:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "The required Python library 'requests' is not installed for", // {pythonCmd} will be inserted here
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nPlease install it by running:\n{pythonCmd} -m pip install requests\nPlugin features requiring Python will be unavailable until installed.", // {pythonCmd} will be inserted here
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Invalid HTTP port configured:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Server not started. Please configure a valid port (1-65535) in settings.",
	NOTICE_PORT_IN_USE_PREFIX: "Port",
	NOTICE_PORT_IN_USE_SUFFIX: "is already in use. Please choose another port in settings or close the other application using it. Server not started.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Failed to start server on port",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".", // Original message had error details appended after this
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: HTTP Port changed (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Script might target the old port if already running or launched externally.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Python script not found or is not a file:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Error accessing script file:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Running Python script:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Error running",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "with",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "failed with exit code",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Check console logs.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Could not find a valid Python executable. Tried:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Please ensure Python is installed and accessible via your system's PATH (or the 'py' launcher on Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Python scripts folder not found or invalid. Please check plugin settings.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Error reading scripts folder:",
	NOTICE_NO_SCRIPTS_FOUND: "No Python scripts (.py) found in the configured folder.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Running",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "Python script(s)...",
	NOTICE_INPUT_VALIDATION_FAILED: "Input does not match the required format.", // Added for UserInputModal

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Run a specific Python script",
	CMD_RUN_ALL_SCRIPTS_NAME: "Run all Python scripts in folder",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Submit",

	// ScriptSelectionModal (Placeholder - if needed later)
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "Select a Python script to run...",
	// MODAL_SELECT_SCRIPT_PLACEHOLDER: "Select a Python script to run...",
};
