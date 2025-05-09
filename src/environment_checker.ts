// --- src/environment_checker.ts ---
// Handles checking the Python environment (executable, required libraries).

import { Notice, Platform } from "obsidian";
import { spawn } from "child_process";
import type ObsidianPythonBridge from "./main"; // Import the main plugin type
import { t } from "./lang/translations"; // Import translation function

/**
 * Checks if Python is accessible and the 'requests' library is installed.
 * Stores the found executable in `plugin.pythonExecutable`.
 * Shows persistent notifications if issues are found.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns {Promise<boolean>} True if environment is OK, false otherwise.
 */
export async function checkPythonEnvironment(plugin: ObsidianPythonBridge): Promise<boolean> {
	plugin.logInfo("Checking Python environment...");
	plugin.pythonExecutable = null; // Reset before check
	const pythonCmd = await findPythonExecutable(plugin);
	if (!pythonCmd) { plugin.logError("Python executable not found during environment check."); showPythonMissingNotification(plugin); return false; } // Indicate failure
	plugin.logInfo(`Found Python executable: ${pythonCmd}`);
	plugin.pythonExecutable = pythonCmd; // Store the found command
	// Check for 'requests'
	const requestsInstalled = await checkPythonModule(plugin, pythonCmd, "requests");
	if (!requestsInstalled) { plugin.logError(`Python module 'requests' not found using ${pythonCmd}.`); showRequestsMissingNotification(plugin, pythonCmd); return false; } // Indicate failure
	// Check for 'PyYAML' (optional, only warn)
	const yamlInstalled = await checkPythonModule(plugin, pythonCmd, "yaml");
	if (!yamlInstalled) plugin.logWarn(`Optional Python module 'PyYAML' not found using ${pythonCmd}. Frontmatter property management features will not work.`); // Don't show a persistent notice for optional dependencies
	else plugin.logInfo("'PyYAML' module found.");
	plugin.logInfo("Python environment check completed successfully.");
	return true; // Indicate success (even if optional PyYAML is missing)
}

/**
 * Tries to find a working Python command ('py', 'python3', 'python').
 * @param plugin The ObsidianPythonBridge plugin instance (for logging).
 * @returns The command string if found, otherwise null.
 */
export async function findPythonExecutable(plugin: ObsidianPythonBridge): Promise<string | null> {
	const isWindows = Platform.isWin; // Use Obsidian's Platform API
	const commandsToTry = isWindows ? ["py", "python3", "python"] : ["python3", "python"];
	plugin.logDebug(`Attempting to find Python executable. Trying: ${commandsToTry.join(", ")}`);
	for (const cmd of commandsToTry) {
		try {
			// Try running 'command --version' which should be quick and safe
			await new Promise<void>((resolve, reject) => {
				const process = spawn(cmd, ["--version"]);
				process.on("error", reject); // Failed to spawn (ENOENT)
				process.on("close", (code) => {
					if (isWindows && code === 9009) reject(new Error(`Command ${cmd} resulted in exit code 9009 (MS Store alias?)`));
					else if (code === 0) resolve(); // Success
					else reject(new Error(`Command ${cmd} --version exited with code ${code}`)); // Reject if the --version command failed for this specific 'cmd'
				});
			});
			plugin.logDebug(`Python executable found: ${cmd}`);
			return cmd; // Command worked
		} catch (error) {
			plugin.logDebug(`Command '${cmd}' not found or failed version check: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
	plugin.logError(`No valid Python executable found after trying: ${commandsToTry.join(", ")}`);
	return null; // Return null if no command was found
}

/**
 * Checks if a Python module can be imported using a specific Python command.
 * @param plugin The ObsidianPythonBridge plugin instance (for logging).
 * @param pythonCmd The Python command to use (e.g., 'python3', 'py').
 * @param moduleName The name of the module to check (e.g., 'requests', 'yaml').
 * @returns True if the module can be imported, false otherwise.
 */
export async function checkPythonModule(plugin: ObsidianPythonBridge, pythonCmd: string, moduleName: string): Promise<boolean> {
	plugin.logDebug(`Checking import of module '${moduleName}' using command '${pythonCmd}'...`);
	try {
		await new Promise<void>((resolve, reject) => {
			// Use spawn, similar to findPythonExecutable and runPythonScript
			const process = spawn(pythonCmd, ["-c", `import ${moduleName}`]);
			let stderrOutput = "";
			process.stderr?.on("data", (data) => { stderrOutput += data.toString(); });
			process.on("error", (error) => {
				// Handles errors like command not found *if* findPythonExecutable somehow failed
				plugin.logWarn(`Spawn error during module check for '${moduleName}' using '${pythonCmd}': ${error.message}`);
				reject(error);
			});
			process.on("close", (code) => {
				if (code === 0) { plugin.logDebug(`Module '${moduleName}' imported successfully using '${pythonCmd}'.`); resolve(); } // Success
				else {
					// Log the failure and reject
					plugin.logWarn(`Failed to import module '${moduleName}' using '${pythonCmd}'. Exit code: ${code}.`);
					if (stderrOutput.trim()) plugin.logWarn(`Stderr from failed import: ${stderrOutput.trim()}`);
					reject(new Error(`Module '${moduleName}' import failed with exit code ${code}`));
				}
			});
		});
		return true; // Promise resolved, import successful
	} catch (error) {
		// This catch block now handles the rejection from the promise
		plugin.logDebug(`Module check failed for '${moduleName}' using '${pythonCmd}': ${error instanceof Error ? error.message : String(error)}`);
		return false; // Promise rejected, import failed
	}
}

/**
 * Shows a persistent notification if Python executable is missing.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export function showPythonMissingNotification(plugin: ObsidianPythonBridge): void {
	// Delay notice slightly to ensure Obsidian UI is ready
	setTimeout(() => { new Notice(`${t("NOTICE_PYTHON_MISSING_TITLE")}\n${t("NOTICE_PYTHON_MISSING_DESC")}`, 0); }, 500); // Persistent notice // Delay by 500ms (adjust if needed)
}

/**
 * Shows a persistent notification if the 'requests' library is missing.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param pythonCmd The Python command that was checked.
 */
export function showRequestsMissingNotification(plugin: ObsidianPythonBridge, pythonCmd: string): void {
	// Delay notice slightly to ensure Obsidian UI is ready
	setTimeout(() => {
		// Use translation for the notice, inserting the pythonCmd
		const descPrefix = t("NOTICE_REQUESTS_MISSING_DESC_PREFIX");
		const descSuffix = t("NOTICE_REQUESTS_MISSING_DESC_SUFFIX").replace("{pythonCmd}", pythonCmd);
		new Notice(`${t("NOTICE_REQUESTS_MISSING_TITLE")}\n${descPrefix} ${pythonCmd}.${descSuffix}`, 0); // Persistent notice
	}, 500); // Delay by 500ms (adjust if needed)
}
