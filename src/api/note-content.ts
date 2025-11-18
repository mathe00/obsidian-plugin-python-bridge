// --- src/api/note-content.ts ---
// Retrieves and modifies note content by path.

import { TFile, normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Retrieves the full content of a note specified by its vault-relative path.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path to the note.
 * @returns The content of the note.
 * @throws Error if the file is not found or is not a TFile.
 */
export async function getNoteContentByPath(
  plugin: ObsidianPythonBridge,
  relativePath: string
): Promise<string> {
  const normalizedPath = normalizePath(relativePath);
  const file = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  if (!(file instanceof TFile))
    throw new Error(
      `File not found or is not a file at path: ${normalizedPath}`
    );
  return plugin.app.vault.cachedRead(file); // Use cachedRead
}

/**
 * Modifies the content of a note specified by its vault-relative path using app.vault.modify.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path of the note to modify.
 * @param newContent The new full content for the note.
 * @throws Error if the file is not found or modification fails.
 */
export async function modifyNoteContentByRelativePath(
  plugin: ObsidianPythonBridge,
  relativePath: string,
  newContent: string
): Promise<void> {
  const normalizedPath = normalizePath(relativePath);
  const file = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  if (!(file instanceof TFile))
    throw new Error(
      `Cannot modify note: File not found in vault at path: ${normalizedPath}`
    );
  plugin.logDebug(`Attempting to modify note via Vault API: ${normalizedPath}`);
  try {
    await plugin.app.vault.modify(file, newContent);
    plugin.logInfo(`Note modified successfully: ${normalizedPath}`);
  } catch (error) {
    plugin.logError(
      `Error during app.vault.modify for ${normalizedPath}:`,
      error
    );
    throw new Error(
      `Vault API failed to modify ${normalizedPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
