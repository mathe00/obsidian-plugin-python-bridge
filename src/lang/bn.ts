// bn.ts - bn translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'অবসিডিয়ান পাইথন ব্রিজ সেটিংস',
  SETTINGS_FOLDER_TITLE: 'পাইথন স্ক্রিপ্ট ফোল্ডার',
  SETTINGS_FOLDER_DESC:
    'আপনার পাইথন স্ক্রিপ্ট ধারণকারী ফোল্ডারের পাথ (ভল্টের সাপেক্ষে পরম বা আপেক্ষিক)।',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/to/your/scripts অথবা ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP সার্ভার পোর্ট',
  SETTINGS_PORT_DESC:
    'স্থানীয় HTTP সার্ভারের জন্য পোর্ট (1024-65535)। প্রয়োগ করার জন্য রিস্টার্ট বা সেটিংস সংরক্ষণ প্রয়োজন।',
  SETTINGS_CACHE_TITLE: 'পাইথন ক্যাশে নিষ্ক্রিয় করুন (__pycache__)',
  SETTINGS_CACHE_DESC: '.pyc ফাইল লেখা প্রতিরোধ করতে "-B" ফ্ল্যাগ দিয়ে পাইথন চালান।',
  NOTICE_PLUGIN_NAME: 'পাইথন ব্রিজ',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP পোর্ট পরিবর্তন করে',
  NOTICE_PORT_CHANGED_SUFFIX: 'সার্ভার রিস্টার্ট করা হচ্ছে...',
  NOTICE_PYTHON_MISSING_TITLE: 'পাইথন ব্রিজ ত্রুটি:',
  NOTICE_PYTHON_MISSING_DESC:
    'PATH-এ পাইথন এক্সিকিউটেবল পাওয়া যায়নি।\\nঅনুগ্রহ করে পাইথন ইনস্টল করুন এবং নিশ্চিত করুন যে এটি আপনার সিস্টেমের PATH এনভায়রনমেন্ট ভেরিয়েবলে যোগ করা হয়েছে যাতে প্লাগইন স্ক্রিপ্ট চালাতে পারে।\\nপাইথন প্রয়োজন এমন প্লাগইন বৈশিষ্ট্যগুলি অনুপলব্ধ থাকবে।',
  NOTICE_REQUESTS_MISSING_TITLE: 'পাইথন ব্রিজ ত্রুটি:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX: "প্রয়োজনীয় পাইথন লাইব্রেরি 'requests' ইনস্টল করা নেই",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    'এর জন্য।\\nঅনুগ্রহ করে এটি চালান:\\n{pythonCmd} -m pip install requests\\nপাইথন প্রয়োজন এমন প্লাগইন বৈশিষ্ট্যগুলি ইনস্টল না হওয়া পর্যন্ত অনুপলব্ধ থাকবে।',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'অবৈধ HTTP পোর্ট কনফিগার করা হয়েছে:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'সার্ভার শুরু হয়নি। অনুগ্রহ করে সেটিংসে একটি বৈধ পোর্ট (1-65535) কনফিগার করুন।',
  NOTICE_PORT_IN_USE_PREFIX: 'পোর্ট',
  NOTICE_PORT_IN_USE_SUFFIX:
    'ইতিমধ্যে ব্যবহৃত হচ্ছে। অনুগ্রহ করে সেটিংসে অন্য একটি পোর্ট বেছে নিন বা এটি ব্যবহার করা অন্য অ্যাপ্লিকেশনটি বন্ধ করুন। সার্ভার শুরু হয়নি।',
  NOTICE_SERVER_START_FAILED_PREFIX: 'পোর্টে সার্ভার শুরু করতে ব্যর্থ হয়েছে',
  NOTICE_SERVER_START_FAILED_SUFFIX: '।',
  NOTICE_INVALID_PORT_RANGE: 'অবৈধ পোর্ট। অনুগ্রহ করে 0 এবং 65535 এর মধ্যে একটি সংখ্যা লিখুন।',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ পাইথন ব্রিজ: HTTP পোর্ট পরিবর্তিত হয়েছে (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    ')। স্ক্রিপ্টটি পুরানো পোর্টকে লক্ষ্য করতে পারে যদি এটি ইতিমধ্যে চলছে বা বাহ্যিকভাবে চালু করা হয়েছে।',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'পাইথন স্ক্রিপ্ট পাওয়া যায়নি বা এটি একটি ফাইল নয়:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'স্ক্রিপ্ট ফাইল অ্যাক্সেস করার সময় ত্রুটি:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'পাইথন স্ক্রিপ্ট চালানো হচ্ছে:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'চালানোর সময় ত্রুটি',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'দিয়ে',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'ব্যর্থ হয়েছে এক্সিট কোড',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'সহ। কনসোল লগ পরীক্ষা করুন।',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'একটি বৈধ পাইথন এক্সিকিউটেবল খুঁজে পাওয়া যায়নি। চেষ্টা করা হয়েছে:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "অনুগ্রহ করে নিশ্চিত করুন যে পাইথন ইনস্টল করা আছে এবং আপনার সিস্টেমের PATH (অথবা উইন্ডোজে 'py' লঞ্চার) এর মাধ্যমে অ্যাক্সেসযোগ্য।",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'পাইথন স্ক্রিপ্ট ফোল্ডার পাওয়া যায়নি বা অবৈধ। অনুগ্রহ করে প্লাগইন সেটিংস পরীক্ষা করুন।',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'স্ক্রিপ্ট ফোল্ডার পড়ার সময় ত্রুটি:',
  NOTICE_NO_SCRIPTS_FOUND: 'কনফিগার করা ফোল্ডারে কোনো পাইথন স্ক্রিপ্ট (.py) পাওয়া যায়নি।',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'চালানো হচ্ছে',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'পাইথন স্ক্রিপ্ট(গুলি)...',
  NOTICE_INPUT_VALIDATION_FAILED: 'ইনপুট প্রয়োজনীয় বিন্যাসের সাথে মেলে না।',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'একটি নির্দিষ্ট পাইথন স্ক্রিপ্ট চালান',
  CMD_RUN_ALL_SCRIPTS_NAME: 'ফোল্ডারের সমস্ত পাইথন স্ক্রিপ্ট চালান',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'জমা দিন',
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'চালানোর জন্য একটি পাইথন স্ক্রিপ্ট নির্বাচন করুন...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'স্ক্রিপ্ট-নির্দিষ্ট সেটিংস',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'স্ক্রিপ্ট সেটিংস রিফ্রেশ করুন',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'আপনার পাইথন স্ক্রিপ্টে সংজ্ঞায়িত সেটিংস আবিষ্কার বা আপডেট করতে স্ক্রিপ্ট ফোল্ডারটি পুনরায় স্ক্যান করুন।',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'সংজ্ঞা রিফ্রেশ করুন',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'রিফ্রেশ করা হচ্ছে...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'পাইথন স্ক্রিপ্ট ফোল্ডার কনফিগার করা হয়নি। অনুগ্রহ করে উপরে পাথ সেট করুন।',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "কনফিগার করা ফোল্ডারে সংজ্ঞায়িত সেটিংস সহ কোনো স্ক্রিপ্ট পাওয়া যায়নি, অথবা সেটিংস আবিষ্কার ব্যর্থ হয়েছে। আবার চেষ্টা করতে 'সংজ্ঞা রিফ্রেশ করুন' ক্লিক করুন।",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'এর জন্য সেটিংস:',
  SETTINGS_LANGUAGE_AUTO: 'স্বয়ংক্রিয় (অবসিডিয়ানের সাথে মিল)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'সেটিংস রিফ্রেশ করা যাবে না: পাইথন এক্সিকিউটেবল পাওয়া যায়নি। অনুগ্রহ করে নিশ্চিত করুন পাইথন ইনস্টল করা আছে এবং PATH-এ আছে।',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'স্ক্রিপ্ট সেটিংস সংজ্ঞা রিফ্রেশ করা হচ্ছে...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: 'স্ক্রিপ্ট সেটিংস সংজ্ঞা সফলভাবে রিফ্রেশ করা হয়েছে!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'স্ক্রিপ্ট সেটিংস সংজ্ঞা রিফ্রেশ করতে ব্যর্থ হয়েছে। বিস্তারিত জানার জন্য লগ পরীক্ষা করুন।',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'স্ক্রিপ্ট চালানো যাবে না: পাইথন এক্সিকিউটেবল পাওয়া যায়নি। অনুগ্রহ করে ইনস্টলেশন এবং PATH পরীক্ষা করুন।',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'পাইথন স্ক্রিপ্ট সেটিংস সংজ্ঞা রিফ্রেশ করুন',
  SETTINGS_SECURITY_WARNING_TITLE: 'নিরাপত্তা সতর্কতা',
  SETTINGS_SECURITY_WARNING_TEXT:
    'নির্বিচারে পাইথন স্ক্রিপ্ট চালানো ঝুঁকিপূর্ণ হতে পারে। আপনি যে স্ক্রিপ্টটি চালান তার উৎসের উপর আস্থা রাখুন, কারণ তারা আপনার সিস্টেম এবং ডেটা অ্যাক্সেস করতে পারে। প্লাগইন লেখক এবং স্ক্রিপ্ট লেখকরা আপনার চালানো স্ক্রিপ্টগুলির কারণে ডেটা ক্ষতি বা নিরাপত্তা সমস্যার জন্য দায়ী নন। নিজের ঝুঁকিতে স্ক্রিপ্ট চালান।',
  SETTINGS_LANGUAGE_TITLE: 'প্লাগইন ভাষা',
  SETTINGS_LANGUAGE_DESC:
    "পাইথন ব্রিজ প্লাগইন ইন্টারফেসের জন্য প্রদর্শনের ভাষা চয়ন করুন। 'স্বয়ংক্রিয়' অবসিডিয়ানের ভাষা সেটিং অনুসরণ করে।",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'পারফরম্যান্স টিপ: ব্যাকলিঙ্ক ক্যাশে',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "বৃহৎ ভল্টে ব্যাকলিঙ্ক পুনরুদ্ধার করার সময় (get_backlinks ফাংশন ব্যবহার করে) উন্নত পারফরম্যান্সের জন্য, @mnaoumov দ্বারা তৈরি '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' কমিউনিটি প্লাগইন ইনস্টল করার কথা বিবেচনা করুন।",
  NOTICE_INVALID_FOLDER_PATH:
    'অবৈধ ফোল্ডার পাথ। অনুগ্রহ করে সেটিংসে একটি বৈধ ফোল্ডার নির্বাচন করুন।',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "কনফিগার করা পাইথন স্ক্রিপ্ট ফোল্ডার পাথ '{path}' অবৈধ বা পাওয়া যায়নি। সেটিং সাফ করা হচ্ছে।",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'স্ক্রিপ্ট সক্ষম',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "কমান্ড, শর্টকাট বা 'সব চালান' এর মাধ্যমে এই স্ক্রিপ্টটি চালানোর অনুমতি দিন।",
  NOTICE_SCRIPT_DISABLED: "স্ক্রিপ্ট '{scriptName}' সেটিংসে নিষ্ক্রিয় করা আছে এবং চালানো যাবে না।",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'স্টার্টআপে চালান',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Obsidian শুরু হলে এই স্ক্রিপ্টটি স্বয়ংক্রিয়ভাবে চালান (শুধুমাত্র যদি 'স্ক্রিপ্ট সক্ষম' চালু থাকে)।",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'স্টার্টআপ বিলম্ব (সেকেন্ড)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Obsidian শুরু হওয়ার পর স্ক্রিপ্টটি চালানোর আগে এই কয়েক সেকেন্ড অপেক্ষা করুন ('স্টার্টআপে চালান' চালু থাকলেই প্রযোজ্য)। কোনো বিলম্ব না চাইলে 0 ব্যবহার করুন।",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'লাইব্রেরির জন্য স্বয়ংক্রিয়ভাবে PYTHONPATH সেট করুন',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'স্ক্রিপ্ট চালানোর সময় প্লাগইন ডিরেক্টরি স্বয়ংক্রিয়ভাবে PYTHONPATH-এ যোগ করুন, যা পাইথন লাইব্রেরির সরাসরি আমদানি সক্ষম করে (প্রস্তাবিত)। নিষ্ক্রিয় করা থাকলে, আপনাকে অবশ্যই ObsidianPluginDevPythonToJS.py আপনার স্ক্রিপ্ট ফোল্ডারে কপি করতে হবে অথবা sys.path ম্যানুয়ালি পরিচালনা করতে হবে।',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'স্বয়ংক্রিয় PYTHONPATH নিষ্ক্রিয় করা হয়েছে। নিশ্চিত করুন ObsidianPluginDevPythonToJS.py আপনার স্ক্রিপ্ট ফোল্ডারে আছে অথবা sys.path ম্যানুয়ালি পরিচালনা করুন।',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'পাইথন এক্সিকিউটেবল পাথ',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'আপনার পাইথন বা ইউভি এক্সিকিউটেবলের সম্পূর্ণ পাথ। স্বয়ংক্রিয় সনাক্তকরণের জন্য খালি রাখুন (uv, py, python3, python)। পরিবর্তন করা হলে সম্পূর্ণ প্রভাবের জন্য প্লাগইন পুনরায় লোড বা পুনরায় চালু করতে হবে।',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: 'যেমন, /usr/bin/python3 অথবা C:\Python39\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'পাইথন এক্সিকিউটেবল পাথ পরিবর্তিত হয়েছে। স্ক্রিপ্ট রিফ্রেশ করা হচ্ছে...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'কাস্টম পাইথন পাথ অবৈধ, এবং কোনও ফলব্যাক এক্সিকিউটেবল পাওয়া যায়নি। স্ক্রিপ্টগুলি নাও চলতে পারে।',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'কাস্টম পাইথন পাথ ব্যর্থ হয়েছে',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "কাস্টম পাইথন এক্সিকিউটেবল পাথ '{path}' অবৈধ অথবা চালানো যায়নি। স্বয়ংক্রিয় সনাক্তকরণে ফিরে যাওয়া হচ্ছে।",
};
