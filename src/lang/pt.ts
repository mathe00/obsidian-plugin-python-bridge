// --- src/lang/pt.ts ---
// Portuguese translations
export default {
	// Settings Tab
	SETTINGS_TAB_TITLE: "Configurações do Obsidian Python Bridge",
	SETTINGS_FOLDER_TITLE: "Pasta de Scripts Python",
	SETTINGS_FOLDER_DESC:
		"Caminho para a pasta que contém seus scripts Python (absoluto ou relativo ao cofre).",
	SETTINGS_FOLDER_PLACEHOLDER: "/caminho/para/seus/scripts ou ./scripts-python",
	SETTINGS_PORT_TITLE: "Porta do Servidor HTTP",
	SETTINGS_PORT_DESC:
		"Porta para o servidor HTTP local (1024-65535). Requer reinicialização ou salvamento das configurações para aplicar.",
	SETTINGS_CACHE_TITLE: "Desativar Cache do Python (__pycache__)",
	SETTINGS_CACHE_DESC:
		'Executa o Python com a flag "-B" para impedir a escrita de arquivos .pyc.',

	// main.ts Notices
	NOTICE_PLUGIN_NAME: "Python Bridge",
	NOTICE_PORT_CHANGED_PREFIX: "Porta HTTP alterada para",
	NOTICE_PORT_CHANGED_SUFFIX: "Reiniciando servidor...",
	NOTICE_PYTHON_MISSING_TITLE: "Erro do Python Bridge:",
	NOTICE_PYTHON_MISSING_DESC: "Executável Python não encontrado no PATH.\nInstale o Python e certifique-se de que ele foi adicionado à variável de ambiente PATH do seu sistema para que o plugin possa executar scripts.\nRecursos do plugin que exigem Python ficarão indisponíveis.",
	NOTICE_REQUESTS_MISSING_TITLE: "Erro do Python Bridge:",
	NOTICE_REQUESTS_MISSING_DESC_PREFIX: "A biblioteca Python necessária 'requests' não está instalada para",
	NOTICE_REQUESTS_MISSING_DESC_SUFFIX: ".\nInstale-a executando:\n{pythonCmd} -m pip install requests\nRecursos do plugin que exigem Python ficarão indisponíveis até que seja instalada.",
	NOTICE_INVALID_PORT_CONFIG_PREFIX: "Porta HTTP configurada inválida:",
	NOTICE_INVALID_PORT_CONFIG_SUFFIX: "Servidor não iniciado. Configure uma porta válida (1-65535) nas configurações.",
	NOTICE_PORT_IN_USE_PREFIX: "A porta",
	NOTICE_PORT_IN_USE_SUFFIX: "já está em uso. Escolha outra porta nas configurações ou feche o outro aplicativo que a está usando. Servidor não iniciado.",
	NOTICE_SERVER_START_FAILED_PREFIX: "Falha ao iniciar o servidor na porta",
	NOTICE_SERVER_START_FAILED_SUFFIX: ".",
	NOTICE_PORT_MISMATCH_WARNING_PREFIX: "⚠️ Python Bridge: Porta HTTP alterada (",
	NOTICE_PORT_MISMATCH_WARNING_MIDDLE: "->",
	NOTICE_PORT_MISMATCH_WARNING_SUFFIX: "). O script pode estar direcionado à porta antiga se já estiver em execução ou tiver sido iniciado externamente.",
	NOTICE_SCRIPT_NOT_FOUND_PREFIX: "Script Python não encontrado ou não é um arquivo:",
	NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: "Erro ao acessar o arquivo de script:",
	NOTICE_RUNNING_SCRIPT_PREFIX: "Executando script Python:",
	NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: "Erro ao executar",
	NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: "com",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: "falhou com o código de saída",
	NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX: "Verifique os logs do console.",
	NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX: "Não foi possível encontrar um executável Python válido. Tentativas:",
	NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX: "Certifique-se de que o Python está instalado e acessível através do PATH do seu sistema (ou o lançador 'py' no Windows).",
	NOTICE_SCRIPTS_FOLDER_INVALID: "Pasta de scripts Python não encontrada ou inválida. Verifique as configurações do plugin.",
	NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX: "Erro ao ler a pasta de scripts:",
	NOTICE_NO_SCRIPTS_FOUND: "Nenhum script Python (.py) encontrado na pasta configurada.",
	NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: "Executando",
	NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: "script(s) Python...",
	NOTICE_INPUT_VALIDATION_FAILED: "A entrada não corresponde ao formato exigido.",

	// main.ts Commands
	CMD_RUN_SPECIFIC_SCRIPT_NAME: "Executar um script Python específico",
	CMD_RUN_ALL_SCRIPTS_NAME: "Executar todos os scripts Python na pasta",

	// UserInputModal
	MODAL_USER_INPUT_SUBMIT_BUTTON: "Enviar",
};
