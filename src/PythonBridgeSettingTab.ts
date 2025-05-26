// --- src/PythonBridgeSettingTab.ts ---
import {
	App,
	PluginSettingTab,
	Setting,
	normalizePath,
	ButtonComponent,
	Notice,
	SearchComponent,
	AbstractInputSuggest,
	TFolder,
	TAbstractFile,
	TextComponent,
	debounce,
} from "obsidian"; // Import debounce
import type ObsidianPythonBridge from "./main";
// Import helpers moved out of main.ts
import {
	getScriptsFolderPath,
	updateAndSyncCommands,
} from "./python_executor";
import { checkPythonEnvironment } from "./environment_checker";
import { DEFAULT_PORT, PYTHON_LIBRARY_FILENAME } from "./constants";
import {
	t,
	loadTranslations,
	getAvailableLanguages,
} from "./lang/translations"; // Import helpers
import * as path from "path"; // Import path for relative path calculation
import * as fs from "fs"; // Import fs for absolute path check

// Inline FolderSuggest class definition
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
		const allFiles = this.app.vault.getAllLoadedFiles();
		const folders: TFolder[] = [];
		allFiles.forEach((file: TAbstractFile) => {
			// Ensure we only consider actual TFolder objects
			if (file instanceof TFolder) {
				// Check if the folder path contains the input string AND is not __pycache__
				if (
					file.name !== "__pycache__" &&
					file.path.toLowerCase().contains(lowerCaseInputStr)
				) {
					// <--- Ignore __pycache__
					folders.push(file);
				}
			}
		});
		// Sort folders alphabetically by path
		folders.sort((a, b) => a.path.localeCompare(b.path));
		return folders;
	}

	renderSuggestion(item: TFolder, el: HTMLElement): void {
		el.setText(item.path);
	} // Display the folder path

	selectSuggestion(item: TFolder): void {
		this.inputEl.value = item.path; // Set input value to the selected path
		this.inputEl.trigger("input"); // Trigger input event to update setting if needed
		this.close(); // Close the suggestion modal
	}
}
// End Inline FolderSuggest

// Plugin settings tab
export default class PythonBridgeSettingTab extends PluginSettingTab {
	plugin: ObsidianPythonBridge;
	// Debounce delay constant
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
			const abstractFile =
				this.app.vault.getAbstractFileByPath(normalizedRelative);
			return abstractFile instanceof TFolder;
		}
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Security Warning
		const warningContainer = containerEl.createDiv({
			cls: "callout python-bridge-security-warning-callout",
			attr: { "data-callout": "warning" },
		});
		warningContainer.createEl("strong", {
			text: t("SETTINGS_SECURITY_WARNING_TITLE"),
		});
		warningContainer.createEl("br");
		warningContainer.appendText(t("SETTINGS_SECURITY_WARNING_TEXT"));

		// General Plugin Settings
		containerEl.createEl("h2", { text: t("SETTINGS_TAB_TITLE") });

		// Language Selection
		new Setting(containerEl)
			.setName(t("SETTINGS_LANGUAGE_TITLE"))
			.setDesc(t("SETTINGS_LANGUAGE_DESC"))
			.addDropdown((dropdown) => {
				const languages = getAvailableLanguages();
				dropdown.addOption("auto", t("SETTINGS_LANGUAGE_AUTO") || "Automatic");
				for (const code in languages) {
					if (code !== "auto") dropdown.addOption(code, languages[code]);
				}
				dropdown
					.setValue(this.plugin.settings.pluginLanguage)
					.onChange(async (value) => {
						this.plugin.settings.pluginLanguage = value;
						await this.plugin.saveSettings();
						loadTranslations(this.plugin);
						this.display(); // Redraw settings tab with new language
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
					// Use debounced validation/saving
					.onChange(
						debounce(
							async (value: string) => {
								const newValue = value.trim();
								const oldValue = this.plugin.settings.pythonScriptsFolder;
								const isValidDirectory =
									await this.isPathValidDirectory(newValue);
								if (isValidDirectory) {
									search.inputEl.classList.remove(
										"python-bridge-input-error",
									);
									if (oldValue !== newValue) {
										this.plugin.logDebug(
											`Saving valid folder path: ${newValue}`,
										);
										this.plugin.settings.pythonScriptsFolder = newValue;
										await this.plugin.saveSettings();
										// Trigger settings discovery & command sync only if path is valid and changed
										const scriptsFolder = getScriptsFolderPath(this.plugin); // Re-check path validity
										if (scriptsFolder && this.plugin.pythonExecutable) {
											updateAndSyncCommands(
												this.plugin,
												scriptsFolder,
											) // Call updateAndSyncCommands
												.then(() => {
													this.plugin.logInfo(
														"Script settings cache & commands updated after folder change.",
													);
													this.display(); // Redraw potentially needed if script settings appeared/disappeared
												})
												.catch((err) =>
													this.plugin.logError(
														"Error updating settings cache & commands after folder change:",
														err,
													),
												);
										} else {
											// This case might happen if python executable disappears between checks
											this.plugin.logWarn(
												"Clearing script settings cache & commands due to invalid folder or missing Python after change.",
											);
											this.plugin.settings.scriptSettingsDefinitions = {};
											this.plugin.settings.scriptSettingsValues = {};
											this.plugin.settings.scriptActivationStatus = {}; // Clear activation status too
											this.plugin.settings.scriptAutoStartStatus = {}; // Clear auto-start status too
											this.plugin.settings.scriptAutoStartDelay = {}; // Clear auto-start delay too
											await this.plugin.saveSettings(); // Save cleared settings
											this.display(); // Redraw needed
										}
									}
								} else {
									// Path is invalid (doesn't exist or is a file)
									// Only show error if the input field is not empty
									if (newValue) {
										search.inputEl.classList.add(
											"python-bridge-input-error",
										);
										new Notice(t("NOTICE_INVALID_FOLDER_PATH"));
										this.plugin.logWarn(
											`Invalid folder path entered: ${newValue}. Not saving.`,
										);
									} else {
										// If field is empty, clear border and save empty path
										search.inputEl.classList.remove(
											"python-bridge-input-error",
										);
										if (oldValue !== "") {
											this.plugin.settings.pythonScriptsFolder = "";
											await this.plugin.saveSettings();
											// Clear script settings if path becomes empty
											this.plugin.settings.scriptSettingsDefinitions = {};
											this.plugin.settings.scriptSettingsValues = {};
											this.plugin.settings.scriptActivationStatus = {}; // Clear activation status too
											this.plugin.settings.scriptAutoStartStatus = {}; // Clear auto-start status too
											this.plugin.settings.scriptAutoStartDelay = {}; // Clear auto-start delay too
											await this.plugin.saveSettings();
											this.display();
										}
									}
								}
							},
							this.DEBOUNCE_DELAY,
							true,
						),
					); // Debounce onChange, true for leading edge execution if needed (optional)

				// Initial validation check on display
				const currentPath = this.plugin.settings.pythonScriptsFolder;
				if (
					currentPath &&
					!(await this.isPathValidDirectory(currentPath))
				) {
					search.inputEl.classList.add("python-bridge-input-error");
				}
			});

		// Custom Python Executable Path
		new Setting(containerEl)
			.setName(
				t("SETTINGS_PYTHON_EXEC_PATH_TITLE") || "Python Executable Path",
			)
			.setDesc(
				t("SETTINGS_PYTHON_EXEC_PATH_DESC") ||
					"Absolute path to your Python or uv executable. Leave empty for auto-detection (uv, py, python3, python). Requires plugin reload or restart to take full effect if changed.",
			)
			.addText((text) => {
				text.setPlaceholder(
					t("SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER") ||
						"e.g., /usr/bin/python3 or C:\\Python39\\python.exe",
				).setValue(this.plugin.settings.pythonExecutablePath); // Semicolon to terminate the .setValue() call.

				// Function to handle the visual validation (red border)
				const performVisualValidation = (currentValue: string) => {
					const currentTrimmedPath = currentValue.trim();
					let showVisualError = false;
					if (currentTrimmedPath) {
						// Only validate if the path is not empty
						if (path.isAbsolute(currentTrimmedPath)) {
							try {
								// Check if the absolute path exists and is a file
								if (
									!(
										fs.existsSync(currentTrimmedPath) &&
										fs.statSync(currentTrimmedPath).isFile()
									)
								) {
									showVisualError = true; // Absolute path, but not a valid file
								}
							} catch (e) {
								this.plugin.logWarn(
									`Error checking custom executable path '${currentTrimmedPath}' for visual feedback:`,
									e,
								);
								showVisualError = true; // Error during check, assume invalid for visual feedback
							}
						}
						// If not absolute (e.g., "python", "uv"), we don't set showVisualError = true here.
						// The actual validation for these PATH-based commands will happen in checkPythonEnvironment.
					}

					if (showVisualError) {
						text.inputEl.classList.add("python-bridge-input-error");
					} else {
						text.inputEl.classList.remove("python-bridge-input-error");
					}
				};

				// Apply initial visual validation in case an invalid path is already saved from previous settings
				performVisualValidation(this.plugin.settings.pythonExecutablePath);

				// Visual validation on 'input' event, debounced to run after user stops typing
				const debouncedVisualValidation = debounce(
					() => {
						// Wrap the call to pass the current value from text.inputEl
						performVisualValidation(text.inputEl.value);
					},
					this.DEBOUNCE_DELAY,
					false, // Trailing edge: execute after the delay
				);
				// Listen to 'input' for live-ish visual feedback
				text.inputEl.addEventListener("input", debouncedVisualValidation);

				// Logic for saving settings and re-checking environment on 'blur' (loss of focus)
				text.inputEl.addEventListener("blur", async (event) => {
					const newPath = (
						event.target as HTMLInputElement
					).value.trim();

					// Perform final visual validation on blur, without debounce, to ensure correct state
					performVisualValidation(newPath);

					// Only save and re-check if the path has actually changed from what's currently stored
					if (this.plugin.settings.pythonExecutablePath !== newPath) {
						this.plugin.settings.pythonExecutablePath = newPath;
						await this.plugin.saveSettings();
						this.plugin.logInfo(
							`Custom Python executable path set to: '${newPath}'. Re-checking environment.`,
						);

						// This re-check is important as it updates plugin.pythonExecutable
						// and provides Notices if the chosen path (custom or auto-detected fallback) is ultimately unusable.
						await checkPythonEnvironment(this.plugin);

						const scriptsFolder = getScriptsFolderPath(this.plugin);
						if (scriptsFolder && this.plugin.pythonExecutable) {
							// If a valid executable (custom or fallback) is now set and scripts folder is valid,
							// refresh scripts.
							new Notice(
								t("NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING") ||
									"Python path changed, refreshing scripts...",
							);
							await updateAndSyncCommands(this.plugin, scriptsFolder);
						} else if (newPath && !this.plugin.pythonExecutable) {
							// If a custom path was provided but it (and any fallback) failed.
							new Notice(
								t("NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK") ||
									"Custom Python path is invalid, and no fallback found. Scripts may not run.",
							);
						}
						// Consider if this.display() is needed if checkPythonEnvironment changes state that affects UI
						// For now, assuming Notices are sufficient for feedback on this specific setting change.
					}
				});
			}); // This was the missing closing parenthesis for .addText()

		// HTTP Server Port
		new Setting(containerEl)
			.setName(t("SETTINGS_PORT_TITLE"))
			.setDesc(t("SETTINGS_PORT_DESC"))
			.addText((text: TextComponent) => {
				// Added type annotation
				text.setPlaceholder(String(DEFAULT_PORT))
					.setValue(String(this.plugin.settings.httpPort))
					// Use debounced validation/saving
					.onChange(
						debounce(
							async (value: string) => {
								const portStr = value.trim();
								// Handle empty input: reset to default
								if (portStr === "") {
									this.plugin.logInfo(
										"Port input cleared, resetting to default.",
									);
									text.inputEl.classList.remove(
										"python-bridge-input-error",
									);
									text.inputEl.style.borderColor = ""; // Clear border
									if (this.plugin.settings.httpPort !== DEFAULT_PORT) {
										this.plugin.settings.httpPort = DEFAULT_PORT;
										text.setValue(String(DEFAULT_PORT)); // Update UI
										await this.plugin.saveSettings();
									}
									return; // Stop processing if empty
								}
								const port = parseInt(portStr, 10);
								const isValidPort =
									!isNaN(port) &&
									(port === 0 || (port >= 1024 && port <= 65535));
								if (isValidPort) {
									text.inputEl.classList.remove(
										"python-bridge-input-error",
									);
									if (this.plugin.settings.httpPort !== port) {
										this.plugin.logDebug(`Saving valid port: ${port}`);
										this.plugin.settings.httpPort = port;
										await this.plugin.saveSettings(); // saveSettings handles restart
									}
								} else {
									// Invalid port number or range
									text.inputEl.classList.add("python-bridge-input-error");
									new Notice(t("NOTICE_INVALID_PORT_RANGE"));
									this.plugin.logWarn(
										`Invalid port entered: ${value}. Must be 0 or between 1024 and 65535. Not saving invalid value.`,
									);
									// Do NOT save the invalid value. Keep the last valid one.
									// Optionally revert the input field visually, but might conflict with user typing
									// text.setValue(String(this.plugin.settings.httpPort));
								}
							},
							this.DEBOUNCE_DELAY,
							true,
						),
					); // Debounce onChange
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

		// Auto-set PYTHONPATH Toggle
		new Setting(containerEl)
			.setName(t("SETTINGS_AUTO_PYTHONPATH_NAME"))
			.setDesc(t("SETTINGS_AUTO_PYTHONPATH_DESC"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoSetPYTHONPATH)
					.onChange(async (value) => {
						this.plugin.settings.autoSetPYTHONPATH = value;
						await this.plugin.saveSettings();
						this.plugin.logInfo(
							`Automatic PYTHONPATH setting changed to: ${value}`,
						);
						// Optionally add a notice if disabled, explaining the consequence
						if (!value) {
							new Notice(
								t("NOTICE_AUTO_PYTHONPATH_DISABLED_DESC"),
								6000,
							);
						}
					}),
			);

		// Script Specific Settings
		containerEl.createEl("h2", {
			text: t("SETTINGS_SCRIPT_SETTINGS_TITLE"),
		});

		// Refresh Button
		new Setting(containerEl)
			.setName(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME"))
			.setDesc(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC"))
			.addButton((button: ButtonComponent) => {
				button
					.setButtonText(t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT"))
					.setCta()
					.onClick(async () => {
						const scriptsFolder = getScriptsFolderPath(this.plugin);
						if (!scriptsFolder) {
							if (this.plugin.settings.pythonScriptsFolder)
								new Notice(t("NOTICE_INVALID_FOLDER_PATH"));
							else
								new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000);
							return;
						}
						if (!this.plugin.pythonExecutable) {
							new Notice(
								t("NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH"),
								5000,
							);
							await checkPythonEnvironment(this.plugin); // Re-check env
							if (!this.plugin.pythonExecutable) return;
						}
						button
							.setDisabled(true)
							.setButtonText(
								t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING"),
							);
						new Notice(t("NOTICE_REFRESHING_SCRIPT_SETTINGS"));
						try {
							await updateAndSyncCommands(this.plugin, scriptsFolder); // Call updateAndSyncCommands
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS"));
							this.display(); // Redraw to show updated settings/scripts
						} catch (error) {
							this.plugin.logError(
								"Manual script settings refresh failed:",
								error,
							);
							new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED"));
						} finally {
							// Ensure button is re-enabled even if display() fails or is interrupted
							if (button.buttonEl && button.disabled) {
								button
									.setDisabled(false)
									.setButtonText(
										t("SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT"),
									);
							}
						}
					});
			});

		// Logic to display ALL scripts
		const scriptsFolder = getScriptsFolderPath(this.plugin);
		const definitions = this.plugin.settings.scriptSettingsDefinitions;
		const values = this.plugin.settings.scriptSettingsValues;
		const activationStatus = this.plugin.settings.scriptActivationStatus;
		const autoStartStatus = this.plugin.settings.scriptAutoStartStatus;
		const autoStartDelay = this.plugin.settings.scriptAutoStartDelay;

		if (!scriptsFolder) {
			if (!this.plugin.settings.pythonScriptsFolder)
				containerEl.createEl("p", {
					text: t("SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED"),
				});
			else
				containerEl.createEl("p", {
					text: t("NOTICE_INVALID_FOLDER_PATH"),
				}); // Folder path is set but invalid
			return; // Stop here if folder is invalid/not set
		}

		// Get all valid Python script files from the folder
		let scriptFiles: string[];
		try {
			scriptFiles = fs
				.readdirSync(scriptsFolder)
				.filter(
					(f) =>
						f.toLowerCase().endsWith(".py") &&
						!f.startsWith(".") &&
						f !== PYTHON_LIBRARY_FILENAME,
				); // Exclude library
		} catch (error) {
			this.plugin.logError(
				"Error reading scripts folder in settings tab:",
				error,
			);
			containerEl.createEl("p", {
				text:
					t("NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX") +
					(error instanceof Error ? error.message : String(error)),
			});
			return; // Stop if folder cannot be read
		}

		// Sort script files alphabetically
		scriptFiles.sort((a, b) => a.localeCompare(b));

		if (scriptFiles.length === 0) {
			containerEl.createEl("p", { text: t("NOTICE_NO_SCRIPTS_FOUND") }); // Use the existing "no scripts" notice
		} else {
			// Iterate through ALL found script files
			for (const scriptFilename of scriptFiles) {
				const absolutePath = path.join(scriptsFolder, scriptFilename);
				// Calculate relative path for settings keys
				const relativePath = normalizePath(
					path.relative(scriptsFolder, absolutePath),
				);

				// Ensure activation status exists (default true)
				if (activationStatus[relativePath] === undefined)
					activationStatus[relativePath] = true;
				const isScriptActive = activationStatus[relativePath];

				// Display section for EACH script
				containerEl.createEl("h3", {
					text: `${t("SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX")} ${scriptFilename}`,
				}); // Use filename for title

				// Activation Toggle (Always shown)
				new Setting(containerEl)
					.setName(t("SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME"))
					.setDesc(t("SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC"))
					.addToggle((toggle) =>
						toggle
							.setValue(isScriptActive)
							.onChange(async (value) => {
								activationStatus[relativePath] = value;
								await this.plugin.saveSettings();
								this.plugin.logInfo(
									`Script '${relativePath}' activation status set to: ${value}`,
								);
								this.display(); // Redraw needed to show/hide auto-start options
							}),
					);

				// Auto-start Toggle (Only if script is active)
				if (isScriptActive) {
					// Ensure auto-start status exists (default false)
					if (autoStartStatus[relativePath] === undefined)
						autoStartStatus[relativePath] = false;
					const isAutoStartEnabled = autoStartStatus[relativePath];

					new Setting(containerEl)
						.setName(t("SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME")) // New translation key
						.setDesc(t("SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC")) // New translation key
						.addToggle((toggle) =>
							toggle
								.setValue(isAutoStartEnabled)
								.onChange(async (value) => {
									autoStartStatus[relativePath] = value;
									await this.plugin.saveSettings();
									this.plugin.logInfo(
										`Script '${relativePath}' auto-start status set to: ${value}`,
									);
									this.display(); // Redraw needed to show/hide delay input
								}),
						);

					// Auto-start Delay Input (Only if auto-start is enabled)
					if (isAutoStartEnabled) {
						// Ensure delay value exists (default 0)
						if (autoStartDelay[relativePath] === undefined)
							autoStartDelay[relativePath] = 0;
						const currentDelay = autoStartDelay[relativePath];

						new Setting(containerEl)
							.setName(t("SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME")) // New translation key
							.setDesc(t("SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC")) // New translation key
							.addText((text) => {
								text.inputEl.type = "number";
								text.inputEl.min = "0"; // Minimum delay is 0
								text.setPlaceholder("0")
									.setValue(String(currentDelay))
									.onChange(
										debounce(async (value) => {
											const delayStr = value.trim();
											let delayNum = parseInt(delayStr, 10);
											// Validate: must be a non-negative integer
											if (isNaN(delayNum) || delayNum < 0) {
												text.inputEl.classList.add(
													"python-bridge-input-error",
												);
												this.plugin.logWarn(
													`Invalid auto-start delay entered: ${value}. Using 0.`,
												);
												delayNum = 0; // Reset to default if invalid
												// text.setValue("0"); // This might interfere with typing
											} else {
												text.inputEl.classList.remove(
													"python-bridge-input-error",
												);
											}
											// Save only if the valid number changed
											if (autoStartDelay[relativePath] !== delayNum) {
												autoStartDelay[relativePath] = delayNum;
												await this.plugin.saveSettings();
												this.plugin.logInfo(
													`Script '${relativePath}' auto-start delay set to: ${delayNum} seconds.`,
												);
											}
										}, this.DEBOUNCE_DELAY),
									); // Use debounce
							});
					}
				}

				// Conditionally display specific settings
				const scriptDefs = definitions[relativePath];
				if (scriptDefs && scriptDefs.length > 0) {
					// Ensure scriptValues object exists if definitions exist
					values[relativePath] = values[relativePath] || {};
					const scriptValues = values[relativePath];

					// Loop through specific settings ONLY if definitions exist
					for (const settingDef of scriptDefs) {
						const setting = new Setting(containerEl)
							.setName(settingDef.label || settingDef.key)
							.setDesc(settingDef.description || "");
						const currentValue = scriptValues.hasOwnProperty(settingDef.key)
							? scriptValues[settingDef.key]
							: settingDef.default;

						// Switch statement for different setting types (unchanged from previous version)
						switch (settingDef.type) {
							case "text":
								setting.addText((text) =>
									text
										.setValue(String(currentValue ?? ""))
										.onChange(
											debounce(async (value) => {
												scriptValues[settingDef.key] = value;
												await this.plugin.saveSettings();
											}, this.DEBOUNCE_DELAY),
										),
								);
								break;
							case "textarea":
								setting.addTextArea((text) => {
									text.setValue(String(currentValue ?? "")).onChange(
										debounce(async (value) => {
											scriptValues[settingDef.key] = value;
											await this.plugin.saveSettings();
										}, this.DEBOUNCE_DELAY),
									);
									text.inputEl.rows = 4;
								});
								break;
							case "number": // Applying the compact style requested earlier
								setting.addText((text) => {
									text.inputEl.type = "number";
									if (
										settingDef.min !== undefined &&
										settingDef.min !== null
									)
										text.inputEl.min = String(settingDef.min);
									if (
										settingDef.max !== undefined &&
										settingDef.max !== null
									)
										text.inputEl.max = String(settingDef.max);
									if (
										settingDef.step !== undefined &&
										settingDef.step !== null
									)
										text.inputEl.step = String(settingDef.step);
									text.setValue(
										String(currentValue ?? settingDef.default ?? ""),
									).onChange(
										debounce(async (value) => {
											const numValue =
												value === ""
													? settingDef.default
													: parseFloat(value);
											const isValidNumber = !isNaN(numValue);
											if (isValidNumber) {
												text.inputEl.classList.remove(
													"python-bridge-input-error",
												);
											} else {
												text.inputEl.classList.add(
													"python-bridge-input-error",
												);
											}
											scriptValues[settingDef.key] = isValidNumber
												? numValue
												: settingDef.default;
											await this.plugin.saveSettings();
										}, this.DEBOUNCE_DELAY),
									);
								});
								break;
							case "slider":
								setting.addSlider((slider) => {
									const min = settingDef.min ?? 0;
									const max = settingDef.max ?? 100;
									const step = settingDef.step ?? 1;
									slider
										.setLimits(min, max, step)
										.setValue(
											Math.max(
												min,
												Math.min(
													max,
													Number(currentValue ?? settingDef.default),
												),
											),
										)
										.setDynamicTooltip()
										.onChange(async (value) => {
											scriptValues[settingDef.key] = value;
											await this.plugin.saveSettings();
										});
								});
								break;
							case "toggle":
								setting.addToggle((toggle) =>
									toggle
										.setValue(Boolean(currentValue ?? settingDef.default))
										.onChange(async (value) => {
											scriptValues[settingDef.key] = value;
											await this.plugin.saveSettings();
										}),
								);
								break;
							case "dropdown":
								setting.addDropdown((dropdown) => {
									const options = settingDef.options || [];
									options.forEach((option) => {
										if (typeof option === "string")
											dropdown.addOption(option, option);
										else if (
											typeof option === "object" &&
											option !== null &&
											"value" in option &&
											"display" in option
										)
											dropdown.addOption(option.value, option.display);
									});
									const validValue = options.some((opt) =>
										(typeof opt === "string" ? opt : opt.value) ===
										currentValue,
									)
										? currentValue
										: settingDef.default;
									dropdown
										.setValue(String(validValue ?? ""))
										.onChange(async (value) => {
											scriptValues[settingDef.key] = value;
											await this.plugin.saveSettings();
										});
								});
								break;
							default:
								setting.addText((text) =>
									text
										.setValue(String(currentValue ?? ""))
										.setDisabled(true)
										.setPlaceholder(
											`Unknown setting type: ${settingDef.type}`,
										),
								);
								this.plugin.logWarn(
									`Unknown setting type "${settingDef.type}" for key "${settingDef.key}" in script "${relativePath}"`,
								);
						}
					} // End loop for specific settings
				} // End conditional display of specific settings
			} // End loop for ALL scripts
		} // End else (scripts found)
	} // End display()
} // End class