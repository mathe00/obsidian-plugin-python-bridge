// --- src/lang/zh.ts ---
// Chinese translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge 设置",
	SETTINGS_FOLDER_TITLE: "Python 脚本文件夹",
	SETTINGS_FOLDER_DESC: "包含 Python 脚本的文件夹路径（绝对路径或相对于仓库的路径）。",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts 或 ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP 服务器端口",
	SETTINGS_PORT_DESC:
		"本地 HTTP 服务器的端口（1024-65535）。需要重新启动或保存设置才能应用。",
	SETTINGS_CACHE_TITLE: "禁用 Python 缓存 (__pycache__)",
	SETTINGS_CACHE_DESC: "使用“-B”标志运行 Python 以阻止写入 .pyc 文件。",

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "HTTP 端口已更改为",
	NOTICE_PORT_CHANGED_SUFFIX: "正在重新启动服务器...",
	NOTICE_PYTHON_MISSING_TITLE: "Python Bridge 错误：",
	NOTICE_PYTHON_MISSING_DESC: "在 PATH 中找不到 Python 可执行文件。\n请安装 Python 并确保将其添加到系统的 PATH 环境变量中，以便插件运行脚本。\n需要 Python 的插件功能将不可用。",
	NOTICE_REQUESTS_MISSING_TITLE: "Python Bridge 错误：",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "所需的 Python 库 'requests' 未为",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: "安装。\n请通过运行以下命令安装：\n{pythonCmd} -m pip install requests\n在安装之前，需要 Python 的插件功能将不可用。",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "配置的 HTTP 端口无效：",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "服务器未启动。请在设置中配置一个有效的端口（1-65535）。",
	NOTICE_PORT_IN_USE_PREFIX: "端口",
	NOTICE_PORT_IN_USE_SUFFIX: "已被占用。请在设置中选择另一个端口或关闭使用该端口的其他应用程序。服务器未启动。",
	NOTICE_SERVER_START_FAILED_PREFIX: "在端口上启动服务器失败",
	NOTICE_SERVER_START_FAILED_SUFFIX: "。",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge：HTTP 端口已更改（",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "）。如果脚本已在运行或从外部启动，它可能会指向旧端口。",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "找不到 Python 脚本或不是文件：",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "访问脚本文件时出错：",
	NOTICE_RUNNING_SCRIPT_PREFIX: "正在运行 Python 脚本：",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "运行",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "时出错，使用",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "失败，退出代码为",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "请检查控制台日志。",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "找不到有效的 Python 可执行文件。已尝试：",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "请确保已安装 Python 并且可以通过系统 PATH（或 Windows 上的 'py' 启动器）访问。",
	NOTICE_SCRIPTS_FOLDER_INVALID: "找不到 Python 脚本文件夹或无效。请检查插件设置。",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "读取脚本文件夹时出错：",
	NOTICE_NO_SCRIPTS_FOUND: "在配置的文件夹中找不到 Python 脚本 (.py)。",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "正在运行",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "个 Python 脚本...",
	NOTICE_INPUT_VALIDATION_FAILED: "输入不符合要求的格式。",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "运行特定的 Python 脚本",
	CMD_RUN_ALL_SCRIPTS_NAME: "运行文件夹中的所有 Python 脚本",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "提交",
};
