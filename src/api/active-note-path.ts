// --- src/api/active-note-path.ts ---
// Gets path-related information for the currently active Markdown note.

import { getActiveNoteFile } from './active-note-file';
import { FileSystemAdapter } from 'obsidian';
import * as path from 'path';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the vault-relative path of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The relative path string or null.
 */
export function getActiveNoteRelativePath(
  plugin: ObsidianPythonBridge
): string | null {
  return getActiveNoteFile(plugin)?.path ?? null;
}

/**
 * Gets the absolute filesystem path of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute path string or null if path cannot be determined.
 */
export function getActiveNoteAbsolutePath(
  plugin: ObsidianPythonBridge
): string | null {
  const file = getActiveNoteFile(plugin);
  if (!file) {
    plugin.logWarn('Cannot get active note absolute path: No active file.');
    return null;
  }

  const adapter = plugin.app.vault.adapter;
  // Check if the adapter is a FileSystemAdapter and has the getFullPath method
  if (
    adapter instanceof FileSystemAdapter &&
    typeof adapter.getFullPath === 'function'
  ) {
    try {
      // file.path is already the normalized vault-relative path
      const absolutePath = adapter.getFullPath(file.path);
      plugin.logDebug(
        `Returning active note absolute path via getFullPath: ${absolutePath}`
      );
      // Double-check with Node.js path.isAbsolute for sanity (optional)
      if (!path.isAbsolute(absolutePath)) {
        plugin.logWarn(
          `getActiveNoteAbsolutePath: Path "${absolutePath}" from getFullPath() not considered absolute by Node.js path.isAbsolute. Check adapter behavior.`
        );
      }
      return absolutePath;
    } catch (error) {
      plugin.logError(
        `Error calling adapter.getFullPath for "${file.path}":`,
        error
      );
      return null; // Return null if the adapter method fails
    }
  } else {
    plugin.logError(
      'Cannot get active note absolute path: Vault adapter is not FileSystemAdapter or getFullPath is unavailable.'
    );
    return null; // Return null if adapter method is unavailable and fallback fails
  }
}

/**
 * Gets the title (basename) of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The title string or null.
 */
export function getActiveNoteTitle(
  plugin: ObsidianPythonBridge
): string | null {
  return getActiveNoteFile(plugin)?.basename ?? null;
}
