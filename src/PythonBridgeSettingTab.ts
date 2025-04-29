// --- src/PythonBridgeSettingTab.ts ---
import { App, PluginSettingTab, Setting, normalizePath, ButtonComponent, Notice } from "obsidian";
// --- MODIFIED: Import DEFAULT_PORT ---
// --- MODIFIED: Import type for plugin and constant from constants.ts ---
import type ObsidianPythonBridge from "./main";
import { DEFAULT_PORT } from "./constants";
import { t, loadTranslations, getAvailableLanguages } from "./lang/translations"; // Import helpers
import * as path from "path"; // Import path for relative path calculation

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

		// --- General Plugin Settings ---
		containerEl.createEl("h2", { text: t("SETTINGS_TAB_TITLE") });

		// Language Selection
		new Setting(containerEl)
			.setName(t("SETTINGS_LANGUAGE_TITLE"))
			.setDesc(t("SETTINGS_LANGUAGE_DESC"))
			.addDropdown((dropdown) => {
				const languages = getAvailableLanguages();
				// Ensure 'auto' is always an option
				dropdown.addOption('auto', t('SETTINGS_LANGUAGE_AUTO') || 'Automatic'); // Add translation key
				for (const code in languages) {
					if (code !== 'auto') { // Avoid duplicating 'auto' if present in languages
						dropdown.addOption(code, languages[code]);
					}
				}
				dropdown
					.setValue(this.plugin.settings.pluginLanguage)
					.onChange(async (value) => {
						this.plugin.settings.pluginLanguage = value;
						await this.plugin.saveSettings();
						loadTranslations(this.plugin);
						this.display(); // Force redraw
					});
			});

		// Python Scripts Folder
		new Setting(containerEl)
			.setName(t("SETTINGS_FOLDER_TITLE"))
			.setDesc(t("SETTINGS_FOLDER_DESC"))
			.addText((text) =>
				text
					.setPlaceholder(t("SETTINGS_FOLDER_PLACEHOLDER"))
					.setValue(this.plugin.settings.pythonScriptsFolder)
					.onChange(async (value) => {
						const oldValue = this.plugin.settings.pythonScriptsFolder;
						const newValue = value.trim(); // Trim the new value
						// Only proceed if the value actually changed
						if (oldValue !== newValue) {
							this.plugin.settings.pythonScriptsFolder = newValue;
							await this.plugin.saveSettings();
							// If folder changed, trigger settings discovery
							const scriptsFolder = this.plugin.getScriptsFolderPath(); // Re-evaluate folder path
							if (scriptsFolder && this.plugin.pythonExecutable) {
								// Use then/catch for async operation without blocking UI thread
								this.plugin.updateScriptSettingsCache(scriptsFolder)
									.then(() => {
										this.plugin.logInfo("Script settings cache updated after folder change.");
										this.display(); // Redraw after update completes
									})
									.catch(err => this.plugin.logError("Error updating settings cache after folder change:", err));
							} else {
								// Clear definitions if folder becomes invalid or Python is missing
								this.plugin.logWarn("Clearing script settings cache due to invalid folder or missing Python.");
								this.plugin.settings.scriptSettingsDefinitions = {};
								this.plugin.settings.scriptSettingsValues = {}; // Also clear values
								await this.plugin.saveSettings();
								this.display(); // Redraw to remove old script settings
							}
						}
					}),
			);

		// HTTP Server Port
		new Setting(containerEl)
			.setName(t("SETTINGS_PORT_TITLE"))
			.setDesc(t("SETTINGS_PORT_DESC"))
			.addText((text) =>
				text
					// --- MODIFIED: Use imported DEFAULT_PORT ---
					.setPlaceholder(String(DEFAULT_PORT))
					.setValue(String(this.plugin.settings.httpPort))
					.onChange(async (value) => {
						const port = parseInt(value.trim(), 10);
						// Allow port 0 for dynamic assignment
						if (!isNaN(port) && port >= 0 && port <= 65535) {
							if (port > 0 && port < 1024) {
								this.plugin.logWarn(`Port ${port} is in the well-known range, might require root/admin privileges.`);
							}
							this.plugin.settings.httpPort = port;
							await this.plugin.saveSettings(); // saveSettings handles restart if needed
							text.inputEl.style.borderColor = ""; // Reset border on valid input
						} else {
							text.inputEl.style.borderColor = "red"; // Indicate error
							this.plugin.logWarn(
								`Invalid port entered: ${value}. Must be between 0 and 65535.`,
							);
							// Do not save invalid port
						}
					}),
			);

		// Disable Python Cache
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

		// --- Script Specific Settings ---
		containerEl.createEl("h2", { text: t("SETTINGS_SCRIPT_SETTINGS_TITLE") }); // Add key

		// Refresh Button
		new Setting(containerEl)
			.setName(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME")) // Add key
			.setDesc(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC")) // Add key
			.addButton((button: ButtonComponent) => {
				button
					.setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT")) // Add key
					.setCta() // Make it stand out a bit
					.onClick(async () => {
						const scriptsFolder = this.plugin.getScriptsFolderPath();
						if (!scriptsFolder) {
							new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000); // Notice is imported now
							return;
						}
						if (!this.plugin.pythonExecutable) {
							new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH"), 5000); // Notice is imported now
							await this.plugin.checkPythonEnvironment();
							if (!this.plugin.pythonExecutable) return;
						}

						button.setDisabled(true).setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING")); // Add key
						new Notice(t("NOTICE_REFRESHING_SCRIPT_SETTINGS")); // Notice is imported now

						try {
							await this.plugin.updateScriptSettingsCache(scriptsFolder);
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS")); // Notice is imported now
							this.display(); // Redraw the settings tab with new/updated definitions
						} catch (error) {
							this.plugin.logError("Manual script settings refresh failed:", error);
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED")); // Notice is imported now
						} finally {
							// Re-enable button even on error
							// Check if button element still exists before modifying
							if (button.buttonEl && button.disabled) { // Check disabled state before re-enabling
								button.setDisabled(false).setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT"));
							}
						}
					});
			});


		// Dynamically generate settings UI for each script
		const definitions = this.plugin.settings.scriptSettingsDefinitions;
		const values = this.plugin.settings.scriptSettingsValues;
		const scriptsFolder = this.plugin.getScriptsFolderPath(); // Needed for relative path keys

		if (!scriptsFolder) {
			containerEl.createEl('p', { text: t("SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED") }); // Add key
			return; // Don't proceed if folder isn't set
		}

		const sortedScriptPaths = Object.keys(definitions).sort();

		if (sortedScriptPaths.length === 0) {
			containerEl.createEl('p', { text: t("SETTINGS_NO_SCRIPT_SETTINGS_FOUND") }); // Add key
		}

		for (const relativePath of sortedScriptPaths) {
			const scriptDefs = definitions[relativePath];
			if (!scriptDefs || scriptDefs.length === 0) continue; // Skip if no definitions for this script

			// Ensure value storage exists for this script
			values[relativePath] = values[relativePath] || {};
			const scriptValues = values[relativePath];

			// Add a heading for the script
			containerEl.createEl("h3", { text: `${t("SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX")} ${relativePath}` }); // Add key

			// Create settings for this script
			for (const settingDef of scriptDefs) {
				const setting = new Setting(containerEl)
					.setName(settingDef.label || settingDef.key) // Use key as fallback label
					.setDesc(settingDef.description || ""); // Use empty string as fallback desc

				// Get current value or default
				const currentValue = scriptValues.hasOwnProperty(settingDef.key)
					? scriptValues[settingDef.key]
					: settingDef.default;

				// Add appropriate control based on type
				switch (settingDef.type) {
					case "text":
						setting.addText(text => {
							text.setValue(String(currentValue ?? '')) // Ensure string, handle null/undefined default
								.onChange(async (value) => {
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					case "textarea":
						setting.addTextArea(text => {
							text.setValue(String(currentValue ?? '')) // Ensure string
								.onChange(async (value) => {
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
							// Optional: Adjust rows for textarea
							text.inputEl.rows = 4;
						});
						break;
					case "number":
						setting.addText(text => {
							text.inputEl.type = "number"; // Set input type
							if (settingDef.min !== undefined && settingDef.min !== null) text.inputEl.min = String(settingDef.min);
							if (settingDef.max !== undefined && settingDef.max !== null) text.inputEl.max = String(settingDef.max);
							if (settingDef.step !== undefined && settingDef.step !== null) text.inputEl.step = String(settingDef.step);

							text.setValue(String(currentValue ?? settingDef.default ?? '')) // Use default if current is null/undefined
								.onChange(async (value) => {
									const numValue = value === '' ? settingDef.default : parseFloat(value); // Use default if empty string
									// Store as number if valid, otherwise use default
									scriptValues[settingDef.key] = isNaN(numValue) ? settingDef.default : numValue;
									await this.plugin.saveSettings();
									// Optional: Add validation feedback (e.g., red border)
									text.inputEl.style.borderColor = isNaN(numValue) ? 'red' : '';
								});
						});
						break;
					case "slider":
						setting.addSlider(slider => {
							const min = settingDef.min ?? 0;
							const max = settingDef.max ?? 100;
							const step = settingDef.step ?? 1;
							slider
								.setLimits(min, max, step)
								// Ensure value is a number and within bounds before setting
								.setValue(Math.max(min, Math.min(max, Number(currentValue ?? settingDef.default))))
								.setDynamicTooltip()
								.onChange(async (value) => {
									scriptValues[settingDef.key] = value; // Store as number
									await this.plugin.saveSettings();
								});
						});
						break;
					case "toggle":
						setting.addToggle(toggle => {
							toggle.setValue(Boolean(currentValue ?? settingDef.default)) // Ensure boolean
								.onChange(async (value) => {
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					case "dropdown":
						setting.addDropdown(dropdown => {
							// --- MODIFIED: Use settingDef.options directly (type is now correct) ---
							const options = settingDef.options || [];
							options.forEach(option => {
								// Allow options to be simple strings or {value: string, display: string}
								if (typeof option === 'string') {
									dropdown.addOption(option, option);
								} else if (typeof option === 'object' && option !== null && 'value' in option && 'display' in option) {
									// Check for null and properties explicitly for type safety
									dropdown.addOption(option.value, option.display);
								}
							});
							// Ensure the current value exists in the options, otherwise use default
							const validValue = options.some(opt => (typeof opt === 'string' ? opt : opt.value) === currentValue)
								? currentValue
								: settingDef.default;
							dropdown.setValue(String(validValue ?? '')) // Ensure string for matching option key
								.onChange(async (value) => {
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					default:
						// Fallback for unknown types: display as text? Or show error?
						setting.addText(text => {
							text.setValue(String(currentValue ?? ''))
								.setDisabled(true) // Disable editing for unknown type
								.setPlaceholder(`Unknown setting type: ${settingDef.type}`);
						});
						this.plugin.logWarn(`Unknown setting type "${settingDef.type}" for key "${settingDef.key}" in script "${relativePath}"`);
				}
			}
		}
	}
}
