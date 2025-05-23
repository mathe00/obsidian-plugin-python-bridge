// fil.ts - fil translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
	SETTINGS_TAB_TITLE: "Mga Setting ng Obsidian Python Bridge",
	SETTINGS_FOLDER_TITLE: "Folder ng mga Python Script",
	SETTINGS_FOLDER_DESC: "Path sa folder na naglalaman ng iyong mga Python script (absolute o relative sa vault).",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/to/your/scripts o ./scripts-python",
	SETTINGS_PORT_TITLE: "Port ng HTTP Server",
	SETTINGS_PORT_DESC: "Port para sa lokal na HTTP server (1024-65535). Nangangailangan ng restart o pag-save ng mga setting para mailapat.",
	SETTINGS_CACHE_TITLE: "Huwag paganahin ang Python Cache (__pycache__)",
	SETTINGS_CACHE_DESC: "Patakbuhin ang Python gamit ang \"-B\" flag para maiwasan ang pagsulat ng mga .pyc file.",
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Nagbago ang HTTP port sa",
	NOTICE_PORT_CHANGED_SUFFIX: "Nire-restart ang server...",
	NOTICE_PYTHON_MISSING_TITLE: "Error sa Python Bridge:",
	NOTICE_PYTHON_MISSING_DESC: "Hindi mahanap ang Python executable sa PATH.\\nPaki-install ang Python at tiyaking naidagdag ito sa PATH environment variable ng iyong system para mapatakbo ng plugin ang mga script.\\nHindi magiging available ang mga feature ng plugin na nangangailangan ng Python.",
	NOTICE_REQUESTS_MISSING_TITLE: "Error sa Python Bridge:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "Ang kinakailangang Python library na 'requests' ay hindi naka-install para sa",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\\nPaki-install ito sa pamamagitan ng pagpapatakbo ng:\\n{pythonCmd} -m pip install requests\\nHindi magiging available ang mga feature ng plugin na nangangailangan ng Python hanggang sa mai-install ito.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Hindi wastong HTTP port ang na-configure:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Hindi nagsimula ang server. Paki-configure ang wastong port (1-65535) sa mga setting.",
	NOTICE_PORT_IN_USE_PREFIX: "Port",
	NOTICE_PORT_IN_USE_SUFFIX: "ay ginagamit na. Pakiusap pumili ng ibang port sa mga setting o isara ang ibang application na gumagamit nito. Hindi nagsimula ang server.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Nabigong simulan ang server sa port",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_INVALID_PORT_RANGE: "Hindi wastong port. Mangyaring maglagay ng numero sa pagitan ng 0 at 65535.",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: Nagbago ang HTTP Port (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Maaaring i-target ng script ang lumang port kung ito ay tumatakbo na o inilunsad sa labas.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Hindi mahanap ang Python script o hindi ito isang file:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Error sa pag-access ng script file:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Pinapatakbo ang Python script:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Error sa pagpapatakbo",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "gamit ang",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "nabigo gamit ang exit code",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Suriin ang mga log ng console.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Hindi makahanap ng wastong Python executable. Sinubukan:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Pakitiyak na naka-install ang Python at accessible sa pamamagitan ng PATH ng iyong system (o ang 'py' launcher sa Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Hindi mahanap ang folder ng mga Python script o hindi wasto. Paki-check ang mga setting ng plugin.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Error sa pagbasa ng folder ng mga script:",
	NOTICE_NO_SCRIPTS_FOUND: "Walang nahanap na Python script (.py) sa na-configure na folder.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Pinapatakbo",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "Python script...",
	NOTICE_INPUT_VALIDATION_FAILED: "Hindi tumutugma ang input sa kinakailangang format.",
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Patakbuhin ang isang partikular na Python script",
	CMD_RUN_ALL_SCRIPTS_NAME: "Patakbuhin ang lahat ng Python script sa folder",
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Ipasa",
	MODAL_SELECT_SCRIPT_PLACEHOLDER: "Pumili ng Python script na patatakbuhin...",
	SETTINGS_SCRIPT_SETTINGS_TITLE: "Mga Setting na Partikular sa Script",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: "I-refresh ang Mga Setting ng Script",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC: "I-scan muli ang folder ng mga script para matuklasan o ma-update ang mga setting na tinukoy sa loob ng iyong mga Python script.",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: "I-refresh ang Mga Depinisyon",
	SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: "Nire-refresh...",
	SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED: "Hindi naka-configure ang folder ng mga Python script. Paki-set ang path sa itaas.",
	SETTINGS_NO_SCRIPT_SETTINGS_FOUND: "Walang nahanap na script na may mga setting na maaaring tukuyin sa na-configure na folder, o nabigo ang pagtuklas ng mga setting. I-click ang 'I-refresh ang Mga Depinisyon' para subukang muli.",
	SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: "Mga Setting para sa:",
	SETTINGS_LANGUAGE_AUTO: "Awtomatiko (Itugma sa Obsidian)",
	NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH: "Hindi ma-refresh ang mga setting: Hindi mahanap ang Python executable. Pakitiyak na naka-install ang Python at nasa PATH.",
	NOTICE_REFRESHING_SCRIPT_SETTINGS: "Nire-refresh ang mga depinisyon ng setting ng script...",
	NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: "Matagumpay na na-refresh ang mga depinisyon ng setting ng script!",
	NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED: "Nabigong i-refresh ang mga depinisyon ng setting ng script. Suriin ang mga log para sa mga detalye.",
	NOTICE_PYTHON_EXEC_MISSING_FOR_RUN: "Hindi mapatakbo ang script: Hindi mahanap ang Python executable. Paki-check ang instalasyon at PATH.",
	CMD_REFRESH_SCRIPT_SETTINGS_NAME: "I-refresh ang mga depinisyon ng setting ng Python script",
	SETTINGS_SECURITY_WARNING_TITLE: "Babala sa Seguridad",
	SETTINGS_SECURITY_WARNING_TEXT: "Maaaring mapanganib ang pagpapatakbo ng arbitrary na mga Python script. Tiyaking pinagkakatiwalaan mo ang pinagmulan ng anumang script na iyong pinapatakbo, dahil maaari nilang ma-access ang iyong system at data. Ang may-akda ng plugin at mga may-akda ng script ay hindi responsable para sa anumang pagkawala ng data o mga isyu sa seguridad na dulot ng mga script na pinili mong patakbuhin. Patakbuhin ang mga script sa iyong sariling panganib.",
	SETTINGS_LANGUAGE_TITLE: "Wika ng Plugin",
	SETTINGS_LANGUAGE_DESC: "Piliin ang display language para sa interface ng Python Bridge plugin. Ang 'Awtomatiko' ay sumusunod sa setting ng wika ng Obsidian.",
	SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: "Tip sa Performance: Backlink Cache",
	SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC: "Para sa pinahusay na performance kapag kumukuha ng mga backlink (gamit ang get_backlinks function) sa malalaking vault, isaalang-alang ang pag-install ng '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' community plugin ni @mnaoumov.",
	NOTICE_INVALID_FOLDER_PATH: "Hindi wastong path ng folder. Mangyaring pumili ng wastong folder sa mga setting.",
	NOTICE_INVALID_STARTUP_FOLDER_PATH: "Ang naka-configure na path ng folder ng mga script ng Python '{path}' ay hindi wasto o hindi natagpuan. Kinaklaro ang setting.",

	SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: "Naka-enable ang Script",
	SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC: "Payagan ang script na ito na ma-execute sa pamamagitan ng mga command, shortcut, o 'Run All'.",
	NOTICE_SCRIPT_DISABLED: "Naka-disable ang script na '{scriptName}' sa mga setting at hindi ma-execute.",

	SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: "Patakbuhin sa Startup",
	SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC: "Awtomatikong patakbuhin ang script na ito kapag nagsimula ang Obsidian (kung naka-on din ang 'Script Enabled').",
	SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: "Pagkaantala sa Startup (segundo)",
	SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC: "Maghintay ng ganitong bilang ng segundo pagkatapos magsimula ang Obsidian bago patakbuhin ang script (nalalapat lamang kung naka-on ang 'Patakbuhin sa Startup'). Gumamit ng 0 para walang pagkaantala.",

	SETTINGS_AUTO_PYTHONPATH_NAME: "Awtomatikong itakda ang PYTHONPATH para sa Library",
	SETTINGS_AUTO_PYTHONPATH_DESC: "Awtomatikong idagdag ang direktoryo ng plugin sa PYTHONPATH kapag nagpapatakbo ng mga script, na nagpapahintulot sa direktang pag-import ng Python library (Inirerekomenda). Kung hindi pinagana, dapat mong kopyahin ang ObsidianPluginDevPythonToJS.py sa iyong folder ng mga script o manu-manong pamahalaan ang sys.path.",
	NOTICE_AUTO_PYTHONPATH_DISABLED_DESC: "Hindi pinagana ang awtomatikong PYTHONPATH. Tiyaking nasa iyong script folder ang ObsidianPluginDevPythonToJS.py o manu-manong pamahalaan ang sys.path.",

};
