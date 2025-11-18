// nl.ts - nl translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge Instellingen',
  SETTINGS_FOLDER_TITLE: 'Python Scripts Map',
  SETTINGS_FOLDER_DESC:
    'Pad naar de map met uw Python-scripts (absoluut of relatief ten opzichte van de vault).',
  SETTINGS_FOLDER_PLACEHOLDER: '/pad/naar/uw/scripts of ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP Server Poort',
  SETTINGS_PORT_DESC:
    'Poort voor de lokale HTTP-server (1024-65535). Vereist herstarten of opslaan van instellingen om toe te passen.',
  SETTINGS_CACHE_TITLE: 'Python Cache uitschakelen (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Voer Python uit met de "-B" vlag om het schrijven van .pyc-bestanden te voorkomen.',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP-poort gewijzigd naar',
  NOTICE_PORT_CHANGED_SUFFIX: 'Server opnieuw opstarten...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python Bridge Fout:',
  NOTICE_PYTHON_MISSING_DESC:
    'Python uitvoerbaar bestand niet gevonden in PATH.\\nInstalleer Python en zorg ervoor dat het is toegevoegd aan de PATH-omgevingsvariabele van uw systeem zodat de plugin scripts kan uitvoeren.\\nPlugin-functies die Python vereisen, zijn niet beschikbaar.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Python Bridge Fout:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "De vereiste Python-bibliotheek 'requests' is niet geïnstalleerd voor",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\\nInstalleer deze door uit te voeren:\\n{pythonCmd} -m pip install requests\\nPlugin-functies die Python vereisen, zijn niet beschikbaar totdat deze is geïnstalleerd.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Ongeldige HTTP-poort geconfigureerd:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Server niet gestart. Configureer een geldige poort (1-65535) in de instellingen.',
  NOTICE_PORT_IN_USE_PREFIX: 'Poort',
  NOTICE_PORT_IN_USE_SUFFIX:
    'is al in gebruik. Kies een andere poort in de instellingen of sluit de andere toepassing die deze gebruikt. Server niet gestart.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Kon server niet starten op poort',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE:
    'Ongeldige poort. Voer een getal in tussen 0 en 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX:
    '⚠️ Python Bridge: HTTP-poort gewijzigd (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Script richt zich mogelijk op de oude poort als het al actief is of extern is gestart.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'Python-script niet gevonden of is geen bestand:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Fout bij toegang tot scriptbestand:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Python-script uitvoeren:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Fout bij uitvoeren',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'met',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'mislukt met exitcode',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Controleer console logs.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Kon geen geldig Python uitvoerbaar bestand vinden. Geprobeerd:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Zorg ervoor dat Python is geïnstalleerd en toegankelijk is via de PATH van uw systeem (of de 'py'-launcher op Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Python scripts map niet gevonden of ongeldig. Controleer de plugin-instellingen.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Fout bij lezen van scripts map:',
  NOTICE_NO_SCRIPTS_FOUND:
    'Geen Python-scripts (.py) gevonden in de geconfigureerde map.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Uitvoeren',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'Python-script(s)...',
  NOTICE_INPUT_VALIDATION_FAILED:
    'Invoer komt niet overeen met het vereiste formaat.',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Een specifiek Python-script uitvoeren',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Alle Python-scripts in map uitvoeren',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Verzenden',
  MODAL_SELECT_SCRIPT_PLACEHOLDER:
    'Selecteer een Python-script om uit te voeren...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Script-specifieke Instellingen',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Scriptinstellingen Vernieuwen',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Scan de scripts map opnieuw om instellingen te ontdekken of bij te werken die in uw Python-scripts zijn gedefinieerd.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Definities Vernieuwen',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Vernieuwen...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Python scripts map is niet geconfigureerd. Stel het pad hierboven in.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "Geen scripts met definieerbare instellingen gevonden in de geconfigureerde map, of het ontdekken van instellingen is mislukt. Klik op 'Definities Vernieuwen' om opnieuw te proberen.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Instellingen voor:',
  SETTINGS_LANGUAGE_AUTO: 'Automatisch (Match Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Kan instellingen niet vernieuwen: Python uitvoerbaar bestand niet gevonden. Zorg ervoor dat Python is geïnstalleerd en in PATH staat.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS:
    'Scriptinstellingsdefinities vernieuwen...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Scriptinstellingsdefinities succesvol vernieuwd!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Kon scriptinstellingsdefinities niet vernieuwen. Controleer logs voor details.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Kan script niet uitvoeren: Python uitvoerbaar bestand niet gevonden. Controleer installatie en PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME:
    'Python scriptinstellingsdefinities vernieuwen',
  SETTINGS_SECURITY_WARNING_TITLE: 'Veiligheidswaarschuwing',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Het uitvoeren van willekeurige Python-scripts kan riskant zijn. Zorg ervoor dat u de bron vertrouwt van elk script dat u uitvoert, aangezien deze toegang kunnen krijgen tot uw systeem en gegevens. De auteur van de plugin en de auteurs van de scripts zijn niet verantwoordelijk voor gegevensverlies of beveiligingsproblemen veroorzaakt door scripts die u kiest uit te voeren. Voer scripts uit op eigen risico.',
  SETTINGS_LANGUAGE_TITLE: 'Plugin Taal',
  SETTINGS_LANGUAGE_DESC:
    "Kies de weergavetaal voor de Python Bridge plugin interface. 'Automatisch' volgt de taalinstelling van Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'Prestatietip: Backlink Cache',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Voor betere prestaties bij het ophalen van backlinks (met de functie get_backlinks) in grote kluizen, overweeg de community-plug-in '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' van @mnaoumov te installeren.",
  NOTICE_INVALID_FOLDER_PATH:
    'Ongeldig mappad. Selecteer een geldige map in de instellingen.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Geconfigureerd mappad voor Python-scripts '{path}' is ongeldig of niet gevonden. Instelling wissen.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Script Ingeschakeld',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Sta toe dat dit script wordt uitgevoerd via commando's, sneltoetsen of 'Alles Uitvoeren'.",
  NOTICE_SCRIPT_DISABLED:
    "Script '{scriptName}' is uitgeschakeld in de instellingen en kan niet worden uitgevoerd.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Uitvoeren bij opstarten',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Voer dit script automatisch uit wanneer Obsidian start (alleen als 'Script ingeschakeld' ook aan staat).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Opstartvertraging (seconden)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Wacht dit aantal seconden nadat Obsidian is gestart voordat het script wordt uitgevoerd (alleen van toepassing als 'Uitvoeren bij opstarten' is ingeschakeld). Gebruik 0 voor geen vertraging.",

  SETTINGS_AUTO_PYTHONPATH_NAME:
    'PYTHONPATH automatisch instellen voor bibliotheek',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Voegt automatisch de plug-inmap toe aan PYTHONPATH bij het uitvoeren van scripts, waardoor directe import van de Python-bibliotheek mogelijk is (Aanbevolen). Indien uitgeschakeld, moet u ObsidianPluginDevPythonToJS.py naar uw scriptmap kopiëren of sys.path handmatig beheren.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'Automatische PYTHONPATH uitgeschakeld. Zorg ervoor dat ObsidianPluginDevPythonToJS.py zich in uw scriptmap bevindt of beheer sys.path handmatig.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Pad naar Python Uitvoerbaar Bestand',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Absoluut pad naar uw Python- of uv-uitvoerbaar bestand. Laat leeg voor automatische detectie (uv, py, python3, python). Vereist herladen of opnieuw opstarten van de plug-in om volledig effect te hebben als dit wordt gewijzigd.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'bijv. /usr/bin/python3 of C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Pad naar Python uitvoerbaar bestand gewijzigd. Scripts vernieuwen...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Aangepast Python-pad is ongeldig en er is geen fallback uitvoerbaar bestand gevonden. Scripts werken mogelijk niet.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'Aangepast Python-pad Mislukt',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Aangepast pad naar Python uitvoerbaar bestand '{path}' is ongeldig of kon niet worden uitgevoerd. Terugvallen op automatische detectie.",
};
