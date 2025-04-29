// --- src/lang/ko.ts ---
// Korean translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge 설정",
	SETTINGS_FOLDER_TITLE: "Python 스크립트 폴더",
	SETTINGS_FOLDER_DESC:
		"Python 스크립트가 포함된 폴더 경로 (절대 경로 또는 볼트 기준 상대 경로).",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts 또는 ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP 서버 포트",
	SETTINGS_PORT_DESC:
		"로컬 HTTP 서버 포트 (1024-65535). 적용하려면 재시작하거나 설정을 저장해야 합니다.",
	SETTINGS_CACHE_TITLE: "Python 캐시 비활성화 (__pycache__)",
	SETTINGS_CACHE_DESC:
		'".pyc" 파일 쓰기를 방지하기 위해 "-B" 플래그로 Python을 실행합니다.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "HTTP 포트가",
	NOTICE_PORT_CHANGED_SUFFIX: "로 변경되었습니다. 서버를 다시 시작합니다...",
	NOTICE_PYTHON_MISSING_TITLE: "Python Bridge 오류:",
	NOTICE_PYTHON_MISSING_DESC: "PATH에서 Python 실행 파일을 찾을 수 없습니다.\nPython을 설치하고 플러그인이 스크립트를 실행할 수 있도록 시스템의 PATH 환경 변수에 추가되었는지 확인하십시오.\nPython이 필요한 플러グ인 기능은 사용할 수 없습니다.",
	NOTICE_REQUESTS_MISSING_TITLE: "Python Bridge 오류:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "필수 Python 라이브러리 'requests'가",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: "에 설치되어 있지 않습니다.\n다음을 실행하여 설치하십시오:\n{pythonCmd} -m pip install requests\n설치될 때까지 Python이 필요한 플러그인 기능은 사용할 수 없습니다.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "잘못된 HTTP 포트가 구성되었습니다:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "서버가 시작되지 않았습니다. 설정에서 유효한 포트(1-65535)를 구성하십시오.",
	NOTICE_PORT_IN_USE_PREFIX: "포트",
	NOTICE_PORT_IN_USE_SUFFIX: "가 이미 사용 중입니다. 설정에서 다른 포트를 선택하거나 해당 포트를 사용하는 다른 응용 프로그램을 닫으십시오. 서버가 시작되지 않았습니다.",
	NOTICE_SERVER_START_FAILED_PREFIX: "포트에서 서버 시작 실패:",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: HTTP 포트 변경됨 (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). 스크립트가 이미 실행 중이거나 외부에서 시작된 경우 이전 포트를 대상으로 할 수 있습니다.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Python 스크립트를 찾을 수 없거나 파일이 아닙니다:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "스크립트 파일 액세스 오류:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Python 스크립트 실행 중:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "실행 중 오류 발생",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "(사용된 명령:",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: ") 종료 코드",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "로 실패했습니다. 콘솔 로그를 확인하십시오.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "유효한 Python 실행 파일을 찾을 수 없습니다. 시도:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Python이 설치되어 있고 시스템 PATH(또는 Windows의 'py' 런처)를 통해 액세스할 수 있는지 확인하십시오.",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Python 스크립트 폴더를 찾을 수 없거나 잘못되었습니다. 플러그인 설정을 확인하십시오.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "스크립트 폴더 읽기 오류:",
	NOTICE_NO_SCRIPTS_FOUND: "구성된 폴더에서 Python 스크립트(.py)를 찾을 수 없습니다.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "개의 Python 스크립트 실행 중...",
	NOTICE_INPUT_VALIDATION_FAILED: "입력이 필요한 형식과 일치하지 않습니다.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "특정 Python 스크립트 실행",
	CMD_RUN_ALL_SCRIPTS_NAME: "폴더의 모든 Python 스크립트 실행",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "실행할 Python 스크립트를 선택하세요...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "제출",
};
