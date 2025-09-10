// --- src/lang/es.ts ---
// Spanish translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Configuración de Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'Carpeta de Scripts de Python',
  SETTINGS_FOLDER_DESC:
    'Ruta a la carpeta que contiene tus scripts de Python (absoluta o relativa a la bóveda).',
  SETTINGS_FOLDER_PLACEHOLDER: '/ruta/a/tus/scripts o ./scripts-python',
  SETTINGS_PORT_TITLE: 'Puerto del Servidor HTTP',
  SETTINGS_PORT_DESC:
    'Puerto para el servidor HTTP local (1024-65535). Requiere reiniciar o guardar la configuración para aplicar.',
  SETTINGS_CACHE_TITLE: 'Desactivar Caché de Python (__pycache__)',
  SETTINGS_CACHE_DESC: 'Ejecuta Python con la opción "-B" para evitar escribir archivos .pyc.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'Puerto HTTP cambiado a',
  NOTICE_PORT_CHANGED_SUFFIX: 'Reiniciando servidor...',
  NOTICE_PYTHON_MISSING_TITLE: 'Error de Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'Ejecutable de Python no encontrado en el PATH.\nPor favor, instale Python y asegúrese de que esté agregado a la variable de entorno PATH de su sistema para que el plugin pueda ejecutar scripts.\nLas características del plugin que requieren Python no estarán disponibles.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Error de Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "La librería Python requerida 'requests' no está instalada para",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\nPor favor, instálala ejecutando:\n{pythonCmd} -m pip install requests\nLas características del plugin que requieren Python no estarán disponibles hasta que se instale.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Puerto HTTP configurado inválido:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Servidor no iniciado. Por favor, configure un puerto válido (1-65535) en los ajustes.',
  NOTICE_PORT_IN_USE_PREFIX: 'El puerto',
  NOTICE_PORT_IN_USE_SUFFIX:
    'ya está en uso. Por favor, elija otro puerto en los ajustes o cierre la otra aplicación que lo esté usando. Servidor no iniciado.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Error al iniciar el servidor en el puerto',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE: 'Puerto inválido. Por favor, ingrese un número entre 0 y 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: Puerto HTTP cambiado (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). El script podría apuntar al puerto antiguo si ya se está ejecutando o se lanzó externamente.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'Script de Python no encontrado o no es un archivo:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Error al acceder al archivo del script:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Ejecutando script de Python:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Error al ejecutar',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'con',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'falló con el código de salida',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Revise los logs de la consola.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'No se pudo encontrar un ejecutable de Python válido. Intentado:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Por favor, asegúrese de que Python esté instalado y accesible a través del PATH de su sistema (o el lanzador 'py' en Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Carpeta de scripts de Python no encontrada o inválida. Por favor, revise la configuración del plugin.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Error al leer la carpeta de scripts:',
  NOTICE_NO_SCRIPTS_FOUND: 'No se encontraron scripts de Python (.py) en la carpeta configurada.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Ejecutando',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'script(s) de Python...',
  NOTICE_INPUT_VALIDATION_FAILED: 'La entrada no coincide con el formato requerido.',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Ejecutar un script de Python específico',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Ejecutar todos los scripts de Python en la carpeta',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Selecciona un script de Python para ejecutar...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Enviar',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Configuración Específica del Script',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Actualizar Configuración de Scripts',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Vuelve a escanear la carpeta de scripts para descubrir o actualizar la configuración definida en tus scripts de Python.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Actualizar Definiciones',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Actualizando...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Carpeta de scripts de Python no configurada. Por favor, establece la ruta arriba.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "No se encontraron scripts con configuraciones definibles en la carpeta configurada, o falló el descubrimiento. Haz clic en 'Actualizar Definiciones' para intentarlo de nuevo.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Configuración para:',
  SETTINGS_LANGUAGE_AUTO: 'Automático (Como Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'No se puede actualizar: Ejecutable de Python no encontrado. Asegúrate de que Python esté instalado y en el PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'Actualizando definiciones de configuración de scripts...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    '¡Definiciones de configuración de scripts actualizadas correctamente!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Error al actualizar las definiciones de configuración de scripts. Revisa los logs.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'No se puede ejecutar el script: Ejecutable de Python no encontrado. Revisa la instalación y el PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'Actualizar definiciones de configuración de scripts de Python',
  SETTINGS_SECURITY_WARNING_TITLE: 'Advertencia de Seguridad',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Ejecutar scripts de Python arbitrarios puede ser arriesgado. Asegúrate de confiar en la fuente de cualquier script que ejecutes, ya que pueden acceder a tu sistema y datos. El autor del plugin y los autores de los scripts no son responsables de ninguna pérdida de datos o problemas de seguridad causados por los scripts que elijas ejecutar. Ejecuta los scripts bajo tu propio riesgo.',
  SETTINGS_LANGUAGE_TITLE: 'Idioma del Plugin',
  SETTINGS_LANGUAGE_DESC:
    "Elige el idioma de visualización para la interfaz del plugin Python Bridge. 'Automático' sigue la configuración de idioma de Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'Consejo de rendimiento: Caché de Backlinks',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Para mejorar el rendimiento al recuperar backlinks (usando la función get_backlinks) en bóvedas grandes, considere instalar el plugin comunitario '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' de @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Ruta de carpeta inválida. Por favor, seleccione una carpeta válida en la configuración.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "La ruta de la carpeta de scripts de Python configurada '{path}' es inválida o no se encuentra. Borrando la configuración.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Script Habilitado',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Permitir que este script se ejecute mediante comandos, atajos o 'Ejecutar Todo'.",
  NOTICE_SCRIPT_DISABLED:
    "El script '{scriptName}' está deshabilitado en la configuración y no se puede ejecutar.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Ejecutar al iniciar',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Ejecutar automáticamente este script cuando Obsidian se inicie (solo si 'Script Habilitado' también está activado).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Retraso de inicio (segundos)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Esperar esta cantidad de segundos después de que Obsidian se inicie antes de ejecutar el script (solo se aplica si 'Ejecutar al iniciar' está activado). Use 0 para no tener retraso.",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'Establecer PYTHONPATH automáticamente para la biblioteca',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Añadir automáticamente el directorio del plugin a PYTHONPATH al ejecutar scripts, permitiendo la importación directa de la biblioteca Python (Recomendado). Si está desactivado, debes copiar ObsidianPluginDevPythonToJS.py a tu carpeta de scripts o gestionar sys.path manualmente.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'PYTHONPATH automático desactivado. Asegúrate de que ObsidianPluginDevPythonToJS.py esté en tu carpeta de scripts o gestiona sys.path manualmente.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Ruta del Ejecutable de Python',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Ruta absoluta a tu ejecutable de Python o uv. Déjalo vacío para la autodetección (uv, py, python3, python). Requiere recargar o reiniciar el plugin para que tenga pleno efecto si se cambia.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: 'ej: /usr/bin/python3 o C:\Python39\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Ruta del ejecutable de Python cambiada. Actualizando scripts...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'La ruta personalizada de Python no es válida y no se encontró ningún ejecutable de respaldo. Es posible que los scripts no se ejecuten.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'Falló la Ruta Personalizada de Python',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "La ruta personalizada del ejecutable de Python '{path}' no es válida o no se pudo ejecutar. Volviendo a la detección automática.",
};
