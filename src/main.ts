// --- src/main.ts ---
import { App, Notice, Plugin, TFile, TAbstractFile, MarkdownView, Command, FileSystemAdapter, PluginSettingTab, Setting, Editor, PaneType, OpenViewState, normalizePath, LinkCache, TFolder } from "obsidian";
import * as http from "http";
import * as path from "path";
import { AddressInfo } from "net";

// Import types and constants
import { PythonBridgeSettings, JsonResponse, JsonRequest, ScriptSettingDefinition } from "./types"; // Keep if needed directly in main, otherwise remove
import { DEFAULT_PORT, SETTINGS_DISCOVERY_TIMEOUT, PYTHON_LIBRARY_FILENAME } from "./constants"; // Keep if needed directly in main, otherwise remove

// Import functions from new modules
import { checkPythonEnvironment, showPythonMissingNotification, showRequestsMissingNotification } from "./environment_checker"; // Keep if used directly, e.g., in catch blocks
import { getScriptsFolderPath, updateAndSyncCommands, runPythonScript, runAutoStartScripts, chooseAndRunPythonScript, runAllPythonScripts } from "./python_executor"; // Keep for direct calls if any, or remove // Keep for command callback // Keep for command callback
import { registerObsidianEventListeners, triggerEvent } from "./event_handler"; // Keep if used directly, otherwise remove
import { dispatchAction } from "./action_handler";
import { getObsidianLanguage, getCurrentVaultAbsolutePath } from "./obsidian_api"; // Import specific API helpers if needed directly

// Import UI components
import PythonBridgeSettingTab from "./PythonBridgeSettingTab";
import UserInputModal from "./UserInputModal";
import { loadTranslations, t } from "./lang/translations";
// ScriptSelectionModal is likely used only within python_executor now

// --- Default Settings ---
const DEFAULT_SETTINGS: PythonBridgeSettings = {
	pythonScriptsFolder: "", httpPort: DEFAULT_PORT, disablePyCache: true, pluginLanguage: "auto",
	scriptSettingsDefinitions: {}, scriptSettingsValues: {}, scriptActivationStatus: {},
	scriptAutoStartStatus: {}, scriptAutoStartDelay: {},
};

// --- Main Plugin Class ---
export default class ObsidianPythonBridge extends Plugin {
	settings!: PythonBridgeSettings;
	server: http.Server | null = null;
	initialHttpPort: number = 0; // Store the port used at server start
	pythonExecutable: string | null = null; // Managed by environment_checker
	dynamicScriptCommands: Map<string, Command> = new Map(); // Managed by python_executor
	eventListeners: Map<string, Set<string>> = new Map(); // Managed by event_handler

	// --- Logging Helpers ---
	// (Keep these methods as they are used by other modules via the plugin instance)
	logDebug(message: string, ...optionalParams: any[]) { console.log(`plugin:obsidian-python-bridge:DEBUG: ${message}`, ...optionalParams); }
	logInfo(message: string, ...optionalParams: any[]) { console.log(`plugin:obsidian-python-bridge:INFO: ${message}`, ...optionalParams); }
	logWarn(message: string, ...optionalParams: any[]) { console.warn(`plugin:obsidian-python-bridge:WARN: ${message}`, ...optionalParams); }
	logError(message: string, ...optionalParams: any[]) { console.error(`plugin:obsidian-python-bridge:ERROR: ${message}`, ...optionalParams); }

	// --- Plugin Lifecycle ---
	async onload() {
		this.logInfo("Loading Obsidian Python Bridge plugin...");
		await this.loadSettings();
		await this.validateScriptsFolderPathSetting(); // Validate startup folder path setting
		loadTranslations(this); // Load translations
		this.initialHttpPort = this.settings.httpPort; // Store initial port
		this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
		this.addCommands(); // Add static commands

		// Perform environment check using the dedicated module
		const envCheckOk = await checkPythonEnvironment(this);
		if (envCheckOk) {
			this.startHttpServer(); // Start server only if Python env is okay
			// Discover script settings and sync commands using the dedicated module
			const scriptsFolder = getScriptsFolderPath(this); // Re-check after potential validation
			if (scriptsFolder && this.pythonExecutable) {
				// Run discovery and command sync asynchronously
				updateAndSyncCommands(this, scriptsFolder)
					.catch((err) => { this.logError("Initial script settings discovery and command sync failed:", err); })
					.then(() => { runAutoStartScripts(this); }); // Run auto-start scripts AFTER initial discovery/sync
			} else {
				this.logWarn("Skipping initial script settings discovery: Python executable or valid scripts folder not found.");
			}
		} else {
			this.logWarn("Skipping server start and settings discovery due to Python environment issues.");
		}

		// Register cleanup on quit
		this.registerEvent(this.app.workspace.on("quit", () => {
			this.logInfo("Obsidian quitting, stopping HTTP server...");
			this.stopHttpServer();
		}));
		// Register Obsidian event listeners using the dedicated module
		registerObsidianEventListeners(this);
		this.logInfo("Obsidian Python Bridge plugin loaded.");
	}

	onunload() {
		this.logInfo("Unloading Obsidian Python Bridge plugin...");
		this.stopHttpServer(); // Ensure server is stopped on unload
		this.eventListeners.clear(); // Clear listeners map
		this.logInfo("Obsidian Python Bridge plugin unloaded.");
	}

	// --- Settings Management ---
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		// Ensure new settings fields exist
		this.settings.scriptSettingsDefinitions = this.settings.scriptSettingsDefinitions || {};
		this.settings.scriptSettingsValues = this.settings.scriptSettingsValues || {};
		this.settings.scriptActivationStatus = this.settings.scriptActivationStatus || {};
		this.settings.scriptAutoStartStatus = this.settings.scriptAutoStartStatus || {};
		this.settings.scriptAutoStartDelay = this.settings.scriptAutoStartDelay || {};
		// Validate loaded port
		if (typeof this.settings.httpPort !== "number" || !Number.isInteger(this.settings.httpPort) || (this.settings.httpPort !== 0 && (this.settings.httpPort < 1024 || this.settings.httpPort > 65535))) {
			this.logWarn(`Invalid httpPort loaded (${this.settings.httpPort}), resetting to default ${DEFAULT_PORT}`);
			this.settings.httpPort = DEFAULT_PORT;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Check if port setting needs server restart
		const currentPortSetting = this.settings.httpPort;
		const actualListeningPort = this.server ? (this.server.address() as AddressInfo)?.port ?? this.initialHttpPort : this.initialHttpPort;
		if (this.server && currentPortSetting !== actualListeningPort) {
			if (currentPortSetting === 0 || (currentPortSetting >= 1024 && currentPortSetting <= 65535)) {
				this.logInfo(`HTTP port setting changed or differs from listening port (${actualListeningPort} -> ${currentPortSetting}). Restarting server...`);
				new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${t("NOTICE_PORT_CHANGED_PREFIX")} ${currentPortSetting}. ${t("NOTICE_PORT_CHANGED_SUFFIX")}`, 3000);
				this.stopHttpServer();
				this.startHttpServer();
			} else {
				this.logError(`Attempted to save invalid port ${currentPortSetting}. Server not restarted.`);
			}
		}
		// Settings discovery & command sync on folder change is handled in the settings tab
	}

	// --- Validate Scripts Folder Path on Startup ---
	async validateScriptsFolderPathSetting(): Promise<void> {
		const configuredPath = this.settings.pythonScriptsFolder;
		if (!configuredPath || !configuredPath.trim()) return;
		this.logDebug(`Validating configured scripts folder path on startup: ${configuredPath}`);
		const resolvedPath = getScriptsFolderPath(this); // Use helper from python_executor
		if (!resolvedPath) {
			this.logWarn(`Configured Python scripts folder path "${configuredPath}" is invalid or not found/directory. Clearing setting.`);
			new Notice(t("NOTICE_INVALID_STARTUP_FOLDER_PATH").replace("{path}", configuredPath));
			this.settings.pythonScriptsFolder = "";
			await this.saveSettings();
		} else {
			this.logDebug(`Configured scripts folder path validated successfully on startup: ${resolvedPath}`);
		}
	}

	// --- Command Registration ---
	addCommands() {
		// Static commands remain here
		this.addCommand({ id: "run-specific-python-script", name: t("CMD_RUN_SPECIFIC_SCRIPT_NAME"), callback: () => chooseAndRunPythonScript(this) }); // Use helper from python_executor
		this.addCommand({ id: "run-all-python-scripts", name: t("CMD_RUN_ALL_SCRIPTS_NAME"), callback: () => runAllPythonScripts(this) }); // Use helper from python_executor
		this.addCommand({ id: "refresh-script-settings", name: t("CMD_REFRESH_SCRIPT_SETTINGS_NAME"), callback: async () => {
			const scriptsFolder = getScriptsFolderPath(this);
			if (!scriptsFolder) { new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000); return; }
			if (!this.pythonExecutable) {
				new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH"), 5000);
				await checkPythonEnvironment(this); // Re-check env
				if (!this.pythonExecutable) return;
			}
			new Notice(t("NOTICE_REFRESHING_SCRIPT_SETTINGS"));
			try {
				await updateAndSyncCommands(this, scriptsFolder); // Use the combined update function from python_executor
				new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS"));
				// Force redraw settings tab if open? (Complex, maybe defer)
			} catch (error) {
				this.logError("Manual script settings refresh failed:", error);
				new Notice(t("NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED"));
			}
		}});
		// Dynamic script commands are handled by updateAndSyncCommands in python_executor.ts
	}

	// --- HTTP Server Management ---
	stopHttpServer() {
		if (this.server) {
			this.logInfo("Stopping HTTP server...");
			this.server.close((err) => {
				if (err) this.logError("Error closing HTTP server:", err);
				else this.logInfo("HTTP server stopped.");
				this.server = null;
			});
		} else {
			this.logDebug("HTTP server already stopped or not started.");
		}
	}

	startHttpServer() {
		this.logDebug("Attempting to start HTTP server...");
		if (this.server) { this.logWarn("Server already running. Stopping first."); this.stopHttpServer(); }
		// Validate port
		if (!this.settings.httpPort && this.settings.httpPort !== 0 || typeof this.settings.httpPort !== "number" || !Number.isInteger(this.settings.httpPort) || this.settings.httpPort < 0 || this.settings.httpPort > 65535) {
			const errorMsg = `${t("NOTICE_INVALID_PORT_CONFIG_PREFIX")} ${this.settings.httpPort}. ${t("NOTICE_INVALID_PORT_CONFIG_SUFFIX")}`;
			this.logError(errorMsg);
			new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${errorMsg}`, 7000);
			return;
		}
		this.server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
			const { method, url } = req;
			const remoteAddress = req.socket.remoteAddress || "unknown";
			this.logDebug(`HTTP Request received: ${method} ${url} from ${remoteAddress}`);
			// Basic validation (POST, root path, localhost)
			if (url !== "/" || method !== "POST" || !["127.0.0.1", "::1", "localhost"].includes(remoteAddress)) {
				this.logWarn(`Ignoring request: Invalid method/path/origin (${method} ${url} from ${remoteAddress})`);
				res.writeHead(method !== "POST" || url !== "/" ? 404 : 403, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ status: "error", error: method !== "POST" || url !== "/" ? "Not Found: Please POST to /" : "Forbidden: Access only allowed from localhost" }));
				return;
			}
			// Check Content-Type
			if (req.headers["content-type"] !== "application/json") {
				this.logWarn(`Ignoring request: Invalid Content-Type (${req.headers["content-type"]})`);
				res.writeHead(415, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ status: "error", error: "Invalid Content-Type: application/json required" }));
				return;
			}
			// Process request body
			let body = "";
			req.on("data", (chunk) => { body += chunk.toString(); });
			req.on("end", async () => {
				let request: JsonRequest;
				let response: JsonResponse;
				let statusCode = 200; // Assume success initially
				try {
					this.logDebug(`Attempting to parse JSON request body: ${body}`);
					request = JSON.parse(body);
					if (!request || typeof request !== "object" || typeof request.action !== "string" || !request.action) {
						throw new Error("Invalid JSON request structure. 'action' (non-empty string) is required.");
					}
					// --- Delegate action handling ---
					response = await dispatchAction(this, request);
					// --- End Delegation ---
					this.logDebug(`Action ${request.action} handled, sending response:`, response);
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					this.logError("Error processing request:", errorMessage);
					statusCode = error instanceof SyntaxError ? 400 : 500; // Bad Request for JSON parse errors
					response = { status: "error", error: `Failed to process request: ${errorMessage}` };
				}
				// Send response
				if (!res.writableEnded) {
					const responseJson = JSON.stringify(response);
					res.writeHead(statusCode, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(responseJson) });
					res.end(responseJson);
					this.logDebug(`HTTP Response sent (Status ${statusCode}).`);
				}
			});
			req.on("error", (err) => {
				this.logError("Error reading request stream:", err.message);
				if (!res.writableEnded) {
					res.writeHead(500, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ status: "error", error: "Error reading request data" }));
				}
			});
		});
		this.server.on("error", (err: NodeJS.ErrnoException) => {
			let errorMsg = `HTTP server error: ${err.message}`;
			if (err.code === "EADDRINUSE") errorMsg = `${t("NOTICE_PORT_IN_USE_PREFIX")} ${this.settings.httpPort} ${t("NOTICE_PORT_IN_USE_SUFFIX")}`;
			else this.logError("Unhandled HTTP server error:", err);
			new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${errorMsg}`, 10000);
			this.server = null;
		});
		try {
			this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
				const address = this.server?.address() as AddressInfo;
				const actualPort = address?.port || this.settings.httpPort;
				this.logInfo(`HTTP server listening on http://127.0.0.1:${actualPort}`);
				if (this.settings.httpPort === 0 && actualPort !== 0) {
					this.logInfo(`Server assigned dynamic port: ${actualPort}. Updating internal reference.`);
					this.initialHttpPort = actualPort; // Update the actual listening port reference
					// Optionally update setting in memory for display, but don't save
					// this.settings.httpPort = actualPort;
				} else {
					this.initialHttpPort = this.settings.httpPort;
				}
			});
		} catch (listenErr) {
			const errorMsg = listenErr instanceof Error ? listenErr.message : String(listenErr);
			this.logError("Failed to listen on HTTP port:", errorMsg);
			new Notice(`${t("NOTICE_PLUGIN_NAME")}: ${t("NOTICE_SERVER_START_FAILED_PREFIX")} ${this.settings.httpPort}${t("NOTICE_SERVER_START_FAILED_SUFFIX")} ${errorMsg}`, 7000);
			this.server = null;
		}
	}

	// --- Action Handler (Simplified) ---
	// The complex logic is now in action_handler.ts
	async handleAction(request: JsonRequest): Promise<JsonResponse> { return dispatchAction(this, request); } // Simply delegate

	// --- Obsidian Interaction Helpers ---
	// Keep helpers needed directly by main.ts or UI components (like modals)

	// Keep showNotification as it's called directly by action_handler
	showNotification(message: string, duration: number = 4000) { new Notice(message, duration); }

	// Keep requestUserInput as it instantiates the Modal
	async requestUserInput(scriptName: string, inputType: string, message: string, validationRegex?: string, minValue?: number, maxValue?: number, step?: number): Promise<any> {
		return new Promise((resolve) => {
			const modal = new UserInputModal(this.app, scriptName, inputType, message, (input) => resolve(input), validationRegex, minValue, maxValue, step);
			// Handle modal close/cancel implicitly by not resolving if onSubmit isn't called
			modal.onClose = () => { /* Assume Python side handles timeout/error if no response comes */ };
			modal.open();
		});
	}

	// Keep getAllNotePaths if used directly (e.g., by settings tab?), otherwise remove
	// It's now primarily called via action_handler -> obsidian_api
	getAllNotePaths(): string[] { return this.app.vault.getMarkdownFiles().map((f) => f.path); }

	// Keep getCurrentVaultAbsolutePath if used directly (e.g., by settings tab?), otherwise remove
	// It's now primarily called via action_handler -> obsidian_api
	getCurrentVaultAbsolutePath(): string | null {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter && adapter.getBasePath) return adapter.getBasePath();
		this.logWarn("Vault adapter is not FileSystemAdapter or lacks getBasePath method.");
		return null;
	}

	// Keep checkPythonEnvironment if called directly (e.g., by settings tab?), otherwise remove
	// It's now primarily called during onload
	async checkPythonEnvironment(): Promise<boolean> { return checkPythonEnvironment(this); } // Delegate

	// Remove other API helpers previously here, as they are now in obsidian_api.ts
	// Remove Python execution helpers, now in python_executor.ts
	// Remove Event handling helpers, now in event_handler.ts
}
