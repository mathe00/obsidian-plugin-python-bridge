// --- src/lang/ar.ts ---
// Arabic translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'إعدادات جسر Obsidian Python',
  SETTINGS_FOLDER_TITLE: 'مجلد سكربتات بايثون',
  SETTINGS_FOLDER_DESC:
    'مسار المجلد الذي يحتوي على سكربتات بايثون الخاصة بك (مطلق أو نسبي للمخزن).',
  SETTINGS_FOLDER_PLACEHOLDER: '/مسار/إلى/السكربتات أو ./scripts-python',
  SETTINGS_PORT_TITLE: 'منفذ خادم HTTP',
  SETTINGS_PORT_DESC:
    'المنفذ لخادم HTTP المحلي (1024-65535). يتطلب إعادة التشغيل أو حفظ الإعدادات للتطبيق.',
  SETTINGS_CACHE_TITLE: 'تعطيل ذاكرة التخزين المؤقت لبايثون (__pycache__)',
  SETTINGS_CACHE_DESC:
    'تشغيل بايثون باستخدام العلامة "-B" لمنع كتابة ملفات .pyc.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'جسر بايثون',
  NOTICE_PORT_CHANGED_PREFIX: 'تم تغيير منفذ HTTP إلى',
  NOTICE_PORT_CHANGED_SUFFIX: 'جارٍ إعادة تشغيل الخادم...',
  NOTICE_PYTHON_MISSING_TITLE: 'خطأ في جسر بايثون:',
  NOTICE_PYTHON_MISSING_DESC:
    'لم يتم العثور على ملف بايثون التنفيذي في PATH.\nيرجى تثبيت بايثون والتأكد من إضافته إلى متغير بيئة PATH في نظامك حتى يتمكن الملحق من تشغيل السكربتات.\nميزات الملحق التي تتطلب بايثون لن تكون متاحة.',
  NOTICE_REQUESTS_MISSING_TITLE: 'خطأ في جسر بايثون:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "مكتبة بايثون المطلوبة 'requests' غير مثبتة لـ",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\nيرجى تثبيتها عن طريق تشغيل:\n{pythonCmd} -m pip install requests\nميزات الملحق التي تتطلب بايثون لن تكون متاحة حتى يتم تثبيتها.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'منفذ HTTP الذي تم تكوينه غير صالح:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'لم يتم بدء الخادم. يرجى تكوين منفذ صالح (1-65535) في الإعدادات.',
  NOTICE_PORT_IN_USE_PREFIX: 'المنفذ',
  NOTICE_PORT_IN_USE_SUFFIX:
    'مستخدم بالفعل. يرجى اختيار منفذ آخر في الإعدادات أو إغلاق التطبيق الآخر الذي يستخدمه. لم يتم بدء الخادم.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'فشل بدء الخادم على المنفذ',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE: 'منفذ غير صالح. يرجى إدخال رقم بين 0 و 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ جسر بايثون: تم تغيير منفذ HTTP (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). قد يستهدف السكربت المنفذ القديم إذا كان قيد التشغيل بالفعل أو تم تشغيله خارجيًا.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'لم يتم العثور على سكربت بايثون أو أنه ليس ملفًا:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'خطأ في الوصول إلى ملف السكربت:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'جارٍ تشغيل سكربت بايثون:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'خطأ أثناء تشغيل',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'بواسطة',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'فشل مع رمز الخروج',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'تحقق من سجلات وحدة التحكم.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'تعذر العثور على ملف بايثون تنفيذي صالح. تم المحاولة:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "يرجى التأكد من تثبيت بايثون وإمكانية الوصول إليه عبر PATH الخاص بنظامك (أو مشغل 'py' على Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'لم يتم العثور على مجلد سكربتات بايثون أو أنه غير صالح. يرجى التحقق من إعدادات الملحق.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'خطأ في قراءة مجلد السكربتات:',
  NOTICE_NO_SCRIPTS_FOUND:
    'لم يتم العثور على سكربتات بايثون (.py) في المجلد الذي تم تكوينه.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'جارٍ تشغيل',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'سكربت(ات) بايثون...',
  NOTICE_INPUT_VALIDATION_FAILED: 'الإدخال لا يتطابق مع التنسيق المطلوب.',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'تشغيل سكربت بايثون معين',
  CMD_RUN_ALL_SCRIPTS_NAME: 'تشغيل جميع سكربتات بايثون في المجلد',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'اختر سكربت بايثون لتشغيله...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'إرسال',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'إعدادات خاصة بالسكريبت',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'تحديث إعدادات السكريبت',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'أعد مسح مجلد السكريبتات لاكتشاف أو تحديث الإعدادات المعرفة داخل سكريبتات بايثون الخاصة بك.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'تحديث التعريفات',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'جارٍ التحديث...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'لم يتم تكوين مجلد سكريبتات بايثون. يرجى تعيين المسار أعلاه.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "لم يتم العثور على سكريبتات ذات إعدادات قابلة للتعريف في المجلد المكون، أو فشل اكتشاف الإعدادات. انقر فوق 'تحديث التعريفات' للمحاولة مرة أخرى.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'إعدادات لـ:',
  SETTINGS_LANGUAGE_AUTO: 'تلقائي (مثل Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'لا يمكن تحديث الإعدادات: لم يتم العثور على ملف بايثون التنفيذي. يرجى التأكد من تثبيت بايثون وإضافته إلى PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'جارٍ تحديث تعريفات إعدادات السكريبت...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'تم تحديث تعريفات إعدادات السكريبت بنجاح!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'فشل تحديث تعريفات إعدادات السكريبت. تحقق من السجلات للحصول على التفاصيل.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'لا يمكن تشغيل السكريبت: لم يتم العثور على ملف بايثون التنفيذي. يرجى التحقق من التثبيت و PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'تحديث تعريفات إعدادات سكريبت بايثون',
  SETTINGS_SECURITY_WARNING_TITLE: 'تحذير أمني',
  SETTINGS_SECURITY_WARNING_TEXT:
    'قد يكون تشغيل سكربتات بايثون العشوائية محفوفًا بالمخاطر. تأكد من أنك تثق في مصدر أي سكربت تقوم بتشغيله، حيث يمكنه الوصول إلى نظامك وبياناتك. لا يتحمل مؤلف الإضافة ومؤلفو السكربتات المسؤولية عن أي فقدان للبيانات أو مشكلات أمنية ناتجة عن السكربتات التي تختار تشغيلها. قم بتشغيل السكربتات على مسؤوليتك الخاصة.',
  SETTINGS_LANGUAGE_TITLE: 'لغة الإضافة',
  SETTINGS_LANGUAGE_DESC:
    "اختر لغة العرض لواجهة إضافة Python Bridge. 'تلقائي' يتبع إعداد لغة Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE:
    'نصيحة أداء: ذاكرة التخزين المؤقت للروابط الخلفية',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "لتحسين الأداء عند استرداد الروابط الخلفية (باستخدام وظيفة get_backlinks) في الخزائن الكبيرة، ضع في اعتبارك تثبيت المكون الإضافي المجتمعي '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' بواسطة @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'مسار المجلد غير صالح. يرجى تحديد مجلد صالح في الإعدادات.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "مسار مجلد سكربتات بايثون المكون '{path}' غير صالح أو غير موجود. جارٍ مسح الإعداد.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'تمكين البرنامج النصي',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    'السماح بتنفيذ هذا البرنامج النصي عبر الأوامر أو الاختصارات أو "تشغيل الكل".',
  NOTICE_SCRIPT_DISABLED:
    "البرنامج النصي '{scriptName}' معطل في الإعدادات ولا يمكن تنفيذه.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'تشغيل عند البدء',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "تشغيل هذا السكربت تلقائيًا عند بدء تشغيل Obsidian (فقط إذا كان 'تمكين السكربت' قيد التشغيل أيضًا).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'تأخير البدء (ثواني)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "انتظر هذا العدد من الثواني بعد بدء تشغيل Obsidian قبل تشغيل السكربت (ينطبق فقط إذا كان 'تشغيل عند البدء' قيد التشغيل). استخدم 0 لعدم وجود تأخير.",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'تعيين PYTHONPATH تلقائيًا للمكتبة',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'إضافة دليل المكون الإضافي تلقائيًا إلى PYTHONPATH عند تشغيل البرامج النصية، مما يسمح بالاستيراد المباشر لمكتبة Python (موصى به). إذا تم تعطيله، يجب عليك نسخ ObsidianPluginDevPythonToJS.py إلى مجلد البرامج النصية الخاص بك أو إدارة sys.path يدويًا.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'تم تعطيل PYTHONPATH التلقائي. تأكد من وجود ObsidianPluginDevPythonToJS.py في مجلد البرامج النصية الخاص بك أو قم بإدارة sys.path يدويًا.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'مسار ملف Python التنفيذي',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'المسار المطلق لملف Python أو uv التنفيذي الخاص بك. اتركه فارغًا للكشف التلقائي (uv, py, python3, python). يتطلب إعادة تحميل المكون الإضافي أو إعادة تشغيله ليصبح ساري المفعول بالكامل في حالة تغييره.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'مثال: /usr/bin/python3 أو C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'تم تغيير مسار ملف Python التنفيذي. جارٍ تحديث البرامج النصية...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'مسار Python المخصص غير صالح، ولم يتم العثور على ملف تنفيذي احتياطي. قد لا تعمل البرامج النصية.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'فشل مسار Python المخصص',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "مسار ملف Python التنفيذي المخصص '{path}' غير صالح أو لا يمكن تنفيذه. الرجوع إلى الكشف التلقائي.",
};
