// zht.ts - zht translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge 設定',
  SETTINGS_FOLDER_TITLE: 'Python 腳本資料夾',
  SETTINGS_FOLDER_DESC: '包含您的 Python 腳本的資料夾路徑（絕對路徑或相對於 vault 的路徑）。',
  SETTINGS_FOLDER_PLACEHOLDER: '/您的/腳本/路徑 或 ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP 伺服器端口',
  SETTINGS_PORT_DESC: '本地 HTTP 伺服器的端口（1024-65535）。需要重新啟動或儲存設定才能套用。',
  SETTINGS_CACHE_TITLE: '停用 Python 快取 (__pycache__)',
  SETTINGS_CACHE_DESC: '使用 "-B" 標誌運行 Python 以防止寫入 .pyc 檔案。',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP 端口已更改為',
  NOTICE_PORT_CHANGED_SUFFIX: '正在重新啟動伺服器...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python Bridge 錯誤：',
  NOTICE_PYTHON_MISSING_DESC:
    '在 PATH 中找不到 Python 可執行檔。\\n請安裝 Python 並確保它已添加到您系統的 PATH 環境變數中，以便插件運行腳本。\\n需要 Python 的插件功能將無法使用。',
  NOTICE_REQUESTS_MISSING_TITLE: 'Python Bridge 錯誤：',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX: "所需的 Python 函式庫 'requests' 未安裝於",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '。\\n請運行以下指令安裝：\\n{pythonCmd} -m pip install requests\\n需要 Python 的插件功能在安裝前將無法使用。',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: '設定了無效的 HTTP 端口：',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX: '伺服器未啟動。請在設定中配置一個有效的端口（1-65535）。',
  NOTICE_PORT_IN_USE_PREFIX: '端口',
  NOTICE_PORT_IN_USE_SUFFIX:
    '已被使用。請在設定中選擇另一個端口或關閉正在使用它的其他應用程式。伺服器未啟動。',
  NOTICE_SERVER_START_FAILED_PREFIX: '無法在端口上啟動伺服器',
  NOTICE_SERVER_START_FAILED_SUFFIX: '。',
  NOTICE_INVALID_PORT_RANGE: '連接埠無效。請輸入 0 到 65535 之間的數字。',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge：HTTP 端口已更改 (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX: ')。如果腳本已在運行或從外部啟動，它可能會指向舊端口。',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: '找不到 Python 腳本或它不是一個檔案：',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: '存取腳本檔案時出錯：',
  NOTICE_RUNNING_SCRIPT_PREFIX: '正在運行 Python 腳本：',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: '運行時出錯',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: '使用',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: '失敗，退出代碼為',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: '請檢查控制台日誌。',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: '找不到有效的 Python 可執行檔。已嘗試：',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "請確保已安裝 Python 並且可以通過系統的 PATH（或 Windows 上的 'py' 啟動器）訪問。",
  NOTICE_SCRIPTS_FOLDER_INVALID: '找不到 Python 腳本資料夾或無效。請檢查插件設定。',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: '讀取腳本資料夾時出錯：',
  NOTICE_NO_SCRIPTS_FOUND: '在設定的資料夾中找不到 Python 腳本 (.py)。',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: '正在運行',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: '個 Python 腳本...',
  NOTICE_INPUT_VALIDATION_FAILED: '輸入不符合所需格式。',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: '運行特定的 Python 腳本',
  CMD_RUN_ALL_SCRIPTS_NAME: '運行資料夾中的所有 Python 腳本',
  MODAL_USER_INPUT_SUBMIT_BUTTON: '提交',
  MODAL_SELECT_SCRIPT_PLACEHOLDER: '選擇要運行的 Python 腳本...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: '腳本特定設定',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: '重新整理腳本設定',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    '重新掃描腳本資料夾以發現或更新您的 Python 腳本中定義的設定。',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: '重新整理定義',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: '正在重新整理...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED: '未設定 Python 腳本資料夾。請在上方設定路徑。',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    '在設定的資料夾中找不到具有可定義設定的腳本，或者設定發現失敗。點擊「重新整理定義」重試。',
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: '設定：',
  SETTINGS_LANGUAGE_AUTO: '自動 (匹配 Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    '無法重新整理設定：找不到 Python 可執行檔。請確保已安裝 Python 並在 PATH 中。',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: '正在重新整理腳本設定定義...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: '腳本設定定義已成功重新整理！',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED: '重新整理腳本設定定義失敗。請檢查日誌以獲取詳細資訊。',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN: '無法運行腳本：找不到 Python 可執行檔。請檢查安裝和 PATH。',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: '重新整理 Python 腳本設定定義',
  SETTINGS_SECURITY_WARNING_TITLE: '安全警告',
  SETTINGS_SECURITY_WARNING_TEXT:
    '執行任意 Python 腳本可能存在風險。請確保您信任所運行腳本的來源，因為它們可以訪問您的系統和數據。插件作者和腳本作者對您選擇執行的腳本造成的任何數據丟失或安全問題概不負責。運行腳本需自擔風險。',
  SETTINGS_LANGUAGE_TITLE: '插件語言',
  SETTINGS_LANGUAGE_DESC:
    '選擇 Python Bridge 插件界面的顯示語言。「自動」將遵循 Obsidian 的語言設定。',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: '效能提示：反向連結快取',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    '為了在大型儲存庫中擷取反向連結（使用 get_backlinks 函數）時提高效能，請考慮安裝由 @mnaoumov 開發的「[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)」社群外掛。',
  NOTICE_INVALID_FOLDER_PATH: '資料夾路徑無效。請在設定中選擇一個有效的資料夾。',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "設定的 Python 指令碼資料夾路徑 '{path}' 無效或找不到。正在清除設定。",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: '腳本已啟用',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC: '允許透過指令、快捷鍵或「全部執行」來執行此腳本。',
  NOTICE_SCRIPT_DISABLED: "腳本 '{scriptName}' 已在設定中停用，無法執行。",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: '啟動時執行',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    'Obsidian 啟動時自動執行此腳本（僅當「腳本已啟用」也開啟時）。',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: '啟動延遲（秒）',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    'Obsidian 啟動後等待這麼多秒再執行腳本（僅當「啟動時執行」開啟時適用）。使用 0 表示無延遲。',

  SETTINGS_AUTO_PYTHONPATH_NAME: '為庫自動設定 PYTHONPATH',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    '執行腳本時自動將插件目錄添加到 PYTHONPATH，允許直接導入 Python 庫（推薦）。如果停用，您必須將 ObsidianPluginDevPythonToJS.py 複製到您的腳本資料夾或手動管理 sys.path。',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    '自動 PYTHONPATH 已停用。請確保 ObsidianPluginDevPythonToJS.py 在您的腳本資料夾中，或手動管理 sys.path。',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Python 可執行檔案路徑',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    '您的 Python 或 uv 可執行檔案的絕對路徑。留空以進行自動偵測（uv、py、python3、python）。如果變更，需要重新載入或重新啟動外掛程式才能完全生效。',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: '例如 /usr/bin/python3 或 C:\Python39\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING: 'Python 可執行檔案路徑已變更。正在重新整理腳本...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    '自訂 Python 路徑無效，且找不到備用可執行檔案。腳本可能無法執行。',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: '自訂 Python 路徑失敗',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "自訂 Python 可執行檔案路徑 '{path}' 無效或無法執行。將回復到自動偵測。",
};
