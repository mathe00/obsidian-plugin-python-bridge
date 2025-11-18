// ro.ts - ro translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'Setări Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'Folder Scripturi Python',
  SETTINGS_FOLDER_DESC:
    'Calea către folderul care conține scripturile Python (absolută sau relativă la vault).',
  SETTINGS_FOLDER_PLACEHOLDER: '/cale/catre/scripturi sau ./scripts-python',
  SETTINGS_PORT_TITLE: 'Port Server HTTP',
  SETTINGS_PORT_DESC:
    'Portul pentru serverul HTTP local (1024-65535). Necesită repornire sau salvarea setărilor pentru a aplica.',
  SETTINGS_CACHE_TITLE: 'Dezactivare Cache Python (__pycache__)',
  SETTINGS_CACHE_DESC: 'Rulați Python cu flag-ul "-B" pentru a preveni scrierea fișierelor .pyc.',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'Portul HTTP a fost schimbat în',
  NOTICE_PORT_CHANGED_SUFFIX: 'Se repornește serverul...',
  NOTICE_PYTHON_MISSING_TITLE: 'Eroare Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'Executabilul Python nu a fost găsit în PATH.\\nVă rugăm să instalați Python și să vă asigurați că este adăugat la variabila de mediu PATH a sistemului pentru ca pluginul să ruleze scripturi.\\nFuncționalitățile pluginului care necesită Python nu vor fi disponibile.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Eroare Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "Biblioteca Python necesară 'requests' nu este instalată pentru",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\\nVă rugăm să o instalați rulând:\\n{pythonCmd} -m pip install requests\\nFuncționalitățile pluginului care necesită Python nu vor fi disponibile până la instalare.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Port HTTP invalid configurat:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Serverul nu a pornit. Vă rugăm să configurați un port valid (1-65535) în setări.',
  NOTICE_PORT_IN_USE_PREFIX: 'Portul',
  NOTICE_PORT_IN_USE_SUFFIX:
    'este deja utilizat. Vă rugăm să alegeți alt port în setări sau să închideți cealaltă aplicație care îl folosește. Serverul nu a pornit.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Nu s-a putut porni serverul pe portul',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE: 'Port invalid. Vă rugăm să introduceți un număr între 0 și 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: Portul HTTP s-a schimbat (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Scriptul ar putea viza portul vechi dacă rulează deja sau a fost lansat extern.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'Scriptul Python nu a fost găsit sau nu este un fișier:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Eroare la accesarea fișierului script:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Se rulează scriptul Python:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Eroare la rularea',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'cu',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'a eșuat cu codul de ieșire',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Verificați logurile consolei.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: 'Nu s-a putut găsi un executabil Python valid. Încercat:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Vă rugăm să vă asigurați că Python este instalat și accesibil prin PATH-ul sistemului (sau lansatorul 'py' pe Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Folderul scripturilor Python nu a fost găsit sau este invalid. Verificați setările pluginului.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Eroare la citirea folderului scripturilor:',
  NOTICE_NO_SCRIPTS_FOUND: 'Nu s-au găsit scripturi Python (.py) în folderul configurat.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Se rulează',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'script(uri) Python...',
  NOTICE_INPUT_VALIDATION_FAILED: 'Intrarea nu corespunde formatului necesar.',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Rulează un script Python specific',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Rulează toate scripturile Python din folder',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Trimite',
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Selectați un script Python de rulat...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Setări Specifice Scriptului',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Reîmprospătare Setări Script',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Rescanați folderul scripturilor pentru a descoperi sau actualiza setările definite în scripturile Python.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Reîmprospătare Definiții',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Se reîmprospătează...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Folderul scripturilor Python nu este configurat. Vă rugăm să setați calea mai sus.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "Nu s-au găsit scripturi cu setări definibile în folderul configurat sau descoperirea setărilor a eșuat. Apăsați 'Reîmprospătare Definiții' pentru a reîncerca.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Setări pentru:',
  SETTINGS_LANGUAGE_AUTO: 'Automat (Potrivire Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Nu se pot reîmprospăta setările: Executabilul Python nu a fost găsit. Vă rugăm să vă asigurați că Python este instalat și în PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'Se reîmprospătează definițiile setărilor scriptului...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Definițiile setărilor scriptului au fost reîmprospătate cu succes!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Nu s-au putut reîmprospăta definițiile setărilor scriptului. Verificați logurile pentru detalii.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Nu se poate rula scriptul: Executabilul Python nu a fost găsit. Verificați instalarea și PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'Reîmprospătare definiții setări script Python',
  SETTINGS_SECURITY_WARNING_TITLE: 'Avertisment de Securitate',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Executarea scripturilor Python arbitrare poate fi riscantă. Asigurați-vă că aveți încredere în sursa oricărui script pe care îl rulați, deoarece acestea pot accesa sistemul și datele dvs. Autorul pluginului și autorii scripturilor nu sunt responsabili pentru nicio pierdere de date sau probleme de securitate cauzate de scripturile pe care alegeți să le executați. Rulați scripturile pe propriul risc.',
  SETTINGS_LANGUAGE_TITLE: 'Limba Pluginului',
  SETTINGS_LANGUAGE_DESC:
    "Alegeți limba de afișare pentru interfața pluginului Python Bridge. 'Automat' urmează setarea de limbă a Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'Sfat de performanță: Cache Backlink',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Pentru performanțe îmbunătățite la preluarea backlink-urilor (folosind funcția get_backlinks) în vault-uri mari, luați în considerare instalarea pluginului comunitar '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' de @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Cale folder invalidă. Vă rugăm să selectați un folder valid în setări.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Calea folderului de scripturi Python configurată '{path}' este invalidă sau nu a fost găsită. Se șterge setarea.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Script Activat',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Permiteți executarea acestui script prin comenzi, comenzi rapide sau 'Executare Toate'.",
  NOTICE_SCRIPT_DISABLED:
    "Scriptul '{scriptName}' este dezactivat în setări și nu poate fi executat.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Rulează la pornire',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Rulează automat acest script la pornirea Obsidian (doar dacă și 'Script Activat' este pornit).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Întârziere la pornire (secunde)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Așteaptă acest număr de secunde după pornirea Obsidian înainte de a rula scriptul (se aplică doar dacă 'Rulează la pornire' este activat). Folosește 0 pentru nicio întârziere.",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'Setați automat PYTHONPATH pentru bibliotecă',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Adaugă automat directorul pluginului la PYTHONPATH la rularea scripturilor, permițând importul direct al bibliotecii Python (Recomandat). Dacă este dezactivat, trebuie să copiați ObsidianPluginDevPythonToJS.py în folderul dvs. de scripturi sau să gestionați manual sys.path.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'PYTHONPATH automat dezactivat. Asigurați-vă că ObsidianPluginDevPythonToJS.py se află în folderul dvs. de scripturi sau gestionați manual sys.path.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Calea către Executabilul Python',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Calea absolută către executabilul Python sau uv. Lăsați necompletat pentru detectare automată (uv, py, python3, python). Necesită reîncărcarea sau repornirea pluginului pentru a intra în vigoare complet dacă este modificat.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: 'ex: /usr/bin/python3 sau C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Calea către executabilul Python a fost modificată. Se reîmprospătează scripturile...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Calea Python personalizată este invalidă și nu s-a găsit niciun executabil de rezervă. Este posibil ca scripturile să nu ruleze.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'Calea Python Personalizată a Eșuat',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Calea personalizată a executabilului Python '{path}' este invalidă sau nu a putut fi executată. Se revine la detectarea automată.",
};
