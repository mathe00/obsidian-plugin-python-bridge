// --- src/lang/ko.ts ---
// Korean translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge 설정',
  SETTINGS_FOLDER_TITLE: 'Python 스크립트 폴더',
  SETTINGS_FOLDER_DESC: 'Python 스크립트가 포함된 폴더 경로 (절대 경로 또는 볼트 기준 상대 경로).',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/to/your/scripts 또는 ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP 서버 포트',
  SETTINGS_PORT_DESC:
    '로컬 HTTP 서버 포트 (1024-65535). 적용하려면 재시작하거나 설정을 저장해야 합니다.',
  SETTINGS_CACHE_TITLE: 'Python 캐시 비활성화 (__pycache__)',
  SETTINGS_CACHE_DESC: '".pyc" 파일 쓰기를 방지하기 위해 "-B" 플래그로 Python을 실행합니다.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP 포트가',
  NOTICE_PORT_CHANGED_SUFFIX: '로 변경되었습니다. 서버를 다시 시작합니다...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python Bridge 오류:',
  NOTICE_PYTHON_MISSING_DESC:
    'PATH에서 Python 실행 파일을 찾을 수 없습니다.\nPython을 설치하고 플러그인이 스크립트를 실행할 수 있도록 시스템의 PATH 환경 변수에 추가되었는지 확인하십시오.\nPython이 필요한 플러グ인 기능은 사용할 수 없습니다.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Python Bridge 오류:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX: "필수 Python 라이브러리 'requests'가",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '에 설치되어 있지 않습니다.\n다음을 실행하여 설치하십시오:\n{pythonCmd} -m pip install requests\n설치될 때까지 Python이 필요한 플러그인 기능은 사용할 수 없습니다.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: '잘못된 HTTP 포트가 구성되었습니다:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    '서버가 시작되지 않았습니다. 설정에서 유효한 포트(1-65535)를 구성하십시오.',
  NOTICE_PORT_IN_USE_PREFIX: '포트',
  NOTICE_PORT_IN_USE_SUFFIX:
    '가 이미 사용 중입니다. 설정에서 다른 포트를 선택하거나 해당 포트를 사용하는 다른 응용 프로그램을 닫으십시오. 서버가 시작되지 않았습니다.',
  NOTICE_SERVER_START_FAILED_PREFIX: '포트에서 서버 시작 실패:',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE: '잘못된 포트입니다. 0에서 65535 사이의 숫자를 입력하십시오.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: HTTP 포트 변경됨 (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). 스크립트가 이미 실행 중이거나 외부에서 시작된 경우 이전 포트를 대상으로 할 수 있습니다.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'Python 스크립트를 찾을 수 없거나 파일이 아닙니다:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: '스크립트 파일 액세스 오류:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Python 스크립트 실행 중:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: '실행 중 오류 발생',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: '(사용된 명령:',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: ') 종료 코드',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: '로 실패했습니다. 콘솔 로그를 확인하십시오.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: '유효한 Python 실행 파일을 찾을 수 없습니다. 시도:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Python이 설치되어 있고 시스템 PATH(또는 Windows의 'py' 런처)를 통해 액세스할 수 있는지 확인하십시오.",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Python 스크립트 폴더를 찾을 수 없거나 잘못되었습니다. 플러그인 설정을 확인하십시오.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: '스크립트 폴더 읽기 오류:',
  NOTICE_NO_SCRIPTS_FOUND: '구성된 폴더에서 Python 스크립트(.py)를 찾을 수 없습니다.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: '',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: '개의 Python 스크립트 실행 중...',
  NOTICE_INPUT_VALIDATION_FAILED: '입력이 필요한 형식과 일치하지 않습니다.',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: '특정 Python 스크립트 실행',
  CMD_RUN_ALL_SCRIPTS_NAME: '폴더의 모든 Python 스크립트 실행',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: '실행할 Python 스크립트를 선택하세요...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: '제출',
  SETTINGS_SCRIPT_SETTINGS_TITLE: '스크립트별 설정',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: '스크립트 설정 새로고침',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    '스크립트 폴더를 다시 스캔하여 Python 스크립트 내에 정의된 설정을 검색하거나 업데이트합니다.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: '정의 새로고침',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: '새로고침 중...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Python 스크립트 폴더가 구성되지 않았습니다. 위에서 경로를 설정하십시오.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "구성된 폴더에서 정의 가능한 설정이 있는 스크립트를 찾을 수 없거나 설정 검색에 실패했습니다. '정의 새로고침'을 클릭하여 다시 시도하십시오.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: '설정:',
  SETTINGS_LANGUAGE_AUTO: '자동 (Obsidian과 일치)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    '설정을 새로고칠 수 없습니다: Python 실행 파일을 찾을 수 없습니다. Python이 설치되어 있고 PATH에 있는지 확인하십시오.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: '스크립트 설정 정의를 새로고침하는 중...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: '스크립트 설정 정의를 성공적으로 새로고침했습니다!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    '스크립트 설정 정의를 새로고침하지 못했습니다. 자세한 내용은 로그를 확인하십시오.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    '스크립트를 실행할 수 없습니다: Python 실행 파일을 찾을 수 없습니다. 설치 및 PATH를 확인하십시오.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'Python 스크립트 설정 정의 새로고침',
  SETTINGS_SECURITY_WARNING_TITLE: '보안 경고',
  SETTINGS_SECURITY_WARNING_TEXT:
    '임의의 Python 스크립트를 실행하는 것은 위험할 수 있습니다. 실행하는 스크립트의 출처를 신뢰할 수 있는지 확인하십시오. 스크립트는 시스템과 데이터에 접근할 수 있습니다. 플러그인 작성자와 스크립트 작성자는 사용자가 실행하기로 선택한 스크립트로 인해 발생하는 데이터 손실이나 보안 문제에 대해 책임을 지지 않습니다. 자신의 책임 하에 스크립트를 실행하십시오.',
  SETTINGS_LANGUAGE_TITLE: '플러그인 언어',
  SETTINGS_LANGUAGE_DESC:
    "Python Bridge 플러그인 인터페이스의 표시 언어를 선택하십시오. '자동'은 Obsidian의 언어 설정을 따릅니다.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: '성능 팁: 백링크 캐시',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "큰 보관소에서 백링크를 검색할 때(get_backlinks 함수 사용) 성능 향상을 위해 @mnaoumov의 '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' 커뮤니티 플러그인 설치를 고려하십시오.",
  NOTICE_INVALID_FOLDER_PATH: '잘못된 폴더 경로입니다. 설정에서 유효한 폴더를 선택하십시오.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "구성된 Python 스크립트 폴더 경로 '{path}'가 잘못되었거나 찾을 수 없습니다. 설정을 지웁니다.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: '스크립트 활성화됨',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "명령, 단축키 또는 '모두 실행'을 통해 이 스크립트를 실행하도록 허용합니다.",
  NOTICE_SCRIPT_DISABLED: "스크립트 '{scriptName}'이(가) 설정에서 비활성화되어 실행할 수 없습니다.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: '시작 시 실행',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Obsidian 시작 시 이 스크립트를 자동으로 실행합니다 ('스크립트 활성화'도 켜져 있는 경우에만).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: '시작 지연 (초)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Obsidian 시작 후 스크립트를 실행하기 전에 이 시간(초)만큼 기다립니다 ('시작 시 실행'이 켜져 있는 경우에만 적용됨). 지연이 없으려면 0을 사용하십시오.",

  SETTINGS_AUTO_PYTHONPATH_NAME: '라이브러리에 대해 PYTHONPATH 자동 설정',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    '스크립트를 실행할 때 플러그인 디렉토리를 PYTHONPATH에 자동으로 추가하여 Python 라이브러리를 직접 가져올 수 있도록 합니다(권장). 비활성화된 경우 ObsidianPluginDevPythonToJS.py를 스크립트 폴더에 복사하거나 sys.path를 수동으로 관리해야 합니다.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    '자동 PYTHONPATH가 비활성화되었습니다. ObsidianPluginDevPythonToJS.py가 스크립트 폴더에 있는지 확인하거나 sys.path를 수동으로 관리하십시오.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Python 실행 파일 경로',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Python 또는 uv 실행 파일의 절대 경로입니다. 자동 감지(uv, py, python3, python)를 위해 비워 두십시오. 변경된 경우 전체 효과를 적용하려면 플러그인을 다시 로드하거나 다시 시작해야 합니다.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: '예: /usr/bin/python3 또는 C:\Python39\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Python 실행 파일 경로가 변경되었습니다. 스크립트를 새로 고치는 중...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    '사용자 지정 Python 경로가 잘못되었거나 대체 실행 파일을 찾을 수 없습니다. 스크립트가 실행되지 않을 수 있습니다.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: '사용자 지정 Python 경로 실패',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "사용자 지정 Python 실행 파일 경로 '{path}'가 잘못되었거나 실행할 수 없습니다. 자동 감지로 대체합니다.",
};
