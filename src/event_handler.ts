// --- src/event_handler.ts ---
// Handles registration for and triggering of Obsidian events for Python scripts.

import { TFile, MarkdownView, Notice } from "obsidian";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";
import type ObsidianPythonBridge from "./main"; // Import the main plugin type
import { getScriptsFolderPath } from "./python_executor"; // Import helper

/**
 * Registers internal listeners for Obsidian events that can trigger Python scripts.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export function registerObsidianEventListeners(
	plugin: ObsidianPythonBridge,
): void {
	plugin.logInfo("Registering Obsidian event listeners...");

	// Vault changes
	plugin.registerEvent(
		plugin.app.vault.on("modify", (file) => {
			if (file instanceof TFile) {
				triggerEvent(plugin, "vault-modify", { path: file.path });
			}
		}),
	);
	plugin.registerEvent(
		plugin.app.vault.on("delete", (file) => {
			triggerEvent(plugin, "vault-delete", {
				path: file.path,
				type: file instanceof TFile ? "file" : "folder",
			});
		}),
	);
	plugin.registerEvent(
		plugin.app.vault.on("rename", (file, oldPath) => {
			triggerEvent(plugin, "vault-rename", {
				path: file.path,
				oldPath: oldPath,
				type: file instanceof TFile ? "file" : "folder",
			});
		}),
	);

	// Metadata changes
	plugin.registerEvent(
		plugin.app.metadataCache.on("changed", (file, data, cache) => {
			triggerEvent(plugin, "metadata-changed", { path: file.path });
		}),
	);

	// Layout changes
	plugin.registerEvent(
		plugin.app.workspace.on("layout-change", () => {
			triggerEvent(plugin, "layout-change", {});
		}),
	);

	// Active leaf change
	plugin.registerEvent(
		plugin.app.workspace.on("active-leaf-change", (leaf) => {
			const view = leaf?.view;
			let filePath = null;
			if (view instanceof MarkdownView && view.file) {
				filePath = view.file.path;
			}
			triggerEvent(plugin, "active-leaf-change", { path: filePath });
		}),
	);

	// Add more listeners here as needed (e.g., file-menu, editor-menu)

	plugin.logInfo("Obsidian event listeners registered.");
}

/**
 * Triggers the execution of Python scripts listening to a specific event.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param eventName The name of the event being triggered.
 * @param payload Data associated with the event, must be JSON serializable.
 */
export function triggerEvent(
	plugin: ObsidianPythonBridge,
	eventName: string,
	payload: any,
): void {
	const listeningScripts = plugin.eventListeners.get(eventName);
	if (!listeningScripts || listeningScripts.size === 0) {
		// plugin.logDebug(`No scripts listening for event: ${eventName}`); // Can be noisy
		return;
	}

	plugin.logInfo(
		`Event triggered: ${eventName}. Notifying ${listeningScripts.size} script(s). Payload:`,
		payload,
	);
	const scriptsFolder = getScriptsFolderPath(plugin);
	if (!scriptsFolder) {
		plugin.logError(
			`Cannot trigger event ${eventName}: Scripts folder path is invalid.`,
		);
		return;
	}

	let payloadJson: string;
	try {
		payloadJson = JSON.stringify(payload);
	} catch (error) {
		plugin.logError(
			`Failed to serialize payload for event ${eventName}:`,
			error,
		);
		plugin.logError(`Original payload was:`, payload);
		return;
	}

	listeningScripts.forEach((relativePath) => {
		const absolutePath = path.join(scriptsFolder, relativePath);
		// Check if script still exists and is active before running
		if (plugin.settings.scriptActivationStatus[relativePath] !== false) {
			try {
				if (
					fs.existsSync(absolutePath) &&
					fs.statSync(absolutePath).isFile()
				) {
					plugin.logDebug(
						`Running script ${relativePath} for event ${eventName}`,
					);
					runPythonScriptForEvent(
						plugin,
						absolutePath,
						relativePath,
						eventName,
						payloadJson,
					);
				} else {
					plugin.logWarn(
						`Script ${relativePath} registered for event ${eventName} not found at ${absolutePath}. Removing listener.`,
					);
					removeListener(plugin, eventName, relativePath); // Clean up stale listener
				}
			} catch (error) {
				plugin.logError(
					`Error checking file status for event script ${absolutePath}:`,
					error,
				);
			}
		} else {
			plugin.logDebug(
				`Skipping event notification for ${relativePath}: Script is disabled.`,
			);
		}
	});
}

/**
 * Executes a Python script specifically for an event trigger, adding event env vars.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptAbsolutePath Absolute path to the script.
 * @param scriptRelativePath Relative path (for logging/identification).
 * @param eventName Name of the event.
 * @param payloadJson JSON string payload for the event.
 */
async function runPythonScriptForEvent(
	plugin: ObsidianPythonBridge,
	scriptAbsolutePath: string,
	scriptRelativePath: string,
	eventName: string,
	payloadJson: string,
) {
	if (!plugin.pythonExecutable) {
		plugin.logError(
			`Cannot run event script ${scriptRelativePath}: Python executable not found.`,
		);
		return;
	}
	const pythonCmd = plugin.pythonExecutable;
	const scriptFilename = path.basename(scriptAbsolutePath);
	const scriptDir = path.dirname(scriptAbsolutePath);

	plugin.logDebug(
		`Running event handler: ${pythonCmd} ${scriptAbsolutePath} for event ${eventName}`,
	);

	// Prepare environment variables
	const currentPYTHONPATH = process.env.PYTHONPATH;
	const newPYTHONPATH = currentPYTHONPATH
		? `${scriptDir}${path.delimiter}${currentPYTHONPATH}`
		: scriptDir;

	const env = {
		...process.env,
		OBSIDIAN_HTTP_PORT: plugin.initialHttpPort.toString(),
		OBSIDIAN_BRIDGE_ACTIVE: "true",
		OBSIDIAN_SCRIPT_RELATIVE_PATH: scriptRelativePath,
		PYTHONPATH: newPYTHONPATH, // Set PYTHONPATH
		// Event Variables
		OBSIDIAN_EVENT_NAME: eventName,
		OBSIDIAN_EVENT_PAYLOAD: payloadJson,
		...(plugin.settings.disablePyCache && {
			PYTHONPYCACHEPREFIX: os.tmpdir(),
		}),
	};

	plugin.logDebug(`Setting PYTHONPATH=${newPYTHONPATH} for event script`);
	plugin.logDebug(`Setting cwd=${scriptDir} for event script`);

	const pythonArgsBase = plugin.settings.disablePyCache ? ["-B"] : [];
	const fullArgs = [...pythonArgsBase, scriptAbsolutePath];

	try {
		await new Promise<void>((resolve, reject) => {
			const pythonProcess = spawn(pythonCmd, fullArgs, {
				env,
				cwd: scriptDir, // Set CWD
			});

			let stderrOutput = "";
			pythonProcess.stderr?.on("data", (data) => {
				stderrOutput += data.toString();
				console.error(
					`[stderr EVENT ${scriptFilename}]: ${data.toString().trim()}`,
				);
				plugin.logError(
					`[stderr EVENT ${scriptFilename}]: ${data.toString().trim()}`,
				);
			});

			pythonProcess.stdout?.on("data", (data) => {
				console.log(
					`[stdout EVENT ${scriptFilename}]: ${data.toString().trim()}`,
				);
				plugin.logDebug(
					`[stdout EVENT ${scriptFilename}]: ${data.toString().trim()}`,
				);
			});

			pythonProcess.on("error", (error) => {
				plugin.logError(
					`Failed to start event script ${scriptRelativePath}: ${error.message}`,
				);
				reject(error);
			});

			pythonProcess.on("close", (code) => {
				if (code !== 0 && code !== null) {
					plugin.logError(
						`Event script ${scriptRelativePath} failed for event ${eventName} with exit code ${code}.`,
					);
					if (stderrOutput.trim()) {
						plugin.logError(
							`[Error Summary EVENT ${scriptFilename}]: ${stderrOutput.trim()}`,
						);
					}
					reject(
						new Error(`Event script exited with non-zero code: ${code}`),
					);
				} else {
					plugin.logDebug(
						`Event script ${scriptRelativePath} finished for event ${eventName}.`,
					);
					resolve();
				}
			});
		});
	} catch (error) {
		plugin.logWarn(
			`Event script ${scriptRelativePath} execution failed for event ${eventName}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Helper to remove a script listener from the plugin's internal map.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param eventName The name of the event.
 * @param relativePath The relative path of the script listener to remove.
 */
export function removeListener(
	plugin: ObsidianPythonBridge,
	eventName: string,
	relativePath: string,
): void {
	const listeners = plugin.eventListeners.get(eventName);
	if (listeners) {
		listeners.delete(relativePath);
		if (listeners.size === 0) {
			plugin.eventListeners.delete(eventName);
			plugin.logDebug(`Removed last listener for event: ${eventName}`);
		} else {
			plugin.logDebug(
				`Removed listener ${relativePath} for event: ${eventName}. Remaining: ${listeners.size}`,
			);
		}
	}
}
