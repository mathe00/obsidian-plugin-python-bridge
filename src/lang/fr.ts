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
	// SETTINGS_AUTO_PYTHONPATH_NAME: "Définir PYTHONPATH pour la Librairie", // <-- REMOVED FROM HERE
	// SETTINGS_AUTO_PYTHONPATH_DESC: "...", // <-- REMOVED FROM HERE

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
	NOTICE_INVALID_PORT_RANGE: "Port invalide. Veuillez entrer un nombre entre 0 et 65535.",
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
	SETTINGS_SCRIPT_SETTINGS_TITLE: "Paramètres Spécifiques aux Scripts",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: "Rafraîchir les Paramètres des Scripts",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC: "Réanalyser le dossier des scripts pour découvrir ou mettre à jour les paramètres définis dans vos scripts Python.",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: "Rafraîchir les Définitions",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: "Rafraîchissement...",
	SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED: "Dossier des scripts Python non configuré. Veuillez définir le chemin ci-dessus.",
	SETTINGS_NO_SCRIPT_SETTINGS_FOUND: "Aucun script avec des paramètres définissables trouvé dans le dossier configuré, ou la découverte a échoué. Cliquez sur 'Rafraîchir les Définitions' pour réessayer.",
	SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: "Paramètres pour :",
	SETTINGS_LANGUAGE_AUTO: "Automatique (Comme Obsidian)",
	NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH: "Impossible de rafraîchir : Exécutable Python introuvable. Assurez-vous que Python est installé et dans le PATH.",
	NOTICE_REFRESHING_SCRIPT_SETTINGS: "Rafraîchissement des définitions de paramètres des scripts...",
	NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: "Définitions des paramètres des scripts rafraîchies avec succès !",
	NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED: "Échec du rafraîchissement des définitions de paramètres des scripts. Vérifiez les logs.",
	NOTICE_PYTHON_EXEC_MISSING_FOR_RUN: "Impossible d'exécuter le script : Exécutable Python introuvable. Vérifiez l'installation et le PATH.",
	CMD_REFRESH_SCRIPT_SETTINGS_NAME: "Rafraîchir les définitions des paramètres des scripts Python",
	SETTINGS_SECURITY_WARNING_TITLE: "Avertissement de Sécurité",
	SETTINGS_SECURITY_WARNING_TEXT: "L'exécution de scripts Python arbitraires peut être risquée. Assurez-vous de faire confiance à la source de tout script que vous exécutez, car ils peuvent accéder à votre système et à vos données. L'auteur du plugin et les auteurs des scripts ne sont pas responsables des pertes de données ou des problèmes de sécurité causés par les scripts que vous choisissez d'exécuter. Exécutez les scripts à vos propres risques.",
	SETTINGS_LANGUAGE_TITLE: "Langue du Plugin",
	SETTINGS_LANGUAGE_DESC: "Choisissez la langue d'affichage pour l'interface du plugin Python Bridge. 'Automatique' suit le réglage de langue d'Obsidian.",
	SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: "Conseil Performance : Cache de Backlinks",
	SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC: "Pour des performances améliorées lors de la récupération des backlinks (via la fonction get_backlinks) dans les grands coffres, envisagez d'installer l'extension communautaire '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' de @mnaoumov.",
	NOTICE_INVALID_FOLDER_PATH: "Chemin de dossier invalide. Veuillez sélectionner un dossier valide dans les réglages.",
	NOTICE_INVALID_STARTUP_FOLDER_PATH: "Le chemin configuré pour le dossier des scripts Python '{path}' est invalide ou introuvable. Effacement du réglage.",

	SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: "Script Activé",
	SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC: "Permet l'exécution de ce script via les commandes, les raccourcis ou 'Exécuter Tout'.",
	SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: "Exécuter au Démarrage",
	SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC: "Exécute automatiquement ce script au démarrage d'Obsidian (seulement si 'Script Activé' est aussi coché).",
	SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: "Délai au Démarrage (secondes)",
	SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC: "Attendre ce nombre de secondes après le démarrage d'Obsidian avant d'exécuter le script (s'applique seulement si 'Exécuter au Démarrage' est coché). Utilisez 0 pour aucun délai.",
	NOTICE_SCRIPT_DISABLED: "Le script '{scriptName}' est désactivé dans les paramètres et ne peut pas être exécuté.",

	// --- ADDED KEYS AT THE END ---
	SETTINGS_AUTO_PYTHONPATH_NAME: "Définir PYTHONPATH pour la Librairie",
	SETTINGS_AUTO_PYTHONPATH_DESC: "Ajouter automatiquement le dossier du plugin à PYTHONPATH lors de l'exécution des scripts, permettant l'import direct de la librairie Python (Recommandé). Si désactivé, vous devez copier ObsidianPluginDevPythonToJS.py dans votre dossier de scripts ou gérer sys.path manuellement.",
	NOTICE_AUTO_PYTHONPATH_DISABLED_DESC: "PYTHONPATH automatique désactivé. Assurez-vous que ObsidianPluginDevPythonToJS.py est dans votre dossier de scripts ou gérez sys.path manuellement.",

};
