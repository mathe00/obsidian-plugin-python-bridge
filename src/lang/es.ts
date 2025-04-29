// --- src/lang/es.ts ---
// Spanish translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Configuración de Obsidian Python Bridge",
	SETTINGS_FOLDER_TITLE: "Carpeta de Scripts de Python",
	SETTINGS_FOLDER_DESC:
		"Ruta a la carpeta que contiene tus scripts de Python (absoluta o relativa a la bóveda).",
	SETTINGS_FOLDER_PLACEHOLDER: "/ruta/a/tus/scripts o ./scripts-python",
	SETTINGS_PORT_TITLE: "Puerto del Servidor HTTP",
	SETTINGS_PORT_DESC:
		"Puerto para el servidor HTTP local (1024-65535). Requiere reiniciar o guardar la configuración para aplicar.",
	SETTINGS_CACHE_TITLE: "Desactivar Caché de Python (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Ejecuta Python con la opción "-B" para evitar escribir archivos .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Puerto HTTP cambiado a",
	NOTICE_PORT_CHANGED_SUFFIX: "Reiniciando servidor...",
	NOTICE_PYTHON_MISSING_TITLE: "Error de Python Bridge:",
	NOTICE_PYTHON_MISSING_DESC: "Ejecutable de Python no encontrado en el PATH.\nPor favor, instale Python y asegúrese de que esté agregado a la variable de entorno PATH de su sistema para que el plugin pueda ejecutar scripts.\nLas características del plugin que requieren Python no estarán disponibles.",
	NOTICE_REQUESTS_MISSING_TITLE: "Error de Python Bridge:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "La librería Python requerida 'requests' no está instalada para",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nPor favor, instálala ejecutando:\n{pythonCmd} -m pip install requests\nLas características del plugin que requieren Python no estarán disponibles hasta que se instale.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Puerto HTTP configurado inválido:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Servidor no iniciado. Por favor, configure un puerto válido (1-65535) en los ajustes.",
	NOTICE_PORT_IN_USE_PREFIX: "El puerto",
	NOTICE_PORT_IN_USE_SUFFIX: "ya está en uso. Por favor, elija otro puerto en los ajustes o cierre la otra aplicación que lo esté usando. Servidor no iniciado.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Error al iniciar el servidor en el puerto",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: Puerto HTTP cambiado (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). El script podría apuntar al puerto antiguo si ya se está ejecutando o se lanzó externamente.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Script de Python no encontrado o no es un archivo:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Error al acceder al archivo del script:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Ejecutando script de Python:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Error al ejecutar",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "con",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "falló con el código de salida",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Revise los logs de la consola.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "No se pudo encontrar un ejecutable de Python válido. Intentado:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Por favor, asegúrese de que Python esté instalado y accesible a través del PATH de su sistema (o el lanzador 'py' en Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Carpeta de scripts de Python no encontrada o inválida. Por favor, revise la configuración del plugin.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Error al leer la carpeta de scripts:",
	NOTICE_NO_SCRIPTS_FOUND: "No se encontraron scripts de Python (.py) en la carpeta configurada.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Ejecutando",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "script(s) de Python...",
	NOTICE_INPUT_VALIDATION_FAILED: "La entrada no coincide con el formato requerido.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Ejecutar un script de Python específico",
	CMD_RUN_ALL_SCRIPTS_NAME: "Ejecutar todos los scripts de Python en la carpeta",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "Selecciona un script de Python para ejecutar...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Enviar",
};
