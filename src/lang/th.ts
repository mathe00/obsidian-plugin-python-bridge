// th.ts - th translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'การตั้งค่า Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'โฟลเดอร์สคริปต์ Python',
  SETTINGS_FOLDER_DESC:
    'พาธไปยังโฟลเดอร์ที่มีสคริปต์ Python ของคุณ (สัมบูรณ์หรือสัมพัทธ์กับ vault)',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/to/your/scripts หรือ ./scripts-python',
  SETTINGS_PORT_TITLE: 'พอร์ตเซิร์ฟเวอร์ HTTP',
  SETTINGS_PORT_DESC:
    'พอร์ตสำหรับเซิร์فเวอร์ HTTP ในเครื่อง (1024-65535) ต้องรีสตาร์ทหรือบันทึกการตั้งค่าเพื่อนำไปใช้',
  SETTINGS_CACHE_TITLE: 'ปิดใช้งานแคช Python (__pycache__)',
  SETTINGS_CACHE_DESC: 'รัน Python ด้วยแฟล็ก "-B" เพื่อป้องกันการเขียนไฟล์ .pyc',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'พอร์ต HTTP เปลี่ยนเป็น',
  NOTICE_PORT_CHANGED_SUFFIX: 'กำลังรีสตาร์ทเซิร์ฟเวอร์...',
  NOTICE_PYTHON_MISSING_TITLE: 'ข้อผิดพลาด Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'ไม่พบไฟล์ปฏิบัติการ Python ใน PATH\\nโปรดติดตั้ง Python และตรวจสอบให้แน่ใจว่าได้เพิ่มลงในตัวแปรสภาพแวดล้อม PATH ของระบบเพื่อให้ปลั๊กอินรันสคริปต์ได้\\nคุณสมบัติปลั๊กอินที่ต้องใช้ Python จะไม่สามารถใช้งานได้',
  NOTICE_REQUESTS_MISSING_TITLE: 'ข้อผิดพลาด Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX: "ไลบรารี Python ที่จำเป็น 'requests' ไม่ได้ติดตั้งสำหรับ",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\\nโปรดติดตั้งโดยรัน:\\n{pythonCmd} -m pip install requests\\nคุณสมบัติปลั๊กอินที่ต้องใช้ Python จะไม่สามารถใช้งานได้จนกว่าจะติดตั้ง',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'กำหนดค่าพอร์ต HTTP ไม่ถูกต้อง:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'เซิร์ฟเวอร์ยังไม่ได้เริ่ม โปรดกำหนดค่าพอร์ตที่ถูกต้อง (1-65535) ในการตั้งค่า',
  NOTICE_PORT_IN_USE_PREFIX: 'พอร์ต',
  NOTICE_PORT_IN_USE_SUFFIX:
    'มีการใช้งานอยู่แล้ว โปรดเลือกพอร์ตอื่นในการตั้งค่าหรือปิดแอปพลิเคชันอื่นที่ใช้งานอยู่ เซิร์ฟเวอร์ยังไม่ได้เริ่ม',
  NOTICE_SERVER_START_FAILED_PREFIX: 'ไม่สามารถเริ่มเซิร์ฟเวอร์บนพอร์ต',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE: 'พอร์ตไม่ถูกต้อง โปรดป้อนตัวเลขระหว่าง 0 ถึง 65535',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: พอร์ต HTTP เปลี่ยนไป (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    ') สคริปต์อาจกำหนดเป้าหมายไปที่พอร์ตเก่าหากกำลังทำงานอยู่แล้วหรือเปิดใช้งานจากภายนอก',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX: 'ไม่พบสคริปต์ Python หรือไม่ใช่ไฟล์:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'ข้อผิดพลาดในการเข้าถึงไฟล์สคริปต์:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'กำลังรันสคริปต์ Python:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'ข้อผิดพลาดในการรัน',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'ด้วย',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'ล้มเหลวด้วยรหัสออก',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'ตรวจสอบบันทึกคอนโซล',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: 'ไม่พบไฟล์ปฏิบัติการ Python ที่ถูกต้อง ลอง:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "โปรดตรวจสอบให้แน่ใจว่า Python ได้รับการติดตั้งและสามารถเข้าถึงได้ผ่าน PATH ของระบบ (หรือตัวเรียกใช้ 'py' บน Windows)",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'ไม่พบโฟลเดอร์สคริปต์ Python หรือไม่ถูกต้อง โปรดตรวจสอบการตั้งค่าปลั๊กอิน',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'ข้อผิดพลาดในการอ่านโฟลเดอร์สคริปต์:',
  NOTICE_NO_SCRIPTS_FOUND: 'ไม่พบสคริปต์ Python (.py) ในโฟลเดอร์ที่กำหนดค่าไว้',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'กำลังรัน',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'สคริปต์ Python...',
  NOTICE_INPUT_VALIDATION_FAILED: 'อินพุตไม่ตรงกับรูปแบบที่ต้องการ',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'รันสคริปต์ Python ที่ระบุ',
  CMD_RUN_ALL_SCRIPTS_NAME: 'รันสคริปต์ Python ทั้งหมดในโฟลเดอร์',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'ส่ง',
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'เลือกสคริปต์ Python ที่จะรัน...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'การตั้งค่าเฉพาะสคริปต์',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'รีเฟรชการตั้งค่าสคริปต์',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'สแกนโฟลเดอร์สคริปต์อีกครั้งเพื่อค้นหาหรืออัปเดตการตั้งค่าที่กำหนดไว้ในสคริปต์ Python ของคุณ',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'รีเฟรชคำจำกัดความ',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'กำลังรีเฟรช...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'โฟลเดอร์สคริปต์ Python ไม่ได้กำหนดค่าไว้ โปรดตั้งค่าพาธด้านบน',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "ไม่พบสคริปต์ที่มีการตั้งค่าที่กำหนดได้ในโฟลเดอร์ที่กำหนดค่าไว้ หรือการค้นหาการตั้งค่าล้มเหลว คลิก 'รีเฟรชคำจำกัดความ' เพื่อลองอีกครั้ง",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'การตั้งค่าสำหรับ:',
  SETTINGS_LANGUAGE_AUTO: 'อัตโนมัติ (ตรงกับ Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'ไม่สามารถรีเฟรชการตั้งค่า: ไม่พบไฟล์ปฏิบัติการ Python โปรดตรวจสอบให้แน่ใจว่า Python ได้รับการติดตั้งและอยู่ใน PATH',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'กำลังรีเฟรชคำจำกัดความการตั้งค่าสคริปต์...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS: 'รีเฟรชคำจำกัดความการตั้งค่าสคริปต์สำเร็จแล้ว!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'ไม่สามารถรีเฟรชคำจำกัดความการตั้งค่าสคริปต์ ตรวจสอบบันทึกเพื่อดูรายละเอียด',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'ไม่สามารถรันสคริปต์: ไม่พบไฟล์ปฏิบัติการ Python โปรดตรวจสอบการติดตั้งและ PATH',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'รีเฟรชคำจำกัดความการตั้งค่าสคริปต์ Python',
  SETTINGS_SECURITY_WARNING_TITLE: 'คำเตือนด้านความปลอดภัย',
  SETTINGS_SECURITY_WARNING_TEXT:
    'การรันสคริปต์ Python ใดๆ อาจมีความเสี่ยง โปรดตรวจสอบให้แน่ใจว่าคุณเชื่อถือแหล่งที่มาของสคริปต์ใดๆ ที่คุณรัน เนื่องจากสามารถเข้าถึงระบบและข้อมูลของคุณได้ ผู้เขียนปลั๊กอินและผู้เขียนสคริปต์จะไม่รับผิดชอบต่อการสูญหายของข้อมูลหรือปัญหาด้านความปลอดภัยใดๆ ที่เกิดจากสคริปต์ที่คุณเลือกที่จะรัน รันสคริปต์ด้วยความเสี่ยงของคุณเอง',
  SETTINGS_LANGUAGE_TITLE: 'ภาษาปลั๊กอิน',
  SETTINGS_LANGUAGE_DESC:
    "เลือกภาษาที่แสดงสำหรับอินเทอร์เฟซปลั๊กอิน Python Bridge 'อัตโนมัติ' จะเป็นไปตามการตั้งค่าภาษาของ Obsidian",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'เคล็ดลับประสิทธิภาพ: Backlink Cache',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "เพื่อประสิทธิภาพที่ดีขึ้นในการดึงข้อมูล Backlink (โดยใช้ฟังก์ชัน get_backlinks) ใน Vault ขนาดใหญ่ ลองพิจารณาติดตั้งปลั๊กอินชุมชน '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' โดย @mnaoumov",
  NOTICE_INVALID_FOLDER_PATH: 'เส้นทางโฟลเดอร์ไม่ถูกต้อง โปรดเลือกโฟลเดอร์ที่ถูกต้องในการตั้งค่า',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "เส้นทางโฟลเดอร์สคริปต์ Python ที่กำหนดค่า '{path}' ไม่ถูกต้องหรือไม่พบ กำลังล้างการตั้งค่า",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'สคริปต์เปิดใช้งานอยู่',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "อนุญาตให้สคริปต์นี้ทำงานผ่านคำสั่ง ทางลัด หรือ 'เรียกใช้ทั้งหมด'",
  NOTICE_SCRIPT_DISABLED: "สคริปต์ '{scriptName}' ถูกปิดใช้งานในการตั้งค่าและไม่สามารถดำเนินการได้",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'ทำงานเมื่อเริ่มต้น',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "เรียกใช้สคริปต์นี้โดยอัตโนมัติเมื่อ Obsidian เริ่มทำงาน (เฉพาะเมื่อ 'เปิดใช้งานสคริปต์' เปิดอยู่ด้วย)",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'ความล่าช้าในการเริ่มต้น (วินาที)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "รอเป็นจำนวนวินาทีหลังจาก Obsidian เริ่มทำงานก่อนที่จะเรียกใช้สคริปต์ (ใช้ได้เฉพาะเมื่อ 'ทำงานเมื่อเริ่มต้น' เปิดอยู่) ใช้ 0 หากไม่ต้องการความล่าช้า",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'ตั้งค่า PYTHONPATH อัตโนมัติสำหรับไลบรารี',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'เพิ่มไดเรกทอรีปลั๊กอินไปยัง PYTHONPATH โดยอัตโนมัติเมื่อเรียกใช้สคริปต์ ทำให้สามารถนำเข้าไลบรารี Python ได้โดยตรง (แนะนำ) หากปิดใช้งาน คุณต้องคัดลอก ObsidianPluginDevPythonToJS.py ไปยังโฟลเดอร์สคริปต์ของคุณ หรือจัดการ sys.path ด้วยตนเอง',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'ปิดใช้งาน PYTHONPATH อัตโนมัติแล้ว ตรวจสอบให้แน่ใจว่า ObsidianPluginDevPythonToJS.py อยู่ในโฟลเดอร์สคริปต์ของคุณ หรือจัดการ sys.path ด้วยตนเอง',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'เส้นทางไฟล์ Python ที่เรียกใช้งานได้',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'เส้นทางสัมบูรณ์ไปยังไฟล์ Python หรือ uv ที่เรียกใช้งานได้ของคุณ ปล่อยว่างไว้สำหรับการตรวจจับอัตโนมัติ (uv, py, python3, python) หากมีการเปลี่ยนแปลง จำเป็นต้องโหลดปลั๊กอินใหม่หรือรีสตาร์ทเพื่อให้มีผลสมบูรณ์',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER: 'เช่น /usr/bin/python3 หรือ C:\Python39\python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'เส้นทางไฟล์ Python ที่เรียกใช้งานได้มีการเปลี่ยนแปลง กำลังรีเฟรชสคริปต์...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'เส้นทาง Python ที่กำหนดเองไม่ถูกต้อง และไม่พบไฟล์ปฏิบัติการสำรอง สคริปต์อาจไม่ทำงาน',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'เส้นทาง Python ที่กำหนดเองล้มเหลว',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "เส้นทางไฟล์ Python ที่เรียกใช้งานได้ที่กำหนดเอง '{path}' ไม่ถูกต้องหรือไม่สามารถเรียกใช้งานได้ กำลังกลับไปใช้การตรวจจับอัตโนมัติ",
};
