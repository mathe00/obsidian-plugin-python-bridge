// --- src/api/tags.ts ---
// Retrieves all unique tags from the Obsidian metadata cache. (Temporarily Disabled)

import type ObsidianPythonBridge from '../main';

/**
 * Retrieves all unique tags from the Obsidian metadata cache. (Temporarily Disabled)
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns A sorted list of unique tags (including '#').
 * @throws Error always (feature disabled).
 */
export function getAllTags(plugin: ObsidianPythonBridge): string[] {
  plugin.logError('get_all_tags is temporarily disabled due to build issues.');
  throw new Error('get_all_tags is temporarily disabled.');
  // Original logic:
  // try {
  //  const tagsObject = plugin.app.metadataCache.getAllTags();
  //  const tagsArray = Object.keys(tagsObject);
  //  tagsArray.sort();
  //  plugin.logDebug(`Retrieved ${tagsArray.length} unique tags directly via getAllTags().`);
  //  return tagsArray;
  // } catch (error) {
  //  plugin.logError("Error retrieving tags using metadataCache.getAllTags():", error);
  //  throw new Error(`Failed to get tags using getAllTags(): ${error instanceof Error ? error.message : String(error)}`);
  // }
}
