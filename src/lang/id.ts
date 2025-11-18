// --- src/lang/id.ts ---
// Indonesian translations
export default {
  // Settings Tab
  SETTINGS_TAB_TITLE: 'Pengaturan Obsidian Python Bridge',
  SETTINGS_FOLDER_TITLE: 'Folder Skrip Python',
  SETTINGS_FOLDER_DESC:
    'Path ke folder yang berisi skrip Python Anda (absolut atau relatif terhadap vault).',
  SETTINGS_FOLDER_PLACEHOLDER: '/path/ke/skrip/anda atau ./scripts-python',
  SETTINGS_PORT_TITLE: 'Port Server HTTP',
  SETTINGS_PORT_DESC:
    'Port untuk server HTTP lokal (1024-65535). Memerlukan restart atau simpan pengaturan untuk menerapkan.',
  SETTINGS_CACHE_TITLE: 'Nonaktifkan Cache Python (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Jalankan Python dengan flag "-B" untuk mencegah penulisan file .pyc.',

  // main.ts Notices
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'Port HTTP diubah ke',
  NOTICE_PORT_CHANGED_SUFFIX: 'Memulai ulang server...',
  NOTICE_PYTHON_MISSING_TITLE: 'Kesalahan Python Bridge:',
  NOTICE_PYTHON_MISSING_DESC:
    'Eksekutable Python tidak ditemukan di PATH.\nHarap instal Python dan pastikan ditambahkan ke variabel lingkungan PATH sistem Anda agar plugin dapat menjalankan skrip.\nFitur plugin yang memerlukan Python tidak akan tersedia.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Kesalahan Python Bridge:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "Pustaka Python yang diperlukan 'requests' tidak diinstal untuk",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\nHarap instal dengan menjalankan:\n{pythonCmd} -m pip install requests\nFitur plugin yang memerlukan Python tidak akan tersedia sampai diinstal.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX:
    'Port HTTP yang dikonfigurasi tidak valid:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'Server tidak dimulai. Harap konfigurasikan port yang valid (1-65535) di pengaturan.',
  NOTICE_PORT_IN_USE_PREFIX: 'Port',
  NOTICE_PORT_IN_USE_SUFFIX:
    'sudah digunakan. Harap pilih port lain di pengaturan atau tutup aplikasi lain yang menggunakannya. Server tidak dimulai.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Gagal memulai server di port',
  NOTICE_SERVER_START_FAILED_SUFFIX: '.',
  NOTICE_INVALID_PORT_RANGE:
    'Port tidak valid. Harap masukkan angka antara 0 dan 65535.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX: '⚠️ Python Bridge: Port HTTP berubah (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). Skrip mungkin menargetkan port lama jika sudah berjalan atau diluncurkan secara eksternal.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'Skrip Python tidak ditemukan atau bukan file:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Kesalahan mengakses file skrip:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Menjalankan skrip Python:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Kesalahan saat menjalankan',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'dengan',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'gagal dengan kode keluar',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: 'Periksa log konsol.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Tidak dapat menemukan eksekutable Python yang valid. Mencoba:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Harap pastikan Python diinstal dan dapat diakses melalui PATH sistem Anda (atau peluncur 'py' di Windows).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'Folder skrip Python tidak ditemukan atau tidak valid. Harap periksa pengaturan plugin.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: 'Kesalahan membaca folder skrip:',
  NOTICE_NO_SCRIPTS_FOUND:
    'Tidak ada skrip Python (.py) yang ditemukan di folder yang dikonfigurasi.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Menjalankan',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'skrip Python...',
  NOTICE_INPUT_VALIDATION_FAILED:
    'Input tidak cocok dengan format yang dibutuhkan.',

  // main.ts Commands
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Jalankan skrip Python tertentu',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Jalankan semua skrip Python di folder',

  // UserInputModal
  MODAL_SELECT_SCRIPT_PLACEHOLDER: 'Pilih skrip Python untuk dijalankan...',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Kirim',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Pengaturan Khusus Skrip',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Segarkan Pengaturan Skrip',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Pindai ulang folder skrip untuk menemukan atau memperbarui pengaturan yang ditentukan dalam skrip Python Anda.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Segarkan Definisi',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Menyegarkan...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'Folder skrip Python belum dikonfigurasi. Harap atur path di atas.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "Tidak ada skrip dengan pengaturan yang dapat ditentukan ditemukan di folder yang dikonfigurasi, atau penemuan pengaturan gagal. Klik 'Segarkan Definisi' untuk mencoba lagi.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Pengaturan untuk:',
  SETTINGS_LANGUAGE_AUTO: 'Otomatis (Sesuai Obsidian)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Tidak dapat menyegarkan pengaturan: Eksekusi Python tidak ditemukan. Pastikan Python terinstal dan ada di PATH.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS: 'Menyegarkan definisi pengaturan skrip...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Definisi pengaturan skrip berhasil disegarkan!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Gagal menyegarkan definisi pengaturan skrip. Periksa log untuk detail.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Tidak dapat menjalankan skrip: Eksekusi Python tidak ditemukan. Periksa instalasi dan PATH.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME: 'Segarkan definisi pengaturan skrip Python',
  SETTINGS_SECURITY_WARNING_TITLE: 'Peringatan Keamanan',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Menjalankan skrip Python sembarangan bisa berisiko. Pastikan Anda mempercayai sumber skrip apa pun yang Anda jalankan, karena skrip tersebut dapat mengakses sistem dan data Anda. Penulis plugin dan penulis skrip tidak bertanggung jawab atas kehilangan data atau masalah keamanan apa pun yang disebabkan oleh skrip yang Anda pilih untuk dijalankan. Jalankan skrip dengan risiko Anda sendiri.',
  SETTINGS_LANGUAGE_TITLE: 'Bahasa Plugin',
  SETTINGS_LANGUAGE_DESC:
    "Pilih bahasa tampilan untuk antarmuka plugin Python Bridge. 'Otomatis' mengikuti pengaturan bahasa Obsidian.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE: 'Tips Performa: Cache Backlink',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "Untuk peningkatan performa saat mengambil backlink (menggunakan fungsi get_backlinks) di vault besar, pertimbangkan untuk menginstal plugin komunitas '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' oleh @mnaoumov.",
  NOTICE_INVALID_FOLDER_PATH:
    'Path folder tidak valid. Harap pilih folder yang valid di pengaturan.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "Path folder skrip Python yang dikonfigurasi '{path}' tidak valid atau tidak ditemukan. Menghapus pengaturan.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Skrip Diaktifkan',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Izinkan skrip ini dieksekusi melalui perintah, pintasan, atau 'Jalankan Semua'.",
  NOTICE_SCRIPT_DISABLED:
    "Skrip '{scriptName}' dinonaktifkan di pengaturan dan tidak dapat dieksekusi.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Jalankan saat Startup',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "Jalankan skrip ini secara otomatis saat Obsidian dimulai (hanya jika 'Skrip Diaktifkan' juga aktif).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Penundaan Startup (detik)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Tunggu beberapa detik setelah Obsidian dimulai sebelum menjalankan skrip (hanya berlaku jika 'Jalankan saat Startup' aktif). Gunakan 0 jika tidak ada penundaan.",

  SETTINGS_AUTO_PYTHONPATH_NAME: 'Atur otomatis PYTHONPATH untuk Library',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Secara otomatis menambahkan direktori plugin ke PYTHONPATH saat menjalankan skrip, memungkinkan impor langsung pustaka Python (Disarankan). Jika dinonaktifkan, Anda harus menyalin ObsidianPluginDevPythonToJS.py ke folder skrip Anda atau mengelola sys.path secara manual.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'PYTHONPATH otomatis dinonaktifkan. Pastikan ObsidianPluginDevPythonToJS.py ada di folder skrip Anda atau kelola sys.path secara manual.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Jalur Eksekusi Python',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Jalur absolut ke eksekusi Python atau uv Anda. Biarkan kosong untuk deteksi otomatis (uv, py, python3, python). Memerlukan muat ulang atau mulai ulang plugin agar berlaku penuh jika diubah.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'misalnya, /usr/bin/python3 atau C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'Jalur eksekusi Python diubah. Memperbarui skrip...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Jalur Python kustom tidak valid, dan tidak ada eksekusi fallback yang ditemukan. Skrip mungkin tidak berjalan.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE: 'Jalur Python Kustom Gagal',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Jalur eksekusi Python kustom '{path}' tidak valid atau tidak dapat dieksekusi. Kembali ke deteksi otomatis.",
};
