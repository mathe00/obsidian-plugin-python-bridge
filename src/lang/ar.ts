// --- src/lang/ar.ts ---
// Arabic translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "إعدادات جسر Obsidian Python",
	SETTINGS_FOLDER_TITLE: "مجلد سكربتات بايثون",
	SETTINGS_FOLDER_DESC:
		"مسار المجلد الذي يحتوي على سكربتات بايثون الخاصة بك (مطلق أو نسبي للمخزن).",
	SETTINGS_FOLDER_PLACEHOLDER: "/مسار/إلى/السكربتات أو ./scripts-python",
	SETTINGS_PORT_TITLE: "منفذ خادم HTTP",
	SETTINGS_PORT_DESC:
		"المنفذ لخادم HTTP المحلي (1024-65535). يتطلب إعادة التشغيل أو حفظ الإعدادات للتطبيق.",
	SETTINGS_CACHE_TITLE: "تعطيل ذاكرة التخزين المؤقت لبايثون (__pycache__)",
	SETTINGS_CACHE_DESC:
		'تشغيل بايثون باستخدام العلامة "-B" لمنع كتابة ملفات .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "جسر بايثون",
	NOTICE_PORT_CHANGED_PREFIX: "تم تغيير منفذ HTTP إلى",
	NOTICE_PORT_CHANGED_SUFFIX: "جارٍ إعادة تشغيل الخادم...",
	NOTICE_PYTHON_MISSING_TITLE: "خطأ في جسر بايثون:",
	NOTICE_PYTHON_MISSING_DESC: "لم يتم العثور على ملف بايثون التنفيذي في PATH.\nيرجى تثبيت بايثون والتأكد من إضافته إلى متغير بيئة PATH في نظامك حتى يتمكن الملحق من تشغيل السكربتات.\nميزات الملحق التي تتطلب بايثون لن تكون متاحة.",
	NOTICE_REQUESTS_MISSING_TITLE: "خطأ في جسر بايثون:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "مكتبة بايثون المطلوبة 'requests' غير مثبتة لـ",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nيرجى تثبيتها عن طريق تشغيل:\n{pythonCmd} -m pip install requests\nميزات الملحق التي تتطلب بايثون لن تكون متاحة حتى يتم تثبيتها.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "منفذ HTTP الذي تم تكوينه غير صالح:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "لم يتم بدء الخادم. يرجى تكوين منفذ صالح (1-65535) في الإعدادات.",
	NOTICE_PORT_IN_USE_PREFIX: "المنفذ",
	NOTICE_PORT_IN_USE_SUFFIX: "مستخدم بالفعل. يرجى اختيار منفذ آخر في الإعدادات أو إغلاق التطبيق الآخر الذي يستخدمه. لم يتم بدء الخادم.",
	NOTICE_SERVER_START_FAILED_PREFIX: "فشل بدء الخادم على المنفذ",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ جسر بايثون: تم تغيير منفذ HTTP (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). قد يستهدف السكربت المنفذ القديم إذا كان قيد التشغيل بالفعل أو تم تشغيله خارجيًا.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "لم يتم العثور على سكربت بايثون أو أنه ليس ملفًا:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "خطأ في الوصول إلى ملف السكربت:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "جارٍ تشغيل سكربت بايثون:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "خطأ أثناء تشغيل",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "بواسطة",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "فشل مع رمز الخروج",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "تحقق من سجلات وحدة التحكم.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "تعذر العثور على ملف بايثون تنفيذي صالح. تم المحاولة:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "يرجى التأكد من تثبيت بايثون وإمكانية الوصول إليه عبر PATH الخاص بنظامك (أو مشغل 'py' على Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "لم يتم العثور على مجلد سكربتات بايثون أو أنه غير صالح. يرجى التحقق من إعدادات الملحق.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "خطأ في قراءة مجلد السكربتات:",
	NOTICE_NO_SCRIPTS_FOUND: "لم يتم العثور على سكربتات بايثون (.py) في المجلد الذي تم تكوينه.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "جارٍ تشغيل",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "سكربت(ات) بايثون...",
	NOTICE_INPUT_VALIDATION_FAILED: "الإدخال لا يتطابق مع التنسيق المطلوب.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "تشغيل سكربت بايثون معين",
	CMD_RUN_ALL_SCRIPTS_NAME: "تشغيل جميع سكربتات بايثون في المجلد",

	// UserInputModal
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "اختر سكربت بايثون لتشغيله...",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "إرسال",
};
