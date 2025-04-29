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
import ScriptSelectionModal from "./ScriptSelectionModal";

// --- Interfaces ---
interface PythonBridgeSettings {
	pythonScriptsFolder: string;
	httpPort: number;
	disablePyCache: boolean;
}

const DEFAULT_PORT = 27123;

const DEFAULT_SETTINGS: PythonBridgeSettings = {
	pythonScriptsFolder: "",
	httpPort: DEFAULT_PORT,
	disablePyCache: true,
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
		this.initialHttpPort = this.settings.httpPort; // Store initial port

		this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
		this.addCommands();
		this.startHttpServer(); // Start server after loading settings
		this.checkPythonEnvironment(); // Perform environment check on load

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
		// Validate loaded port
		if (
			typeof this.settings.httpPort !== "number" ||
			!Number.isInteger(this.settings.httpPort) ||
			this.settings.httpPort <= 0 ||
			this.settings.httpPort > 65535
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
		if (this.server && this.settings.httpPort !== this.initialHttpPort) {
			this.logInfo(
				`HTTP port changed from ${this.initialHttpPort} to ${this.settings.httpPort}. Restarting server...`,
			);
			new Notice(
				`Python Bridge: HTTP port changed to ${this.settings.httpPort}. Restarting server...`,
				3000,
			);
			this.stopHttpServer();
			this.startHttpServer(); // Restart server with the new port
			// Update initialHttpPort only after successful restart
			if (this.server) {
				this.initialHttpPort = this.settings.httpPort;
			}
		}
	}

	// --- Environment Check ---

	/**
	 * Checks if Python is accessible and the 'requests' library is installed.
	 * Shows persistent notifications if issues are found.
	 */
	async checkPythonEnvironment(): Promise<void> {
		this.logInfo("Checking Python environment...");

		const pythonCmd = await this.findPythonExecutable();

		if (!pythonCmd) {
			this.logError("Python executable not found during environment check.");
			this.showPythonMissingNotification();
			return;
		}

		this.logInfo(`Found Python executable: ${pythonCmd}`);

		const requestsInstalled = await this.checkPythonModule(pythonCmd, "requests");

		if (!requestsInstalled) {
			this.logError(`Python module 'requests' not found using ${pythonCmd}.`);
			this.showRequestsMissingNotification(pythonCmd);
			return;
		}

		this.logInfo("'requests' module found. Python environment seems OK.");
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
				// Corrected typo: error.me -> error.message
				this.logDebug(`Command '${cmd}' not found or failed version check: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		return null; // Return null if no command was found after checking all options
	} // <-- Closing brace for findPythonExecutable

  /**
   * Checks if a Python module can be imported using a specific Python command.
   * @param pythonCmd The Python command to use (e.g., 'python3', 'py').
   * @param moduleName The name of the module to check (e.g., 'requests').
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
        new Notice("Python Bridge Error:\nPython executable not found in PATH.\nPlease install Python and ensure it's added to your system's PATH environment variable for the plugin to run scripts.\nPlugin features requiring Python will be unavailable.", 0); // Persistent notice
    }, 500); // Delay by 500ms (adjust if needed)
  }

  showRequestsMissingNotification(pythonCmd: string): void {
    // Delay notice slightly to ensure Obsidian UI is ready
    setTimeout(() => {
        new Notice(`Python Bridge Error:\nThe required Python library 'requests' is not installed for ${pythonCmd}.\nPlease install it by running:\n${pythonCmd} -m pip install requests\nPlugin features requiring Python will be unavailable until installed.`, 0); // Persistent notice
    }, 500); // Delay by 500ms (adjust if needed)
  }


	// --- Command Registration ---
	addCommands() {
		this.addCommand({
			id: "run-specific-python-script",
			name: "Run a specific Python script",
			callback: () => this.chooseAndRunPythonScript(),
		});

		this.addCommand({
			id: "run-all-python-scripts",
			name: "Run all Python scripts in folder",
			callback: () => this.runAllPythonScripts(),
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
			!this.settings.httpPort ||
			typeof this.settings.httpPort !== "number" ||
			!Number.isInteger(this.settings.httpPort) ||
			this.settings.httpPort <= 0 ||
			this.settings.httpPort > 65535
		) {
			const errorMsg = `Invalid HTTP port configured: ${this.settings.httpPort}. Server not started. Please configure a valid port (1-65535) in settings.`;
			this.logError(errorMsg);
			new Notice(`Python Bridge: ${errorMsg}`, 7000);
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
									? "Not Found: Please POST to /"
									: "Forbidden: Access only allowed from localhost",
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
							error: "Invalid Content-Type: application/json required",
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
								"Invalid JSON request structure. 'action' (non-empty string) is required.",
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
							error: `Failed to process request: ${errorMessage}`,
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
								error: "Error reading request data",
							}),
						);
					}
				});
			},
		);

		this.server.on("error", (err: NodeJS.ErrnoException) => {
			let errorMsg = `HTTP server error: ${err.message}`;
			if (err.code === "EADDRINUSE") {
				errorMsg = `Port ${this.settings.httpPort} is already in use. Please choose another port in settings or close the other application using it. Server not started.`;
				this.logError(errorMsg);
			} else {
				this.logError("Unhandled HTTP server error:", err);
			}
			new Notice(`Python Bridge: ${errorMsg}`, 10000);
			this.server = null; // Ensure server is marked as null on error
		});

		try {
			this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
				// Get the actual port the server is listening on (useful if port 0 was used)
				const address = this.server?.address() as AddressInfo;
				const actualPort = address?.port || this.settings.httpPort;
				this.logInfo(
					`HTTP server listening on http://127.0.0.1:${actualPort}`,
				);
				// Update settings and initial port if a dynamic port was assigned
				if (this.settings.httpPort === 0 && actualPort !== 0) {
					this.logInfo(
						`Server assigned dynamic port: ${actualPort}. Updating settings.`,
					);
					this.settings.httpPort = actualPort;
					this.initialHttpPort = actualPort;
					this.saveSettings(); // Save the dynamically assigned port
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
			new Notice(
				`Python Bridge: Failed to start server on port ${this.settings.httpPort}. ${errorMsg}`,
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
								error: "No active Markdown note found.",
							};

				case "get_active_note_relative_path":
					const activeRelativePath = this.getActiveNoteRelativePath();
					return activeRelativePath !== null
						? { status: "success", data: activeRelativePath }
						: {
								status: "error",
								error: "No active Markdown note found.",
							};

				case "get_active_note_absolute_path":
					const activeAbsolutePath = this.getActiveNoteAbsolutePath();
					return activeAbsolutePath !== null
						? { status: "success", data: activeAbsolutePath }
						: {
								status: "error",
								error: "No active note or vault path unavailable.",
							};

				case "get_active_note_title":
					const activeTitle = this.getActiveNoteTitle();
					return activeTitle !== null
						? { status: "success", data: activeTitle }
						: {
								status: "error",
								error: "No active Markdown note found.",
							};

				case "get_current_vault_absolute_path":
					const vaultPath = this.getCurrentVaultAbsolutePath();
					return vaultPath !== null
						? { status: "success", data: vaultPath }
						: {
								status: "error",
								error: "Could not determine vault absolute path.",
							};

				case "get_active_note_frontmatter":
					const activeFrontmatter =
						await this.getActiveNoteFrontmatter();
					return { status: "success", data: activeFrontmatter }; // Returns null if no frontmatter

				case "get_note_content":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (string) required.",
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
									: String(error),
						};
					}

				case "get_note_frontmatter":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (string) required.",
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
									: String(error),
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
									: String(error),
						};
					}

				case "replace_selected_text":
					if (typeof payload?.replacement !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'replacement' (string) required.",
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
									: String(error),
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
							error: "Invalid payload: 'filePath' (absolute path string) and 'content' (string) required.",
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
							error: `Failed to modify note: ${errorMsg}`,
						};
					}

				case "modify_note_content_by_path": // New preferred action name
					if (
						typeof payload?.path !== "string" || // Expecting relative path here
						typeof payload?.content !== "string"
					) {
						return {
							status: "error",
							error: "Invalid payload: 'path' (relative vault path string) and 'content' (string) required.",
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
							error: `Failed to modify note: ${errorMsg}`,
						};
					}

				case "open_note":
					if (typeof payload?.path !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'path' (relative vault path string) required.",
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
									: String(error),
						};
					}

				// --- UI Interactions ---
				case "show_notification":
					if (typeof payload?.content !== "string") {
						return {
							status: "error",
							error: "Invalid payload: 'content' (string) required.",
						};
					}
					const duration =
						typeof payload?.duration === "number"
							? payload.duration
							: 4000;
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
							error: "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required.",
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
							error: "User cancelled input.",
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

				// --- Default ---
				default:
					this.logWarn(`Received unknown action: ${action}`);
					return {
						status: "error",
						error: `Unknown action: ${action}`,
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
				error: `Failed to execute action "${action}": ${errorMessage}`,
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
			throw new Error("Cannot modify note: Vault path is unavailable.");
		}
		if (!path.isAbsolute(absoluteFilePath)) {
			throw new Error(
				`Cannot modify note: Provided path is not absolute: ${absoluteFilePath}`,
			);
		}
		// Normalize both paths before comparing
		const normalizedVaultPath = normalizePath(vaultPath);
		const normalizedFilePath = normalizePath(absoluteFilePath);

		// Check if the file path starts with the vault path
		if (!normalizedFilePath.startsWith(normalizedVaultPath)) {
			throw new Error(
				`Cannot modify note: Path is outside the current vault: ${absoluteFilePath}`,
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
				`Cannot modify note: File not found in vault at path: ${normalizedPath}`,
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
				`Vault API failed to modify ${normalizedPath}: ${error instanceof Error ? error.message : String(error)}`,
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

	// --- NEW Interaction Helpers ---

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
				`File not found or is not a file at path: ${normalizedPath}`,
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
			throw new Error("No active Markdown view found.");
		}
		// Ensure editor exists before accessing it
		const editor = view.editor;
		if (!editor) {
			throw new Error("Active Markdown view does not have an editor instance.");
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
				"No active Markdown view found to replace selection in.",
			);
		}
		const editor = view.editor;
		if (!editor) {
			throw new Error("Active Markdown view does not have an editor instance.");
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
				`Could not open note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	// --- Python Script Execution ---

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
	 * Executes a Python script, attempting multiple common Python commands.
	 * Handles finding the executable, setting environment variables, and logging output/errors.
	 * @param scriptPath Absolute path to the Python script.
	 */
	async runPythonScript(scriptPath: string) {
		// Check if port has changed since server start - potential mismatch
		if (this.server && this.settings.httpPort !== this.initialHttpPort) {
			new Notice(
				`⚠️ Python Bridge: HTTP Port changed (${this.initialHttpPort} -> ${this.settings.httpPort}). Script might target the old port if already running or launched externally.`,
				8000,
			);
			this.logWarn(
				`HTTP Port mismatch detected (${this.initialHttpPort} vs ${this.settings.httpPort}) when running script ${path.basename(scriptPath)}.`,
			);
		}

		// Validate script path existence
		try {
			if (!fs.existsSync(scriptPath) || !fs.statSync(scriptPath).isFile()) {
				new Notice(`Python script not found or is not a file: ${path.basename(scriptPath)}`);
				this.logError(`Python script not found or is not a file: ${scriptPath}`);
				return;
			}
		} catch (error) {
			new Notice(`Error accessing script file: ${path.basename(scriptPath)}`);
			this.logError(`Error accessing script file ${scriptPath}:`, error);
			return;
		}

		this.logInfo(`Attempting to run Python script: ${scriptPath}`);
		new Notice(`Running Python script: ${path.basename(scriptPath)}`);

		// Prepare environment variables for the Python script
		const env = {
			...process.env, // Inherit existing environment variables
			OBSIDIAN_HTTP_PORT: this.settings.httpPort.toString(),
			OBSIDIAN_BRIDGE_ACTIVE: "true", // Flag indicating the bridge is active
			...(this.settings.disablePyCache && { PYTHONPYCACHEPREFIX: os.tmpdir() }), // Attempt to redirect __pycache__ if disabled
		};
		this.logDebug(
			`Setting OBSIDIAN_HTTP_PORT=${this.settings.httpPort} for script.`,
		);
		if (this.settings.disablePyCache) {
			this.logDebug(`Attempting to disable __pycache__ creation.`);
		}

		// Determine the command sequence based on the OS
		const isWindows = process.platform === "win32";
		const pythonCommands = isWindows
			? ["py", "python3", "python"] // Windows: Prefer py launcher, then python3, then python
			: ["python3", "python"]; // Other OS: Prefer python3, then python
		const pythonArgsBase = this.settings.disablePyCache ? ["-B"] : []; // Add -B flag if disabling pycache

		this.logDebug(
			`Platform: ${process.platform}. Python command sequence: ${pythonCommands.join(", ")}`,
		);

		// Function to attempt execution with a specific command
		const executePythonScript = (
			cmd: string,
			args: string[],
			options: SpawnOptionsWithoutStdio,
		): Promise<number | null> => {
			return new Promise((resolve, reject) => {
				this.logDebug(`Attempting to execute: ${cmd} ${args.join(" ")}`);
				const pythonProcess = spawn(cmd, args, options);

				let stderrOutput = "";
				pythonProcess.stderr?.on("data", (data) => {
					const msg = data.toString();
					stderrOutput += msg;
					console.error(
						`[stderr ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
					this.logError(
						`[stderr ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
				});

				pythonProcess.stdout?.on("data", (data) => {
					const msg = data.toString();
					console.log(
						`[stdout ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
					this.logDebug(
						`[stdout ${path.basename(scriptPath)}]: ${msg.trim()}`,
					);
				});

				pythonProcess.on("error", (error) => {
					this.logError(
						`Failed to start script with command "${cmd}": ${error.message}`,
					);
					// If error is ENOENT (command not found), reject to try next command
					if ((error as NodeJS.ErrnoException).code === "ENOENT") {
						reject(error); // Indicate command not found
					} else {
						// For other spawn errors, report and resolve with a generic error code
						new Notice(
							`Error running ${path.basename(scriptPath)} with ${cmd}: ${error.message}`,
						);
						resolve(1); // Indicate failure with a generic error code
					}
				});

				pythonProcess.on("close", (code) => {
					this.logDebug(
						`${path.basename(scriptPath)} (using ${cmd}) finished with exit code ${code}.`,
					);
					if (isWindows && code === 9009) {
						// Exit code 9009 on Windows often means command not found / MS Store alias hit
						this.logError(
							`Command "${cmd}" likely not found or hit Windows Store alias (exit code 9009).`,
						);
						reject(
							new Error(
								`Command "${cmd}" not found (exit code 9009)`,
							),
						); // Indicate command not found
					} else if (code !== 0 && code !== null) {
						// Check code is not null before showing notice
						new Notice(
							`${path.basename(scriptPath)} failed with exit code ${code}. Check console logs.`,
							5000,
						);
						// Log captured stderr for context if script failed
						if (stderrOutput.trim()) {
							this.logError(
								`[Error Summary ${path.basename(scriptPath)}]: ${stderrOutput.trim()}`,
							);
						}
						resolve(code); // Resolve with the actual non-zero exit code
					} else {
						resolve(code); // Success (exit code 0 or null if process exited before code assigned)
					}
				});
			});
		};

		// Try executing with the commands in sequence
		let finalExitCode: number | null = null;
		let executedSuccessfully = false;

		for (const cmd of pythonCommands) {
			try {
				const fullArgs = [...pythonArgsBase, scriptPath]; // Combine base args (-B) with script path
				finalExitCode = await executePythonScript(cmd, fullArgs, {
					env,
					// cwd: path.dirname(scriptPath) // Optional: Set working directory? Usually not needed.
				});
				executedSuccessfully = true; // If promise resolves, command was found and launched
				this.logInfo(
					`Successfully launched script with command: ${cmd}`,
				);
				break; // Stop trying commands if one was successfully launched
			} catch (error: any) {
				// This catch block is primarily for ENOENT or code 9009, indicating command not found
				this.logDebug(
					`Command "${cmd}" failed to start: ${error.message}. Trying next command.`,
				);
			}
		}

		// Report final status
		if (!executedSuccessfully) {
			const errorMsg = `Could not find a valid Python executable. Tried: ${pythonCommands.join(", ")}. Please ensure Python is installed and accessible via your system's PATH (or the 'py' launcher on Windows).`;
			this.logError(errorMsg);
			new Notice(errorMsg, 10000);
		} else if (finalExitCode !== 0 && finalExitCode !== null) {
			// Error notice already shown inside executePythonScript
			this.logWarn(
				`Script ${path.basename(scriptPath)} execution completed with non-zero exit code: ${finalExitCode}`,
			);
		} else {
			// Exit code 0 or null (successful exit)
			this.logInfo(
				`Script ${path.basename(scriptPath)} execution completed successfully.`,
			);
			// Optional: Show success notice only if needed/configured
			// new Notice(`${path.basename(scriptPath)} finished successfully.`);
		}
	}

	/**
	 * Opens a modal for the user to select a Python script from the configured folder, then runs it.
	 */
	async chooseAndRunPythonScript() {
		const scriptsFolder = this.getScriptsFolderPath();
		if (!scriptsFolder) {
			new Notice(
				"Python scripts folder not found or invalid. Please check plugin settings.",
				5000,
			);
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
			new Notice(`Error reading scripts folder: ${errorMsg}`);
			this.logError(
				`Error reading scripts folder ${scriptsFolder}:`,
				err,
			);
			return;
		}

		if (pythonFiles.length === 0) {
			new Notice(
				"No Python scripts (.py) found in the configured folder.",
				5000,
			);
			return;
		}

		const scriptChoices = pythonFiles.map((f) => ({
			label: f, // Display name
			value: path.join(scriptsFolder, f), // Full path as value (use Node's join directly)
		}));

		// Sort choices alphabetically by label for better usability
		scriptChoices.sort((a, b) => a.label.localeCompare(b.label));

		new ScriptSelectionModal(this.app, scriptChoices, (selectedPath) => {
			if (selectedPath) {
				this.logDebug(`User selected script: ${selectedPath}`);
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
			new Notice(
				"Python scripts folder not found or invalid. Please check plugin settings.",
				5000,
			);
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
			new Notice(`Error reading scripts folder: ${errorMsg}`);
			this.logError(
				`Error reading scripts folder ${scriptsFolder}:`,
				err,
			);
			return;
		}

		if (pythonFiles.length === 0) {
			new Notice(
				"No Python scripts (.py) found in the configured folder.",
				5000,
			);
			return;
		}

		// Sort files alphabetically before running
		pythonFiles.sort((a, b) => a.localeCompare(b));

		new Notice(`Running ${pythonFiles.length} Python script(s)...`);
		this.logInfo(`Starting batch run of ${pythonFiles.length} scripts...`);

		// Run scripts sequentially using a loop
		for (const file of pythonFiles) {
			const scriptPath = normalizePath(path.join(scriptsFolder, file));
			this.logInfo(`Running next script in batch: ${file}`);
			// Use await here to ensure scripts run one after another
			// Note: runPythonScript itself is async due to the Promise inside executePythonScript
			await this.runPythonScript(scriptPath);
			// Optional: Add a small delay between scripts if needed
			// await new Promise(resolve => setTimeout(resolve, 100));
		}
		this.logInfo("Finished batch run of scripts.");
	}
} // End of class ObsidianPythonBridge
