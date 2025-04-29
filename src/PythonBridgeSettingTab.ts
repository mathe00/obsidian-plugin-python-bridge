// --- src/PythonBridgeSettingTab.ts ---
import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianPythonBridge from "./main"; // Adjust path as needed
import { t } from "./lang/translations"; // Import the translation function

// Plugin settings tab
export default class PythonBridgeSettingTab extends PluginSettingTab {
	plugin: ObsidianPythonBridge;

	constructor(app: App, plugin: ObsidianPythonBridge) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		// Use translation for the main title
		containerEl.createEl("h2", { text: t("SETTINGS_TAB_TITLE") });

		// Setting for Python Scripts Folder
		new Setting(containerEl)
			// Use translations for name and description
			.setName(t("SETTINGS_FOLDER_TITLE"))
			.setDesc(t("SETTINGS_FOLDER_DESC"))
			.addText((text) =>
				text
					// Use translation for placeholder
					.setPlaceholder(t("SETTINGS_FOLDER_PLACEHOLDER"))
					.setValue(this.plugin.settings.pythonScriptsFolder)
					.onChange(async (value) => {
						this.plugin.settings.pythonScriptsFolder = value.trim(); // Trim whitespace
						await this.plugin.saveSettings();
					}),
			);

		// Setting for HTTP Server Port
		new Setting(containerEl)
			// Use translations for name and description
			.setName(t("SETTINGS_PORT_TITLE"))
			.setDesc(t("SETTINGS_PORT_DESC"))
			.addText((text) =>
				text
					.setPlaceholder(String(27123)) // Default port placeholder (usually not translated)
					.setValue(String(this.plugin.settings.httpPort)) // Store as number, display as string
					.onChange(async (value) => {
						const port = parseInt(value, 10);
						if (!isNaN(port) && port > 1023 && port <= 65535) {
							this.plugin.settings.httpPort = port;
							await this.plugin.saveSettings();
							// Optionally add visual feedback for valid input
							text.inputEl.style.borderColor = ""; // Reset border
						} else {
							// Optionally add visual feedback for invalid input
							text.inputEl.style.borderColor = "red";
							// Do not save invalid port
							console.warn(
								`Invalid port entered: ${value}. Must be between 1024 and 65535.`,
							);
							// Optionally show a notice, but might be annoying during typing
							// new Notice("Invalid port number. Please enter a value between 1024 and 65535.");
						}
					}),
			);

		// Setting to disable Python cache (__pycache__)
		new Setting(containerEl)
			// Use translations for name and description
			.setName(t("SETTINGS_CACHE_TITLE"))
			.setDesc(t("SETTINGS_CACHE_DESC"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.disablePyCache)
					.onChange(async (value) => {
						this.plugin.settings.disablePyCache = value;
						await this.plugin.saveSettings();
					}),
			);

		// Optional: Add a button to test connection? (More complex)
		// new Setting(containerEl)
		//     .setName('Test Connection') // Needs translation key if uncommented
		//     .setDesc('Attempt to connect to the running server.') // Needs translation key if uncommented
		//     .addButton(button => button
		//         .setButtonText('Test') // Needs translation key if uncommented
		//         .onClick(async () => {
		//             // Logic to send a test request (e.g., a 'ping' action)
		//             // Would likely require adding a 'ping' action to handleAction
		//             // and calling it from the Python client library's test method.
		//             new Notice('Test functionality not yet implemented.'); // Needs translation key if uncommented
		//         }));
	}
}
