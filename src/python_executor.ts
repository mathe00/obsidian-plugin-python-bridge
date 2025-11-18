// --- src/python_executor.ts ---
// Handles finding, discovering settings for, executing, and managing Python scripts.

import { Notice, normalizePath } from 'obsidian';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type ObsidianPythonBridge from './main'; // Import the main plugin type
import { t } from './lang/translations'; // Import translation function
import {
  SETTINGS_DISCOVERY_TIMEOUT,
  PYTHON_LIBRARY_FILENAME,
} from './constants';
import type { ScriptSettingDefinition } from './types'; // Import types
import ScriptSelectionModal from './ScriptSelectionModal'; // Import modal
import { logScriptExecution } from './audit_logger'; // Import audit logger

/**
 * Resolves the absolute path to the Python scripts folder based on settings.
 * Returns an empty string and logs an error if the path is invalid or not found.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute, normalized path to the scripts folder, or empty string.
 */
export function getScriptsFolderPath(plugin: ObsidianPythonBridge): string {
  const { pythonScriptsFolder } = plugin.settings;
  if (!pythonScriptsFolder || typeof pythonScriptsFolder !== 'string') {
    plugin.logWarn('Python scripts folder path is not configured in settings.');
    return '';
  }
  let resolvedPath = '';
  if (path.isAbsolute(pythonScriptsFolder)) {
    plugin.logDebug(`Configured path is absolute: ${pythonScriptsFolder}`);
    resolvedPath = path.normalize(pythonScriptsFolder);
  } else {
    plugin.logDebug(`Configured path is relative: ${pythonScriptsFolder}`);
    const vaultPath = plugin.getCurrentVaultAbsolutePath(); // Assumes getCurrentVaultAbsolutePath is moved or accessible
    if (!vaultPath) {
      plugin.logError(
        'Cannot resolve relative script path: Vault path unavailable.'
      );
      return '';
    }
    resolvedPath = path.resolve(vaultPath, pythonScriptsFolder);
    resolvedPath = path.normalize(resolvedPath);
    plugin.logDebug(`Resolved relative path to: ${resolvedPath}`);
  }
  try {
    if (
      fs.existsSync(resolvedPath) &&
      fs.statSync(resolvedPath).isDirectory()
    ) {
      plugin.logInfo(`Scripts folder path validated: ${resolvedPath}`);
      return resolvedPath;
    } else {
      const exists = fs.existsSync(resolvedPath);
      const isDir = exists ? fs.statSync(resolvedPath).isDirectory() : false;
      plugin.logWarn(
        `Validation failed for scripts folder: ${resolvedPath} (Exists: ${exists}, IsDirectory: ${isDir})`
      );
      return '';
    }
  } catch (error) {
    plugin.logError(
      `Error accessing resolved scripts folder path ${resolvedPath}:`,
      error
    );
    return '';
  }
}

/**
 * Executes a Python script to retrieve its settings definitions JSON.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptAbsolutePath Absolute path to the Python script.
 * @returns A promise resolving to the parsed settings definitions array, or null on error/non-compliance.
 */
export async function discoverScriptSettings(
  plugin: ObsidianPythonBridge,
  scriptAbsolutePath: string
): Promise<ScriptSettingDefinition[] | null> {
  const scriptName = path.basename(scriptAbsolutePath);
  plugin.logDebug(`Discovering settings for script: ${scriptName}`);
  if (!plugin.pythonExecutable) {
    plugin.logWarn(
      `Cannot discover settings for ${scriptName}: Python executable not found.`
    );
    return null;
  }
  const discoveryTimeoutMs = SETTINGS_DISCOVERY_TIMEOUT;
  return new Promise((resolve) => {
    let commandArgs: string[];
    const executableToRun = plugin.pythonExecutable!;

    if (executableToRun === 'uv') {
      // For uv, the command is 'uv run script_path --get-settings-json'
      // No direct equivalent for -B with 'uv run script.py'.
      // The --get-settings-json flag is passed to the script itself.
      commandArgs = ['run', scriptAbsolutePath, '--get-settings-json'];
    } else {
      // For standard python, it's 'python script_path --get-settings-json'
      // The -B flag (disablePyCache) is handled by the main runPythonScript,
      // not typically needed for discovery as it's a short-lived process.
      commandArgs = [scriptAbsolutePath, '--get-settings-json'];
    }
    plugin.logDebug(
      `Running discovery command: ${executableToRun} ${commandArgs.join(' ')}`
    );
    const scriptDir = path.dirname(scriptAbsolutePath);
    // --- PYTHONPATH for discovery: Only needs script's dir for its own imports ---
    const currentPYTHONPATH = process.env.PYTHONPATH;
    // --- PYTHONPATH for discovery: Mirror the logic from runPythonScript ---
    const pathsForPythonPath: string[] = [];
    // 1. Add the script's own directory
    pathsForPythonPath.push(scriptDir);
    plugin.logDebug(
      `Discovery PYTHONPATH: Adding script's own directory: ${scriptDir}`
    );
    // 2. Conditionally add the plugin's directory based on setting
    if (plugin.settings.autoSetPYTHONPATH) {
      // <-- Respect the setting
      if (plugin.pluginDirAbsPath) {
        pathsForPythonPath.push(plugin.pluginDirAbsPath);
        plugin.logDebug(
          `Discovery PYTHONPATH: Adding plugin directory (autoSetPYTHONPATH enabled): ${plugin.pluginDirAbsPath}`
        );
      } else {
        plugin.logWarn(
          'Discovery PYTHONPATH: Plugin directory path not available, library might not be importable even if autoSetPYTHONPATH is enabled.'
        );
      }
    } else {
      plugin.logDebug(
        'Discovery PYTHONPATH: Skipping adding plugin directory (autoSetPYTHONPATH disabled).'
      );
    }
    // 3. Construct the final PYTHONPATH, appending existing env var if present
    let discoveryPYTHONPATH = pathsForPythonPath.join(path.delimiter);
    if (currentPYTHONPATH) {
      discoveryPYTHONPATH = `${discoveryPYTHONPATH}${path.delimiter}${currentPYTHONPATH}`;
    }
    // --- End PYTHONPATH for discovery ---
    const env = {
      ...process.env, // Inherit existing environment
      PYTHONPATH: discoveryPYTHONPATH,
      OBSIDIAN_BRIDGE_MODE: 'discovery',
    };
    // --- End PYTHONPATH for discovery ---
    plugin.logDebug(
      `Executing discovery with PYTHONPATH: ${discoveryPYTHONPATH} and cwd: ${scriptDir}`
    );
    const pythonProcess = spawn(executableToRun, commandArgs, {
      timeout: discoveryTimeoutMs,
      cwd: scriptDir,
      env: env,
    });
    let stdoutData = '';
    let stderrData = '';
    pythonProcess.stdout?.on('data', (data) => {
      stdoutData += data.toString();
    });
    pythonProcess.stderr?.on('data', (data) => {
      stderrData += data.toString();
    });
    pythonProcess.on('error', (error) => {
      plugin.logError(
        `Settings discovery failed for script '${scriptAbsolutePath}': Failed to start process - ${error.message}`
      );
      plugin.logWarn(
        `Security Note: If the script '${scriptName}' doesn't handle --get-settings-json, it may execute unintended code. Consider using the define_settings/_handle_cli_args structure.`
      );
      resolve(null);
    });
    pythonProcess.on('close', (code, signal) => {
      if (signal === 'SIGTERM' || (pythonProcess.killed && signal === null)) {
        plugin.logError(
          `Settings discovery failed for script '${scriptAbsolutePath}': Timed out after ${discoveryTimeoutMs}ms`
        );
        plugin.logWarn(
          `Security Note: If the script '${scriptName}' doesn't handle --get-settings-json, it may execute unintended code. Consider using the define_settings/_handle_cli_args structure.`
        );
        resolve(null);
        return;
      }
      if (code !== 0) {
        plugin.logError(
          `Settings discovery failed for script '${scriptAbsolutePath}': Process exited with code ${code}`
        );
        if (stderrData.trim()) {
          plugin.logError(
            `Stderr from ${scriptName} discovery: ${stderrData.trim()}`
          );
        }
        plugin.logWarn(
          `Security Note: If the script '${scriptName}' doesn't handle --get-settings-json, it may execute unintended code. Consider using the define_settings/_handle_cli_args structure.`
        );
        resolve(null);
        return;
      }
      try {
        const trimmedStdout = stdoutData.trim();
        plugin.logDebug(
          `Raw settings JSON from ${scriptName}: ${trimmedStdout}`
        );
        if (!trimmedStdout) {
          plugin.logDebug(
            `Script ${scriptName} provided no settings output (empty stdout). Assuming no settings.`
          );
          resolve([]);
          return;
        } // Success, but no settings defined
        const definitions = JSON.parse(trimmedStdout);
        if (!Array.isArray(definitions)) {
          plugin.logError(
            `Settings discovery failed for script '${scriptAbsolutePath}': Parsed output is not a valid settings array`
          );
          plugin.logError(
            `Expected JSON array from ${scriptName}, but received: ${trimmedStdout}`
          );
          plugin.logWarn(
            `Security Note: If the script '${scriptName}' doesn't handle --get-settings-json properly, it may execute unintended code. Consider using the define_settings/_handle_cli_args structure.`
          );
          resolve(null);
          return;
        }
        // Optional: Add more validation for each definition object structure here
        plugin.logInfo(
          `Successfully discovered ${definitions.length} settings for ${scriptName}.`
        );
        resolve(definitions as ScriptSettingDefinition[]);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        plugin.logError(
          `Settings discovery failed for script '${scriptAbsolutePath}': JSON parse error - ${errorMsg}`
        );
        plugin.logError(
          `Stdout from ${scriptName} that failed parsing was: ${stdoutData.trim()}`
        );
        plugin.logWarn(
          `Security Note: If the script '${scriptName}' doesn't handle --get-settings-json, it may execute unintended code. Consider using the define_settings/_handle_cli_args structure.`
        );
        resolve(null); // Discovery failed due to parsing error
      }
    });
  });
}

/**
 * Scans the scripts folder, discovers settings for each script, and updates the cache.
 * Handles clearing cached definitions if discovery fails for a script.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 */
export async function updateScriptSettingsCache(
  plugin: ObsidianPythonBridge,
  scriptsFolder: string,
  isManualRefresh = false
): Promise<void> {
  plugin.logInfo('Updating script settings definitions cache...');
  if (!plugin.pythonExecutable) {
    plugin.logError(
      'Cannot update script settings cache: Python executable not found.'
    );
    return;
  }
  if (!scriptsFolder || !fs.existsSync(scriptsFolder)) {
    plugin.logWarn(
      'Cannot update script settings cache: Scripts folder path is invalid or not found.'
    );
    return;
  }

  // Track failed scripts for potential notice display
  const failedScripts: string[] = [];

  let pythonFiles: string[];
  try {
    // Read directory and filter for .py files, excluding hidden files and the library itself
    pythonFiles = fs
      .readdirSync(scriptsFolder)
      .filter(
        (f) =>
          f.toLowerCase().endsWith('.py') &&
          !f.startsWith('.') &&
          f !== PYTHON_LIBRARY_FILENAME
      );
  } catch (err) {
    plugin.logError(
      `Error reading scripts folder for settings discovery ${scriptsFolder}:`,
      err
    );
    return;
  }

  // Store newly discovered definitions here
  const newDefinitions: Record<string, ScriptSettingDefinition[]> = {};
  let changesMade = false; // Track if any updates require saving settings
  const currentScriptPaths = new Set<string>(); // Keep track of scripts found in the folder

  for (const file of pythonFiles) {
    const scriptAbsolutePath = path.join(scriptsFolder, file);
    // Use normalized relative path as the key for settings objects
    const relativePath = normalizePath(
      path.relative(scriptsFolder, scriptAbsolutePath)
    );
    currentScriptPaths.add(relativePath);
    let discoveryFailed = false; // Flag to track failure for the current script

    // Security: Default new scripts to disabled state
    if (!(relativePath in plugin.settings.scriptActivationStatus)) {
      plugin.logInfo(
        `New script detected, defaulting to disabled state: ${relativePath}`
      );
      plugin.settings.scriptActivationStatus[relativePath] = false;
      changesMade = true;
    }

    // Initialize other status defaults for new scripts
    if (!(relativePath in plugin.settings.scriptAutoStartStatus)) {
      plugin.settings.scriptAutoStartStatus[relativePath] = false;
      changesMade = true;
    }
    if (!(relativePath in plugin.settings.scriptAutoStartDelay)) {
      plugin.settings.scriptAutoStartDelay[relativePath] = 0;
      changesMade = true;
    }

    // Check if script is disabled - skip settings discovery for security
    if (plugin.settings.scriptActivationStatus[relativePath] === false) {
      plugin.logInfo(
        `Skipping settings discovery for disabled script: ${relativePath}`
      );

      // Clear any previously cached settings definitions and values for this disabled script
      if (
        plugin.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)
      ) {
        plugin.logInfo(
          `Removing cached settings definitions for disabled script: ${relativePath}`
        );
        changesMade = true;
      }
      if (plugin.settings.scriptSettingsValues.hasOwnProperty(relativePath)) {
        plugin.logInfo(
          `Clearing settings values for disabled script: ${relativePath}`
        );
        delete plugin.settings.scriptSettingsValues[relativePath];
        changesMade = true;
      }

      continue; // Skip to next script
    }

    try {
      // Attempt to discover settings by running the script with --get-settings-json
      const definitions = await discoverScriptSettings(
        plugin,
        scriptAbsolutePath
      );

      // discoverScriptSettings returns null on failure (timeout, non-zero exit, parse error, etc.)
      if (definitions === null) {
        discoveryFailed = true;
        failedScripts.push(relativePath);
      } else {
        // Discovery succeeded (definitions can be an empty array if no settings are defined)
        newDefinitions[relativePath] = definitions;
        // Check if the discovered definitions differ from the cached ones
        if (
          JSON.stringify(definitions) !==
          JSON.stringify(
            plugin.settings.scriptSettingsDefinitions[relativePath]
          )
        ) {
          changesMade = true;
          plugin.logDebug(`Definitions updated or added for ${relativePath}`);
        }
      }
    } catch (error) {
      // Catch unexpected errors during the discoverScriptSettings call itself
      plugin.logError(
        `Unexpected error during settings discovery call for ${file}:`,
        error
      );
      discoveryFailed = true;
    }

    // --- Handle Cache Clearing on Discovery Failure ---
    if (discoveryFailed) {
      // If discovery failed, check if there were old definitions cached
      if (
        plugin.settings.scriptSettingsDefinitions.hasOwnProperty(relativePath)
      ) {
        plugin.logInfo(
          `Removing cached settings definitions for ${relativePath} due to discovery failure.`
        );
        // By *not* adding this script to newDefinitions, we effectively remove it.
        changesMade = true; // Mark that a change (removal) occurred
      }
      // If no old cache existed, we just logged the failure above.
    }
  } // --- End of script file loop ---

  // --- Final Cleanup: Remove data for scripts no longer present and orphaned values ---
  const previouslyCachedPaths = Object.keys(
    plugin.settings.scriptSettingsDefinitions
  );
  for (const cachedPath of previouslyCachedPaths) {
    if (!currentScriptPaths.has(cachedPath)) {
      // Script file was deleted from the folder
      changesMade = true;
      plugin.logInfo(
        `Script ${cachedPath} removed, clearing its settings definitions and values.`
      );
      // Definition is already absent from newDefinitions because it wasn't in currentScriptPaths.
      // Clean up associated values and statuses.
      if (plugin.settings.scriptSettingsValues.hasOwnProperty(cachedPath)) {
        delete plugin.settings.scriptSettingsValues[cachedPath];
      }
      if (plugin.settings.scriptActivationStatus.hasOwnProperty(cachedPath)) {
        delete plugin.settings.scriptActivationStatus[cachedPath];
      }
      if (plugin.settings.scriptAutoStartStatus.hasOwnProperty(cachedPath)) {
        delete plugin.settings.scriptAutoStartStatus[cachedPath];
      }
      if (plugin.settings.scriptAutoStartDelay.hasOwnProperty(cachedPath)) {
        delete plugin.settings.scriptAutoStartDelay[cachedPath];
      }
    } else if (!newDefinitions.hasOwnProperty(cachedPath)) {
      // Script file exists, but discovery failed (and it was previously cached)
      // The definition was already omitted from newDefinitions above.
      // Also remove any stored values for this script.
      if (plugin.settings.scriptSettingsValues.hasOwnProperty(cachedPath)) {
        plugin.logInfo(
          `Clearing settings values for ${cachedPath} due to discovery failure.`
        );
        delete plugin.settings.scriptSettingsValues[cachedPath];
        changesMade = true; // Ensure change is marked
      }
      // Keep activation/autostart status even if settings discovery fails? Yes, seems reasonable.
    }
  }

  // Check if the overall structure of definitions changed (covers additions/removals)
  if (
    JSON.stringify(newDefinitions) !==
    JSON.stringify(plugin.settings.scriptSettingsDefinitions)
  ) {
    changesMade = true;
  }

  // Save settings only if there were actual changes to definitions or values
  if (changesMade) {
    plugin.logInfo('Script settings definitions cache updated.');
    plugin.settings.scriptSettingsDefinitions = newDefinitions;
    // Note: scriptSettingsValues and statuses might have been modified directly above
    await plugin.saveSettings();
  } else {
    plugin.logInfo('Script settings definitions cache is up to date.');
  }

  // Show notice for manual refresh if there were failures
  if (isManualRefresh && failedScripts.length > 0) {
    const failureMessage = `Settings discovery failed for ${failedScripts.length} script(s): ${failedScripts.join(', ')}. Check console for details.`;
    new Notice(failureMessage, 8000);
    plugin.logWarn(
      `Manual refresh completed with ${failedScripts.length} discovery failures: ${failedScripts.join(', ')}`
    );
  }
}

/**
 * Executes a Python script using the detected executable.
 * Handles setting environment variables, logging output/errors.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptPath Absolute path to the Python script.
 * @param context Optional context (e.g., 'manual', 'auto-start', 'event') for logging.
 */
export async function runPythonScript(
  plugin: ObsidianPythonBridge,
  scriptPath: string,
  context = 'manual'
) {
  // Add context for logging
  if (!plugin.pythonExecutable) {
    plugin.logError(
      `Cannot run script ${path.basename(scriptPath)} (${context}): Python executable not found.`
    );
    if (context === 'manual') {
      // Avoid notice spam for auto-start/event contexts
      new Notice(t('NOTICE_PYTHON_EXEC_MISSING_FOR_RUN'));
      const envOk = await plugin.checkPythonEnvironment(); // Re-check env
      if (!envOk || !plugin.pythonExecutable) return;
      plugin.logInfo(
        'Python executable found after re-check, proceeding with script execution.'
      );
    } else return; // Don't proceed if Python missing in non-manual contexts
  }
  const pythonCmd = plugin.pythonExecutable;
  // Port mismatch check (only relevant for manual runs?)
  if (
    context === 'manual' &&
    plugin.server &&
    plugin.settings.httpPort !== 0 &&
    plugin.settings.httpPort !== plugin.initialHttpPort
  ) {
    new Notice(
      `${t('NOTICE_PORT_MISMATCH_WARNING_PREFIX')}${plugin.initialHttpPort} ${t('NOTICE_PORT_MISMATCH_WARNING_MIDDLE')} ${plugin.settings.httpPort}${t('NOTICE_PORT_MISMATCH_WARNING_SUFFIX')}`,
      8000
    );
    plugin.logWarn(
      `HTTP Port mismatch detected (Server on ${plugin.initialHttpPort}, Setting is ${plugin.settings.httpPort}) when running script ${path.basename(scriptPath)}.`
    );
  }
  // Validate script path existence
  try {
    if (!fs.existsSync(scriptPath) || !fs.statSync(scriptPath).isFile()) {
      if (context === 'manual')
        new Notice(
          `${t('NOTICE_SCRIPT_NOT_FOUND_PREFIX')} ${path.basename(scriptPath)}`
        );
      plugin.logError(
        `Python script not found or is not a file (${context}): ${scriptPath}`
      );
      return;
    }
  } catch (error) {
    if (context === 'manual')
      new Notice(
        `${t('NOTICE_SCRIPT_ACCESS_ERROR_PREFIX')} ${path.basename(scriptPath)}`
      );
    plugin.logError(
      `Error accessing script file ${scriptPath} (${context}):`,
      error
    );
    return;
  }
  const scriptFilename = path.basename(scriptPath);
  const scriptDir = path.dirname(scriptPath);
  // Calculate Relative Path
  const scriptsFolder = getScriptsFolderPath(plugin); // Use the function from this module
  let relativePath = '';
  if (scriptsFolder && scriptPath.startsWith(scriptsFolder))
    relativePath = normalizePath(path.relative(scriptsFolder, scriptPath));
  else
    plugin.logWarn(
      `Could not determine relative path for script ${scriptPath} relative to folder ${scriptsFolder}. Script settings might not be retrievable.`
    );
  // Check if script is active
  if (
    relativePath &&
    plugin.settings.scriptActivationStatus[relativePath] === false
  ) {
    plugin.logInfo(
      `Skipping execution (${context}): Script ${scriptFilename} is disabled in settings.`
    );
    if (context === 'manual')
      new Notice(
        t('NOTICE_SCRIPT_DISABLED').replace('{scriptName}', scriptFilename)
      );
    return;
  }
  // Show "Running" notice only for manual runs
  if (context === 'manual')
    new Notice(`${t('NOTICE_RUNNING_SCRIPT_PREFIX')} ${scriptFilename}`);
  plugin.logInfo(
    `Attempting to run Python script (${context}): ${scriptPath} using ${pythonCmd}`
  );

  // Log script execution start
  await logScriptExecution(plugin, scriptFilename, context, 'start');
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
      plugin.logDebug(
        `Adding plugin directory to PYTHONPATH (autoSetPYTHONPATH enabled): ${plugin.pluginDirAbsPath}`
      );
    } else {
      plugin.logWarn(
        'Plugin directory path not available, library might not be importable even if autoSetPYTHONPATH is enabled.'
      );
    }
  } else {
    plugin.logDebug(
      'Skipping adding plugin directory to PYTHONPATH (autoSetPYTHONPATH disabled).'
    );
  }

  let newPYTHONPATH = pathsForPythonPath.join(path.delimiter);

  // 3. Append any existing PYTHONPATH from the environment
  if (currentPYTHONPATH) {
    newPYTHONPATH = `${newPYTHONPATH}${path.delimiter}${currentPYTHONPATH}`;
  }

  const env = {
    ...process.env, // Inherit existing environment
    OBSIDIAN_HTTP_PORT: plugin.initialHttpPort.toString(),
    OBSIDIAN_BRIDGE_ACTIVE: 'true',
    PYTHONPATH: newPYTHONPATH, // Set our constructed PYTHONPATH
    ...(relativePath && { OBSIDIAN_SCRIPT_RELATIVE_PATH: relativePath }),
    ...(plugin.settings.disablePyCache && { PYTHONPYCACHEPREFIX: os.tmpdir() }),
  };
  plugin.logDebug(
    `Setting OBSIDIAN_HTTP_PORT=${plugin.initialHttpPort} for script.`
  );
  if (relativePath)
    plugin.logDebug(`Setting OBSIDIAN_SCRIPT_RELATIVE_PATH=${relativePath}`);
  plugin.logDebug(`Setting PYTHONPATH=${newPYTHONPATH}`);
  plugin.logDebug(`Setting cwd=${scriptDir}`);
  if (plugin.settings.disablePyCache)
    plugin.logDebug(`Attempting to disable __pycache__ creation.`);
  // Determine Python arguments
  const executableToRun = pythonCmd;
  let fullArgs: string[];

  if (pythonCmd === 'uv') {
    if (plugin.settings.disablePyCache) {
      // To pass -B to Python when using uv, we need 'uv run python -B script.py'
      fullArgs = ['run', 'python', '-B', scriptPath];
    } else {
      // Default 'uv run script.py'
      fullArgs = ['run', scriptPath];
    }
  } else {
    // Standard Python execution
    const pythonArgsBase = plugin.settings.disablePyCache ? ['-B'] : [];
    fullArgs = [...pythonArgsBase, scriptPath];
  }
  // Execute using the stored pythonCmd
  try {
    await new Promise<void>((resolve, reject) => {
      plugin.logDebug(`Executing: ${executableToRun} ${fullArgs.join(' ')}`);
      const pythonProcess = spawn(executableToRun, fullArgs, {
        env,
        cwd: scriptDir,
      });
      let stderrOutput = '';
      pythonProcess.stderr?.on('data', (data) => {
        const msg = data.toString();
        stderrOutput += msg;
        plugin.logError(`[stderr ${scriptFilename}]: ${msg.trim()}`);
      });
      pythonProcess.stdout?.on('data', (data) => {
        const msg = data.toString();
        plugin.logDebug(`[stdout ${scriptFilename}]: ${msg.trim()}`);
      });
      pythonProcess.on('error', (error) => {
        plugin.logError(
          `Failed to start script (${context}) with command "${pythonCmd}": ${error.message}`
        );
        if (context === 'manual')
          new Notice(
            `${t('NOTICE_SCRIPT_ERROR_RUNNING_PREFIX')} ${scriptFilename} ${t('NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE')} ${pythonCmd}: ${error.message}`
          );
        reject(error);
      });
      pythonProcess.on('close', async (code) => {
        plugin.logDebug(
          `${scriptFilename} (${context}, using ${pythonCmd}) finished with exit code ${code}.`
        );
        if (code !== 0 && code !== null) {
          if (context === 'manual')
            new Notice(
              `${scriptFilename} ${t('NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE')} ${code}. ${t('NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX')}`,
              5000
            );
          if (stderrOutput.trim())
            plugin.logError(
              `[Error Summary ${scriptFilename}]: ${stderrOutput.trim()}`
            );

          // Log script execution error
          await logScriptExecution(
            plugin,
            scriptFilename,
            context,
            'error',
            code || undefined,
            stderrOutput.trim()
          );

          reject(new Error(`Script exited with non-zero code: ${code}`));
        } else {
          // Log script execution success
          await logScriptExecution(
            plugin,
            scriptFilename,
            context,
            'success',
            code || undefined
          );
          resolve(); // Success
        }
      });
    });
    plugin.logInfo(
      `Script ${scriptFilename} (${context}) execution completed successfully.`
    );
  } catch (error) {
    plugin.logWarn(
      `Script ${scriptFilename} (${context}) execution failed or exited with error: ${error instanceof Error ? error.message : String(error)}`
    );

    // Log script execution error for exceptions
    await logScriptExecution(
      plugin,
      scriptFilename,
      context,
      'error',
      undefined,
      error instanceof Error ? error.message : String(error)
    );

    // Notices are handled inside the promise callbacks/rejections for manual context
  }
}

/**
 * Opens a modal for the user to select a Python script from the configured folder, then runs it.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export async function chooseAndRunPythonScript(
  plugin: ObsidianPythonBridge
): Promise<void> {
  const scriptsFolder = getScriptsFolderPath(plugin);
  if (!scriptsFolder) {
    new Notice(t('NOTICE_SCRIPTS_FOLDER_INVALID'), 5000);
    return;
  }
  let pythonFiles: string[];
  try {
    pythonFiles = fs
      .readdirSync(scriptsFolder)
      .filter(
        (f) =>
          f.toLowerCase().endsWith('.py') &&
          !f.startsWith('.') &&
          f !== PYTHON_LIBRARY_FILENAME
      );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    new Notice(`${t('NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX')} ${errorMsg}`);
    plugin.logError(`Error reading scripts folder ${scriptsFolder}:`, err);
    return;
  }
  if (pythonFiles.length === 0) {
    new Notice(t('NOTICE_NO_SCRIPTS_FOUND'), 5000);
    return;
  }
  const scriptChoices = pythonFiles.map((f) => ({
    label: f,
    value: path.join(scriptsFolder, f),
  }));
  scriptChoices.sort((a, b) => a.label.localeCompare(b.label));
  new ScriptSelectionModal(plugin.app, scriptChoices, (selectedPath) => {
    if (selectedPath) {
      plugin.logDebug(`User selected script: ${selectedPath}`);
      runPythonScript(plugin, selectedPath, 'manual');
    } // Don't await, run in background
    else plugin.logDebug('Script selection cancelled by user.');
  }).open();
}

/**
 * Runs all active Python scripts found in the configured folder sequentially.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export async function runAllPythonScripts(
  plugin: ObsidianPythonBridge
): Promise<void> {
  const scriptsFolder = getScriptsFolderPath(plugin);
  if (!scriptsFolder) {
    new Notice(t('NOTICE_SCRIPTS_FOLDER_INVALID'), 5000);
    return;
  }
  let pythonFiles: string[];
  try {
    pythonFiles = fs
      .readdirSync(scriptsFolder)
      .filter(
        (f) =>
          f.toLowerCase().endsWith('.py') &&
          !f.startsWith('.') &&
          f !== PYTHON_LIBRARY_FILENAME
      );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    new Notice(`${t('NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX')} ${errorMsg}`);
    plugin.logError(`Error reading scripts folder ${scriptsFolder}:`, err);
    return;
  }
  if (pythonFiles.length === 0) {
    new Notice(t('NOTICE_NO_SCRIPTS_FOUND'), 5000);
    return;
  }
  pythonFiles.sort((a, b) => a.localeCompare(b));
  const activeScriptsToRun = pythonFiles.filter((file) => {
    const relativePath = normalizePath(
      path.relative(scriptsFolder, path.join(scriptsFolder, file))
    );
    return plugin.settings.scriptActivationStatus[relativePath] !== false;
  }); // Check activation
  if (activeScriptsToRun.length === 0) {
    new Notice(t('NOTICE_NO_SCRIPTS_FOUND'), 5000);
    plugin.logInfo('Run All: No active scripts found to run.');
    return;
  } // Or a more specific message like "No active scripts found"
  new Notice(
    `${t('NOTICE_RUNNING_ALL_SCRIPTS_PREFIX')} ${activeScriptsToRun.length} ${t('NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX')}`
  );
  plugin.logInfo(
    `Starting batch run of ${activeScriptsToRun.length} active scripts...`
  );
  for (const file of activeScriptsToRun) {
    const scriptPath = path.join(scriptsFolder, file);
    plugin.logInfo(`Run All: Running next script: ${file}`);
    await runPythonScript(plugin, scriptPath, 'manual'); // Use await here to ensure scripts run one after another // Context is still manual trigger
  }
  plugin.logInfo('Finished batch run of active scripts.');
}

/**
 * Runs scripts marked for auto-start.
 * Called after plugin load, server start, and initial settings sync.
 * @param plugin The ObsidianPythonBridge plugin instance.
 */
export async function runAutoStartScripts(
  plugin: ObsidianPythonBridge
): Promise<void> {
  // Make async to await loadData
  plugin.logInfo('Checking for scripts to run on startup...');

  // Reload settings just before checking to ensure the latest values are used.
  // This is a safeguard against potential async state issues.
  await plugin.loadSettings();
  const currentSettings = plugin.settings; // Use a local copy for the loop

  const scriptsFolder = getScriptsFolderPath(plugin); // Uses plugin.settings which was just reloaded
  if (!scriptsFolder) {
    plugin.logWarn(
      'Cannot run auto-start scripts: Scripts folder path is invalid.'
    );
    return;
  }

  let scriptsRunCount = 0;
  plugin.logDebug(
    'Current AutoStart Status:',
    currentSettings.scriptAutoStartStatus
  );
  plugin.logDebug(
    'Current Activation Status:',
    currentSettings.scriptActivationStatus
  );

  // Iterate over scripts that have an entry in scriptAutoStartStatus
  for (const relativePath in currentSettings.scriptAutoStartStatus) {
    const shouldAutoStart = currentSettings.scriptAutoStartStatus[relativePath];
    // Explicitly check if shouldAutoStart is true
    if (shouldAutoStart === true) {
      // Then check if the script is active
      const isScriptActive =
        currentSettings.scriptActivationStatus[relativePath] !== false;
      plugin.logDebug(
        `Checking script ${relativePath}: shouldAutoStart=${shouldAutoStart}, isScriptActive=${isScriptActive}`
      );

      if (isScriptActive) {
        const absolutePath = path.join(scriptsFolder, relativePath);
        try {
          if (
            fs.existsSync(absolutePath) &&
            fs.statSync(absolutePath).isFile()
          ) {
            plugin.logInfo(`Auto-starting script: ${relativePath}`);
            const delaySeconds =
              currentSettings.scriptAutoStartDelay[relativePath] ?? 0;
            const delayMs = Math.max(0, delaySeconds) * 1000;

            if (delayMs > 0) {
              plugin.logInfo(
                ` -> Delaying execution by ${delaySeconds} second(s).`
              );
              setTimeout(async () => {
                // Make callback async to reload settings
                // Re-check status just before delayed execution
                await plugin.loadSettings(); // Reload again
                const latestActivationStatus =
                  plugin.settings.scriptActivationStatus[relativePath] !==
                  false;
                const latestAutoStartStatus =
                  plugin.settings.scriptAutoStartStatus[relativePath] === true;

                if (latestActivationStatus && latestAutoStartStatus) {
                  plugin.logInfo(
                    `Executing delayed auto-start script: ${relativePath}`
                  );
                  runPythonScript(plugin, absolutePath, 'auto-start'); // No await needed here
                } else {
                  plugin.logWarn(
                    `Skipping delayed auto-start for ${relativePath}: Script status changed during delay (Active: ${latestActivationStatus}, AutoStart: ${latestAutoStartStatus}).`
                  );
                }
              }, delayMs);
            } else {
              // Immediate execution (no need to re-check here as we just loaded settings)
              runPythonScript(plugin, absolutePath, 'auto-start'); // No await needed here
            }
            scriptsRunCount++;
          } else {
            plugin.logWarn(
              `Skipping auto-start for ${relativePath}: Script file not found at ${absolutePath}.`
            );
          }
        } catch (error) {
          plugin.logError(
            `Error checking file status for auto-start script ${absolutePath}:`,
            error
          );
        }
      } else {
        plugin.logDebug(
          `Skipping auto-start for ${relativePath}: Script is not active.`
        );
      }
    } else {
      plugin.logDebug(
        `Skipping auto-start for ${relativePath}: Auto-start setting is false.`
      );
    }
  } // End for loop

  if (scriptsRunCount > 0) {
    plugin.logInfo(
      `Finished launching ${scriptsRunCount} auto-start script(s).`
    );
  } else {
    plugin.logInfo(
      'No active scripts configured for auto-start based on current settings.'
    );
  }
}

// --- Dynamic Command Management ---

/**
 * Generates a unique and stable command ID for a given script path.
 * @param relativePath Normalized relative path of the script.
 * @returns The command ID string.
 */
export function getCommandIdForScript(relativePath: string): string {
  return `python-bridge:run-script:${relativePath}`;
}

/**
 * Updates or registers dynamic commands for all valid Python scripts.
 * Ensures commands exist for active scripts and their callbacks check activation status.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 * @returns Set of relative paths for scripts found during the update.
 */
export async function updateDynamicScriptCommands(
  plugin: ObsidianPythonBridge,
  scriptsFolder: string
): Promise<Set<string>> {
  plugin.logDebug('Updating dynamic script commands...');
  const activeScriptPaths = new Set<string>();
  if (!plugin.pythonExecutable) {
    plugin.logWarn(
      'Cannot update dynamic commands: Python executable not found.'
    );
    return activeScriptPaths;
  }
  let pythonFiles: string[];
  try {
    pythonFiles = fs
      .readdirSync(scriptsFolder)
      .filter(
        (f) =>
          f.toLowerCase().endsWith('.py') &&
          !f.startsWith('.') &&
          f !== PYTHON_LIBRARY_FILENAME
      );
  } catch (err) {
    plugin.logError(
      `Error reading scripts folder for command update ${scriptsFolder}:`,
      err
    );
    return activeScriptPaths;
  }
  for (const file of pythonFiles) {
    const scriptAbsolutePath = path.join(scriptsFolder, file);
    const relativePath = normalizePath(
      path.relative(scriptsFolder, scriptAbsolutePath)
    );
    activeScriptPaths.add(relativePath);

    // Security: Default new scripts to disabled state
    if (!(relativePath in plugin.settings.scriptActivationStatus)) {
      plugin.logInfo(
        `New script detected in command update, defaulting to disabled state: ${relativePath}`
      );
      plugin.settings.scriptActivationStatus[relativePath] = false;
      // Initialize other status defaults for new scripts
      plugin.settings.scriptAutoStartStatus[relativePath] = false;
      plugin.settings.scriptAutoStartDelay[relativePath] = 0;
      // Save settings immediately for security
      await plugin.saveSettings();
    }

    const commandId = getCommandIdForScript(relativePath);
    const commandName = `Run Script: ${file}`; // Simple name
    if (!plugin.dynamicScriptCommands.has(commandId)) {
      plugin.logDebug(
        `Registering new command: ${commandId} ('${commandName}')`
      );
      const command = plugin.addCommand({
        id: commandId,
        name: commandName,
        callback: () => {
          const isActive =
            plugin.settings.scriptActivationStatus[relativePath] !== false;
          if (isActive) {
            plugin.logInfo(`Executing script via command: ${relativePath}`);
            runPythonScript(plugin, scriptAbsolutePath, 'manual');
          } // Don't await
          else {
            plugin.logInfo(
              `Skipping execution via command: Script ${relativePath} is disabled.`
            );
            new Notice(
              t('NOTICE_SCRIPT_DISABLED').replace('{scriptName}', file)
            );
          }
        },
      });
      plugin.dynamicScriptCommands.set(commandId, command);
    } else {
      plugin.logDebug(`Command already exists: ${commandId}`);
      // Optional: Update name/callback if needed, though current callback is robust
    }
  }
  // Clean up commands for scripts that no longer exist
  const commandIdsToRemove: string[] = [];
  for (const [commandId] of plugin.dynamicScriptCommands.entries()) {
    const scriptPathFromId = commandId.substring(
      'python-bridge:run-script:'.length
    );
    if (!activeScriptPaths.has(scriptPathFromId)) {
      plugin.logDebug(
        `Command ${commandId} is stale (script removed), marking for removal.`
      );
      commandIdsToRemove.push(commandId);
    } // Obsidian API lacks unregister. We just remove from our map.
  }
  commandIdsToRemove.forEach((id) => plugin.dynamicScriptCommands.delete(id));
  plugin.logDebug(
    `Dynamic script command update complete. Active commands: ${plugin.dynamicScriptCommands.size}`
  );
  return activeScriptPaths;
}

/**
 * Updates script settings cache AND synchronizes dynamic commands.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptsFolder Absolute path to the Python scripts folder.
 * @param isManualRefresh Whether this update was triggered by a manual refresh.
 */
export async function updateAndSyncCommands(
  plugin: ObsidianPythonBridge,
  scriptsFolder: string,
  isManualRefresh = false
): Promise<void> {
  await updateScriptSettingsCache(plugin, scriptsFolder, isManualRefresh);
  await updateDynamicScriptCommands(plugin, scriptsFolder);
}
