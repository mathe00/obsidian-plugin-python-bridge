// --- src/PythonBridgeSettingTab.ts ---
import { App, PluginSettingTab, Setting, normalizePath, ButtonComponent, Notice, SearchComponent, AbstractInputSuggest, TFolder, TAbstractFile, TextComponent, debounce } from "obsidian"; // Import debounce
// --- MODIFIED: Import DEFAULT_PORT ---
// --- MODIFIED: Import type for plugin and constant from constants.ts ---
import type ObsidianPythonBridge from "./main";
import { DEFAULT_PORT } from "./constants";
import { t, loadTranslations, getAvailableLanguages } from "./lang/translations"; // Import helpers
// --- REMOVED: Import FolderSuggest (now defined inline) ---
import * as path from "path"; // Import path for relative path calculation
import * as fs from "fs"; // Import fs for absolute path check

// --- NEW: Inline FolderSuggest class definition ---
// Inspired by Obsidian's internal file suggester and AutoNoteMover example
class FolderSuggest extends AbstractInputSuggest<TFolder> {
	constructor(
		app: App,
		private inputEl: HTMLInputElement,
	) {
		super(app, inputEl);
	}

	getSuggestions(inputStr: string): TFolder[] {
		const lowerCaseInputStr = inputStr.toLowerCase();
		// --- MODIFIED: Explicitly get folders first ---
		const allFiles = this.app.vault.getAllLoadedFiles();
		const folders: TFolder[] = [];

		allFiles.forEach((file: TAbstractFile) => {
			// Ensure we only consider actual TFolder objects
			if (file instanceof TFolder) {
				// Check if the folder path contains the input string AND is not __pycache__
				if (
					file.name !== "__pycache__" && // <--- Ignore __pycache__
					file.path.toLowerCase().contains(lowerCaseInputStr)
				) {
					folders.push(file);
				}
			}
		});

		// Sort folders alphabetically by path
		folders.sort((a, b) => a.path.localeCompare(b.path));

		return folders;
	}

	renderSuggestion(item: TFolder, el: HTMLElement): void {
		el.setText(item.path); // Display the folder path
	}

	selectSuggestion(item: TFolder): void {
		this.inputEl.value = item.path; // Set input value to the selected path
		this.inputEl.trigger('input'); // Trigger input event to update setting if needed
		this.close(); // Close the suggestion modal
	}
}
// --- End Inline FolderSuggest ---


// Plugin settings tab
export default class PythonBridgeSettingTab extends PluginSettingTab {
	plugin: ObsidianPythonBridge;
	// --- NEW: Debounce delay constant ---
	private readonly DEBOUNCE_DELAY = 750; // milliseconds

	constructor(app: App, plugin: ObsidianPythonBridge) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// Helper to check if a path is a valid directory
	private async isPathValidDirectory(inputPath: string): Promise<boolean> {
		if (!inputPath) return false;
		const trimmedPath = inputPath.trim();
		if (!trimmedPath) return false;

		if (path.isAbsolute(trimmedPath)) {
			try {
				const stats = await fs.promises.stat(trimmedPath);
				return stats.isDirectory();
			} catch (error) {
				return false;
			}
		} else {
			const normalizedRelative = normalizePath(trimmedPath);
			const abstractFile = this.app.vault.getAbstractFileByPath(normalizedRelative);
			return abstractFile instanceof TFolder;
		}
	}


	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Security Warning
		const warningContainer = containerEl.createDiv({
			cls: 'callout python-bridge-security-warning',
			attr: { 'data-callout': 'warning' }
		});
		warningContainer.createEl('strong', { text: t('SETTINGS_SECURITY_WARNING_TITLE') });
		warningContainer.createEl('br');
		warningContainer.appendText(t('SETTINGS_SECURITY_WARNING_TEXT'));
		warningContainer.style.marginBottom = '1.5em';

		// General Plugin Settings
		containerEl.createEl("h2", { text: t("SETTINGS_TAB_TITLE") });

		// Language Selection
		new Setting(containerEl)
			.setName(t("SETTINGS_LANGUAGE_TITLE"))
			.setDesc(t("SETTINGS_LANGUAGE_DESC"))
			.addDropdown((dropdown) => {
				const languages = getAvailableLanguages();
				dropdown.addOption('auto', t('SETTINGS_LANGUAGE_AUTO') || 'Automatic');
				for (const code in languages) {
					if (code !== 'auto') {
						dropdown.addOption(code, languages[code]);
					}
				}
				dropdown
					.setValue(this.plugin.settings.pluginLanguage)
					.onChange(async (value) => {
						this.plugin.settings.pluginLanguage = value;
						await this.plugin.saveSettings();
						loadTranslations(this.plugin);
						this.display();
					});
			});

		// Python Scripts Folder
		new Setting(containerEl)
			.setName(t("SETTINGS_FOLDER_TITLE"))
			.setDesc(t("SETTINGS_FOLDER_DESC"))
			.addSearch(async (search: SearchComponent) => {
				new FolderSuggest(this.app, search.inputEl);
				search
					.setPlaceholder(t("SETTINGS_FOLDER_PLACEHOLDER"))
					.setValue(this.plugin.settings.pythonScriptsFolder)
					// --- MODIFIED: Use debounced validation/saving ---
					.onChange(debounce(async (value: string) => {
						const newValue = value.trim();
						const oldValue = this.plugin.settings.pythonScriptsFolder;
						const isValidDirectory = await this.isPathValidDirectory(newValue);

						if (isValidDirectory) {
							search.inputEl.style.borderColor = ''; // Reset border
							if (oldValue !== newValue) {
								this.plugin.logDebug(`Saving valid folder path: ${newValue}`);
								this.plugin.settings.pythonScriptsFolder = newValue;
								await this.plugin.saveSettings();
								// Trigger settings discovery only if path is valid and changed
								const scriptsFolder = this.plugin.getScriptsFolderPath(); // Re-check path validity
								if (scriptsFolder && this.plugin.pythonExecutable) {
									// No need to await here, let it run in background
									this.plugin.updateScriptSettingsCache(scriptsFolder)
										.then(() => {
											this.plugin.logInfo("Script settings cache updated after folder change.");
											this.display(); // Redraw potentially needed if script settings appeared/disappeared
										})
										.catch(err => this.plugin.logError("Error updating settings cache after folder change:", err));
								} else {
									// This case might happen if python executable disappears between checks
									this.plugin.logWarn("Clearing script settings cache due to invalid folder or missing Python after change.");
									this.plugin.settings.scriptSettingsDefinitions = {};
									this.plugin.settings.scriptSettingsValues = {};
									await this.plugin.saveSettings(); // Save cleared settings
									this.display(); // Redraw needed
								}
							}
						} else {
							// Path is invalid (doesn't exist or is a file)
							// Only show error if the input field is not empty
							if (newValue) {
								search.inputEl.style.borderColor = 'red';
								new Notice(t("NOTICE_INVALID_FOLDER_PATH"));
								this.plugin.logWarn(`Invalid folder path entered: ${newValue}. Not saving.`);
							} else {
								// If field is empty, clear border and save empty path
								search.inputEl.style.borderColor = '';
								if (oldValue !== "") {
									this.plugin.settings.pythonScriptsFolder = "";
									await this.plugin.saveSettings();
									// Clear script settings if path becomes empty
									this.plugin.settings.scriptSettingsDefinitions = {};
									this.plugin.settings.scriptSettingsValues = {};
									await this.plugin.saveSettings();
									this.display();
								}
							}
						}
					}, this.DEBOUNCE_DELAY, true)); // Debounce onChange, true for leading edge execution if needed (optional)

				// Initial validation check on display
				const currentPath = this.plugin.settings.pythonScriptsFolder;
				if (currentPath && !(await this.isPathValidDirectory(currentPath))) {
					search.inputEl.style.borderColor = 'red';
				}
			});


		// HTTP Server Port
		new Setting(containerEl)
			.setName(t("SETTINGS_PORT_TITLE"))
			.setDesc(t("SETTINGS_PORT_DESC"))
			.addText((text: TextComponent) => { // Added type annotation
				text
					.setPlaceholder(String(DEFAULT_PORT))
					.setValue(String(this.plugin.settings.httpPort))
					// --- MODIFIED: Use debounced validation/saving ---
					.onChange(debounce(async (value: string) => {
						const portStr = value.trim();
						// Handle empty input: reset to default
						if (portStr === "") {
							this.plugin.logInfo("Port input cleared, resetting to default.");
							text.inputEl.style.borderColor = ""; // Clear border
							if (this.plugin.settings.httpPort !== DEFAULT_PORT) {
								this.plugin.settings.httpPort = DEFAULT_PORT;
								text.setValue(String(DEFAULT_PORT)); // Update UI
								await this.plugin.saveSettings();
							}
							return; // Stop processing if empty
						}

						const port = parseInt(portStr, 10);
						const isValidPort = !isNaN(port) && (port === 0 || (port >= 1024 && port <= 65535));

						if (isValidPort) {
							text.inputEl.style.borderColor = ""; // Clear border
							if (this.plugin.settings.httpPort !== port) {
								this.plugin.logDebug(`Saving valid port: ${port}`);
								this.plugin.settings.httpPort = port;
								await this.plugin.saveSettings(); // saveSettings handles restart
							}
						} else {
							// Invalid port number or range
							text.inputEl.style.borderColor = "red";
							new Notice(t("NOTICE_INVALID_PORT_RANGE"));
							this.plugin.logWarn(
								`Invalid port entered: ${value}. Must be 0 or between 1024 and 65535. Not saving invalid value.`
							);
							// Do NOT save the invalid value. Keep the last valid one.
							// Optionally revert the input field visually, but might conflict with user typing
							// text.setValue(String(this.plugin.settings.httpPort));
						}
					}, this.DEBOUNCE_DELAY, true)); // Debounce onChange
			});

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
		containerEl.createEl("h2", { text: t("SETTINGS_SCRIPT_SETTINGS_TITLE") });

		// Refresh Button
		new Setting(containerEl)
			.setName(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME"))
			.setDesc(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC"))
			.addButton((button: ButtonComponent) => {
				button
					.setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT"))
					.setCta()
					.onClick(async () => {
						const scriptsFolder = this.plugin.getScriptsFolderPath();
						if (!scriptsFolder) {
							if (this.plugin.settings.pythonScriptsFolder) {
								new Notice(t("NOTICE_INVALID_FOLDER_PATH"));
							} else {
								new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000);
							}
							return;
						}
						if (!this.plugin.pythonExecutable) {
							new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH"), 5000);
							await this.plugin.checkPythonEnvironment();
							if (!this.plugin.pythonExecutable) return;
						}

						button.setDisabled(true).setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING"));
						new Notice(t("NOTICE_REFRESHING_SCRIPT_SETTINGS"));

						try {
							await this.plugin.updateScriptSettingsCache(scriptsFolder);
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS"));
							this.display();
						} catch (error) {
							this.plugin.logError("Manual script settings refresh failed:", error);
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED"));
						} finally {
							if (button.buttonEl && button.disabled) {
								button.setDisabled(false).setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT"));
							}
						}
					});
			});


		// Dynamically generate settings UI for each script
		const definitions = this.plugin.settings.scriptSettingsDefinitions;
		const values = this.plugin.settings.scriptSettingsValues;
		const scriptsFolder = this.plugin.getScriptsFolderPath();

		if (!scriptsFolder) {
			if (!this.plugin.settings.pythonScriptsFolder) {
				containerEl.createEl('p', { text: t("SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED") });
			} else {
				containerEl.createEl('p', { text: t("NOTICE_INVALID_FOLDER_PATH") });
			}
			return;
		}

		const sortedScriptPaths = Object.keys(definitions).sort();

		if (sortedScriptPaths.length === 0) {
			containerEl.createEl('p', { text: t("SETTINGS_NO_SCRIPT_SETTINGS_FOUND") });
		}

		for (const relativePath of sortedScriptPaths) {
			const scriptDefs = definitions[relativePath];
			if (!scriptDefs || scriptDefs.length === 0) continue;

			values[relativePath] = values[relativePath] || {};
			const scriptValues = values[relativePath];

			containerEl.createEl("h3", { text: `${t("SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX")} ${relativePath}` });

			for (const settingDef of scriptDefs) {
				const setting = new Setting(containerEl)
					.setName(settingDef.label || settingDef.key)
					.setDesc(settingDef.description || "");

				const currentValue = scriptValues.hasOwnProperty(settingDef.key)
					? scriptValues[settingDef.key]
					: settingDef.default;

				switch (settingDef.type) {
					case "text":
						setting.addText(text => {
							text.setValue(String(currentValue ?? ''))
								.onChange(debounce(async (value) => { // Debounce simple text too
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								}, this.DEBOUNCE_DELAY));
						});
						break;
					case "textarea":
						setting.addTextArea(text => {
							text.setValue(String(currentValue ?? ''))
								.onChange(debounce(async (value) => { // Debounce textarea
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								}, this.DEBOUNCE_DELAY));
							text.inputEl.rows = 4;
						});
						break;
					case "number":
						setting.addText(text => {
							text.inputEl.type = "number";
							if (settingDef.min !== undefined && settingDef.min !== null) text.inputEl.min = String(settingDef.min);
							if (settingDef.max !== undefined && settingDef.max !== null) text.inputEl.max = String(settingDef.max);
							if (settingDef.step !== undefined && settingDef.step !== null) text.inputEl.step = String(settingDef.step);

							text.setValue(String(currentValue ?? settingDef.default ?? ''))
								.onChange(debounce(async (value) => { // Debounce number input
									const numValue = value === '' ? settingDef.default : parseFloat(value);
									// Basic validation within number type itself (min/max handled by browser)
									const isValidNumber = !isNaN(numValue);
									text.inputEl.style.borderColor = isValidNumber ? '' : 'red';
									// Save the parsed number or the default if parsing failed
									scriptValues[settingDef.key] = isValidNumber ? numValue : settingDef.default;
									await this.plugin.saveSettings();
								}, this.DEBOUNCE_DELAY));
						});
						break;
					// Slider, Toggle, Dropdown usually don't need debounce as they change on specific actions
					case "slider":
						setting.addSlider(slider => {
							const min = settingDef.min ?? 0;
							const max = settingDef.max ?? 100;
							const step = settingDef.step ?? 1;
							slider
								.setLimits(min, max, step)
								.setValue(Math.max(min, Math.min(max, Number(currentValue ?? settingDef.default))))
								.setDynamicTooltip()
								.onChange(async (value) => { // Save immediately on slider change
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					case "toggle":
						setting.addToggle(toggle => {
							toggle.setValue(Boolean(currentValue ?? settingDef.default))
								.onChange(async (value) => { // Save immediately on toggle
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					case "dropdown":
						setting.addDropdown(dropdown => {
							const options = settingDef.options || [];
							options.forEach(option => {
								if (typeof option === 'string') {
									dropdown.addOption(option, option);
								} else if (typeof option === 'object' && option !== null && 'value' in option && 'display' in option) {
									dropdown.addOption(option.value, option.display);
								}
							});
							const validValue = options.some(opt => (typeof opt === 'string' ? opt : opt.value) === currentValue)
								? currentValue
								: settingDef.default;
							dropdown.setValue(String(validValue ?? ''))
								.onChange(async (value) => { // Save immediately on dropdown change
									scriptValues[settingDef.key] = value;
									await this.plugin.saveSettings();
								});
						});
						break;
					default:
						setting.addText(text => {
							text.setValue(String(currentValue ?? ''))
								.setDisabled(true)
								.setPlaceholder(`Unknown setting type: ${settingDef.type}`);
						});
						this.plugin.logWarn(`Unknown setting type "${settingDef.type}" for key "${settingDef.key}" in script "${relativePath}"`);
				}
			}
		}
	}
}
