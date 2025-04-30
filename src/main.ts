// --- src/main.ts ---
import {
	App,
	Notice,
	Plugin,
	TFile,
	TAbstractFile,
	MarkdownView,
	FileSystemAdapter,
	PluginSettingTab,
	Setting,
	Editor,
	PaneType,
	OpenViewState,
	normalizePath,
	LinkCache,
} from "obsidian";
import { spawn, ChildProcess, SpawnOptionsWithoutStdio, exec } from "child_process";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as os from "os";
import { AddressInfo } from "net";

// Import other components
import PythonBridgeSettingTab from "./PythonBridgeSettingTab";
import UserInputModal from "./UserInputModal";
import { loadTranslations, t } from "./lang/translations"; // Import the loader AND the function t
import ScriptSelectionModal from "./ScriptSelectionModal";
import { DEFAULT_PORT, SETTINGS_DISCOVERY_TIMEOUT } from "./constants";

// --- Interfaces ---

// Type for dropdown options
type DropdownOption = string | { value: string; display: string };

interface ScriptSettingDefinition {
	key: string;
	type: "text" | "textarea" | "number" | "toggle" | "dropdown" | "slider";
	label: string;
	description: string;
	default: any;
	// --- MODIFIED: Use the new DropdownOption type ---
	options?: DropdownOption[];
	min?: number;
	max?: number;
	step?: number;
}

interface PythonBridgeSettings {
	pythonScriptsFolder: string;
	httpPort: number;
	disablePyCache: boolean;
	pluginLanguage: string; // Added setting for language override
	// --- NEW: Script Settings Storage ---
	/** Cache of settings definitions discovered from Python scripts. Key: relative script path */
	scriptSettingsDefinitions: Record<string, ScriptSettingDefinition[]>;
	/** User-configured values for script settings. Key: relative script path, Value: { settingKey: value } */
	scriptSettingsValues: Record<string, Record<string, any>>;
}

const DEFAULT_SETTINGS: PythonBridgeSettings = {
	pythonScriptsFolder: "",
	httpPort: DEFAULT_PORT,
	disablePyCache: true,
	pluginLanguage: 'auto', // Default to automatic detection
	// --- NEW: Initialize script settings storage ---
	scriptSettingsDefinitions: {},
	scriptSettingsValues: {},
};

interface JsonResponse {
	status: "success" | "error";
	data?: any;
	error?: string;
}

interface JsonRequest {
	action: string;
	payload?: any;
}

// --- Main Plugin Class ---
export default class ObsidianPythonBridge extends Plugin {
	settings!: PythonBridgeSettings;
	server: http.Server | null = null;
	initialHttpPort: number = 0; // Store the port used at server start
	// --- NEW: Store the detected Python executable ---
	pythonExecutable: string | null = null;

	// --- Logging Helpers ---
	logDebug(message: string, ...optionalParams: any[]) {
		console.log(`plugin:obsidian-python-bridge:DEBUG: ${message}`, ...optionalParams);
	}

	logInfo(message: string, ...optionalParams: any[]) {
		console.log(`plugin:obsidian-python-bridge:INFO: ${message}`, ...optionalParams);
	}

	logWarn(message: string, ...optionalParams: any[]) {
		console.warn(`plugin:obsidian-python-bridge:WARN: ${message}`, ...optionalParams);
	}

	logError(message: string, ...optionalParams: any[]) {
		console.error(`plugin:obsidian-python-bridge:ERROR: ${message}`, ...optionalParams);
	}

	// --- Plugin Lifecycle ---
	async onload() {
		this.logInfo("Loading Obsidian Python Bridge plugin...");
		await this.loadSettings();
		loadTranslations(this); // Load translations, passing the plugin instance
		this.initialHttpPort = this.settings.httpPort; // Store initial port

		this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
		this.addCommands(); // Add commands (including the new refresh command)

		// --- MODIFIED: Perform environment check BEFORE starting server or discovering settings ---
		const envCheckOk = await this.checkPythonEnvironment();

		if (envCheckOk) {
			this.startHttpServer(); // Start server only if Python env is okay

			// --- NEW: Discover script settings after finding Python and scripts folder ---
			const scriptsFolder = this.getScriptsFolderPath();
			if (scriptsFolder && this.pythonExecutable) {
				// Run discovery asynchronously, don't block loading
				this.updateScriptSettingsCache(scriptsFolder).catch((err) => {
					this.logError("Initial script settings discovery failed:", err);
				});
			} else {
				this.logWarn("Skipping initial script settings discovery: Python executable or scripts folder not found.");
			}
		} else {
			this.logWarn("Skipping server start and settings discovery due to Python environment issues.");
		}

		// Register cleanup on quit
		this.registerEvent(
			this.app.workspace.on("quit", () => {
				this.logInfo("Obsidian quitting, stopping HTTP server...");
				this.stopHttpServer();
			}),
		);
		this.logInfo("Obsidian Python Bridge plugin loaded.");
	}

	onunload() {
		this.logInfo("Unloading Obsidian Python Bridge plugin...");
		this.stopHttpServer(); // Ensure server is stopped on unload
		this.logInfo("Obsidian Python Bridge plugin unloaded.");
	}

	// --- Settings Management ---
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
		// --- NEW: Ensure new settings fields exist ---
		this.settings.scriptSettingsDefinitions = this.settings.scriptSettingsDefinitions || {};
		this.settings.scriptSettingsValues = this.settings.scriptSettingsValues || {};

		// Validate loaded port
		if (
			typeof this.settings.httpPort !== "number" ||
			!Number.isInteger(this.settings.httpPort) ||
			// Allow port 0 for dynamic assignment
			(this.settings.httpPort !== 0 && (this.settings.httpPort <= 0 || this.settings.httpPort > 65535))
		) {
			this.logWarn(
				`Invalid httpPort loaded (${this.settings.httpPort}), resetting to default ${DEFAULT_PORT}`,
			);
			this.settings.httpPort = DEFAULT_PORT;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Check if the port setting has actually changed since the server started
		if (this.server && this.settings.httpPort !== 0 && this.settings.httpPort !== this.initialHttpPort) {
			this.logInfo(
				`HTTP port changed from ${this.initialHttpPort} to ${this.settings.httpPort}. Restarting server...`,
			);
			// Use translation for the notice
			new Notice(
				`${t("NOTICE_PLUGIN_NAME")}: ${t("NOTICE_PORT_CHANGED_PREFIX")} ${this.settings.httpPort}. ${t("NOTICE_PORT_CHANGED_SUFFIX")}`,
				3000,
			);
			this.stopHttpServer();
			this.startHttpServer(); // Restart server with the new port
			// Update initialHttpPort only after successful restart
			if (this.server) {
				// If port 0 was used, initialHttpPort is updated in startHttpServer callback
				if (this.settings.httpPort !== 0) {
					this.initialHttpPort = this.settings.httpPort;
				}
			}
		}
		// Note: Settings discovery update on folder change is handled in the settings tab itself.
	}

	// --- Environment Check ---

	/**
	 * Checks if Python is accessible and the 'requests' library is installed.
	 * Stores the found executable in `this.pythonExecutable`.
	 * Shows persistent notifications if issues are found.
	 * @returns {Promise<boolean>} True if environment is OK, false otherwise.
	 */
	async checkPythonEnvironment(): Promise<boolean> { // Modified return type
		this.logInfo("Checking Python environment...");
		this.pythonExecutable = null; // Reset before check

		const pythonCmd = await this.findPythonExecutable();

		if (!pythonCmd) {
			this.logError("Python executable not found during environment check.");
			this.showPythonMissingNotification();
			return false; // Indicate failure
		}

		this.logInfo(`Found Python executable: ${pythonCmd}`);
		this.pythonExecutable = pythonCmd; // Store the found command

		// Check for 'requests'
		const requestsInstalled = await this.checkPythonModule(pythonCmd, "requests");
		if (!requestsInstalled) {
			this.logError(`Python module 'requests' not found using ${pythonCmd}.`);
			this.showRequestsMissingNotification(pythonCmd);
			return false; // Indicate failure
		}

		// Check for 'PyYAML' (optional, only warn)
		const yamlInstalled = await this.checkPythonModule(pythonCmd, "yaml");
		if (!yamlInstalled) {
			this.logWarn(`Optional Python module 'PyYAML' not found using ${pythonCmd}. Frontmatter property management features will not work.`);
			// Don't show a persistent notice for optional dependencies
			// this.showYamlMissingNotification(pythonCmd); // Could add this if desired
		} else {
			this.logInfo("'PyYAML' module found.");
		}


		this.logInfo("Python environment check completed.");
		return true; // Indicate success (even if optional PyYAML is missing)
	}

	/**
	 * Tries to find a working Python command ('py', 'python3', 'python').
	 * @returns The command string if found, otherwise null.
	 */
	async findPythonExecutable(): Promise<string | null> {
		const isWindows = process.platform === "win32";
		const commandsToTry = isWindows ? ["py", "python3", "python"] : ["python3", "python"];

		for (const cmd of commandsToTry) {
			try {
				// Try running 'command --version' which should be quick and safe
				await new Promise<void>((resolve, reject) => {
					const process = spawn(cmd, ["--version"]);
					process.on('error', reject); // Failed to spawn (ENOENT)
					process.on('close', (code) => {
						if (isWindows && code === 9009) {
							reject(new Error(`Command ${cmd} resulted in exit code 9009 (MS Store alias?)`));
						} else if (code === 0) {
							resolve(); // Success
						} else {
							// Reject if the --version command failed for this specific 'cmd'
							reject(new Error(`Command ${cmd} --version exited with code ${code}`));
						}

					});
				});
				return cmd; // Command worked
			} catch (error) {
				this.logDebug(`Command '${cmd}' not found or failed version check: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		return null; // Return null if no command was found after checking all options
	} // <-- Closing brace for findPythonExecutable

	/**
	 * Checks if a Python module can be imported using a specific Python command.
	 * @param pythonCmd The Python command to use (e.g., 'python3', 'py').
	 * @param moduleName The name of the module to check (e.g., 'requests', 'yaml').
	 * @returns True if the module can be imported, false otherwise.
	 */
	async checkPythonModule(pythonCmd: string, moduleName: string): Promise<boolean> {
		this.logDebug(`Checking import of module '${moduleName}' using command '${pythonCmd}'...`);
		try {
			await new Promise<void>((resolve, reject) => {
				// Use spawn, similar to findPythonExecutable and runPythonScript
				const process = spawn(pythonCmd, ['-c', `import ${moduleName}`]);

				let stderrOutput = '';
				process.stderr?.on('data', (data) => {
					stderrOutput += data.toString();
				});

				process.on('error', (error) => {
					// Handles errors like command not found *if* findPythonExecutable somehow failed
					this.logWarn(`Spawn error during module check for '${moduleName}' using '${pythonCmd}': ${error.message}`);
					reject(error);
				});

				process.on('close', (code) => {
					if (code === 0) {
						this.logDebug(`Module '${moduleName}' imported successfully using '${pythonCmd}'.`);
						resolve(); // Success
					} else {
						// Log the failure and reject
						this.logWarn(`Failed to import module '${moduleName}' using '${pythonCmd}'. Exit code: ${code}.`);
						if (stderrOutput.trim()) {
							this.logWarn(`Stderr from failed import: ${stderrOutput.trim()}`);
						}
						reject(new Error(`Module '${moduleName}' import failed with exit code ${code}`));
					}
				});
			});
			return true; // Promise resolved, import successful
		} catch (error) {
			// This catch block now handles the rejection from the promise
			this.logDebug(`Module check failed for '${moduleName}' using '${pythonCmd}': ${error instanceof Error ? error.message : String(error)}`);
			return false; // Promise rejected, import failed
		}
	} // <-- Closing brace for checkPythonModule


	showPythonMissingNotification(): void {
		// Delay notice slightly to ensure Obsidian UI is ready
		setTimeout(() => {
			// Use translation for the notice
			new Notice(`${t("NOTICE_PYTHON_MISSING_TITLE")}\n${t("NOTICE_PYTHON_MISSING_DESC")}`, 0); // Persistent notice
		}, 500); // Delay by 500ms (adjust if needed)
	}

	showRequestsMissingNotification(pythonCmd: string): void {
		// Delay notice slightly to ensure Obsidian UI is ready
		setTimeout(() => {
			// Use translation for the notice, inserting the pythonCmd
			const desc = t("NOTICE_REQUESTS_MISSING_DESC_SUFFIX").replace("{pythonCmd}", pythonCmd);
			new Notice(`${t("NOTICE_REQUESTS_MISSING_TITLE")}\n${t("NOTICE_REQUESTS_MISSING_DESC_PREFIX")} ${pythonCmd}.${desc}`, 0); // Persistent notice
		}, 500); // Delay by 500ms (adjust if needed)
	}


	// --- Command Registration ---
	addCommands() {
		this.addCommand({
			id: "run-specific-python-script",
			// Use translation for command name
			name: t("CMD_RUN_SPECIFIC_SCRIPT_NAME"),
			callback: () => this.chooseAndRunPythonScript(),
		});

		this.addCommand({
			id: "run-all-python-scripts",
			// Use translation for command name
			name: t("CMD_RUN_ALL_SCRIPTS_NAME"),
			callback: () => this.runAllPythonScripts(),
		});

		// --- NEW: Command to refresh script settings ---
		this.addCommand({
			id: "refresh-script-settings",
			name: t("CMD_REFRESH_SCRIPT_SETTINGS_NAME"), // Add this key to translation files
			callback: async () => {
				const scriptsFolder = this.getScriptsFolderPath();
				if (!scriptsFolder) {
					new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000);
					return;
				}
				if (!this.pythonExecutable) {
					new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH"), 5000); // Add key
					await this.checkPythonEnvironment(); // Re-check env
					if (!this.pythonExecutable) return; // Still missing
				}
				new Notice(t("NOTICE_REFRESHING_SCRIPT_SETTINGS")); // Add key
				try {
					await this.updateScriptSettingsCache(scriptsFolder);
					new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS")); // Add key
					// Optional: Force redraw settings tab if open?
					// This might require more complex logic to find the specific tab instance.
					// For now, the user might need to reopen settings to see immediate changes.
				} catch (error) {
					this.logError("Manual script settings refresh failed:", error);
					new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED")); // Add key
				}
			},
		});
	}

	// --- HTTP Server Management ---
	stopHttpServer() {
		if (this.server) {
			this.logInfo("Stopping HTTP server...");
			this.server.close((err) => {
				if (err) {
					this.logError("Error closing HTTP server:", err);
				} else {
					this.logInfo("HTTP server stopped.");
				}
				this.server = null;
			});
		} else {
			this.logDebug("HTTP server already stopped or not started.");
		}
	}

	startHttpServer() {
		this.logDebug("Attempting to start HTTP server...");
		if (this.server) {
			this.logWarn("Server already running. Stopping first.");
			this.stopHttpServer();
		}

		// Validate port before attempting to create server
		if (
			!this.settings.httpPort && this.settings.httpPort !== 0 || // Allow 0
			typeof this.settings.httpPort !== "number" ||
			!Number.isInteger(this.settings.httpPort) ||
			this.settings.httpPort < 0 || // Allow 0
			this.settings.httpPort > 65535
		) {
			// Use translation for the notice
			const errorMsg = `${t("NOTICE_INVALID_PORT_CONFIG_PREFIX")} ${this.settings.httpPort}. ${t("NOTICE_INVALID_PORT_CONFIG_SUFFIX")}`;
			this.logError(errorMsg);
			new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${errorMsg}`, 7000);
			return;
		}

		this.server = http.createServer(
			async (req: http.IncomingMessage, res: http.ServerResponse) => {
				const { method, url } = req;
				const remoteAddress = req.socket.remoteAddress || "unknown";
				this.logDebug(
					`HTTP Request received: ${method} ${url} from ${remoteAddress}`,
				);

				// Only allow POST requests to the root path from localhost
				if (
					url !== "/" ||
					method !== "POST" ||
					!["127.0.0.1", "::1", "localhost"].includes(
						remoteAddress,
					)
				) {
					this.logWarn(
						`Ignoring request: Invalid method/path/origin (${method} ${url} from ${remoteAddress})`,
					);
					res.writeHead(
						method !== "POST" || url !== "/" ? 404 : 403,
						{ "Content-Type": "application/json" },
					); // 404 Not Found or 403 Forbidden
					res.end(
						JSON.stringify({
							status: "error",
							error:
								method !== "POST" || url !== "/"
									? "Not Found: Please POST to /" // Standard HTTP messages, usually not translated
									: "Forbidden: Access only allowed from localhost", // Standard HTTP messages
						}),
					);
					return;
				}

				// Check Content-Type
				if (req.headers["content-type"] !== "application/json") {
					this.logWarn(
						`Ignoring request: Invalid Content-Type (${req.headers["content-type"]})`,
					);
					res.writeHead(415, { "Content-Type": "application/json" }); // 415 Unsupported Media Type
					res.end(
						JSON.stringify({
							status: "error",
							error: "Invalid Content-Type: application/json required", // Technical error message
						}),
					);
					return;
				}

				let body = "";
				req.on("data", (chunk) => {
					body += chunk.toString();
					// Optional: Add size limit check here if needed
				});

				req.on("end", async () => {
					let request: JsonRequest;
					let response: JsonResponse;

					try {
						this.logDebug(
							`Attempting to parse JSON request body: ${body}`,
						);
						request = JSON.parse(body);

						// Basic validation of the request structure
						if (
							!request ||
							typeof request !== "object" ||
							typeof request.action !== "string" ||
							!request.action // Ensure action is not empty
						) {
							throw new Error(
								"Invalid JSON request structure. 'action' (non-empty string) is required.", // Technical error
							);
						}

						this.logDebug(`Handling action: ${request.action}`);
						response = await this.handleAction(request);
						this.logDebug(
							`Action ${request.action} handled, sending response:`,
							response,
						);
					} catch (error) {
						const errorMessage =
							error instanceof Error
								? error.message
								: String(error);
						this.logError("Error processing request:", errorMessage);
						// Determine appropriate status code based on error type
						const statusCode =
							error instanceof SyntaxError ? 400 : 500; // 400 Bad Request for JSON parse errors
						response = {
							status: "error",
							error: `Failed to process request: ${errorMessage}`, // Technical error
						};
						// Ensure response is sent even on error during processing
						if (!res.writableEnded) {
							const responseJson = JSON.stringify(response);
							res.writeHead(statusCode, {
								"Content-Type": "application/json",
								"Content-Length":
									Buffer.byteLength(responseJson),
							});
							res.end(responseJson);
							this.logDebug(
								`Error response sent (Status ${statusCode}).`,
							);
						}
						return; // Stop further processing on error
					}

					// Send successful response
					if (!res.writableEnded) {
						const responseJson = JSON.stringify(response);
						res.writeHead(200, {
							// Assume success if no error thrown before
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength(responseJson),
						});
						res.end(responseJson);
						this.logDebug("HTTP Response sent (Status 200).");
					}
				});

				req.on("error", (err) => {
					this.logError("Error reading request stream:", err.message);
					if (!res.writableEnded) {
						res.writeHead(500, {
							"Content-Type": "application/json",
						});
						res.end(
							JSON.stringify({
								status: "error",
								error: "Error reading request data", // Technical error
							}),
						);
					}
				});
			},
		);

		this.server.on("error", (err: NodeJS.ErrnoException) => {
			let errorMsg = `HTTP server error: ${err.message}`; // Keep technical part
			if (err.code === "EADDRINUSE") {
				// Use translation for the user-facing part
				errorMsg = `${t("NOTICE_PORT_IN_USE_PREFIX")} ${this.settings.httpPort} ${t("NOTICE_PORT_IN_USE_SUFFIX")}`;
				this.logError(errorMsg);
			} else {
				this.logError("Unhandled HTTP server error:", err);
				// Keep generic error message for unknown errors
				errorMsg = `HTTP server error: ${err.message}`;
			}
			new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${errorMsg}`, 10000);
			this.server = null; // Ensure server is marked as null on error
		});

		try {
			this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
				// Get the actual port the server is listening on (useful if port 0 was used)
				const address = this.server?.address() as AddressInfo;
				const actualPort = address?.port || this.settings.httpPort; // Fallback just in case
				this.logInfo(
					`HTTP server listening on http://127.0.0.1:${actualPort}`,
				);
				// Update settings and initial port if a dynamic port was assigned
				if (this.settings.httpPort === 0 && actualPort !== 0) {
					this.logInfo(
						`Server assigned dynamic port: ${actualPort}. Updating settings.`,
					);
					// Don't save settings here, let Python script read the env var with actual port
					// But DO update initialHttpPort for mismatch checks
					this.initialHttpPort = actualPort;
					// Optionally update the setting in memory for display, but don't save
					// this.settings.httpPort = actualPort;
				} else {
					this.initialHttpPort = this.settings.httpPort; // Confirm the port being used
				}
			});
		} catch (listenErr) {
			const errorMsg =
				listenErr instanceof Error
					? listenErr.message
					: String(listenErr);
			this.logError("Failed to listen on HTTP port:", errorMsg);
			// Use translation for the notice
			new Notice(
				`${t("NOTICE_PLUGIN_NAME")}: ${t("NOTICE_SERVER_START_FAILED_PREFIX")} ${this.settings.httpPort}${t("NOTICE_SERVER_START_FAILED_SUFFIX")} ${errorMsg}`,
				7000,
			);
			this.server = null; // Ensure server is marked as null on listen error
		}
	}

	// --- Action Handler ---
	async handleAction(request: JsonRequest): Promise<JsonResponse> {
		const { action, payload } = request;
		this.logDebug(`Executing action: ${action} with payload:`, payload);

		try {
			switch (action) {
				// --- Vault/Note Info ---
				case "get_all_note_paths":
					return { status: "success", data: this.getAllNotePaths() };

				case "get_active_note_content":
					const activeContent = await this.getActiveNoteContent();
					return activeContent !== null
						? { status: "success", data: activeContent }
						: {
								status: "error",
								error: "No active Markdown note found.", // Technical error
							};

				case "get_active_note_relative_path":
					const activeRelativePath = this.getActiveNoteRelativePath();
					return activeRelativePath !== null
						? { status: "success", data: activeRelativePath }
						: {
								status: "error",
								error: "No active Markdown note found.", // Technical error
							};

				case "get_active_note_absolute_path":
					const activeAbsolutePath = this.getActiveNoteAbsolutePath();
					return activeAbsolutePath !== null
						? { status: "success", data: activeAbsolutePath }
						: {
								status: "error",
								error: "No active note or vault path unavailable.", // Technical error
							};

				case "get_active_note_title":
					const activeTitle = this.getActiveNoteTitle();
					return activeTitle !== null
						? { status: "success", data: activeTitle }
						: {
								status: "error",
								error: "No active Markdown note found.", // Technical error
							};

				case "get_current_vault_absolute_path":
					const vaultPath = this.getCurrentVaultAbsolutePath();
					return vaultPath !== null
						? { status: "success", data: vaultPath }
						: {
								status: "error",
								error: "Could not determine vault absolute path.", // Technical error
							};

				case "get_active_note_frontmatter":
					const activeFrontmatter =
						await this.getActiveNoteFrontmatter();
					return { status: "success", data: activeFrontmatter }; // Returns null if no frontmatter

				case "get_note_content":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (string) required.", // Technical error
						};
					}
					try {
						const content = await this.getNoteContentByPath(
							payload.path,
						);
						return { status: "success", data: content };
					} catch (error) {
						return {
							status: "error",
							error:
								error instanceof Error
									? error.message
									: String(error), // Technical error
						};
					}

				case "get_note_frontmatter":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (string) required.", // Technical error
						};
					}
					try {
						const frontmatter =
							await this.getNoteFrontmatterByPath(payload.path);
						return { status: "success", data: frontmatter }; // Returns null if no frontmatter
					} catch (error) {
						return {
							status: "error",
							error:
								error instanceof Error
									? error.message
									: String(error), // Technical error
						};
					}

				// --- Editor Actions ---
				case "get_selected_text":
					try {
						const selectedText = this.getSelectedText();
						return { status: "success", data: selectedText }; // Returns empty string if nothing selected
					} catch (error) {
						return {
							status: "error",
							error:
								error instanceof Error
									? error.message
									: String(error), // Technical error
						};
					}

				case "replace_selected_text":
					if (typeof payload?.replacement !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'replacement' (string) required.", // Technical error
						};
					}
					try {
						this.replaceSelectedText(payload.replacement);
						return { status: "success", data: null };
					} catch (error) {
						return {
							status: "error",
							error:
								error instanceof Error
									? error.message
									: String(error), // Technical error
						};
					}

				// --- Note Modification/Opening ---
				case "modify_note_content":
					// DEPRECATED? Prefer modify_note_content_by_path for clarity
					// Keeping for backward compatibility for now, but points to the same logic
					if (
						typeof payload?.filePath !== "string" || // Expecting absolute path here
						typeof payload?.content !== "string"
					) {
						return {
							status: "error",
							error: "Invalid payload: 'filePath' (absolute path string) and 'content' (string) required.", // Technical error
						};
					}
					try {
						await this.modifyNoteContentByAbsolutePath(
							payload.filePath,
							payload.content,
						);
						return { status: "success", data: null };
					} catch (modifyError) {
						const errorMsg =
							modifyError instanceof Error
								? modifyError.message
								: String(modifyError);
						this.logError(
							`Error in modifyNoteContent for ${payload.filePath}: ${errorMsg}`,
						);
						return {
							status: "error",
							error: `Failed to modify note: ${errorMsg}`, // Technical error
						};
					}

				case "modify_note_content_by_path": // New preferred action name
					if (
						typeof payload?.path !== "string" || // Expecting relative path here
						typeof payload?.content !== "string"
					) {
						return {
							status: "error",
							error: "Invalid payload: 'path' (relative vault path string) and 'content' (string) required.", // Technical error
						};
					}
					try {
						await this.modifyNoteContentByRelativePath(
							payload.path,
							payload.content,
						);
						return { status: "success", data: null };
					} catch (modifyError) {
						const errorMsg =
							modifyError instanceof Error
								? modifyError.message
								: String(modifyError);
						this.logError(
							`Error in modifyNoteContentByPath for ${payload.path}: ${errorMsg}`,
						);
						return {
							status: "error",
							error: `Failed to modify note: ${errorMsg}`, // Technical error
						};
					}

				case "open_note":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (relative vault path string) required.", // Technical error
						};
					}
					const newLeaf =
						typeof payload?.new_leaf === "boolean"
							? payload.new_leaf
							: false;
					try {
						await this.openNote(payload.path, newLeaf);
						return { status: "success", data: null };
					} catch (error) {
						return {
							status: "error",
							error:
								error instanceof Error
									? error.message
									: String(error), // Technical error
						};
					}

				// --- UI Interactions ---
				case "show_notification":
					if (typeof payload?.content !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'content' (string) required.", // Technical error
						};
					}
					const duration =
						typeof payload?.duration === "number"
							? payload.duration
							: 4000;
					// Note: Notifications sent from Python are not translated here.
					this.showNotification(payload.content, duration);
					return { status: "success", data: null };

				case "request_user_input":
					if (
						typeof payload?.scriptName !== "string" ||
						typeof payload?.inputType !== "string" ||
						typeof payload?.message !== "string"
					) {
						return {
							status: "error",
							error: "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required.", // Technical error
						};
					}
					const userInput = await this.requestUserInput(
						payload.scriptName,
						payload.inputType,
						payload.message,
						payload.validationRegex, // Optional
						payload.minValue, // Optional
						payload.maxValue, // Optional
						payload.step, // Optional
					);
					if (userInput === null) {
						this.logDebug("User cancelled input modal.");
						return {
							status: "error",
							error: "User cancelled input.", // Technical error (from user action)
						};
					}
					return { status: "success", data: userInput };

				// --- Internal/Test ---
				case "_test_connection_ping":
					// Handle the test connection ping gracefully but log it
					this.logDebug(
						"Received test connection ping from client.",
					);
					// Return success to indicate the server is reachable and processing requests
					return { status: "success", data: "pong" };

				// --- NEW: Script Settings Action ---
				case "get_script_settings":
					if (typeof payload?.scriptPath !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'scriptPath' (relative path string) required.",
						};
					}
					const relativePath = normalizePath(payload.scriptPath);
					this.logDebug(`Requesting settings for script: ${relativePath}`);

					// Get definitions from cache
					const definitions = this.settings.scriptSettingsDefinitions[relativePath] || [];
					// Get stored values
					const storedValues = this.settings.scriptSettingsValues[relativePath] || {};

					// Merge stored values with defaults from definitions
					const finalValues: Record<string, any> = {};
					for (const def of definitions) {
						// Use stored value if it exists, otherwise use default
						finalValues[def.key] = storedValues.hasOwnProperty(def.key)
							? storedValues[def.key]
							: def.default;
					}

					this.logDebug(`Returning settings for ${relativePath}:`, finalValues);
					return { status: "success", data: finalValues };


				case "get_obsidian_language":
					try {
						const lang = this._getObsidianLanguage();
						return { status: "success", data: lang };
					} catch (error) {
						return { status: "error", error: `Failed to get Obsidian language: ${error instanceof Error ? error.message : String(error)}` };
					}
				

				case "create_note":
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					// Content is optional, default to empty string if not provided or not a string
					const noteContent = typeof payload?.content === "string" ? payload.content : "";
					try {
						await this._createNote(payload.path, noteContent);
						return { status: "success", data: null }; // No data needed on success
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}
					
				
				case "check_path_exists":
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					try {
						const exists = await this._checkPathExists(payload.path);
						return { status: "success", data: exists };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}
				
				
				case "delete_path":
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					const permanently = typeof payload?.permanently === "boolean" ? payload.permanently : false;
					try {
						await this._deletePath(payload.path, permanently);
						return { status: "success", data: null };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}
				

				case "rename_path":
					if (typeof payload?.old_path !== "string" || !payload.old_path) {
						return { status: "error", error: "Invalid payload: 'old_path' (non-empty string) required." };
					}
					if (typeof payload?.new_path !== "string" || !payload.new_path) {
						return { status: "error", error: "Invalid payload: 'new_path' (non-empty string) required." };
					}
					try {
						await this._renamePath(payload.old_path, payload.new_path);
						return { status: "success", data: null };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}

				// --- TEMPORARILY DISABLED due to persistent TS build errors (TS2339) ---
				// --- Issue seems related to type definitions for App.commands not being recognized ---
				// case "run_obsidian_command":
				// 	if (typeof payload?.command_id !== "string" || !payload.command_id) {
				// 		return { status: "error", error: "Invalid payload: 'command_id' (non-empty string) required." };
				// 	}
				// 	try {
				// 		this._runObsidianCommand(payload.command_id);
				// 		return { status: "success", data: null };
				// 	} catch (error) {
				// 		return { status: "error", error: error instanceof Error ? error.message : String(error) };
				// 	}


				// --- TEMPORARILY DISABLED due to persistent TS build errors (TS2339) ---
				// --- Issue seems related to type definitions for App.commands not being recognized ---
				// case "get_all_tags":
				// 	try {
				// 		const tags = this._getAllTags();
				// 		return { status: "success", data: tags };
				// 	} catch (error) {
				// 		return { status: "error", error: error instanceof Error ? error.message : String(error) };
				// 	}


				case "get_vault_name":
					try {
						const name = this._getVaultName();
						return { status: "success", data: name };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}

				case "get_theme_mode":
					try {
						const mode = this._getThemeMode();
						return { status: "success", data: mode };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}


				case "create_folder":
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					try {
						await this._createFolder(payload.path);
						return { status: "success", data: null };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}


				case "list_folder":
					if (typeof payload?.path !== "string") { // Allow empty path for vault root listing
						return { status: "error", error: "Invalid payload: 'path' (string) required." };
					}
					try {
						const contents = await this._listFolder(payload.path);
						return { status: "success", data: contents };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}

				
				case "get_links":
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					const linkType = typeof payload?.type === "string" ? payload.type : 'outgoing';
					try {
						const links = this._getLinks(payload.path, linkType);
						return { status: "success", data: links };
					} catch (error) {
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}

				
				case "get_editor_context":
					try {
						const context = this._getEditorContext();
						// Return data (which might be null if no editor)
						return { status: "success", data: context };
					} catch (error) {
						// This catches errors from within _getEditorContext if they occur
						return { status: "error", error: error instanceof Error ? error.message : String(error) };
					}
				
				
				case "get_backlinks":
					// Validate payload
					if (typeof payload?.path !== "string" || !payload.path) {
						return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
					}
					const targetPath = normalizePath(payload.path);
					const useCacheIfAvailable = payload.use_cache_if_available ?? true; // Default to true
					const cacheMode = payload.cache_mode === 'safe' ? 'safe' : 'fast'; // Default to 'fast'

					this.logDebug(`Handling get_backlinks for: ${targetPath}, useCache: ${useCacheIfAvailable}, mode: ${cacheMode}`);

					// Get the target file
					const targetFile = this.app.vault.getAbstractFileByPath(targetPath);
					if (!(targetFile instanceof TFile)) {
						return { status: "error", error: `File not found at path: ${targetPath}` };
					}

					let backlinksResult: Record<string, LinkCache[]> | null = null;
					let errorOccurred: string | null = null;

					const isCachePluginEnabled = (this.app as any).plugins.enabledPlugins.has('backlink-cache');
					const attemptCacheFeatures = useCacheIfAvailable && isCachePluginEnabled;
					const getBacklinksFn = (this.app.metadataCache as any).getBacklinksForFile;

					if (typeof getBacklinksFn !== 'function') {
						this.logError("Native function app.metadataCache.getBacklinksForFile not found!");
						return { status: "error", error: "Obsidian's native getBacklinksForFile function is missing." };
					}

					try {
						if (attemptCacheFeatures && cacheMode === 'safe') {
							if (typeof getBacklinksFn.safe === 'function') {
								this.logDebug("Attempting to call getBacklinksForFile.safe() (provided by backlink-cache)");
								// *** CORRECTION: Use .call() to set 'this' context ***
								backlinksResult = await getBacklinksFn.safe.call(this.app.metadataCache, targetFile);
								this.logDebug("Call to getBacklinksForFile.safe() completed.");
							} else {
								this.logWarn("Requested 'safe' mode, but getBacklinksForFile.safe function not found. Falling back to standard call.");
								// *** CORRECTION: Use .call() to set 'this' context ***
								backlinksResult = getBacklinksFn.call(this.app.metadataCache, targetFile);
							}
						} else {
							if (attemptCacheFeatures) {
								this.logDebug("Calling standard getBacklinksForFile (using backlink-cache 'fast' mode if active)");
							} else {
								this.logDebug("Calling standard getBacklinksForFile (native Obsidian implementation)");
							}
							// *** CORRECTION: Use .call() to set 'this' context ***
							backlinksResult = getBacklinksFn.call(this.app.metadataCache, targetFile);
							this.logDebug("Standard call to getBacklinksForFile completed.");
						}
					} catch (error) {
						this.logError(`Error during getBacklinksForFile call (mode: ${attemptCacheFeatures ? cacheMode : 'native'}):`, error);
						errorOccurred = `Error retrieving backlinks: ${error instanceof Error ? error.message : String(error)}`;
					}


					// --- Return result or error ---
					// (Serialization logic remains the same)
					if (errorOccurred) {
						return { status: "error", error: errorOccurred };
					} else if (backlinksResult !== null) {
						this.logDebug("Raw backlinks result from API/Native:", backlinksResult);
						const serializableBacklinks: Record<string, LinkCache[]> = {};
						try {
							const backlinksMap = (backlinksResult as any)?.data;
							if (backlinksMap instanceof Map) {
								this.logDebug(`Iterating through Map with ${backlinksMap.size} entries.`);
								for (const [sourcePath, linkCacheArray] of backlinksMap.entries()) {
									if (typeof sourcePath === 'string' && Array.isArray(linkCacheArray)) {
										serializableBacklinks[sourcePath] = linkCacheArray;
									} else {
										this.logWarn(`Skipping invalid entry in backlinks Map: Key=${sourcePath}, Value type=${typeof linkCacheArray}`);
									}
								}
							} else {
								this.logWarn("Backlinks result did not contain the expected 'data' Map structure. Raw result:", backlinksResult);
							}
							this.logDebug("Serializable backlinks data prepared:", serializableBacklinks);
							return { status: "success", data: serializableBacklinks };
						} catch (conversionError) {
							this.logError("Error converting backlinks result to serializable format:", conversionError);
							return { status: "error", error: `Failed to process backlink data: ${conversionError instanceof Error ? conversionError.message : String(conversionError)}` };
						}
					} else {
						this.logError(`Failed to retrieve backlinks for ${targetPath} using any method. Returning error.`);
						return { status: "error", error: `Failed to retrieve backlinks for ${targetPath} using any method.` };
					}
				// End of case "get_backlinks"	
	

				// --- Default ---
				default:
					this.logWarn(`Received unknown action: ${action}`);
					return {
						status: "error",
						error: `Unknown action: ${action}`, // Technical error
					};
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			this.logError(`Error executing action "${action}":`, errorMessage);
			// Log stack trace for better debugging if available
			if (error instanceof Error && error.stack) {
				this.logError("Stack trace:", error.stack);
			}
			return {
				status: "error",
				error: `Failed to execute action "${action}": ${errorMessage}`, // Technical error
			};
		}
	}

	// --- Obsidian Interaction Helpers ---

	// Helpers for ACTIVE note
	getActiveNoteFile(): TFile | null {
		// Use getActiveViewOfType for better type safety
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		return activeView?.file ?? null;
	}

	async getActiveNoteContent(): Promise<string | null> {
		const file = this.getActiveNoteFile();
		return file ? this.app.vault.cachedRead(file) : null; // Use cachedRead for potential performance gain
	}

	getActiveNoteRelativePath(): string | null {
		return this.getActiveNoteFile()?.path ?? null;
	}

	getActiveNoteAbsolutePath(): string | null {
		const file = this.getActiveNoteFile();
		const vaultPath = this.getCurrentVaultAbsolutePath();
		if (!file || !vaultPath) return null;
		// Use normalizePath for consistency across OS
		return normalizePath(path.join(vaultPath, file.path));
	}

	getActiveNoteTitle(): string | null {
		return this.getActiveNoteFile()?.basename ?? null;
	}

	async getActiveNoteFrontmatter(): Promise<Record<string, any> | null> {
		const file = this.getActiveNoteFile();
		if (!file) return null;
		// Use processFrontMatter for potentially more robust parsing? Or stick to getFileCache
		const metadata = this.app.metadataCache.getFileCache(file);
		return metadata?.frontmatter ?? null;
	}

	// General Helpers
	getCurrentVaultAbsolutePath(): string | null {
		const adapter = this.app.vault.adapter;
		// Check if adapter has getBasePath method before calling
		if (adapter instanceof FileSystemAdapter && adapter.getBasePath) {
			return adapter.getBasePath(); // Return the raw path
		}
		this.logWarn("Vault adapter is not FileSystemAdapter or lacks getBasePath method.");
		return null;
	}

	showNotification(message: string, duration: number = 4000) {
		// This is the generic function used by the 'show_notification' action from Python.
		// We don't translate 'message' here as it comes directly from the Python script.
		new Notice(message, duration);
	}

	/**
	 * Modifies the content of a note specified by its ABSOLUTE file path.
	 * Validates that the path is within the current vault.
	 * @deprecated Prefer modifyNoteContentByRelativePath for clarity and safety.
	 */
	async modifyNoteContentByAbsolutePath(
		absoluteFilePath: string,
		newContent: string,
	): Promise<void> {
		const vaultPath = this.getCurrentVaultAbsolutePath();
		if (!vaultPath) {
			throw new Error("Cannot modify note: Vault path is unavailable."); // Technical error
		}
		if (!path.isAbsolute(absoluteFilePath)) {
			throw new Error(
				`Cannot modify note: Provided path is not absolute: ${absoluteFilePath}`, // Technical error
			);
		}
		// Normalize both paths before comparing
		const normalizedVaultPath = normalizePath(vaultPath);
		const normalizedFilePath = normalizePath(absoluteFilePath);

		// Check if the file path starts with the vault path
		if (!normalizedFilePath.startsWith(normalizedVaultPath)) {
			throw new Error(
				`Cannot modify note: Path is outside the current vault: ${absoluteFilePath}`, // Technical error
			);
		}

		// Calculate relative path *after* ensuring it's inside the vault
		const relativePath = path.relative(vaultPath, absoluteFilePath);
		// Normalize the relative path for Obsidian API
		const normalizedRelativePath = normalizePath(relativePath);

		await this.modifyNoteContentByRelativePath(
			normalizedRelativePath,
			newContent,
		);
	}

	/**
	 * Modifies the content of a note specified by its vault-relative path using app.vault.modify.
	 */
	async modifyNoteContentByRelativePath(
		relativePath: string,
		newContent: string,
	): Promise<void> {
		const normalizedPath = normalizePath(relativePath); // Ensure consistent separators
		const file = this.app.vault.getAbstractFileByPath(normalizedPath);

		if (!(file instanceof TFile)) {
			throw new Error(
				`Cannot modify note: File not found in vault at path: ${normalizedPath}`, // Technical error
			);
		}

		this.logDebug(
			`Attempting to modify note via Vault API: ${normalizedPath}`,
		);
		try {
			await this.app.vault.modify(file, newContent);
			this.logInfo(`Note modified successfully: ${normalizedPath}`);
		} catch (error) {
			this.logError(
				`Error during app.vault.modify for ${normalizedPath}:`,
				error,
			);
			throw new Error(
				`Vault API failed to modify ${normalizedPath}: ${error instanceof Error ? error.message : String(error)}`, // Technical error
			);
		}
	}

	async requestUserInput(
		scriptName: string,
		inputType: string,
		message: string,
		validationRegex?: string,
		minValue?: number,
		maxValue?: number,
		step?: number,
	): Promise<any> {
		return new Promise((resolve) => {
			// Note: scriptName and message come from Python, not translated here.
			const modal = new UserInputModal(
				this.app,
				scriptName,
				inputType,
				message,
				(input) => resolve(input), // Resolve with null if cancelled, value otherwise
				validationRegex,
				minValue,
				maxValue,
				step,
			);
			modal.open();
		});
	}

	getAllNotePaths(): string[] {
		return this.app.vault.getMarkdownFiles().map((f) => f.path);
	}

	// --- NEW Interaction Helpers --- (Keep existing ones)

	/**
	 * Retrieves the full content of a note specified by its vault-relative path.
	 * @param relativePath The vault-relative path to the note (e.g., "Folder/My Note.md").
	 * @returns The content of the note.
	 * @throws Error if the file is not found or is not a TFile.
	 */
	async getNoteContentByPath(relativePath: string): Promise<string> {
		const normalizedPath = normalizePath(relativePath);
		const file = this.app.vault.getAbstractFileByPath(normalizedPath);
		if (!(file instanceof TFile)) {
			throw new Error(
				`File not found or is not a file at path: ${normalizedPath}`, // Technical error
			);
		}
		return this.app.vault.cachedRead(file); // Use cachedRead
	}

	/**
	 * Retrieves the parsed frontmatter of a note specified by its vault-relative path.
	 * @param relativePath The vault-relative path to the note.
	 * @returns The parsed frontmatter object, or null if no frontmatter exists or file not found.
	 * @throws Error only if metadata cache access itself fails unexpectedly.
	 */
	async getNoteFrontmatterByPath(
		relativePath: string,
	): Promise<Record<string, any> | null> {
		const normalizedPath = normalizePath(relativePath);
		// Using getCache is generally safer as it doesn't require TFile first
		const metadata = this.app.metadataCache.getCache(normalizedPath);
		if (!metadata) {
			// Check if the file exists at all to provide context, but don't throw error if simply no metadata
			const fileExists =
				!!this.app.vault.getAbstractFileByPath(normalizedPath);
			if (!fileExists) {
				this.logDebug(
					`File not found at path for frontmatter lookup: ${normalizedPath}`,
				);
				return null; // Consistent with returning null for no frontmatter
			}
			// File exists but no metadata cache (e.g., not markdown, empty file, etc.)
			this.logDebug(
				`No metadata cache found for existing file: ${normalizedPath}`,
			);
			return null;
		}
		return metadata.frontmatter ?? null; // Return null if frontmatter key is missing or null/undefined
	}

	/**
	 * Gets the currently selected text in the active Markdown editor.
	 * @returns The selected text (can be an empty string if nothing is selected).
	 * @throws Error if no Markdown view/editor is active.
	 */
	getSelectedText(): string {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			throw new Error("No active Markdown view found."); // Technical error
		}
		// Ensure editor exists before accessing it
		const editor = view.editor;
		if (!editor) {
			throw new Error("Active Markdown view does not have an editor instance."); // Technical error
		}
		return editor.getSelection(); // Returns "" if no selection
	}

	/**
	 * Replaces the currently selected text in the active Markdown editor.
	 * If no text is selected, inserts the text at the cursor position.
	 * @param replacement The text to insert or replace the selection with.
	 * @throws Error if no Markdown view/editor is active.
	 */
	replaceSelectedText(replacement: string): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			throw new Error(
				"No active Markdown view found to replace selection in.", // Technical error
			);
		}
		const editor = view.editor;
		if (!editor) {
			throw new Error("Active Markdown view does not have an editor instance."); // Technical error
		}
		editor.replaceSelection(replacement);
	}

	/**
	 * Opens a note in the Obsidian workspace.
	 * @param relativePath The vault-relative path of the note to open (e.g., "Folder/Note.md" or just "Folder/Note").
	 * @param newLeaf If true, opens the note in a new leaf (tab/split). Defaults to false.
	 * @throws Error if the file cannot be opened (e.g., not found, invalid path).
	 */
	async openNote(
		relativePath: string,
		newLeaf: boolean = false,
	): Promise<void> {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(
			`Requesting to open note: ${normalizedPath} (newLeaf: ${newLeaf})`,
		);
		try {
			// openLinkText handles resolving the path (with or without .md) and opening
			// The empty string "" for sourcePath is usually sufficient for vault paths.
			await this.app.workspace.openLinkText(
				normalizedPath,
				"", // sourcePath - usually okay to leave empty for vault paths
				newLeaf ? "split" : false, // Use PaneType or boolean
			);
			this.logInfo(`Successfully requested to open ${normalizedPath}`);
		} catch (error) {
			this.logError(
				`Failed to open link text "${normalizedPath}":`,
				error,
			);
			// Rethrow a more specific error or the original one
			throw new Error(
				`Could not open note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`, // Technical error
			);
		}
	}

	// --- Python Script Execution & Settings Discovery ---

	/**
	 * Resolves the absolute path to the Python scripts folder based on settings.
	 * Returns an empty string and logs an error if the path is invalid or not found.
	 */
	getScriptsFolderPath(): string {
		const { pythonScriptsFolder } = this.settings;
		if (!pythonScriptsFolder || typeof pythonScriptsFolder !== "string") {
			this.logWarn("Python scripts folder path is not configured in settings.");
			return "";
		}

		let resolvedPath = "";

		// Check if the configured path is ALREADY absolute
		if (path.isAbsolute(pythonScriptsFolder)) {
			this.logDebug(`Configured path is absolute: ${pythonScriptsFolder}`);
			// Use the absolute path directly, just normalize it using Node's path module
			resolvedPath = path.normalize(pythonScriptsFolder);
		} else {
			// Path is relative, resolve it against the vault path
			this.logDebug(`Configured path is relative: ${pythonScriptsFolder}`);
			const vaultPath = this.getCurrentVaultAbsolutePath();
			if (!vaultPath) {
				this.logError(
					"Cannot resolve relative script path: Vault path unavailable.",
				);
				return "";
			}
			resolvedPath = path.resolve(vaultPath, pythonScriptsFolder); // Use path.resolve again
			// Normalize the combined path using Node's path module
			resolvedPath = path.normalize(resolvedPath);
			this.logDebug(`Resolved relative path to: ${resolvedPath}`);
		}

		// Now, check if the resolved path exists and is a directory using fs
		try {
			// Use the 'resolvedPath' which is now always an absolute, normalized path
			if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
				this.logInfo(`Scripts folder path validated: ${resolvedPath}`);
				// IMPORTANT: Return the Node.js normalized absolute path.
				// Avoid Obsidian's normalizePath here unless proven necessary later.
				return resolvedPath;
			} else {
				// Log the specific reason for failure
				const exists = fs.existsSync(resolvedPath);
				const isDir = exists ? fs.statSync(resolvedPath).isDirectory() : false;
				this.logWarn(
					`Validation failed for scripts folder: ${resolvedPath} (Exists: ${exists}, IsDirectory: ${isDir})`,
				);
				return "";
			}
		} catch (error) {
			this.logError(`Error accessing resolved scripts folder path ${resolvedPath}:`, error);
			return "";
		}
	}

	/**
	 * Gets the current language setting of Obsidian.
	 * @returns The language code (e.g., 'en', 'fr') or 'en' as default.
	 */
	private _getObsidianLanguage(): string {
		// Obsidian stores language in localStorage or has an internal way to get it
		// Using localStorage is a common pattern seen in plugins
		const obsidianLang = localStorage.getItem('language');
		if (obsidianLang) {
			this.logDebug(`Obsidian language from localStorage: ${obsidianLang}`);
			return obsidianLang;
		}
		// Fallback or alternative method if localStorage isn't reliable
		// This might need adjustment based on Obsidian's internal API if it changes
		// For now, let's assume 'moment.locale()' reflects the UI language setting
		try {
			// @ts-ignore - Accessing moment which is globally available in Obsidian
			const momentLocale = moment.locale();
			if (momentLocale) {
				this.logDebug(`Obsidian language from moment.locale(): ${momentLocale}`);
				return momentLocale;
			}
		} catch (e) {
			this.logWarn("Could not get language via moment.locale()", e);
		}
		this.logWarn("Could not determine Obsidian language, defaulting to 'en'.");
		return 'en'; // Default fallback
	}

	/**
	 * Creates a new note in the vault.
	 * @param relativePath Vault-relative path for the new note (including .md).
	 * @param content Initial content for the note.
	 * @throws Error if creation fails (e.g., file exists, invalid path).
	 */
	private async _createNote(relativePath: string, content: string): Promise<TFile> {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(`Attempting to create note: ${normalizedPath}`);
		try {
			// Check if file already exists to provide a clearer error
			const existingFile = this.app.vault.getAbstractFileByPath(normalizedPath);
			if (existingFile) {
				throw new Error(`File already exists at path: ${normalizedPath}`);
			}
			const file = await this.app.vault.create(normalizedPath, content);
			this.logInfo(`Note created successfully: ${normalizedPath}`);
			return file;
		} catch (error) {
			this.logError(`Error creating note ${normalizedPath}:`, error);
			throw new Error(`Failed to create note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Checks if a file or folder exists using the vault adapter.
	 * @param relativePath Vault-relative path to check.
	 * @returns True if the path exists, false otherwise.
	 * @throws Error if the adapter check fails unexpectedly.
	 */
	private async _checkPathExists(relativePath: string): Promise<boolean> {
		const normalizedPath = normalizePath(relativePath);
		try {
			// Use adapter.exists for potentially better performance and reliability
			const exists = await this.app.vault.adapter.exists(normalizedPath);
			this.logDebug(`Path exists check for "${normalizedPath}": ${exists}`);
			return exists;
		} catch (error) {
			this.logError(`Error checking existence for path ${normalizedPath}:`, error);
			// Rethrow a generic error; specific adapter errors might be complex
			throw new Error(`Failed to check existence for path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Deletes a file or folder (moves to trash or permanently).
	 * @param relativePath Vault-relative path of the item to delete.
	 * @param permanently If true, delete permanently. Defaults to false (move to trash).
	 * @throws Error if the item is not found or deletion fails.
	 */
	private async _deletePath(relativePath: string, permanently: boolean = false): Promise<void> {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(`Attempting to delete path: ${normalizedPath} (Permanently: ${permanently})`);
		const fileOrFolder = this.app.vault.getAbstractFileByPath(normalizedPath);

		if (!fileOrFolder) {
			throw new Error(`Cannot delete: Path not found at "${normalizedPath}"`);
		}

		try {
			if (permanently) {
				this.logWarn(`Permanently deleting path: ${normalizedPath}`);
				await this.app.vault.delete(fileOrFolder, true); // Force = true for permanent
			} else {
				// Use system = true to prefer system trash if available
				await this.app.vault.trash(fileOrFolder, true);
			}
			this.logInfo(`Path deleted successfully: ${normalizedPath} (Permanently: ${permanently})`);
		} catch (error) {
			this.logError(`Error deleting path ${normalizedPath}:`, error);
			throw new Error(`Failed to delete path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Renames or moves a file or folder within the vault.
	 * @param oldRelativePath Current vault-relative path.
	 * @param newRelativePath Desired new vault-relative path.
	 * @throws Error if the old path is not found, the new path is invalid, or rename fails.
	 */
	private async _renamePath(oldRelativePath: string, newRelativePath: string): Promise<void> {
		const normalizedOldPath = normalizePath(oldRelativePath);
		const normalizedNewPath = normalizePath(newRelativePath);
		this.logDebug(`Attempting to rename/move: ${normalizedOldPath} -> ${normalizedNewPath}`);

		const fileOrFolder = this.app.vault.getAbstractFileByPath(normalizedOldPath);
		if (!fileOrFolder) {
			throw new Error(`Cannot rename: Source path not found at "${normalizedOldPath}"`);
		}

		// Basic check: prevent renaming to the exact same path
		if (normalizedOldPath === normalizedNewPath) {
			throw new Error(`Cannot rename: Old path and new path are identical "${normalizedOldPath}"`);
		}

		// Check if destination already exists (optional but good practice)
		const destinationExists = this.app.vault.getAbstractFileByPath(normalizedNewPath);
		if (destinationExists) {
			throw new Error(`Cannot rename: Destination path already exists "${normalizedNewPath}"`);
		}


		try {
			await this.app.vault.rename(fileOrFolder, normalizedNewPath);
			this.logInfo(`Path renamed/moved successfully: ${normalizedOldPath} -> ${normalizedNewPath}`);
		} catch (error) {
			this.logError(`Error renaming path ${normalizedOldPath} to ${normalizedNewPath}:`, error);
			throw new Error(`Failed to rename path "${normalizedOldPath}" to "${normalizedNewPath}": ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	// --- TEMPORARILY DISABLED due to persistent TS build errors (TS2339) ---
	// --- Issue seems related to type definitions for App.commands not being recognized ---
	// /**
	//  * Executes an Obsidian command by its ID.
	//  * @param commandId The ID of the command to execute.
	//  * @throws Error if the command ID is not found or execution fails.
	//  */
	// private _runObsidianCommand(commandId: string): void {
	// 	this.logDebug(`Attempting to execute command ID: ${commandId}`);
	// 	try {
	// 		// executeCommandById returns false if command doesn't exist or isn't enabled
	// 		const success = this.app.commands.executeCommandById(commandId);
	// 		if (!success) {
	// 			// Check if the command exists at all
	// 			const commandExists = !!this.app.commands.commands[commandId];
	// 			if (!commandExists) {
	// 				throw new Error(`Command with ID "${commandId}" not found.`);
	// 			} else {
	// 				// Command exists but might be disabled in the current context
	// 				throw new Error(`Command "${commandId}" could not be executed (possibly disabled or inactive in current context).`);
	// 			}
	// 		}
	// 		this.logInfo(`Command executed successfully: ${commandId}`);
	// 	} catch (error) {
	// 		this.logError(`Error executing command ${commandId}:`, error);
	// 		// Rethrow the original error or a wrapped one
	// 		throw new Error(`Failed to execute command "${commandId}": ${error instanceof Error ? error.message : String(error)}`);
	// 	}
	// }


	// --- TEMPORARILY DISABLED due to persistent TS build errors (TS2339) ---
	// --- Issue seems related to type definitions for App.commands not being recognized ---
	// /**
	//  * Retrieves all unique tags directly from the Obsidian metadata cache using getAllTags().
	//  * This method aggregates tags from note bodies and frontmatter across the entire vault.
	//  * @returns A sorted list of unique tags (including '#').
	//  */
	// private _getAllTags(): string[] {
	// 	try {
	// 		// Use the official API method getAllTags() which returns Record<string, number>
	// 		// This is the correct method name based on the documentation.
	// 		const tagsObject = this.app.metadataCache.getAllTags(); // <-- Utilisation de getAllTags()

	// 		// Extract the keys (the tags themselves) from the object
	// 		const tagsArray = Object.keys(tagsObject);

	// 		// Sort the tags alphabetically for consistent output
	// 		tagsArray.sort();

	// 		this.logDebug(`Retrieved ${tagsArray.length} unique tags directly via getAllTags().`);
	// 		return tagsArray;
	// 	} catch (error) {
	// 		this.logError("Error retrieving tags using metadataCache.getAllTags():", error);
	// 		// Throw a consistent error message
	// 		throw new Error(`Failed to get tags using getAllTags(): ${error instanceof Error ? error.message : String(error)}`);
	// 	}
	// }


	/**
	 * Gets the name of the current vault.
	 * @returns The vault name string.
	 */
	private _getVaultName(): string {
		try {
			const vaultName = this.app.vault.getName();
			this.logDebug(`Retrieved vault name: ${vaultName}`);
			return vaultName;
		} catch (error) {
			this.logError("Error retrieving vault name:", error);
			throw new Error(`Failed to get vault name: ${error instanceof Error ? error.message : String(error)}`);
		}
	}


	/**
	 * Determines the current theme mode (light or dark).
	 * @returns 'light' or 'dark'.
	 */
	private _getThemeMode(): 'light' | 'dark' {
		// Check the body class, which Obsidian uses to indicate the theme
		try {
			const isDark = document.body.classList.contains('theme-dark');
			const mode = isDark ? 'dark' : 'light';
			this.logDebug(`Determined theme mode: ${mode}`);
			return mode;
		} catch (error) {
			// This should be very unlikely in a browser context, but handle defensively
			this.logError("Error checking document.body for theme class:", error);
			throw new Error(`Failed to determine theme mode: ${error instanceof Error ? error.message : String(error)}`);
		}
	}


	/**
	 * Creates a new folder in the vault.
	 * @param relativePath Vault-relative path for the new folder.
	 * @throws Error if creation fails (e.g., folder exists, invalid path).
	 */
	private async _createFolder(relativePath: string): Promise<void> {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(`Attempting to create folder: ${normalizedPath}`);
		try {
			// Check if path already exists (could be file or folder)
			const existingPath = this.app.vault.getAbstractFileByPath(normalizedPath);
			if (existingPath) {
				throw new Error(`Path already exists at "${normalizedPath}" (cannot create folder).`);
			}
			await this.app.vault.createFolder(normalizedPath);
			this.logInfo(`Folder created successfully: ${normalizedPath}`);
		} catch (error) {
			this.logError(`Error creating folder ${normalizedPath}:`, error);
			throw new Error(`Failed to create folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
		}
	}


	/**
	 * Lists files and subfolders within a given vault folder path.
	 * @param relativePath Vault-relative path of the folder to list.
	 * @returns An object containing lists of relative file and folder paths within the target folder.
	 * @throws Error if the path is not found, not a folder, or listing fails.
	 */
	private async _listFolder(relativePath: string): Promise<{ files: string[], folders: string[] }> {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(`Attempting to list folder contents: ${normalizedPath}`);
		try {
			// Use adapter.list for direct listing
			const listResult = await this.app.vault.adapter.list(normalizedPath);
			this.logDebug(`Folder listed successfully: ${normalizedPath}`);
			// Ensure the result structure is as expected (files, folders arrays)
			return {
				files: listResult.files || [],
				folders: listResult.folders || []
			};
		} catch (error) {
			// adapter.list might throw if path doesn't exist or isn't a folder
			this.logError(`Error listing folder ${normalizedPath}:`, error);
			// Check if the path exists at all to provide better context
			const pathExists = await this._checkPathExists(normalizedPath); // Reuse helper
			if (!pathExists) {
				throw new Error(`Cannot list folder: Path not found at "${normalizedPath}"`);
			} else {
				// Path exists but might not be a folder, or another error occurred
				throw new Error(`Failed to list folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)} (Is it a folder?)`);
			}
		}
	}


	/**
	 * Retrieves outgoing links (including embeds) from a note's metadata cache.
	 * NOTE: Does not currently compute backlinks.
	 * @param relativePath Vault-relative path of the note.
	 * @param type The type of links requested (currently only 'outgoing' is implemented).
	 * @returns A list of outgoing link strings.
	 * @throws Error if the note is not found or metadata cannot be retrieved.
	 */
	private _getLinks(relativePath: string, type: string = 'outgoing'): string[] {
		const normalizedPath = normalizePath(relativePath);
		this.logDebug(`Attempting to get links for: ${normalizedPath} (type: ${type})`);

		if (type !== 'outgoing') {
			this.logWarn(`Link type "${type}" requested, but only "outgoing" is currently implemented. Returning outgoing links.`);
			// Proceed to return outgoing links as a fallback
		}

		const metadata = this.app.metadataCache.getCache(normalizedPath);
		if (!metadata) {
			// Check if file exists to differentiate between "not found" and "no metadata"
			const fileExists = !!this.app.vault.getAbstractFileByPath(normalizedPath);
			if (!fileExists) {
				throw new Error(`Cannot get links: File not found at path "${normalizedPath}"`);
			} else {
				// File exists but no metadata (e.g., not markdown, empty)
				this.logWarn(`No metadata cache found for file "${normalizedPath}" to get links.`);
				return []; // Return empty list if no metadata
			}
		}

		const outgoingLinks: string[] = [];

		// Add regular links [[link]]
		if (metadata.links) {
			metadata.links.forEach(link => outgoingLinks.push(link.link));
		}

		// Add embeds ![[embed]]
		if (metadata.embeds) {
			metadata.embeds.forEach(embed => outgoingLinks.push(embed.link));
		}

		// Remove duplicates if any (though unlikely between links and embeds for the same target)
		const uniqueLinks = Array.from(new Set(outgoingLinks));

		this.logDebug(`Found ${uniqueLinks.length} unique outgoing links/embeds for ${normalizedPath}.`);
		return uniqueLinks;
	}


	/**
	 * Retrieves context information about the active editor.
	 * @returns An object with editor context, or null if no editor is active.
	 * @throws Error if accessing editor properties fails unexpectedly.
	 */
	private _getEditorContext(): Record<string, any> | null {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || !view.editor) {
			this.logDebug("No active Markdown editor found for get_editor_context.");
			return null; // Return null instead of throwing error if simply no editor active
		}

		const editor = view.editor;
		try {
			const cursor = editor.getCursor(); // {line, ch}
			const lineCount = editor.lineCount();
			const context = {
				cursor: { line: cursor.line, ch: cursor.ch },
				line_count: lineCount,
				// Add more context here if needed in the future
				// e.g., selection: editor.listSelections()?.[0]
			};
			this.logDebug("Retrieved editor context:", context);
			return context;
		} catch (error) {
			this.logError("Error retrieving editor context:", error);
			throw new Error(`Failed to get editor context: ${error instanceof Error ? error.message : String(error)}`);
		}
	}


	/**
	 * Executes a Python script to retrieve its settings definitions JSON.
	 * @param scriptAbsolutePath Absolute path to the Python script.
	 * @returns A promise resolving to the parsed settings definitions array, or null on error/non-compliance.
	 */
	async discover_script_settings(scriptAbsolutePath: string): Promise<ScriptSettingDefinition[] | null> {
		const scriptName = path.basename(scriptAbsolutePath);
		// Log discovery start at DEBUG level unless verbose logging is needed
		this.logDebug(`Discovering settings for script: ${scriptName}`);

		if (!this.pythonExecutable) {
			// Log as WARN because this prevents discovery
			this.logWarn(`Cannot discover settings for ${scriptName}: Python executable not found.`);
			return null;
		}

		const discoveryTimeoutMs = SETTINGS_DISCOVERY_TIMEOUT; // Use constant

		return new Promise((resolve) => {
			const args = [scriptAbsolutePath, "--get-settings-json"];
			this.logDebug(`Running discovery command: ${this.pythonExecutable} ${args.join(" ")}`);

			const scriptDir = path.dirname(scriptAbsolutePath);
			const currentPYTHONPATH = process.env.PYTHONPATH;
			const newPYTHONPATH = currentPYTHONPATH
				? `${scriptDir}${path.delimiter}${currentPYTHONPATH}`
				: scriptDir;
			const env = {
				...process.env,
				PYTHONPATH: newPYTHONPATH
			};

			const pythonProcess = spawn(this.pythonExecutable!, args, {
				timeout: discoveryTimeoutMs,
				cwd: scriptDir,
				env: env
			});

			let stdoutData = "";
			let stderrData = "";

			pythonProcess.stdout?.on("data", (data) => {
				stdoutData += data.toString();
			});

			pythonProcess.stderr?.on("data", (data) => {
				stderrData += data.toString();
			});

			pythonProcess.on("error", (error) => {
				// Log as WARN - failure to start the process is significant
				this.logWarn(`Failed to start settings discovery for ${scriptName}: ${error.message}`);
				resolve(null);
			});

			pythonProcess.on("close", (code, signal) => {
				if (signal === 'SIGTERM' || (pythonProcess.killed && signal === null)) {
					// Log as WARN - timeout is an issue
					this.logWarn(`Settings discovery for ${scriptName} timed out after ${discoveryTimeoutMs}ms.`);
					resolve(null);
					return;
				}

				// --- Check Exit Code FIRST ---
				if (code !== 0) {
					// Log as WARN - non-zero exit usually indicates an error in the script
					// or that it doesn't handle the --get-settings-json argument.
					this.logWarn(`Settings discovery process for ${scriptName} failed with exit code ${code}.`);
					// Log stderr as WARN only if there was an error exit code
					if (stderrData.trim()) {
						this.logWarn(`Stderr from ${scriptName} discovery: ${stderrData.trim()}`);
					}
					resolve(null); // Resolve with null on non-zero exit code
					return;
				}

				// --- Process stdout ONLY if exit code is 0 ---
				try {
					// Trim stdout before parsing
					const trimmedStdout = stdoutData.trim();
					this.logDebug(`Raw settings JSON from ${scriptName}: ${trimmedStdout}`);

					// Handle empty output specifically - means script exited cleanly but provided no settings
					if (!trimmedStdout) {
						this.logDebug(`Script ${scriptName} provided no settings output (empty stdout). Assuming no settings.`);
						resolve([]); // Resolve with an empty array, indicating success but no settings
						return;
					}

					// Attempt to parse non-empty output
					const definitions = JSON.parse(trimmedStdout);

					if (!Array.isArray(definitions)) {
						// This IS an error case - script exited 0 but gave invalid JSON structure
						this.logError(`Parsed settings definitions from ${scriptName} is not an array. Output: ${trimmedStdout}`);
						resolve(null); // Indicate failure due to invalid format
						return;
					}

					// Optional: Add more validation for each definition object structure here

					// Success!
					this.logInfo(`Successfully discovered ${definitions.length} settings for ${scriptName}.`);
					resolve(definitions as ScriptSettingDefinition[]);

				} catch (error) {
					// --- Catch JSON PARSE errors specifically ---
					// Log as DEBUG because this is expected for scripts not outputting JSON
					const errorMsg = error instanceof Error ? error.message : String(error);
					this.logDebug(`Could not parse settings JSON from ${scriptName}: ${errorMsg}. This is expected for scripts without settings.`);
					// Log the problematic stdout only at debug level
					this.logDebug(`Stdout from ${scriptName} that failed parsing was: ${stdoutData.trim()}`);
					resolve(null); // Resolve with null as discovery failed for this script due to parsing error
				}
			});
		});
	}

	/**
	 * Scans the scripts folder, discovers settings for each script, and updates the cache.
	 * @param scriptsFolder Absolute path to the Python scripts folder.
	 */
	async updateScriptSettingsCache(scriptsFolder: string): Promise<void> {
		this.logInfo("Updating script settings definitions cache...");
		if (!this.pythonExecutable) {
			this.logError("Cannot update script settings cache: Python executable not found.");
			return;
		}
		if (!scriptsFolder || !fs.existsSync(scriptsFolder)) {
			this.logWarn("Cannot update script settings cache: Scripts folder path is invalid or not found.");
			// Clear existing definitions if folder is invalid? Or keep them? Keeping seems safer.
			// this.settings.scriptSettingsDefinitions = {};
			// await this.saveSettings();
			return;
		}

		let pythonFiles: string[];
		try {
			pythonFiles = fs.readdirSync(scriptsFolder)
				.filter(f => f.toLowerCase().endsWith(".py") && !f.startsWith("."));
		} catch (err) {
			this.logError(`Error reading scripts folder for settings discovery ${scriptsFolder}:`, err);
			return;
		}

		const newDefinitions: Record<string, ScriptSettingDefinition[]> = {};
		let changesMade = false;
		const currentDefinitionKeys = new Set<string>(); // Track keys present in this scan

		for (const file of pythonFiles) {
			const scriptAbsolutePath = path.join(scriptsFolder, file);
			// Use normalizePath on the relative path to ensure consistent keys (e.g., slashes)
			const relativePath = normalizePath(path.relative(scriptsFolder, scriptAbsolutePath));
			currentDefinitionKeys.add(relativePath); // Add to set of current scripts

			try {
				const definitions = await this.discover_script_settings(scriptAbsolutePath);

				if (definitions !== null) {
					// Store definitions if discovery was successful
					newDefinitions[relativePath] = definitions;
					// Check if definitions changed compared to cache
					if (JSON.stringify(definitions) !== JSON.stringify(this.settings.scriptSettingsDefinitions[relativePath])) {
						changesMade = true;
						this.logDebug(`Definitions updated for ${relativePath}`);
					}
				} else {
					// Discovery failed, keep existing definition in cache if it exists
					if (this.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)) {
						newDefinitions[relativePath] = this.settings.scriptSettingsDefinitions[relativePath];
						this.logWarn(`Failed to discover settings for ${relativePath}, keeping cached version.`);
					} else {
						this.logWarn(`Failed to discover settings for ${relativePath}, no cached version available.`);
					}
				}
			} catch (error) {
				this.logError(`Unexpected error during settings discovery for ${file}:`, error);
				// Keep existing definition on unexpected error too
				if (this.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)) {
					newDefinitions[relativePath] = this.settings.scriptSettingsDefinitions[relativePath];
				}
			}
		}

		// Check for scripts removed from the folder by comparing current keys with cached keys
		const cachedPaths = Object.keys(this.settings.scriptSettingsDefinitions);
		for (const cachedPath of cachedPaths) {
			if (!currentDefinitionKeys.has(cachedPath)) {
				changesMade = true; // Definitions were removed
				this.logInfo(`Script ${cachedPath} removed, clearing its settings definitions.`);
				// Also clear corresponding values? Yes, makes sense.
				if (this.settings.scriptSettingsValues.hasOwnProperty(cachedPath)) {
					delete this.settings.scriptSettingsValues[cachedPath];
					this.logDebug(`Cleared stored values for removed script ${cachedPath}.`);
				}
			}
		}
		// Check if number of scripts with definitions changed
		if (cachedPaths.length !== currentDefinitionKeys.size) {
			changesMade = true;
		}


		if (changesMade) {
			this.logInfo("Script settings definitions cache updated.");
			this.settings.scriptSettingsDefinitions = newDefinitions;
			// Save settings (includes definitions and potentially cleared values)
			await this.saveSettings();
		} else {
			this.logInfo("Script settings definitions cache is up to date.");
		}
	}


	/**
	 * Executes a Python script using the detected executable.
	 * Handles setting environment variables, logging output/errors.
	 * @param scriptPath Absolute path to the Python script.
	 */
	async runPythonScript(scriptPath: string) {
		// --- Check for Python executable ---
		if (!this.pythonExecutable) {
			this.logError(`Cannot run script ${path.basename(scriptPath)}: Python executable not found.`);
			new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_RUN")); // Add key
			// Attempt to re-check environment
			const envOk = await this.checkPythonEnvironment();
			if (!envOk || !this.pythonExecutable) {
				return; // Stop if still not found
			}
			// If found now, continue execution
			this.logInfo("Python executable found after re-check, proceeding with script execution.");
		}
		const pythonCmd = this.pythonExecutable; // Use the stored executable

		// Check if port has changed since server start - potential mismatch
		// Use initialHttpPort which reflects the actual listening port (even if dynamic)
		if (this.server && this.settings.httpPort !== 0 && this.settings.httpPort !== this.initialHttpPort) {
			new Notice(
				`${t("NOTICE_PORT_MISMATCH_WARNING_PREFIX")}${this.initialHttpPort} ${t("NOTICE_PORT_MISMATCH_WARNING_MIDDLE")} ${this.settings.httpPort}${t("NOTICE_PORT_MISMATCH_WARNING_SUFFIX")}`,
				8000,
			);
			this.logWarn(
				`HTTP Port mismatch detected (Server on ${this.initialHttpPort}, Setting is ${this.settings.httpPort}) when running script ${path.basename(scriptPath)}.`,
			);
		}

		// Validate script path existence
		try {
			if (!fs.existsSync(scriptPath) || !fs.statSync(scriptPath).isFile()) {
				new Notice(`${t("NOTICE_SCRIPT_NOT_FOUND_PREFIX")} ${path.basename(scriptPath)}`);
				this.logError(`Python script not found or is not a file: ${scriptPath}`);
				return;
			}
		} catch (error) {
			new Notice(`${t("NOTICE_SCRIPT_ACCESS_ERROR_PREFIX")} ${path.basename(scriptPath)}`);
			this.logError(`Error accessing script file ${scriptPath}:`, error);
			return;
		}

		this.logInfo(`Attempting to run Python script: ${scriptPath} using ${pythonCmd}`);
		new Notice(`${t("NOTICE_RUNNING_SCRIPT_PREFIX")} ${path.basename(scriptPath)}`);

		// --- Calculate Relative Path ---
		const scriptsFolder = this.getScriptsFolderPath();
		let relativePath = "";
		if (scriptsFolder && scriptPath.startsWith(scriptsFolder)) {
			// Ensure consistent separators for reliable key lookup later
			relativePath = normalizePath(path.relative(scriptsFolder, scriptPath));
			this.logDebug(`Calculated relative path for env var: ${relativePath}`);
		} else {
			this.logWarn(`Could not determine relative path for script ${scriptPath} relative to folder ${scriptsFolder}. Script settings might not be retrievable.`);
		}


		// Prepare environment variables for the Python script
		const env = {
			...process.env, // Inherit existing environment variables
			OBSIDIAN_HTTP_PORT: this.initialHttpPort.toString(), // Use the ACTUAL port the server is listening on
			OBSIDIAN_BRIDGE_ACTIVE: "true", // Flag indicating the bridge is active
			// --- NEW: Pass relative path ---
			...(relativePath && { OBSIDIAN_SCRIPT_RELATIVE_PATH: relativePath }),
			...(this.settings.disablePyCache && { PYTHONPYCACHEPREFIX: os.tmpdir() }), // Attempt to redirect __pycache__ if disabled
		};
		this.logDebug(
			`Setting OBSIDIAN_HTTP_PORT=${this.initialHttpPort} for script.`, // Log the actual port used
		);
		if (relativePath) {
			this.logDebug(`Setting OBSIDIAN_SCRIPT_RELATIVE_PATH=${relativePath}`);
		}
		if (this.settings.disablePyCache) {
			this.logDebug(`Attempting to disable __pycache__ creation.`);
		}

		// Determine Python arguments
		const pythonArgsBase = this.settings.disablePyCache ? ["-B"] : []; // Add -B flag if disabling pycache
		const fullArgs = [...pythonArgsBase, scriptPath]; // Combine base args (-B) with script path

		// --- Execute using the stored pythonCmd ---
		try {
			await new Promise<void>((resolve, reject) => {
				this.logDebug(`Executing: ${pythonCmd} ${fullArgs.join(" ")}`);
				const pythonProcess = spawn(pythonCmd, fullArgs, {
          env,
          cwd: path.dirname(scriptPath)
        });
        
				let stderrOutput = "";
				pythonProcess.stderr?.on("data", (data) => {
					const msg = data.toString();
					stderrOutput += msg;
					// Log stderr immediately for better debugging context
					console.error(
						`[stderr ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
					this.logError( // Also log via plugin logger
						`[stderr ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
				});

				pythonProcess.stdout?.on("data", (data) => {
					const msg = data.toString();
					// Log stdout immediately
					console.log(
						`[stdout ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
					this.logDebug( // Also log via plugin logger
						`[stdout ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
				});

				pythonProcess.on("error", (error) => {
					this.logError(
						`Failed to start script with command "${pythonCmd}": ${error.message}`,
					);
					new Notice(
						`${t("NOTICE_SCRIPT_ERROR_RUNNING_PREFIX")} ${path.basename(scriptPath)} ${t("NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE")} ${pythonCmd}: ${error.message}`,
					);
					reject(error); // Reject the promise on spawn error
				});

				pythonProcess.on("close", (code) => {
					this.logDebug(
						`${path.basename(scriptPath)} (using ${pythonCmd}) finished with exit code ${code}.`,
					);
					if (code !== 0 && code !== null) {
						new Notice(
							`${path.basename(scriptPath)} ${t("NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE")} ${code}. ${t("NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX")}`,
							5000,
						);
						// Stderr already logged line-by-line, but log summary if useful
						if (stderrOutput.trim()) {
							this.logError(
								`[Error Summary ${path.basename(scriptPath)}]: ${stderrOutput.trim()}`,
							);
						}
						reject(new Error(`Script exited with non-zero code: ${code}`));
					} else {
						resolve(); // Success (exit code 0 or null)
					}
				});
			});
			// If promise resolved successfully
			this.logInfo(
				`Script ${path.basename(scriptPath)} execution completed successfully.`,
			);
		} catch (error) {
			// Catch rejection from the promise (spawn error or non-zero exit)
			this.logWarn(
				`Script ${path.basename(scriptPath)} execution failed or exited with error: ${error instanceof Error ? error.message : String(error)}`,
			);
			// Notices are already shown inside the promise callbacks/rejections
		}
	}


	/**
	 * Opens a modal for the user to select a Python script from the configured folder, then runs it.
	 */
	async chooseAndRunPythonScript() {
		const scriptsFolder = this.getScriptsFolderPath();
		if (!scriptsFolder) {
			// Use translation for the notice
			new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000);
			return;
		}

		let pythonFiles: string[];
		try {
			pythonFiles = fs
				.readdirSync(scriptsFolder)
				.filter(
					(f) =>
						f.toLowerCase().endsWith(".py") && !f.startsWith("."),
				); // Case-insensitive check, ignore hidden
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			// Use translation for the notice
			new Notice(`${t("NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX")} ${errorMsg}`);
			this.logError(
				`Error reading scripts folder ${scriptsFolder}:`,
				err,
			);
			return;
		}

		if (pythonFiles.length === 0) {
			// Use translation for the notice
			new Notice(t("NOTICE_NO_SCRIPTS_FOUND"), 5000);
			return;
		}

		const scriptChoices = pythonFiles.map((f) => ({
			label: f, // Display name
			value: path.join(scriptsFolder, f), // Full path as value (use Node's join directly)
		}));

		// Sort choices alphabetically by label for better usability
		scriptChoices.sort((a, b) => a.label.localeCompare(b.label));

		// Note: ScriptSelectionModal placeholder needs translation if used.
		new ScriptSelectionModal(this.app, scriptChoices, (selectedPath) => {
			if (selectedPath) {
				this.logDebug(`User selected script: ${selectedPath}`);
				// Don't await runPythonScript here, let it run in the background
				this.runPythonScript(selectedPath);
			} else {
				this.logDebug("Script selection cancelled by user.");
			}
		}).open();
	}

	/**
	 * Runs all Python scripts found in the configured folder sequentially.
	 */
	async runAllPythonScripts() {
		const scriptsFolder = this.getScriptsFolderPath();
		if (!scriptsFolder) {
			// Use translation for the notice
			new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000);
			return;
		}

		let pythonFiles: string[];
		try {
			pythonFiles = fs
				.readdirSync(scriptsFolder)
				.filter(
					(f) =>
						f.toLowerCase().endsWith(".py") && !f.startsWith("."),
				);
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			// Use translation for the notice
			new Notice(`${t("NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX")} ${errorMsg}`);
			this.logError(
				`Error reading scripts folder ${scriptsFolder}:`,
				err,
			);
			return;
		}

		if (pythonFiles.length === 0) {
			// Use translation for the notice
			new Notice(t("NOTICE_NO_SCRIPTS_FOUND"), 5000);
			return;
		}

		// Sort files alphabetically before running
		pythonFiles.sort((a, b) => a.localeCompare(b));

		// Use translation for the notice
		new Notice(`${t("NOTICE_RUNNING_ALL_SCRIPTS_PREFIX")} ${pythonFiles.length} ${t("NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX")}`);
		this.logInfo(`Starting batch run of ${pythonFiles.length} scripts...`);

		// Run scripts sequentially using a loop
		for (const file of pythonFiles) {
			// Use Node's path.join directly
			const scriptPath = path.join(scriptsFolder, file);
			this.logInfo(`Running next script in batch: ${file}`);
			// Use await here to ensure scripts run one after another
			await this.runPythonScript(scriptPath);
			// Optional: Add a small delay between scripts if needed
			// await new Promise(resolve => setTimeout(resolve, 100));
		}
		this.logInfo("Finished batch run of scripts.");
	}
} // End of class ObsidianPythonBridge
