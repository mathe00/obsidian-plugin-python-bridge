// cs.ts - cs translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'Nastavení Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'Složka Python skriptů',
  SETTINGS_FOLDER_DESC:
    'Cesta ke složce obsahující vaše Python skripty (absolutní nebo relativní k vaultu).',
  SETTINGS_FOLDER_PLACEHOLDER: '/cesta/k/vašim/skriptům nebo ./scripts-python',
  SETTINGS_PORT_TITLE: 'Port HTTP serveru',
  SETTINGS_PORT_DESC:
    'Port pro lokální HTTP server (1024-65535). Vyžaduje restart nebo uložení nastavení pro aplikaci.',
  SETTINGS_CACHE_TITLE: 'Zakázat Python Cache (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Spusťte Python s příznakem "-B", abyste zabránili zápisu .pyc souborů.',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP port změněn na',
  NOTICE_PORT_CHANGED_SUFFIX: 'Restartuji server...',
  NOTICE_PYTHON_MISSING_TITLE: 'Chyba Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'Spustitelný soubor Pythonu nebyl nalezen v PATH.\\nNainstalujte prosím Python a ujistěte se, že je přidán do systémové proměnné prostředí PATH, aby plugin mohl spouštět skripty.\\nFunkce pluginu vyžadující Python nebudou dostupné.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Chyba Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "Požadovaná knihovna Pythonu 'requests' není nainstalována pro",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\\nNainstalujte ji spuštěním:\\n{pythonCmd} -m pip install requests\\nFunkce pluginu vyžadující Python nebudou dostupné, dokud nebude nainstalována.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Nakonfigurován neplatný HTTP port:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Server nebyl spuštěn. Nakonfigurujte prosím platný port (1-65535) v nastavení.',
  NOTICE_PORT_IN_USE_PREFIX: 'Port',
  NOTICE_PORT_IN_USE_SUFFIX:
    'je již používán. Zvolte prosím jiný port v nastavení nebo ukončete jinou aplikaci, která jej používá. Server nebyl spuštěn.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Nepodařilo se spustit server na portu',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE:
    'Neplatný port. Zadejte prosím číslo mezi 0 a 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: HTTP port změněn (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Skript může cílit na starý port, pokud již běží nebo byl spuštěn externě.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'Python skript nebyl nalezen nebo není soubor:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Chyba při přístupu k souboru skriptu:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Spouštím Python skript:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Chyba při spouštění',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 's',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'selhal s návratovým kódem',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Zkontrolujte logy konzole.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Nelze najít platný spustitelný soubor Pythonu. Zkoušeno:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Ujistěte se, že je Python nainstalován a dostupný přes systémovou proměnnou PATH (nebo spouštěč 'py' ve Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Složka Python skriptů nebyla nalezena nebo je neplatná. Zkontrolujte nastavení pluginu.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Chyba při čtení složky skriptů:',
  NOTICE_NO_SCRIPTS_FOUND:
    'V nakonfigurované složce nebyly nalezeny žádné Python skripty (.py).',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Spouštím',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'Python skript(y)...',
  NOTICE_INPUT_VALIDATION_FAILED: 'Vstup neodpovídá požadovanému formátu.',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Spustit konkrétní Python skript',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Spustit všechny Python skripty ve složce',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Odeslat',
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Vyberte Python skript ke spuštění...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Nastavení Specifická pro Skript',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Obnovit Nastavení Skriptů',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Znovu proskenujte složku skriptů pro zjištění nebo aktualizaci nastavení definovaných ve vašich Python skriptech.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Obnovit Definice',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Obnovuji...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Složka Python skriptů není nakonfigurována. Nastavte prosím cestu výše.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "V nakonfigurované složce nebyly nalezeny žádné skripty s definovatelnými nastaveními, nebo se zjištění nastavení nezdařilo. Klikněte na 'Obnovit Definice' pro opakování.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Nastavení pro:',
  SETTINGS_LANGUAGE_AUTO: 'Automaticky (Podle Obsidianu)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Nelze obnovit nastavení: Spustitelný soubor Pythonu nebyl nalezen. Ujistěte se, že je Python nainstalován a v PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'Obnovuji definice nastavení skriptů...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Definice nastavení skriptů úspěšně obnoveny!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Nepodařilo se obnovit definice nastavení skriptů. Zkontrolujte logy pro detaily.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Nelze spustit skript: Spustitelný soubor Pythonu nebyl nalezen. Zkontrolujte instalaci a PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'Obnovit definice nastavení Python skriptů',
  SETTINGS_SECURITY_WARNING_TITLE: 'Bezpečnostní Varování',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Spouštění libovolných Python skriptů může být riskantní. Ujistěte se, že důvěřujete zdroji jakéhokoli skriptu, který spouštíte, protože mohou přistupovat k vašemu systému a datům. Autor pluginu a autoři skriptů nejsou zodpovědní za žádnou ztrátu dat nebo bezpečnostní problémy způsobené skripty, které se rozhodnete spustit. Spouštějte skripty na vlastní nebezpečí.',
  SETTINGS_LANGUAGE_TITLE: 'Jazyk Pluginu',
  SETTINGS_LANGUAGE_DESC:
    "Zvolte jazyk zobrazení pro rozhraní pluginu Python Bridge. 'Automaticky' se řídí nastavením jazyka Obsidianu.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE:
    'Tip pro výkon: Mezipaměť zpětných odkazů',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Pro zlepšení výkonu při načítání zpětných odkazů (pomocí funkce get_backlinks) ve velkých trezorech zvažte instalaci komunitního pluginu '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' od @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Neplatná cesta ke složce. Vyberte prosím platnou složku v nastavení.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Nakonfigurovaná cesta ke složce skriptů Python '{path}' je neplatná nebo nebyla nalezena. Vymazání nastavení.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Skript Povolen',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Povolit spuštění tohoto skriptu pomocí příkazů, zkratek nebo 'Spustit vše'.",
  NOTICE_SCRIPT_DISABLED:
    "Skript '{scriptName}' je v nastavení zakázán a nelze jej spustit.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Spustit při startu',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Automaticky spustit tento skript při startu Obsidianu (pouze pokud je také zapnuto 'Skript povolen').",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Zpoždění startu (sekundy)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Počkejte tento počet sekund po startu Obsidianu před spuštěním skriptu (platí pouze pokud je zapnuto 'Spustit při startu'). Použijte 0 pro žádné zpoždění.",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'Automaticky nastavit PYTHONPATH pro knihovnu',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Automaticky přidá adresář pluginu do PYTHONPATH při spouštění skriptů, což umožňuje přímý import knihovny Python (Doporučeno). Pokud je zakázáno, musíte zkopírovat ObsidianPluginDevPythonToJS.py do složky se skripty nebo spravovat sys.path ručně.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'Automatické nastavení PYTHONPATH zakázáno. Ujistěte se, že soubor ObsidianPluginDevPythonToJS.py je ve vaší složce skriptů, nebo spravujte sys.path ručně.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Cesta k spustitelnému souboru Pythonu',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Absolutní cesta k vašemu spustitelnému souboru Pythonu nebo uv. Ponechte prázdné pro automatickou detekci (uv, py, python3, python). Pokud dojde ke změně, vyžaduje pro plný účinek opětovné načtení nebo restartování pluginu.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'např. /usr/bin/python3 nebo C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Cesta ke spustitelnému souboru Pythonu byla změněna. Aktualizují se skripty...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Vlastní cesta k Pythonu je neplatná a nebyl nalezen žádný záložní spustitelný soubor. Skripty nemusí fungovat.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE:
    'Vlastní cesta k Pythonu se nezdařila',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Vlastní cesta ke spustitelnému souboru Pythonu '{path}' je neplatná nebo ji nelze spustit. Vrací se k automatické detekci.",

  // Audit Log Settings
  SETTINGS_AUDIT_LOG_TITLE: 'Auditní Záznam',
  SETTINGS_AUDIT_LOG_ENABLE_NAME: 'Povolit Auditní Záznam',
  SETTINGS_AUDIT_LOG_ENABLE_DESC:
    'Povolit auditní protokolování pro spouštění skriptů a API akce pro bezpečnostní monitorování a ladění.',
  SETTINGS_AUDIT_LOG_FILE_PATH_NAME: 'Cesta k Souboru Auditního Záznamu',
  SETTINGS_AUDIT_LOG_FILE_PATH_DESC:
    'Volitelné: Vlastní cesta pro soubor auditního záznamu. Pokud není specifikována, výchozí je soubor v adresáři pluginu.',
  SETTINGS_AUDIT_LOG_FILE_PATH_PLACEHOLDER: 'např. /cesta/k/audit.log',
  SETTINGS_AUDIT_LOG_MAX_SIZE_NAME: 'Maximální Velikost Souboru Záznamu (MB)',
  SETTINGS_AUDIT_LOG_MAX_SIZE_DESC:
    'Maximální velikost jednoho souboru záznamu před rotací. Výchozí: 10MB',
  SETTINGS_AUDIT_LOG_MAX_SIZE_PLACEHOLDER: '10',
  SETTINGS_AUDIT_LOG_MAX_FILES_NAME: 'Maximální Počet Souborů Záznamu',
  SETTINGS_AUDIT_LOG_MAX_FILES_DESC:
    'Maximální počet souborů záznamu k uchování během rotace. Výchozí: 5',
  SETTINGS_AUDIT_LOG_MAX_FILES_PLACEHOLDER: '5',

  // Error Messages
  ERROR_UNKNOWN_INPUT_TYPE:
    "Chyba: Požadován neznámý typ vstupu '{inputType}'.",
  ERROR_INVALID_NUMBER_INPUT: 'Neplatný číselný vstup.',
  ERROR_SCRIPT_DISCOVERY_FAILED:
    'Zjištění nastavení selhalo pro {count} skript(ů): {scripts}. Zkontrolujte konzoli pro detaily.',
  ERROR_UNKNOWN_SETTING_TYPE: 'Neznámý typ nastavení: {type}',

  // Fallback Messages
  SETTINGS_PYTHON_EXEC_PATH_TITLE_FALLBACK:
    'Cesta ke Spustitelnému Souboru Pythonu',
  SETTINGS_PYTHON_EXEC_PATH_DESC_FALLBACK:
    'Absolutní cesta k vašemu spustitelnému souboru Pythonu nebo uv. Ponechte prázdné pro automatickou detekci (uv, py, python3, python). Vyžaduje opětovné načtení nebo restartování pluginu pro plný účinek při změně.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER_FALLBACK:
    'např. /usr/bin/python3 nebo C:\\Python39\\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE_FALLBACK:
    'Vlastní Cesta k Pythonu Selhala',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC_FALLBACK:
    'Cesta: {path}. Chyba: {error}. Vrací se k automatické detekci.',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_PLACEHOLDER: '0',

  // Activation Warning Modal
  ACTIVATION_WARNING_TITLE: 'Bezpečnostní Varování',
  ACTIVATION_WARNING_MESSAGE:
    'Chystáte se povolit Python skript "{scriptName}".',
  ACTIVATION_WARNING_RISK_FILES:
    'Přistupovat a upravovat soubory ve vašem systému',
  ACTIVATION_WARNING_RISK_NETWORK:
    'Vytvářet síťové požadavky na externí služby',
  ACTIVATION_WARNING_RISK_SYSTEM:
    'Spouštět systémové příkazy a přistupovat ke systémovým zdrojům',
  ACTIVATION_WARNING_SECURITY_NOTE:
    'Povolujte pouze skripty ze zdrojů, kterým důvěřujete. Autor pluginu není zodpovědný za jakoukoli škodu způsobenou škodlivými skripty.',
  ACTIVATION_WARNING_READMORE: 'Přečtěte si více o bezpečnostních opatřeních',
  ACTIVATION_WARNING_CANCEL: 'Zrušit',
  ACTIVATION_WARNING_ACTIVATE_ANYWAY: 'Přesto Aktivovat',
};
