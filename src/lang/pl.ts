// --- src/lang/pl.ts ---
// Polish translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Ustawienia Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'Folder skryptów Python',
  SETTINGS_FOLDER_DESC:
    'Ścieżka do folderu zawierającego skrypty Python (bezwzględna lub względna do przechowalni).',
  SETTINGS_FOLDER_PLACEHOLDER:
    '/ścieżka/do/twoich/skryptów lub ./scripts-python',
  SETTINGS_PORT_TITLE: 'Port serwera HTTP',
  SETTINGS_PORT_DESC:
    'Port dla lokalnego serwera HTTP (1024-65535). Wymaga ponownego uruchomienia lub zapisania ustawień, aby zastosować.',
  SETTINGS_CACHE_TITLE: 'Wyłącz pamięć podręczną Pythona (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Uruchamia Pythona z flagą "-B", aby zapobiec zapisywaniu plików .pyc.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'Port HTTP zmieniony na',
  NOTICE_PORT_CHANGED_SUFFIX: 'Ponowne uruchamianie serwera...',
  NOTICE_PYTHON_MISSING_TITLE: 'Błąd Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'Nie znaleziono pliku wykonywalnego Pythona w PATH.\nZainstaluj Pythona i upewnij się, że jest dodany do zmiennej środowiskowej PATH systemu, aby wtyczka mogła uruchamiać skrypty.\nFunkcje wtyczki wymagające Pythona będą niedostępne.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Błąd Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "Wymagana biblioteka Python 'requests' nie jest zainstalowana dla",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\nZainstaluj ją, uruchamiając:\n{pythonCmd} -m pip install requests\nFunkcje wtyczki wymagające Pythona będą niedostępne do czasu instalacji.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Skonfigurowano nieprawidłowy port HTTP:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Serwer nie został uruchomiony. Skonfiguruj prawidłowy port (1-65535) w ustawieniach.',
  NOTICE_PORT_IN_USE_PREFIX: 'Port',
  NOTICE_PORT_IN_USE_SUFFIX:
    'jest już używany. Wybierz inny port w ustawieniach lub zamknij inną aplikację, która go używa. Serwer nie został uruchomiony.',
  NOTICE_SERVER_START_FAILED_PREFIX:
    'Nie udało się uruchomić serwera na porcie',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE:
    'Nieprawidłowy port. Wprowadź liczbę od 0 do 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX:
    '⚠️ Python Bridge: Port HTTP zmieniony (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Skrypt może celować w stary port, jeśli jest już uruchomiony lub został uruchomiony zewnętrznie.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'Nie znaleziono skryptu Python lub nie jest to plik:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Błąd dostępu do pliku skryptu:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Uruchamianie skryptu Python:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Błąd podczas uruchamiania',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'za pomocą',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE:
    'zakończył się niepowodzeniem z kodem wyjścia',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Sprawdź logi konsoli.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Nie można znaleźć prawidłowego pliku wykonywalnego Pythona. Próbowano:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Upewnij się, że Python jest zainstalowany i dostępny za pośrednictwem PATH systemu (lub launchera 'py' w systemie Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Nie znaleziono folderu skryptów Python lub jest on nieprawidłowy. Sprawdź ustawienia wtyczki.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Błąd odczytu folderu skryptów:',
  NOTICE_NO_SCRIPTS_FOUND:
    'Nie znaleziono skryptów Python (.py) w skonfigurowanym folderze.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Uruchamianie',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'skryptów Python...',
  NOTICE_INPUT_VALIDATION_FAILED:
    'Wprowadzone dane nie pasują do wymaganego formatu.',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Uruchom określony skrypt Python',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Uruchom wszystkie skrypty Python w folderze',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Wybierz skrypt Python do uruchomienia...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Wyślij',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Ustawienia Specyficzne dla Skryptu',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Odśwież Ustawienia Skryptów',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Przeskanuj ponownie folder skryptów, aby odkryć lub zaktualizować ustawienia zdefiniowane w skryptach Python.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Odśwież Definicje',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Odświeżanie...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Folder skryptów Python nie jest skonfigurowany. Ustaw ścieżkę powyżej.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "Nie znaleziono skryptów z definiowalnymi ustawieniami w skonfigurowanym folderze lub odkrywanie ustawień nie powiodło się. Kliknij 'Odśwież Definicje', aby spróbować ponownie.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Ustawienia dla:',
  SETTINGS_LANGUAGE_AUTO: 'Automatyczny (Jak Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Nie można odświeżyć ustawień: Nie znaleziono pliku wykonywalnego Python. Upewnij się, że Python jest zainstalowany i znajduje się w PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS:
    'Odświeżanie definicji ustawień skryptów...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Definicje ustawień skryptów zostały pomyślnie odświeżone!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Nie udało się odświeżyć definicji ustawień skryptów. Sprawdź logi, aby uzyskać szczegóły.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Nie można uruchomić skryptu: Nie znaleziono pliku wykonywalnego Python. Sprawdź instalację i PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME:
    'Odśwież definicje ustawień skryptów Python',
  SETTINGS_SECURITY_WARNING_TITLE: 'Ostrzeżenie dotyczące bezpieczeństwa',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Uruchamianie dowolnych skryptów Python może być ryzykowne. Upewnij się, że ufasz źródłu każdego uruchamianego skryptu, ponieważ mogą one uzyskać dostęp do Twojego systemu i danych. Autor wtyczki i autorzy skryptów nie ponoszą odpowiedzialności za utratę danych ani problemy z bezpieczeństwem spowodowane przez skrypty, które zdecydujesz się uruchomić. Uruchamiaj skrypty na własne ryzyko.',
  SETTINGS_LANGUAGE_TITLE: 'Język Wtyczki',
  SETTINGS_LANGUAGE_DESC:
    "Wybierz język wyświetlania interfejsu wtyczki Python Bridge. 'Automatyczny' podąża za ustawieniem języka Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE:
    'Wskazówka dotycząca wydajności: Pamięć podręczna Backlinków',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Aby poprawić wydajność podczas pobierania backlinków (za pomocą funkcji get_backlinks) w dużych skarbcach, rozważ zainstalowanie wtyczki społecznościowej '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' autorstwa @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Nieprawidłowa ścieżka folderu. Wybierz prawidłowy folder w ustawieniach.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Skonfigurowana ścieżka folderu skryptów Python '{path}' jest nieprawidłowa lub nie znaleziono. Czyszczenie ustawienia.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Skrypt Włączony',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Zezwól na wykonywanie tego skryptu za pomocą poleceń, skrótów lub 'Uruchom Wszystko'.",
  NOTICE_SCRIPT_DISABLED:
    "Skrypt '{scriptName}' jest wyłączony w ustawieniach i nie może zostać wykonany.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Uruchom przy starcie',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Automatycznie uruchom ten skrypt po uruchomieniu Obsidian (tylko jeśli 'Skrypt włączony' jest również zaznaczony).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Opóźnienie startu (sekundy)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Poczekaj tę liczbę sekund po uruchomieniu Obsidian przed uruchomieniem skryptu (dotyczy tylko, gdy opcja 'Uruchom przy starcie' jest włączona). Użyj 0, aby nie było opóźnienia.",

  SETTINGS_AUTO_PYTHONPATH_NAME:
    'Automatycznie ustaw PYTHONPATH dla biblioteki',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Automatycznie dodaje katalog wtyczki do PYTHONPATH podczas uruchamiania skryptów, umożliwiając bezpośredni import biblioteki Python (Zalecane). Jeśli opcja jest wyłączona, musisz skopiować plik ObsidianPluginDevPythonToJS.py do folderu skryptów lub ręcznie zarządzać sys.path.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'Automatyczne ustawianie PYTHONPATH wyłączone. Upewnij się, że plik ObsidianPluginDevPythonToJS.py znajduje się w folderze skryptów lub zarządzaj sys.path ręcznie.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Ścieżka Pliku Wykonywalnego Python',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Ścieżka bezwzględna do pliku wykonywalnego Python lub uv. Pozostaw puste dla automatycznego wykrywania (uv, py, python3, python). Wymaga ponownego załadowania lub ponownego uruchomienia wtyczki, aby w pełni zadziałało po zmianie.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'np. /usr/bin/python3 lub C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Zmieniono ścieżkę pliku wykonywalnego Python. Odświeżanie skryptów...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Niestandardowa ścieżka Python jest nieprawidłowa i nie znaleziono zapasowego pliku wykonywalnego. Skrypty mogą nie działać.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE:
    'Niestandardowa Ścieżka Python Nie Powiodła Się',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Niestandardowa ścieżka pliku wykonywalnego Python '{path}' jest nieprawidłowa lub nie można jej wykonać. Przywracanie automatycznego wykrywania.",
};
