// --- src/api/tags.ts ---
// Retrieves all unique tags from the Obsidian metadata cache.

import type ObsidianPythonBridge from '../main';

/**
 * Retrieves all unique tags from the Obsidian metadata cache.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns A sorted list of unique tags (including '#').
 * @throws Error if retrieval fails.
 */
export function getAllTags(plugin: ObsidianPythonBridge): string[] {
  plugin.logDebug('Attempting to retrieve all tags from metadata cache.');
  try {
    // @ts-ignore: metadataCache.getAllTags() exists but may not be typed
    const tagsObject = plugin.app.metadataCache.getAllTags();
    const tagsArray = Object.keys(tagsObject);
    tagsArray.sort();
    plugin.logDebug(
      `Retrieved ${tagsArray.length} unique tags via getAllTags().`
    );
    return tagsArray;
  } catch (error) {
    plugin.logError(
      'Error retrieving tags using metadataCache.getAllTags():',
      error
    );
    throw new Error(
      `Failed to get tags using getAllTags(): ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
