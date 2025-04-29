// --- src/PythonBridgeSettingTab.ts ---
import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianPythonBridge from "./main"; // Adjust path as needed
import { t, loadTranslations, getAvailableLanguages } from "./lang/translations"; // Import helpers

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

		// --- Language Selection ---
		new Setting(containerEl)
			.setName(t("SETTINGS_LANGUAGE_TITLE")) // Add this key to translation files
			.setDesc(t("SETTINGS_LANGUAGE_DESC")) // Add this key to translation files
			.addDropdown((dropdown) => {
				const languages = getAvailableLanguages();
				for (const code in languages) {
					dropdown.addOption(code, languages[code]);
				}
				dropdown
					.setValue(this.plugin.settings.pluginLanguage)
					.onChange(async (value) => {
						this.plugin.settings.pluginLanguage = value;
						await this.plugin.saveSettings();
						// Reload translations with the new setting
						loadTranslations(this.plugin);
						// Force redraw of the settings tab to reflect language change immediately
						this.display();
						// Optional: Show a notice that language changed and might require restart for full effect elsewhere
						// new Notice(t("NOTICE_LANGUAGE_CHANGED")); // Add key if using notice
					});
			});

		// --- Other Settings ---

		// Setting for Python Scripts Folder
		new Setting(containerEl)
			.setName(t("SETTINGS_FOLDER_TITLE"))
			.setDesc(t("SETTINGS_FOLDER_DESC"))
			.addText((text) =>
				text
					.setPlaceholder(t("SETTINGS_FOLDER_PLACEHOLDER"))
					.setValue(this.plugin.settings.pythonScriptsFolder)
					.onChange(async (value) => {
						this.plugin.settings.pythonScriptsFolder = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		// Setting for HTTP Server Port
		new Setting(containerEl)
			.setName(t("SETTINGS_PORT_TITLE"))
			.setDesc(t("SETTINGS_PORT_DESC"))
			.addText((text) =>
				text
					.setPlaceholder(String(27123))
					.setValue(String(this.plugin.settings.httpPort))
					.onChange(async (value) => {
						const port = parseInt(value, 10);
						if (!isNaN(port) && port > 1023 && port <= 65535) {
							this.plugin.settings.httpPort = port;
							await this.plugin.saveSettings();
							text.inputEl.style.borderColor = "";
						} else {
							text.inputEl.style.borderColor = "red";
							console.warn(
								`Invalid port entered: ${value}. Must be between 1024 and 65535.`,
							);
						}
					}),
			);

		// Setting to disable Python cache (__pycache__)
		new Setting(containerEl)
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
	}
}
