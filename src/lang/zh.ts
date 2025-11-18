// --- src/lang/zh.ts ---
// Chinese translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge 设置',
  SETTINGS_FOLDER_TITLE: 'Python 脚本文件夹',
  SETTINGS_FOLDER_DESC:
    '包含 Python 脚本的文件夹路径（绝对路径或相对于仓库的路径）。',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/to/your/scripts 或 ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP 服务器端口',
  SETTINGS_PORT_DESC:
    '本地 HTTP 服务器的端口（1024-65535）。需要重新启动或保存设置才能应用。',
  SETTINGS_CACHE_TITLE: '禁用 Python 缓存 (__pycache__)',
  SETTINGS_CACHE_DESC: '使用“-B”标志运行 Python 以阻止写入 .pyc 文件。',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP 端口已更改为',
  NOTICE_PORT_CHANGED_SUFFIX: '正在重新启动服务器...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python Bridge 错误：',
  NOTICE_PYTHON_MISSING_DESC:
    '在 PATH 中找不到 Python 可执行文件。\n请安装 Python 并确保将其添加到系统的 PATH 环境变量中，以便插件运行脚本。\n需要 Python 的插件功能将不可用。',
  NOTICE_REQUESTS_MISSING_TITLE: 'Python Bridge 错误：',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX: "所需的 Python 库 'requests' 未为",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '安装。\n请通过运行以下命令安装：\n{pythonCmd} -m pip install requests\n在安装之前，需要 Python 的插件功能将不可用。',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: '配置的 HTTP 端口无效：',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    '服务器未启动。请在设置中配置一个有效的端口（1-65535）。',
  NOTICE_PORT_IN_USE_PREFIX: '端口',
  NOTICE_PORT_IN_USE_SUFFIX:
    '已被占用。请在设置中选择另一个端口或关闭使用该端口的其他应用程序。服务器未启动。',
  NOTICE_SERVER_START_FAILED_PREFIX: '在端口上启动服务器失败',
  NOTICE_SERVER_START_FAILED_SUFFIX: '。',
  NOTICE_INVALID_PORT_RANGE: '端口无效。请输入 0 到 65535 之间的数字。',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge：HTTP 端口已更改（',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '）。如果脚本已在运行或从外部启动，它可能会指向旧端口。',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: '找不到 Python 脚本或不是文件：',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: '访问脚本文件时出错：',
  NOTICE_RUNNING_SCRIPT_PREFIX: '正在运行 Python 脚本：',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: '运行',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: '时出错，使用',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: '失败，退出代码为',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: '请检查控制台日志。',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    '找不到有效的 Python 可执行文件。已尝试：',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "请确保已安装 Python 并且可以通过系统 PATH（或 Windows 上的 'py' 启动器）访问。",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    '找不到 Python 脚本文件夹或无效。请检查插件设置。',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: '读取脚本文件夹时出错：',
  NOTICE_NO_SCRIPTS_FOUND: '在配置的文件夹中找不到 Python 脚本 (.py)。',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: '正在运行',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: '个 Python 脚本...',
  NOTICE_INPUT_VALIDATION_FAILED: '输入不符合要求的格式。',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: '运行特定的 Python 脚本',
  CMD_RUN_ALL_SCRIPTS_NAME: '运行文件夹中的所有 Python 脚本',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: '请选择要运行的 Python 脚本...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: '提交',
  SETTINGS_SCRIPT_SETTINGS_TITLE: '脚本特定设置',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: '刷新脚本设置',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    '重新扫描脚本文件夹以发现或更新 Python 脚本中定义的设置。',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: '刷新定义',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: '正在刷新...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    '未配置 Python 脚本文件夹。请在上方设置路径。',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    '在配置的文件夹中找不到具有可定义设置的脚本，或者设置发现失败。单击“刷新定义”重试。',
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: '设置：',
  SETTINGS_LANGUAGE_AUTO: '自动 (匹配 Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    '无法刷新设置：未找到 Python 可执行文件。请确保已安装 Python 并将其添加到 PATH。',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: '正在刷新脚本设置定义...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: '脚本设置定义刷新成功！',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED: '刷新脚本设置定义失败。请检查日志。',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    '无法运行脚本：未找到 Python 可执行文件。请检查安装和 PATH。',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: '刷新 Python 脚本设置定义',
  SETTINGS_SECURITY_WARNING_TITLE: '安全警告',
  SETTINGS_SECURITY_WARNING_TEXT:
    '执行任意 Python 脚本可能存在风险。请确保您信任所运行脚本的来源，因为它们可以访问您的系统和数据。插件作者和脚本作者对您选择执行的脚本造成的任何数据丢失或安全问题概不负责。运行脚本需自担风险。',
  SETTINGS_LANGUAGE_TITLE: '插件语言',
  SETTINGS_LANGUAGE_DESC:
    '选择 Python Bridge 插件界面的显示语言。“自动”将遵循 Obsidian 的语言设置。',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: '性能提示：反向链接缓存',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    '为了在大型库中检索反向链接（使用 get_backlinks 函数）时提高性能，请考虑安装由 @mnaoumov 开发的“[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)”社区插件。',
  NOTICE_INVALID_FOLDER_PATH:
    '文件夹路径无效。请在设置中选择一个有效的文件夹。',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "配置的 Python 脚本文件夹路径 '{path}' 无效或找不到。正在清除设置。",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: '脚本已启用',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    '允许通过命令、快捷键或“全部运行”执行此脚本。',
  NOTICE_SCRIPT_DISABLED: '脚本“{scriptName}”在设置中被禁用，无法执行。',

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: '启动时运行',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    'Obsidian 启动时自动运行此脚本（仅当“脚本已启用”也开启时）。',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: '启动延迟（秒）',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    'Obsidian 启动后等待这么多秒再运行脚本（仅当“启动时运行”开启时适用）。使用 0 表示无延迟。',

  SETTINGS_AUTO_PYTHONPATH_NAME: '为库自动设置 PYTHONPATH',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    '运行脚本时自动将插件目录添加到 PYTHONPATH，允许直接导入 Python 库（推荐）。如果禁用，您必须将 ObsidianPluginDevPythonToJS.py 复制到您的脚本文件夹或手动管理 sys.path。',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    '自动 PYTHONPATH 已禁用。请确保 ObsidianPluginDevPythonToJS.py 在您的脚本文件夹中，或手动管理 sys.path。',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Python 可执行文件路径',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Python 或 uv 可执行文件的绝对路径。留空以进行自动检测（uv、py、python3、python）。如果更改，需要重新加载或重新启动插件才能完全生效。',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    '例如 /usr/bin/python3 或 C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Python 可执行文件路径已更改。正在刷新脚本...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    '自定义 Python 路径无效，且未找到备用可执行文件。脚本可能无法运行。',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: '自定义 Python 路径失败',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    '自定义 Python 可执行文件路径"{path}"无效或无法执行。将回退到自动检测。',

  // Audit Log Settings
  SETTINGS_AUDIT_LOG_TITLE: '审计日志',
  SETTINGS_AUDIT_LOG_ENABLE_NAME: '启用审计日志',
  SETTINGS_AUDIT_LOG_ENABLE_DESC:
    '启用脚本执行和 API 操作的审计日志记录，用于安全监控和调试。',
  SETTINGS_AUDIT_LOG_FILE_PATH_NAME: '审计日志文件路径',
  SETTINGS_AUDIT_LOG_FILE_PATH_DESC:
    '可选：审计日志文件的自定义路径。如果未指定，默认为插件目录中的文件。',
  SETTINGS_AUDIT_LOG_FILE_PATH_PLACEHOLDER: '例如 /path/to/audit.log',
  SETTINGS_AUDIT_LOG_MAX_SIZE_NAME: '最大日志文件大小 (MB)',
  SETTINGS_AUDIT_LOG_MAX_SIZE_DESC: '轮转前单个日志文件的最大大小。默认：10MB',
  SETTINGS_AUDIT_LOG_MAX_SIZE_PLACEHOLDER: '10',
  SETTINGS_AUDIT_LOG_MAX_FILES_NAME: '最大日志文件数量',
  SETTINGS_AUDIT_LOG_MAX_FILES_DESC: '轮转期间保留的最大日志文件数量。默认：5',
  SETTINGS_AUDIT_LOG_MAX_FILES_PLACEHOLDER: '5',

  // Error Messages
  ERROR_UNKNOWN_INPUT_TYPE: "错误：请求了未知的输入类型 '{inputType}'。",
  ERROR_INVALID_NUMBER_INPUT: '无效的数字输入。',
  ERROR_SCRIPT_DISCOVERY_FAILED:
    '为 {count} 个脚本发现设置失败：{scripts}。请检查控制台获取详细信息。',
  ERROR_UNKNOWN_SETTING_TYPE: '未知的设置类型：{type}',

  // Fallback Messages
  SETTINGS_PYTHON_EXEC_PATH_TITLE_FALLBACK: 'Python 可执行文件路径',
  SETTINGS_PYTHON_EXEC_PATH_DESC_FALLBACK:
    'Python 或 uv 可执行文件的绝对路径。留空以进行自动检测（uv、py、python3、python）。如果更改，需要重新加载或重新启动插件才能完全生效。',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER_FALLBACK:
    '例如 /usr/bin/python3 或 C:\\Python39\\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE_FALLBACK:
    '自定义 Python 路径失败',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC_FALLBACK:
    '路径：{path}。错误：{error}。将回退到自动检测。',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_PLACEHOLDER: '0',

  // Activation Warning Modal
  ACTIVATION_WARNING_TITLE: '安全警告',
  ACTIVATION_WARNING_MESSAGE: '您即将启用 Python 脚本"{scriptName}"。',
  ACTIVATION_WARNING_RISK_FILES: '访问和修改您系统上的文件',
  ACTIVATION_WARNING_RISK_NETWORK: '向外部服务发出网络请求',
  ACTIVATION_WARNING_RISK_SYSTEM: '执行系统命令和访问系统资源',
  ACTIVATION_WARNING_SECURITY_NOTE:
    '仅启用来自您信任来源的脚本。插件作者不对恶意脚本造成的任何损害负责。',
  ACTIVATION_WARNING_READMORE: '阅读更多关于安全注意事项',
  ACTIVATION_WARNING_CANCEL: '取消',
  ACTIVATION_WARNING_ACTIVATE_ANYWAY: '仍然激活',
};
