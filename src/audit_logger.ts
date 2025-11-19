// --- src/audit_logger.ts ---
// Handles audit logging for script executions and API actions.

import * as fs from 'fs';
import * as path from 'path';
import type ObsidianPythonBridge from './main';
import type { AuditLogEntry } from './types';

/**
 * Gets the default audit log file path in the plugin directory.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The default log file path.
 */
export function getDefaultLogFilePath(plugin: ObsidianPythonBridge): string {
  return path.join(plugin.pluginDirAbsPath || '', 'audit.log');
}

/**
 * Rotates log files when they exceed the maximum size limit.
 * @param logFilePath The path to the current log file.
 * @param maxLogFileSize Maximum size of a single log file in bytes.
 * @param maxLogFiles Maximum number of log files to keep.
 */
export function rotateLogFiles(
  logFilePath: string,
  maxLogFileSize: number,
  maxLogFiles: number
): void {
  try {
    if (!fs.existsSync(logFilePath)) {
      return;
    }

    const stats = fs.statSync(logFilePath);
    if (stats.size < maxLogFileSize) {
      return;
    }

    // Remove the oldest log file if it exists
    const oldestLog = `${logFilePath}.${maxLogFiles}`;
    if (fs.existsSync(oldestLog)) {
      fs.unlinkSync(oldestLog);
    }

    // Rotate existing log files
    for (let i = maxLogFiles - 1; i >= 1; i--) {
      const currentLog = `${logFilePath}.${i}`;
      const nextLog = `${logFilePath}.${i + 1}`;
      if (fs.existsSync(currentLog)) {
        fs.renameSync(currentLog, nextLog);
      }
    }

    // Move current log file to .1
    const firstRotatedLog = `${logFilePath}.1`;
    fs.renameSync(logFilePath, firstRotatedLog);
  } catch (error) {
    console.error('Error rotating log files:', error);
  }
}

/**
 * Writes an audit log entry to the log file.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param entry The audit log entry to write.
 */
export async function writeAuditLogEntry(
  plugin: ObsidianPythonBridge,
  entry: AuditLogEntry
): Promise<void> {
  if (!plugin.settings.auditLog.enabled) {
    return;
  }

  try {
    const logFilePath =
      plugin.settings.auditLog.logFilePath || getDefaultLogFilePath(plugin);
    const maxLogFileSize = plugin.settings.auditLog.maxLogFileSize || 10485760; // 10MB default
    const maxLogFiles = plugin.settings.auditLog.maxLogFiles || 5;

    // Ensure log directory exists
    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Rotate logs if necessary
    rotateLogFiles(logFilePath, maxLogFileSize, maxLogFiles);

    // Format log entry as JSON string with newline
    const logLine = JSON.stringify(entry) + '\n';

    // Append to log file
    fs.appendFileSync(logFilePath, logLine, 'utf8');
  } catch (error) {
    plugin.logError('Failed to write audit log entry:', error);
  }
}

/**
 * Logs a script execution event.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param scriptName The name of the script being executed.
 * @param triggerType The trigger type (e.g., 'manual', 'auto-start', 'event').
 * @param status The execution status ('start', 'success', 'error').
 * @param exitCode The exit code (optional).
 * @param error The error message (optional).
 */
export async function logScriptExecution(
  plugin: ObsidianPythonBridge,
  scriptName: string,
  triggerType: string,
  status: 'start' | 'success' | 'error',
  exitCode?: number,
  error?: string
): Promise<void> {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    type: 'script_execution',
    scriptName,
    triggerType,
    status: status === 'start' ? undefined : status,
    exitCode: status !== 'start' ? exitCode : undefined,
    error: status === 'error' ? error : undefined,
  };

  await writeAuditLogEntry(plugin, entry);
}

/**
 * Logs an API action event.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param action The API action name.
 * @param status The action status ('success', 'error').
 * @param sourceScript The script that initiated the action (optional).
 * @param error The error message (optional).
 */
export async function logApiAction(
  plugin: ObsidianPythonBridge,
  action: string,
  status: 'success' | 'error',
  sourceScript?: string,
  error?: string
): Promise<void> {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    type: 'api_action',
    action,
    status,
    sourceScript,
    error: status === 'error' ? error : undefined,
  };

  await writeAuditLogEntry(plugin, entry);
}
