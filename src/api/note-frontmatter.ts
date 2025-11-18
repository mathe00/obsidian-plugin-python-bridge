// --- src/api/note-frontmatter.ts ---
// Retrieves frontmatter from notes by path.

import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Retrieves the parsed frontmatter of a note specified by its vault-relative path.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path to the note.
 * @returns The parsed frontmatter object, or null if no frontmatter exists or file not found.
 */
export async function getNoteFrontmatterByPath(
  plugin: ObsidianPythonBridge,
  relativePath: string
): Promise<Record<string, any> | null> {
  const normalizedPath = normalizePath(relativePath);
  const metadata = plugin.app.metadataCache.getCache(normalizedPath);
  if (!metadata) {
    const fileExists = !!plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (!fileExists) {
      plugin.logDebug(
        `File not found at path for frontmatter lookup: ${normalizedPath}`
      );
      return null;
    }
    plugin.logDebug(
      `No metadata cache found for existing file: ${normalizedPath}`
    );
    return null;
  }
  return metadata.frontmatter ?? null;
}
