// --- src/api/note-opening.ts ---
// Opens notes in the Obsidian workspace.

import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Opens a note in the Obsidian workspace.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path of the note to open (e.g., "Folder/Note.md").
 * @param newLeaf If true, opens the note in a new leaf (tab/split). Defaults to false.
 * @throws Error if the file cannot be opened (e.g., not found, invalid path).
 */
export async function openNote(
  plugin: ObsidianPythonBridge,
  relativePath: string,
  newLeaf: boolean = false
): Promise<void> {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Requesting to open note: ${normalizedPath} (newLeaf: ${newLeaf})`);
  try {
    await plugin.app.workspace.openLinkText(normalizedPath, '', newLeaf ? 'split' : false); // sourcePath // PaneType or boolean
    plugin.logInfo(`Successfully requested to open ${normalizedPath}`);
  } catch (error) {
    plugin.logError(`Failed to open link text "${normalizedPath}":`, error);
    throw new Error(
      `Could not open note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
