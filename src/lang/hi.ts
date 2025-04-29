// --- src/lang/hi.ts ---
// Hindi translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "ऑब्सिडियन पाइथन ब्रिज सेटिंग्स",
	SETTINGS_FOLDER_TITLE: "पाइथन स्क्रिप्ट्स फ़ोल्डर",
	SETTINGS_FOLDER_DESC:
		"आपकी पाइथन स्क्रिप्ट्स वाले फ़ोल्डर का पथ (पूर्ण या वॉल्ट के सापेक्ष)।",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts या ./scripts-python",
	SETTINGS_PORT_TITLE: "HTTP सर्वर पोर्ट",
	SETTINGS_PORT_DESC:
		"स्थानीय HTTP सर्वर के लिए पोर्ट (1024-65535)। लागू करने के लिए पुनरारंभ या सेटिंग्स सहेजने की आवश्यकता है।",
	SETTINGS_CACHE_TITLE: "पाइथन कैश अक्षम करें (__pycache__)",
	SETTINGS_CACHE_DESC:
		'".pyc" फ़ाइलों को लिखने से रोकने के लिए "-B" ध्वज के साथ पाइथन चलाएँ।',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "पाइथन ब्रिज",
	NOTICE_PORT_CHANGED_PREFIX: "HTTP पोर्ट बदल कर",
	NOTICE_PORT_CHANGED_SUFFIX: "कर दिया गया है। सर्वर पुनरारंभ हो रहा है...",
	NOTICE_PYTHON_MISSING_TITLE: "पाइथन ब्रिज त्रुटि:",
	NOTICE_PYTHON_MISSING_DESC: "PATH में पाइथन निष्पादन योग्य नहीं मिला।\nकृपया पाइथन स्थापित करें और सुनिश्चित करें कि यह आपके सिस्टम के PATH पर्यावरण चर में जोड़ा गया है ताकि प्लगइन स्क्रिप्ट चला सके।\nपाइथन की आवश्यकता वाले प्लगइन सुविधाएँ अनुपलब्ध रहेंगी।",
	NOTICE_REQUESTS_MISSING_TITLE: "पाइथन ब्रिज त्रुटि:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "आवश्यक पाइथन लाइब्रेरी 'requests' इसके लिए स्थापित नहीं है:",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: "।\nकृपया इसे चलाकर स्थापित करें:\n{pythonCmd} -m pip install requests\nस्थापित होने तक पाइथन की आवश्यकता वाले प्लगइन सुविधाएँ अनुपलब्ध रहेंगी।",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "अमान्य HTTP पोर्ट कॉन्फ़िगर किया गया:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "सर्वर शुरू नहीं हुआ। कृपया सेटिंग्स में एक मान्य पोर्ट (1-65535) कॉन्फ़िगर करें।",
	NOTICE_PORT_IN_USE_PREFIX: "पोर्ट",
	NOTICE_PORT_IN_USE_SUFFIX: "पहले से उपयोग में है। कृपया सेटिंग्स में दूसरा पोर्ट चुनें या इसका उपयोग करने वाले अन्य एप्लिकेशन को बंद करें। सर्वर शुरू नहीं हुआ।",
	NOTICE_SERVER_START_FAILED_PREFIX: "पोर्ट पर सर्वर शुरू करने में विफल:",
	NOTICE_SERVER_START_FAILED_SUFFIX: "।",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ पाइथन ब्रिज: HTTP पोर्ट बदला (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: ")। यदि स्क्रिप्ट पहले से चल रही है या बाहरी रूप से लॉन्च की गई है तो वह पुराने पोर्ट को लक्षित कर सकती है।",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "पाइथन स्क्रिप्ट नहीं मिली या फ़ाइल नहीं है:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "स्क्रिप्ट फ़ाइल तक पहुँचने में त्रुटि:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "पाइथन स्क्रिप्ट चल रही है:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "चलाने में त्रुटि",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "के साथ",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "निकास कोड के साथ विफल:",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "कंसोल लॉग जांचें।",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "कोई मान्य पाइथन निष्पादन योग्य नहीं मिला। कोशिश की:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "कृपया सुनिश्चित करें कि पाइथन स्थापित है और आपके सिस्टम के PATH (या विंडोज पर 'py' लॉन्चर) के माध्यम से पहुँचा जा सकता है।",
	NOTICE_SCRIPTS_FOLDER_INVALID: "पाइथन स्क्रिप्ट फ़ोल्डर नहीं मिला या अमान्य है। कृपया प्लगइन सेटिंग्स जांचें।",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "स्क्रिप्ट फ़ोल्डर पढ़ने में त्रुटि:",
	NOTICE_NO_SCRIPTS_FOUND: "कॉन्फ़िगर किए गए फ़ोल्डर में कोई पाइथन स्क्रिप्ट (.py) नहीं मिली।",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "चल रहा है",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "पाइथन स्क्रिप्ट...",
	NOTICE_INPUT_VALIDATION_FAILED: "इनपुट आवश्यक प्रारूप से मेल नहीं खाता।",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "एक विशिष्ट पाइथन स्क्रिप्ट चलाएँ",
	CMD_RUN_ALL_SCRIPTS_NAME: "फ़ोल्डर में सभी पाइथन स्क्रिप्ट चलाएँ",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "प्रस्तुत करें",
};
