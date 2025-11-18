// --- src/api/active-note-content.ts ---
// Gets the content of the currently active Markdown note.

import { getActiveNoteFile } from './active-note-file';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the content of the currently active Markdown note using cachedRead.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param returnFormat The desired format for the content ("string" or "lines").
 * @returns The note content as a string, or null if no active note.
 */
export async function getActiveNoteContent(
  plugin: ObsidianPythonBridge,
  returnFormat = 'string'
): Promise<string | string[] | null> {
  const file = getActiveNoteFile(plugin);
  if (!file) return null;

  const contentString = await plugin.app.vault.cachedRead(file);

  if (returnFormat === 'lines') {
    // Split by newline characters. Handles \n, \r\n, and \r.
    // Using a regex accounts for different line ending types.
    return contentString.split(/\r\n|\r|\n/);
  }
  return contentString; // Default to returning the full string
}
