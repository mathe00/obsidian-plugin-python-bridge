// --- src/lang/de.ts ---
// German translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge Einstellungen",
	SETTINGS_FOLDER_TITLE: "Python-Skript-Ordner",
	SETTINGS_FOLDER_DESC:
		"Pfad zum Ordner, der Ihre Python-Skripte enthält (absolut oder relativ zum Vault).",
	SETTINGS_FOLDER_PLACEHOLDER: "/pfad/zu/ihren/skripten oder ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP-Server-Port",
	SETTINGS_PORT_DESC:
		"Port für den lokalen HTTP-Server (1024-65535). Erfordert Neustart oder Speichern der Einstellungen zum Anwenden.",
	SETTINGS_CACHE_TITLE: "Python-Cache deaktivieren (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Führt Python mit der Option "-B" aus, um das Schreiben von .pyc-Dateien zu verhindern.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "HTTP-Port geändert zu",
	NOTICE_PORT_CHANGED_SUFFIX: "Server wird neu gestartet...",
	NOTICE_PYTHON_MISSING_TITLE: "Python Bridge Fehler:",
	NOTICE_PYTHON_MISSING_DESC: "Python-Ausführungsdatei nicht im PATH gefunden.\nBitte installieren Sie Python und stellen Sie sicher, dass es zur PATH-Umgebungsvariable Ihres Systems hinzugefügt wird, damit das Plugin Skripte ausführen kann.\nPlugin-Funktionen, die Python erfordern, sind nicht verfügbar.",
	NOTICE_REQUESTS_MISSING_TITLE: "Python Bridge Fehler:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "Die erforderliche Python-Bibliothek 'requests' ist nicht installiert für",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nBitte installieren Sie sie durch Ausführen von:\n{pythonCmd} -m pip install requests\nPlugin-Funktionen, die Python erfordern, sind bis zur Installation nicht verfügbar.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Ungültiger HTTP-Port konfiguriert:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Server nicht gestartet. Bitte konfigurieren Sie einen gültigen Port (1-65535) in den Einstellungen.",
	NOTICE_PORT_IN_USE_PREFIX: "Port",
	NOTICE_PORT_IN_USE_SUFFIX: "wird bereits verwendet. Bitte wählen Sie einen anderen Port in den Einstellungen oder schließen Sie die andere Anwendung, die ihn verwendet. Server nicht gestartet.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Fehler beim Starten des Servers auf Port",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: HTTP-Port geändert (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Das Skript zielt möglicherweise auf den alten Port, wenn es bereits ausgeführt wird oder extern gestartet wurde.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Python-Skript nicht gefunden oder ist keine Datei:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Fehler beim Zugriff auf die Skriptdatei:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Führe Python-Skript aus:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Fehler beim Ausführen von",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "mit",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "fehlgeschlagen mit Exit-Code",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Überprüfen Sie die Konsolenprotokolle.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Keine gültige Python-Ausführungsdatei gefunden. Versucht:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Bitte stellen Sie sicher, dass Python installiert und über den PATH Ihres Systems (oder den 'py'-Launcher unter Windows) zugänglich ist.",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Python-Skript-Ordner nicht gefunden oder ungültig. Bitte überprüfen Sie die Plugin-Einstellungen.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Fehler beim Lesen des Skript-Ordners:",
	NOTICE_NO_SCRIPTS_FOUND: "Keine Python-Skripte (.py) im konfigurierten Ordner gefunden.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Führe",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "Python-Skript(e) aus...",
	NOTICE_INPUT_VALIDATION_FAILED: "Die Eingabe entspricht nicht dem erforderlichen Format.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Ein bestimmtes Python-Skript ausführen",
	CMD_RUN_ALL_SCRIPTS_NAME: "Alle Python-Skripte im Ordner ausführen",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "Wählen Sie ein Python-Skript zum Ausführen aus...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Senden",
	SETTINGS_SCRIPT_SETTINGS_TITLE: "Skriptspezifische Einstellungen",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: "Skripteinstellungen aktualisieren",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC: "Scannen Sie den Skriptordner erneut, um in Ihren Python-Skripten definierte Einstellungen zu entdecken oder zu aktualisieren.",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: "Definitionen aktualisieren",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: "Aktualisiere...",
	SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED: "Python-Skriptordner ist nicht konfiguriert. Bitte geben Sie oben den Pfad an.",
	SETTINGS_NO_SCRIPT_SETTINGS_FOUND: "Keine Skripte mit definierbaren Einstellungen im konfigurierten Ordner gefunden oder die Erkennung ist fehlgeschlagen. Klicken Sie auf 'Definitionen aktualisieren', um es erneut zu versuchen.",
	SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: "Einstellungen für:",
	SETTINGS_LANGUAGE_AUTO: "Automatisch (Wie Obsidian)",
	NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH: "Aktualisierung nicht möglich: Python-Ausführungsdatei nicht gefunden. Stellen Sie sicher, dass Python installiert und im PATH ist.",
	NOTICE_REFRESHING_SCRIPT_SETTINGS: "Aktualisiere Skripteinstellungsdefinitionen...",
	NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: "Skripteinstellungsdefinitionen erfolgreich aktualisiert!",
	NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED: "Fehler beim Aktualisieren der Skripteinstellungsdefinitionen. Überprüfen Sie die Protokolle.",
	NOTICE_PYTHON_EXEC_MISSING_FOR_RUN: "Skript kann nicht ausgeführt werden: Python-Ausführungsdatei nicht gefunden. Überprüfen Sie die Installation und den PATH.",
	CMD_REFRESH_SCRIPT_SETTINGS_NAME: "Python-Skripteinstellungsdefinitionen aktualisieren",
};
