// --- src/lang/fr.ts ---
// French translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Obsidian Python Bridge Réglages",
	SETTINGS_FOLDER_TITLE: "Dossier des Scripts Python",
	SETTINGS_FOLDER_DESC:
		"Chemin vers le dossier contenant vos scripts Python (absolu ou relatif au coffre).",
	SETTINGS_FOLDER_PLACEHOLDER: "/chemin/vers/vos/scripts ou ./scripts-python",
	SETTINGS_PORT_TITLE: "Port du Serveur HTTP",
	SETTINGS_PORT_DESC:
		"Port pour le serveur HTTP local (1024-65535). Nécessite un redémarrage ou une sauvegarde des réglages pour appliquer.",
	SETTINGS_CACHE_TITLE: "Désactiver le Cache Python (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Exécute Python avec l\'option "-B" pour empêcher l\'écriture des fichiers .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Port HTTP changé vers",
	NOTICE_PORT_CHANGED_SUFFIX: "Redémarrage du serveur...",
	NOTICE_PYTHON_MISSING_TITLE: "Erreur Python Bridge :",
	NOTICE_PYTHON_MISSING_DESC: "Exécutable Python introuvable dans le PATH.\nVeuillez installer Python et vous assurer qu'il est ajouté à la variable d'environnement PATH de votre système pour que le plugin puisse exécuter des scripts.\nLes fonctionnalités du plugin nécessitant Python seront indisponibles.",
	NOTICE_REQUESTS_MISSING_TITLE: "Erreur Python Bridge :",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "La librairie Python requise 'requests' n'est pas installée pour",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nVeuillez l'installer en exécutant :\n{pythonCmd} -m pip install requests\nLes fonctionnalités du plugin nécessitant Python seront indisponibles jusqu'à son installation.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Port HTTP configuré invalide :",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Serveur non démarré. Veuillez configurer un port valide (1-65535) dans les réglages.",
	NOTICE_PORT_IN_USE_PREFIX: "Le port",
	NOTICE_PORT_IN_USE_SUFFIX: "est déjà utilisé. Veuillez choisir un autre port dans les réglages ou fermer l'autre application l'utilisant. Serveur non démarré.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Échec du démarrage du serveur sur le port",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge : Port HTTP changé (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Le script pourrait cibler l'ancien port s'il est déjà en cours d'exécution ou lancé extérieurement.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Script Python introuvable ou n'est pas un fichier :",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Erreur d'accès au fichier de script :",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Exécution du script Python :",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Erreur lors de l'exécution de",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "avec",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "a échoué avec le code de sortie",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Vérifiez les logs de la console.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Impossible de trouver un exécutable Python valide. Essai :",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Veuillez vous assurer que Python est installé et accessible via le PATH de votre système (ou le lanceur 'py' sous Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Dossier des scripts Python introuvable ou invalide. Veuillez vérifier les réglages du plugin.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Erreur de lecture du dossier des scripts :",
	NOTICE_NO_SCRIPTS_FOUND: "Aucun script Python (.py) trouvé dans le dossier configuré.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Exécution de",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "script(s) Python...",
	NOTICE_INPUT_VALIDATION_FAILED: "L'entrée ne correspond pas au format requis.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Exécuter un script Python spécifique",
	CMD_RUN_ALL_SCRIPTS_NAME: "Exécuter tous les scripts Python du dossier",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "Sélectionnez un script Python à exécuter...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Valider",
};
