// --- src/lang/ru.ts ---
// Russian translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Настройки Obsidian Python Bridge",
	SETTINGS_FOLDER_TITLE: "Папка со скриптами Python",
	SETTINGS_FOLDER_DESC:
		"Путь к папке, содержащей ваши скрипты Python (абсолютный или относительный к хранилищу).",
	SETTINGS_FOLDER_PLACEHOLDER: "/путь/к/вашим/скриптам или ./scripts-python",
	SETTINGS_PORT_TITLE: "Порт HTTP-сервера",
	SETTINGS_PORT_DESC:
		"Порт для локального HTTP-сервера (1024-65535). Требуется перезапуск или сохранение настроек для применения.",
	SETTINGS_CACHE_TITLE: "Отключить кэш Python (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Запускает Python с флагом "-B", чтобы предотвратить запись файлов .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Порт HTTP изменен на",
	NOTICE_PORT_CHANGED_SUFFIX: "Перезапуск сервера...",
	NOTICE_PYTHON_MISSING_TITLE: "Ошибка Python Bridge:",
	NOTICE_PYTHON_MISSING_DESC: "Исполняемый файл Python не найден в PATH.\nПожалуйста, установите Python и убедитесь, что он добавлен в переменную среды PATH вашей системы, чтобы плагин мог запускать скрипты.\nФункции плагина, требующие Python, будут недоступны.",
	NOTICE_REQUESTS_MISSING_TITLE: "Ошибка Python Bridge:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "Требуемая библиотека Python 'requests' не установлена для",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nПожалуйста, установите ее, выполнив:\n{pythonCmd} -m pip install requests\nФункции плагина, требующие Python, будут недоступны до ее установки.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Неверный порт HTTP:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Сервер не запущен. Пожалуйста, настройте действительный порт (1-65535) в настройках.",
	NOTICE_PORT_IN_USE_PREFIX: "Порт",
	NOTICE_PORT_IN_USE_SUFFIX: "уже используется. Пожалуйста, выберите другой порт в настройках или закройте другое приложение, использующее его. Сервер не запущен.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Не удалось запустить сервер на порту",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: Порт HTTP изменен (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Скрипт может использовать старый порт, если он уже запущен или запущен извне.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Скрипт Python не найден или не является файлом:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Ошибка доступа к файлу скрипта:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Запуск скрипта Python:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Ошибка при запуске",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "с помощью",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "завершился с кодом ошибки",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Проверьте логи консоли.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Не удалось найти действительный исполняемый файл Python. Попытки:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Пожалуйста, убедитесь, что Python установлен и доступен через PATH вашей системы (или через 'py' в Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Папка скриптов Python не найдена или недействительна. Пожалуйста, проверьте настройки плагина.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Ошибка чтения папки скриптов:",
	NOTICE_NO_SCRIPTS_FOUND: "В настроенной папке не найдено скриптов Python (.py).",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Запуск",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "скрипт(ов) Python...",
	NOTICE_INPUT_VALIDATION_FAILED: "Ввод не соответствует требуемому формату.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Запустить определенный скрипт Python",
	CMD_RUN_ALL_SCRIPTS_NAME: "Запустить все скрипты Python в папке",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Отправить",
};
