// --- src/python_executor.ts ---
// Handles finding, discovering settings for, executing, and managing Python scripts.

import { Notice, normalizePath, TFile, Command } from "obsidian";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type ObsidianPythonBridge from "./main"; // Import the main plugin type
import { t } from "./lang/translations"; // Import translation function
import { SETTINGS_DISCOVERY_TIMEOUT, PYTHON_LIBRARY_FILENAME } from "./constants";
import type { ScriptSettingDefinition } from "./types"; // Import types
import ScriptSelectionModal from "./ScriptSelectionModal"; // Import modal

/**
 * Resolves the absolute path to the Python scripts folder based on settings.
 * Returns an empty string and logs an error if the path is invalid or not found.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute, normalized path to the scripts folder, or empty string.
 */
export function getScriptsFolderPath(plugin: ObsidianPythonBridge): string {
	const { pythonScriptsFolder } = plugin.settings;
	if (!pythonScriptsFolder || typeof pythonScriptsFolder !== "string") { plugin.logWarn("Python scripts folder path is not configured in settings."); return ""; }
	let resolvedPath = "";
	if (path.isAbsolute(pythonScriptsFolder)) { plugin.logDebug(`Configured path is absolute: ${pythonScriptsFolder}`); resolvedPath = path.normalize(pythonScriptsFolder); }
	else {
		plugin.logDebug(`Configured path is relative: ${pythonScriptsFolder}`);
		const vaultPath = plugin.getCurrentVaultAbsolutePath(); // Assumes getCurrentVaultAbsolutePath is moved or accessible
		if (!vaultPath) { plugin.logError("Cannot resolve relative script path: Vault path unavailable."); return ""; }
		resolvedPath = path.resolve(vaultPath, pythonScriptsFolder);
		resolvedPath = path.normalize(resolvedPath);
		plugin.logDebug(`Resolved relative path to: ${resolvedPath}`);
	}
	try {
		if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) { plugin.logInfo(`Scripts folder path validated: ${resolvedPath}`); return resolvedPath; }
		else {
			const exists = fs.existsSync(resolvedPath);
			const isDir = exists ? fs.statSync(resolvedPath).isDirectory() : false;
			plugin.logWarn(`Validation failed for scripts folder: ${resolvedPath} (Exists: ${exists}, IsDirectory: ${isDir})`);
			return "";
		}
	} catch (error) { plugin.logError(`Error accessing resolved scripts folder path ${resolvedPath}:`, error); return ""; }
}

/**
 * Executes a Python script to retrieve its settings definitions JSON.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptAbsolutePath Absolute path to the Python script.
 * @returns A promise resolving to the parsed settings definitions array, or null on error/non-compliance.
 */
export async function discoverScriptSettings(plugin: ObsidianPythonBridge, scriptAbsolutePath: string): Promise<ScriptSettingDefinition[] | null> {
	const scriptName = path.basename(scriptAbsolutePath);
	plugin.logDebug(`Discovering settings for script: ${scriptName}`);
	if (!plugin.pythonExecutable) { plugin.logWarn(`Cannot discover settings for ${scriptName}: Python executable not found.`); return null; }
	const discoveryTimeoutMs = SETTINGS_DISCOVERY_TIMEOUT;
	return new Promise((resolve) => {
		const args = [scriptAbsolutePath, "--get-settings-json"];
		plugin.logDebug(`Running discovery command: ${plugin.pythonExecutable} ${args.join(" ")}`);
		const scriptDir = path.dirname(scriptAbsolutePath);
		// --- PYTHONPATH for discovery: Only needs script's dir for its own imports ---
		const currentPYTHONPATH = process.env.PYTHONPATH;
		// --- PYTHONPATH for discovery: Mirror the logic from runPythonScript ---
		const pathsForPythonPath: string[] = [];
		// 1. Add the script's own directory
		pathsForPythonPath.push(scriptDir);
		plugin.logDebug(`Discovery PYTHONPATH: Adding script's own directory: ${scriptDir}`);
		// 2. Conditionally add the plugin's directory based on setting
		if (plugin.settings.autoSetPYTHONPATH) { // <-- Respect the setting
			if (plugin.pluginDirAbsPath) {
				pathsForPythonPath.push(plugin.pluginDirAbsPath);
				plugin.logDebug(`Discovery PYTHONPATH: Adding plugin directory (autoSetPYTHONPATH enabled): ${plugin.pluginDirAbsPath}`);
			} else {
				plugin.logWarn("Discovery PYTHONPATH: Plugin directory path not available, library might not be importable even if autoSetPYTHONPATH is enabled.");
			}
		} else {
			plugin.logDebug("Discovery PYTHONPATH: Skipping adding plugin directory (autoSetPYTHONPATH disabled).");
		}
		// 3. Construct the final PYTHONPATH, appending existing env var if present
		let discoveryPYTHONPATH = pathsForPythonPath.join(path.delimiter);
		if (currentPYTHONPATH) {
			discoveryPYTHONPATH = `${discoveryPYTHONPATH}${path.delimiter}${currentPYTHONPATH}`;
		}
		// --- End PYTHONPATH for discovery ---
		const env = { ...process.env, PYTHONPATH: discoveryPYTHONPATH };
		// --- End PYTHONPATH for discovery ---
		plugin.logDebug(`Executing discovery with PYTHONPATH: ${discoveryPYTHONPATH} and cwd: ${scriptDir}`);
		const pythonProcess = spawn(plugin.pythonExecutable!, args, { timeout: discoveryTimeoutMs, cwd: scriptDir, env: env }); // Set working directory to the script's folder // Pass modified environment
		let stdoutData = "";
		let stderrData = "";
		pythonProcess.stdout?.on("data", (data) => { stdoutData += data.toString(); });
		pythonProcess.stderr?.on("data", (data) => { stderrData += data.toString(); });
		pythonProcess.on("error", (error) => { plugin.logWarn(`Failed to start settings discovery for ${scriptName}: ${error.message}`); resolve(null); });
		pythonProcess.on("close", (code, signal) => {
			if (signal === "SIGTERM" || (pythonProcess.killed && signal === null)) { plugin.logWarn(`Settings discovery for ${scriptName} timed out after ${discoveryTimeoutMs}ms.`); resolve(null); return; }
			if (code !== 0) {
				plugin.logWarn(`Settings discovery process for ${scriptName} failed with exit code ${code}.`);
				if (stderrData.trim()) plugin.logWarn(`Stderr from ${scriptName} discovery: ${stderrData.trim()}`);
				resolve(null); return;
			}
			try {
				const trimmedStdout = stdoutData.trim();
				plugin.logDebug(`Raw settings JSON from ${scriptName}: ${trimmedStdout}`);
				if (!trimmedStdout) { plugin.logDebug(`Script ${scriptName} provided no settings output (empty stdout). Assuming no settings.`); resolve([]); return; } // Success, but no settings defined
				const definitions = JSON.parse(trimmedStdout);
				if (!Array.isArray(definitions)) { plugin.logError(`Parsed settings definitions from ${scriptName} is not an array. Output: ${trimmedStdout}`); resolve(null); return; }
				// Optional: Add more validation for each definition object structure here
				plugin.logInfo(`Successfully discovered ${definitions.length} settings for ${scriptName}.`);
				resolve(definitions as ScriptSettingDefinition[]);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				plugin.logDebug(`Could not parse settings JSON from ${scriptName}: ${errorMsg}. This is expected for scripts without settings.`);
				plugin.logDebug(`Stdout from ${scriptName} that failed parsing was: ${stdoutData.trim()}`);
				resolve(null); // Discovery failed due to parsing error
			}
		});
	});
}

/**
 * Scans the scripts folder, discovers settings for each script, and updates the cache.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 */
export async function updateScriptSettingsCache(plugin: ObsidianPythonBridge, scriptsFolder: string): Promise<void> {
	plugin.logInfo("Updating script settings definitions cache...");
	if (!plugin.pythonExecutable) { plugin.logError("Cannot update script settings cache: Python executable not found."); return; }
	if (!scriptsFolder || !fs.existsSync(scriptsFolder)) { plugin.logWarn("Cannot update script settings cache: Scripts folder path is invalid or not found."); return; }
	let pythonFiles: string[];
	try { pythonFiles = fs.readdirSync(scriptsFolder).filter((f) => f.toLowerCase().endsWith(".py") && !f.startsWith(".") && f !== PYTHON_LIBRARY_FILENAME); }
	catch (err) { plugin.logError(`Error reading scripts folder for settings discovery ${scriptsFolder}:`, err); return; }
	const newDefinitions: Record<string, ScriptSettingDefinition[]> = {};
	let changesMade = false;
	const currentDefinitionKeys = new Set<string>();
	for (const file of pythonFiles) {
		const scriptAbsolutePath = path.join(scriptsFolder, file);
		const relativePath = normalizePath(path.relative(scriptsFolder, scriptAbsolutePath));
		currentDefinitionKeys.add(relativePath);
		try {
			const definitions = await discoverScriptSettings(plugin, scriptAbsolutePath);
			if (definitions !== null) {
				newDefinitions[relativePath] = definitions;
				if (JSON.stringify(definitions) !== JSON.stringify(plugin.settings.scriptSettingsDefinitions[relativePath])) { changesMade = true; plugin.logDebug(`Definitions updated for ${relativePath}`); }
			} else {
				if (plugin.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)) { newDefinitions[relativePath] = plugin.settings.scriptSettingsDefinitions[relativePath]; plugin.logWarn(`Failed to discover settings for ${relativePath}, keeping cached version.`); }
				else plugin.logWarn(`Failed to discover settings for ${relativePath}, no cached version available.`);
			}
		} catch (error) {
			plugin.logError(`Unexpected error during settings discovery for ${file}:`, error);
			if (plugin.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)) newDefinitions[relativePath] = plugin.settings.scriptSettingsDefinitions[relativePath];
		}
	}
	const cachedPaths = Object.keys(plugin.settings.scriptSettingsDefinitions);
	for (const cachedPath of cachedPaths) {
		if (!currentDefinitionKeys.has(cachedPath)) {
			changesMade = true;
			plugin.logInfo(`Script ${cachedPath} removed, clearing its settings definitions and values.`);
			delete plugin.settings.scriptSettingsDefinitions[cachedPath];
			if (plugin.settings.scriptSettingsValues.hasOwnProperty(cachedPath)) delete plugin.settings.scriptSettingsValues[cachedPath];
			if (plugin.settings.scriptActivationStatus.hasOwnProperty(cachedPath)) delete plugin.settings.scriptActivationStatus[cachedPath];
			if (plugin.settings.scriptAutoStartStatus.hasOwnProperty(cachedPath)) delete plugin.settings.scriptAutoStartStatus[cachedPath];
			if (plugin.settings.scriptAutoStartDelay.hasOwnProperty(cachedPath)) delete plugin.settings.scriptAutoStartDelay[cachedPath];
		}
	}
	if (cachedPaths.length !== currentDefinitionKeys.size) changesMade = true;
	if (changesMade) {
		plugin.logInfo("Script settings definitions cache updated.");
		plugin.settings.scriptSettingsDefinitions = newDefinitions;
		await plugin.saveSettings(); // Save updated definitions and potentially cleared values
	} else {
		plugin.logInfo("Script settings definitions cache is up to date.");
	}
}

/**
 * Executes a Python script using the detected executable.
 * Handles setting environment variables, logging output/errors.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptPath Absolute path to the Python script.
 * @param context Optional context (e.g., 'manual', 'auto-start', 'event') for logging.
 */
export async function runPythonScript(plugin: ObsidianPythonBridge, scriptPath: string, context: string = "manual") { // Add context for logging
	if (!plugin.pythonExecutable) {
		plugin.logError(`Cannot run script ${path.basename(scriptPath)} (${context}): Python executable not found.`);
		if (context === "manual") { // Avoid notice spam for auto-start/event contexts
			new Notice(t("NOTICE_PYTHON_EXEC_MISSING_FOR_RUN"));
			const envOk = await plugin.checkPythonEnvironment(); // Re-check env
			if (!envOk || !plugin.pythonExecutable) return;
			plugin.logInfo("Python executable found after re-check, proceeding with script execution.");
		} else return; // Don't proceed if Python missing in non-manual contexts
	}
	const pythonCmd = plugin.pythonExecutable;
	// Port mismatch check (only relevant for manual runs?)
	if (context === "manual" && plugin.server && plugin.settings.httpPort !== 0 && plugin.settings.httpPort !== plugin.initialHttpPort) {
		new Notice(`${t("NOTICE_PORT_MISMATCH_WARNING_PREFIX")}${plugin.initialHttpPort} ${t("NOTICE_PORT_MISMATCH_WARNING_MIDDLE")} ${plugin.settings.httpPort}${t("NOTICE_PORT_MISMATCH_WARNING_SUFFIX")}`, 8000);
		plugin.logWarn(`HTTP Port mismatch detected (Server on ${plugin.initialHttpPort}, Setting is ${plugin.settings.httpPort}) when running script ${path.basename(scriptPath)}.`);
	}
	// Validate script path existence
	try {
		if (!fs.existsSync(scriptPath) || !fs.statSync(scriptPath).isFile()) {
			if (context === "manual") new Notice(`${t("NOTICE_SCRIPT_NOT_FOUND_PREFIX")} ${path.basename(scriptPath)}`);
			plugin.logError(`Python script not found or is not a file (${context}): ${scriptPath}`); return;
		}
	} catch (error) {
		if (context === "manual") new Notice(`${t("NOTICE_SCRIPT_ACCESS_ERROR_PREFIX")} ${path.basename(scriptPath)}`);
		plugin.logError(`Error accessing script file ${scriptPath} (${context}):`, error); return;
	}
	const scriptFilename = path.basename(scriptPath);
	const scriptDir = path.dirname(scriptPath);
	// Calculate Relative Path
	const scriptsFolder = getScriptsFolderPath(plugin); // Use the function from this module
	let relativePath = "";
	if (scriptsFolder && scriptPath.startsWith(scriptsFolder)) relativePath = normalizePath(path.relative(scriptsFolder, scriptPath));
	else plugin.logWarn(`Could not determine relative path for script ${scriptPath} relative to folder ${scriptsFolder}. Script settings might not be retrievable.`);
	// Check if script is active
	if (relativePath && plugin.settings.scriptActivationStatus[relativePath] === false) {
		plugin.logInfo(`Skipping execution (${context}): Script ${scriptFilename} is disabled in settings.`);
		if (context === "manual") new Notice(t("NOTICE_SCRIPT_DISABLED").replace("{scriptName}", scriptFilename));
		return;
	}
	// Show "Running" notice only for manual runs
	if (context === "manual") new Notice(`${t("NOTICE_RUNNING_SCRIPT_PREFIX")} ${scriptFilename}`);
	plugin.logInfo(`Attempting to run Python script (${context}): ${scriptPath} using ${pythonCmd}`);
	// Prepare environment variables
	const currentPYTHONPATH = process.env.PYTHONPATH;
	const pathsForPythonPath: string[] = [];

	// 1. Add the script's own directory (for its relative imports)
	pathsForPythonPath.push(scriptDir);
	plugin.logDebug(`Adding script's own directory to PYTHONPATH: ${scriptDir}`);

	// 2. Conditionally add the plugin's directory based on setting
	if (plugin.settings.autoSetPYTHONPATH) {
		if (plugin.pluginDirAbsPath) {
			pathsForPythonPath.push(plugin.pluginDirAbsPath);
			plugin.logDebug(`Adding plugin directory to PYTHONPATH (autoSetPYTHONPATH enabled): ${plugin.pluginDirAbsPath}`);
		} else {
			plugin.logWarn("Plugin directory path not available, library might not be importable even if autoSetPYTHONPATH is enabled.");
		}
	} else {
		plugin.logDebug("Skipping adding plugin directory to PYTHONPATH (autoSetPYTHONPATH disabled).");
	}

	let newPYTHONPATH = pathsForPythonPath.join(path.delimiter);

	// 3. Append any existing PYTHONPATH from the environment
	if (currentPYTHONPATH) {
		newPYTHONPATH = `${newPYTHONPATH}${path.delimiter}${currentPYTHONPATH}`;
	}

	const env = {
		...process.env, // Inherit existing environment
		OBSIDIAN_HTTP_PORT: plugin.initialHttpPort.toString(),
		OBSIDIAN_BRIDGE_ACTIVE: "true",
		PYTHONPATH: newPYTHONPATH, // Set our constructed PYTHONPATH
		...(relativePath && { OBSIDIAN_SCRIPT_RELATIVE_PATH: relativePath }),
		...(plugin.settings.disablePyCache && { PYTHONPYCACHEPREFIX: os.tmpdir() }),
	};
	plugin.logDebug(`Setting OBSIDIAN_HTTP_PORT=${plugin.initialHttpPort} for script.`);
	if (relativePath) plugin.logDebug(`Setting OBSIDIAN_SCRIPT_RELATIVE_PATH=${relativePath}`);
	plugin.logDebug(`Setting PYTHONPATH=${newPYTHONPATH}`);
	plugin.logDebug(`Setting cwd=${scriptDir}`);
	if (plugin.settings.disablePyCache) plugin.logDebug(`Attempting to disable __pycache__ creation.`);
	// Determine Python arguments
	const pythonArgsBase = plugin.settings.disablePyCache ? ["-B"] : [];
	const fullArgs = [...pythonArgsBase, scriptPath];
	// Execute using the stored pythonCmd
	try {
		await new Promise<void>((resolve, reject) => {
			plugin.logDebug(`Executing: ${pythonCmd} ${fullArgs.join(" ")}`);
			const pythonProcess = spawn(pythonCmd, fullArgs, { env, cwd: scriptDir }); // Set CWD to script's directory
			let stderrOutput = "";
			pythonProcess.stderr?.on("data", (data) => { const msg = data.toString(); stderrOutput += msg; console.error(`[stderr ${scriptFilename}]: ${msg.trim()}`); plugin.logError(`[stderr ${scriptFilename}]: ${msg.trim()}`); });
			pythonProcess.stdout?.on("data", (data) => { const msg = data.toString(); console.log(`[stdout ${scriptFilename}]: ${msg.trim()}`); plugin.logDebug(`[stdout ${scriptFilename}]: ${msg.trim()}`); });
			pythonProcess.on("error", (error) => {
				plugin.logError(`Failed to start script (${context}) with command "${pythonCmd}": ${error.message}`);
				if (context === "manual") new Notice(`${t("NOTICE_SCRIPT_ERROR_RUNNING_PREFIX")} ${scriptFilename} ${t("NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE")} ${pythonCmd}: ${error.message}`);
				reject(error);
			});
			pythonProcess.on("close", (code) => {
				plugin.logDebug(`${scriptFilename} (${context}, using ${pythonCmd}) finished with exit code ${code}.`);
				if (code !== 0 && code !== null) {
					if (context === "manual") new Notice(`${scriptFilename} ${t("NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE")} ${code}. ${t("NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX")}`, 5000);
					if (stderrOutput.trim()) plugin.logError(`[Error Summary ${scriptFilename}]: ${stderrOutput.trim()}`);
					reject(new Error(`Script exited with non-zero code: ${code}`));
				} else resolve(); // Success
			});
		});
		plugin.logInfo(`Script ${scriptFilename} (${context}) execution completed successfully.`);
	} catch (error) {
		plugin.logWarn(`Script ${scriptFilename} (${context}) execution failed or exited with error: ${error instanceof Error ? error.message : String(error)}`);
		// Notices are handled inside the promise callbacks/rejections for manual context
	}
}

/**
 * Opens a modal for the user to select a Python script from the configured folder, then runs it.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export async function chooseAndRunPythonScript(plugin: ObsidianPythonBridge): Promise<void> {
	const scriptsFolder = getScriptsFolderPath(plugin);
	if (!scriptsFolder) { new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000); return; }
	let pythonFiles: string[];
	try { pythonFiles = fs.readdirSync(scriptsFolder).filter((f) => f.toLowerCase().endsWith(".py") && !f.startsWith(".") && f !== PYTHON_LIBRARY_FILENAME); }
	catch (err) { const errorMsg = err instanceof Error ? err.message : String(err); new Notice(`${t("NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX")} ${errorMsg}`); plugin.logError(`Error reading scripts folder ${scriptsFolder}:`, err); return; }
	if (pythonFiles.length === 0) { new Notice(t("NOTICE_NO_SCRIPTS_FOUND"), 5000); return; }
	const scriptChoices = pythonFiles.map((f) => ({ label: f, value: path.join(scriptsFolder, f) }));
	scriptChoices.sort((a, b) => a.label.localeCompare(b.label));
	new ScriptSelectionModal(plugin.app, scriptChoices, (selectedPath) => {
		if (selectedPath) { plugin.logDebug(`User selected script: ${selectedPath}`); runPythonScript(plugin, selectedPath, "manual"); } // Don't await, run in background
		else plugin.logDebug("Script selection cancelled by user.");
	}).open();
}

/**
 * Runs all active Python scripts found in the configured folder sequentially.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export async function runAllPythonScripts(plugin: ObsidianPythonBridge): Promise<void> {
	const scriptsFolder = getScriptsFolderPath(plugin);
	if (!scriptsFolder) { new Notice(t("NOTICE_SCRIPTS_FOLDER_INVALID"), 5000); return; }
	let pythonFiles: string[];
	try { pythonFiles = fs.readdirSync(scriptsFolder).filter((f) => f.toLowerCase().endsWith(".py") && !f.startsWith(".") && f !== PYTHON_LIBRARY_FILENAME); }
	catch (err) { const errorMsg = err instanceof Error ? err.message : String(err); new Notice(`${t("NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX")} ${errorMsg}`); plugin.logError(`Error reading scripts folder ${scriptsFolder}:`, err); return; }
	if (pythonFiles.length === 0) { new Notice(t("NOTICE_NO_SCRIPTS_FOUND"), 5000); return; }
	pythonFiles.sort((a, b) => a.localeCompare(b));
	const activeScriptsToRun = pythonFiles.filter((file) => { const relativePath = normalizePath(path.relative(scriptsFolder, path.join(scriptsFolder, file))); return plugin.settings.scriptActivationStatus[relativePath] !== false; }); // Check activation
	if (activeScriptsToRun.length === 0) { new Notice(t("NOTICE_NO_SCRIPTS_FOUND"), 5000); plugin.logInfo("Run All: No active scripts found to run."); return; } // Or a more specific message like "No active scripts found"
	new Notice(`${t("NOTICE_RUNNING_ALL_SCRIPTS_PREFIX")} ${activeScriptsToRun.length} ${t("NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX")}`);
	plugin.logInfo(`Starting batch run of ${activeScriptsToRun.length} active scripts...`);
	for (const file of activeScriptsToRun) {
		const scriptPath = path.join(scriptsFolder, file);
		plugin.logInfo(`Run All: Running next script: ${file}`);
		await runPythonScript(plugin, scriptPath, "manual"); // Use await here to ensure scripts run one after another // Context is still manual trigger
	}
	plugin.logInfo("Finished batch run of active scripts.");
}

/**
 * Runs scripts marked for auto-start.
 * Called after plugin load, server start, and initial settings sync.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export function runAutoStartScripts(plugin: ObsidianPythonBridge): void {
	plugin.logInfo("Checking for scripts to run on startup...");
	const scriptsFolder = getScriptsFolderPath(plugin);
	if (!scriptsFolder) { plugin.logWarn("Cannot run auto-start scripts: Scripts folder path is invalid."); return; }
	let scriptsRunCount = 0;
	for (const relativePath in plugin.settings.scriptAutoStartStatus) {
		const shouldAutoStart = plugin.settings.scriptAutoStartStatus[relativePath];
		const isScriptActive = plugin.settings.scriptActivationStatus[relativePath] !== false;
		if (shouldAutoStart && isScriptActive) {
			const absolutePath = path.join(scriptsFolder, relativePath);
			try {
				if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
					plugin.logInfo(`Auto-starting script: ${relativePath}`);
					const delaySeconds = plugin.settings.scriptAutoStartDelay[relativePath] ?? 0;
					const delayMs = Math.max(0, delaySeconds) * 1000;
					if (delayMs > 0) {
						plugin.logInfo(` -> Delaying execution by ${delaySeconds} second(s).`);
						setTimeout(() => {
							if (plugin.settings.scriptActivationStatus[relativePath] !== false) { // Re-check activation status inside timeout
								plugin.logInfo(`Executing delayed auto-start script: ${relativePath}`);
								runPythonScript(plugin, absolutePath, "auto-start"); // No await
							} else plugin.logWarn(`Skipping delayed auto-start for ${relativePath}: Script was disabled during delay.`);
						}, delayMs);
					} else runPythonScript(plugin, absolutePath, "auto-start"); // No await
					scriptsRunCount++;
				} else {
					plugin.logWarn(`Skipping auto-start for ${relativePath}: Script file not found at ${absolutePath}.`);
					// Consider cleaning up stale auto-start/delay entries here if desired
				}
			} catch (error) { plugin.logError(`Error checking file status for auto-start script ${absolutePath}:`, error); }
		}
	}
	if (scriptsRunCount > 0) plugin.logInfo(`Finished launching ${scriptsRunCount} auto-start script(s).`);
	else plugin.logInfo("No active scripts configured for auto-start.");
}

// --- Dynamic Command Management ---

/**
 * Generates a unique and stable command ID for a given script path.
 * @param relativePath Normalized relative path of the script.
 * @returns The command ID string.
 */
export function getCommandIdForScript(relativePath: string): string { return `python-bridge:run-script:${relativePath}`; }

/**
 * Updates or registers dynamic commands for all valid Python scripts.
 * Ensures commands exist for active scripts and their callbacks check activation status.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 * @returns Set of relative paths for scripts found during the update.
 */
export async function updateDynamicScriptCommands(plugin: ObsidianPythonBridge, scriptsFolder: string): Promise<Set<string>> {
	plugin.logDebug("Updating dynamic script commands...");
	const activeScriptPaths = new Set<string>();
	if (!plugin.pythonExecutable) { plugin.logWarn("Cannot update dynamic commands: Python executable not found."); return activeScriptPaths; }
	let pythonFiles: string[];
	try { pythonFiles = fs.readdirSync(scriptsFolder).filter((f) => f.toLowerCase().endsWith(".py") && !f.startsWith(".") && f !== PYTHON_LIBRARY_FILENAME); }
	catch (err) { plugin.logError(`Error reading scripts folder for command update ${scriptsFolder}:`, err); return activeScriptPaths; }
	for (const file of pythonFiles) {
		const scriptAbsolutePath = path.join(scriptsFolder, file);
		const relativePath = normalizePath(path.relative(scriptsFolder, scriptAbsolutePath));
		activeScriptPaths.add(relativePath);
		const commandId = getCommandIdForScript(relativePath);
		const commandName = `Run Script: ${file}`; // Simple name
		if (!plugin.dynamicScriptCommands.has(commandId)) {
			plugin.logDebug(`Registering new command: ${commandId} ('${commandName}')`);
			const command = plugin.addCommand({ id: commandId, name: commandName, callback: () => {
				const isActive = plugin.settings.scriptActivationStatus[relativePath] !== false;
				if (isActive) { plugin.logInfo(`Executing script via command: ${relativePath}`); runPythonScript(plugin, scriptAbsolutePath, "manual"); } // Don't await
				else { plugin.logInfo(`Skipping execution via command: Script ${relativePath} is disabled.`); new Notice(t("NOTICE_SCRIPT_DISABLED").replace("{scriptName}", file)); }
			}});
			plugin.dynamicScriptCommands.set(commandId, command);
		} else {
			plugin.logDebug(`Command already exists: ${commandId}`);
			// Optional: Update name/callback if needed, though current callback is robust
		}
	}
	// Clean up commands for scripts that no longer exist
	const commandIdsToRemove: string[] = [];
	for (const [commandId] of plugin.dynamicScriptCommands.entries()) {
		const scriptPathFromId = commandId.substring("python-bridge:run-script:".length);
		if (!activeScriptPaths.has(scriptPathFromId)) { plugin.logDebug(`Command ${commandId} is stale (script removed), marking for removal.`); commandIdsToRemove.push(commandId); } // Obsidian API lacks unregister. We just remove from our map.
	}
	commandIdsToRemove.forEach((id) => plugin.dynamicScriptCommands.delete(id));
	plugin.logDebug(`Dynamic script command update complete. Active commands: ${plugin.dynamicScriptCommands.size}`);
	return activeScriptPaths;
}

/**
 * Updates script settings cache AND synchronizes dynamic commands.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 */
export async function updateAndSyncCommands(plugin: ObsidianPythonBridge, scriptsFolder: string): Promise<void> {
	await updateScriptSettingsCache(plugin, scriptsFolder);
	await updateDynamicScriptCommands(plugin, scriptsFolder);
}
