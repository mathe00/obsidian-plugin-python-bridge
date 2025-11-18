// --- src/api/commands.ts ---
// Executes Obsidian commands.

import type ObsidianPythonBridge from '../main';

/**
 * Executes an Obsidian command by its ID.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param commandId The ID of the command to execute.
 * @throws Error if command execution fails.
 */
export function runObsidianCommand(
  plugin: ObsidianPythonBridge,
  commandId: string
): void {
  plugin.logDebug(`Attempting to execute command ID: ${commandId}`);
  try {
    // @ts-ignore - executeCommandById might not be in typings
    const success = plugin.app.commands.executeCommandById(commandId);
    if (!success) {
      // @ts-ignore - accessing commands object which may not be in typings
      const commandExists = !!plugin.app.commands.commands[commandId];
      if (!commandExists)
        throw new Error(`Command with ID "${commandId}" not found.`);
      else
        throw new Error(
          `Command "${commandId}" could not be executed (possibly disabled or inactive).`
        );
    }
    plugin.logInfo(`Command executed successfully: ${commandId}`);
  } catch (error) {
    plugin.logError(`Error executing command ${commandId}:`, error);
    throw new Error(
      `Failed to execute command "${commandId}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
