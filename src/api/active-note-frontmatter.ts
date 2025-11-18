// --- src/api/active-note-frontmatter.ts ---
// Gets the parsed frontmatter of the currently active Markdown note.

import { getActiveNoteFile } from './active-note-file';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the parsed frontmatter of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The frontmatter object or null.
 */
export function getActiveNoteFrontmatter(
  plugin: ObsidianPythonBridge
): Record<string, any> | null {
  const file = getActiveNoteFile(plugin);
  if (!file) return null;
  const metadata = plugin.app.metadataCache.getFileCache(file);
  return metadata?.frontmatter ?? null;
}
