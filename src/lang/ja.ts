// --- src/lang/ja.ts ---
// Japanese translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge 設定",
	SETTINGS_FOLDER_TITLE: "Python スクリプトフォルダ",
	SETTINGS_FOLDER_DESC:
		"Python スクリプトを含むフォルダへのパス（絶対パスまたは Vault 相対パス）。",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts または ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP サーバーポート",
	SETTINGS_PORT_DESC:
		"ローカル HTTP サーバーのポート（1024-65535）。適用するには再起動または設定の保存が必要です。",
	SETTINGS_CACHE_TITLE: "Python キャッシュを無効にする (__pycache__)",
	SETTINGS_CACHE_DESC:
		"「-B」フラグを指定して Python を実行し、.pyc ファイルの書き込みを防止します。",

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "HTTP ポートが",
	NOTICE_PORT_CHANGED_SUFFIX: "に変更されました。サーバーを再起動しています...",
	NOTICE_PYTHON_MISSING_TITLE: "Python Bridge エラー:",
	NOTICE_PYTHON_MISSING_DESC: "PATH に Python 実行可能ファイルが見つかりません。\nPython をインストールし、プラグインがスクリプトを実行できるようにシステムの PATH 環境変数に追加されていることを確認してください。\nPython を必要とするプラグイン機能は利用できません。",
	NOTICE_REQUESTS_MISSING_TITLE: "Python Bridge エラー:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "必要な Python ライブラリ 'requests' が",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: "用にインストールされていません。\n次のコマンドを実行してインストールしてください:\n{pythonCmd} -m pip install requests\nインストールされるまで、Python を必要とするプラグイン機能は利用できません。",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "無効な HTTP ポートが設定されています:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "サーバーは起動しませんでした。設定で有効なポート（1-65535）を設定してください。",
	NOTICE_PORT_IN_USE_PREFIX: "ポート",
	NOTICE_PORT_IN_USE_SUFFIX: "は既に使用中です。設定で別のポートを選択するか、それを使用している他のアプリケーションを閉じてください。サーバーは起動しませんでした。",
	NOTICE_SERVER_START_FAILED_PREFIX: "ポートでのサーバー起動に失敗しました",
	NOTICE_SERVER_START_FAILED_SUFFIX: "。",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: HTTP ポートが変更されました (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: ")。スクリプトが既に実行中または外部から起動されている場合、古いポートを対象としている可能性があります。",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Python スクリプトが見つからないか、ファイルではありません:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "スクリプトファイルへのアクセスエラー:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Python スクリプトを実行中:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "実行エラー",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "（使用コマンド:",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "）が終了コード",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "で失敗しました。コンソールログを確認してください。",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "有効な Python 実行可能ファイルが見つかりませんでした。試行:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Python がインストールされ、システムの PATH（または Windows の 'py' ランチャー）経由でアクセス可能であることを確認してください。",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Python スクリプトフォルダが見つからないか無効です。プラグイン設定を確認してください。",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "スクリプトフォルダの読み取りエラー:",
	NOTICE_NO_SCRIPTS_FOUND: "設定されたフォルダに Python スクリプト (.py) が見つかりません。",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "個の Python スクリプトを実行中...",
	NOTICE_INPUT_VALIDATION_FAILED: "入力が必要な形式と一致しません。",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "特定の Python スクリプトを実行",
	CMD_RUN_ALL_SCRIPTS_NAME: "フォルダ内のすべての Python スクリプトを実行",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "実行する Python スクリプトを選択してください...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "送信",
};
