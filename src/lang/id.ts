// --- src/lang/id.ts ---
// Indonesian translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Pengaturan Obsidian Python Bridge",
	SETTINGS_FOLDER_TITLE: "Folder Skrip Python",
	SETTINGS_FOLDER_DESC:
		"Path ke folder yang berisi skrip Python Anda (absolut atau relatif terhadap vault).",
	SETTINGS_FOLDER_PLACEHOLDER: "/path/ke/skrip/anda atau ./scripts-python",
	SETTINGS_PORT_TITLE: "Port Server HTTP",
	SETTINGS_PORT_DESC:
		"Port untuk server HTTP lokal (1024-65535). Memerlukan restart atau simpan pengaturan untuk menerapkan.",
	SETTINGS_CACHE_TITLE: "Nonaktifkan Cache Python (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Jalankan Python dengan flag "-B" untuk mencegah penulisan file .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Port HTTP diubah ke",
	NOTICE_PORT_CHANGED_SUFFIX: "Memulai ulang server...",
	NOTICE_PYTHON_MISSING_TITLE: "Kesalahan Python Bridge:",
	NOTICE_PYTHON_MISSING_DESC: "Eksekutable Python tidak ditemukan di PATH.\nHarap instal Python dan pastikan ditambahkan ke variabel lingkungan PATH sistem Anda agar plugin dapat menjalankan skrip.\nFitur plugin yang memerlukan Python tidak akan tersedia.",
	NOTICE_REQUESTS_MISSING_TITLE: "Kesalahan Python Bridge:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "Pustaka Python yang diperlukan 'requests' tidak diinstal untuk",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nHarap instal dengan menjalankan:\n{pythonCmd} -m pip install requests\nFitur plugin yang memerlukan Python tidak akan tersedia sampai diinstal.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Port HTTP yang dikonfigurasi tidak valid:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Server tidak dimulai. Harap konfigurasikan port yang valid (1-65535) di pengaturan.",
	NOTICE_PORT_IN_USE_PREFIX: "Port",
	NOTICE_PORT_IN_USE_SUFFIX: "sudah digunakan. Harap pilih port lain di pengaturan atau tutup aplikasi lain yang menggunakannya. Server tidak dimulai.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Gagal memulai server di port",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: Port HTTP berubah (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). Skrip mungkin menargetkan port lama jika sudah berjalan atau diluncurkan secara eksternal.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Skrip Python tidak ditemukan atau bukan file:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Kesalahan mengakses file skrip:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Menjalankan skrip Python:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Kesalahan saat menjalankan",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "dengan",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "gagal dengan kode keluar",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Periksa log konsol.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Tidak dapat menemukan eksekutable Python yang valid. Mencoba:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Harap pastikan Python diinstal dan dapat diakses melalui PATH sistem Anda (atau peluncur 'py' di Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Folder skrip Python tidak ditemukan atau tidak valid. Harap periksa pengaturan plugin.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Kesalahan membaca folder skrip:",
	NOTICE_NO_SCRIPTS_FOUND: "Tidak ada skrip Python (.py) yang ditemukan di folder yang dikonfigurasi.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Menjalankan",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "skrip Python...",
	NOTICE_INPUT_VALIDATION_FAILED: "Input tidak cocok dengan format yang dibutuhkan.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Jalankan skrip Python tertentu",
	CMD_RUN_ALL_SCRIPTS_NAME: "Jalankan semua skrip Python di folder",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Kirim",
};
