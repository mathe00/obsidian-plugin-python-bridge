// --- src/api/backlinks.ts ---
// Retrieves backlinks for notes with optional cache plugin support.

import { TFile, LinkCache } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Retrieves backlinks for a specific note, optionally using the Backlink Cache plugin.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param targetPath Vault-relative path of the target note.
 * @param useCacheIfAvailable Attempt to use Backlink Cache plugin if available.
 * @param cacheMode 'fast' or 'safe' mode for Backlink Cache plugin.
 * @returns A dictionary mapping source file paths to their LinkCache arrays.
 * @throws Error if the target file is not found or backlink retrieval fails.
 */
export async function getBacklinks(
  plugin: ObsidianPythonBridge,
  targetPath: string,
  useCacheIfAvailable: boolean,
  cacheMode: 'fast' | 'safe'
): Promise<Record<string, LinkCache[]>> {
  plugin.logDebug(
    `Handling get_backlinks for: ${targetPath}, useCache: ${useCacheIfAvailable}, mode: ${cacheMode}`
  );
  const targetFile = plugin.app.vault.getAbstractFileByPath(targetPath);
  if (!(targetFile instanceof TFile)) throw new Error(`File not found at path: ${targetPath}`);
  let backlinksResult: Record<string, LinkCache[]> | null = null;
  let errorOccurred: string | null = null;
  // @ts-ignore: Accessing internal 'plugins' property which is not part of the public API.
  const isCachePluginEnabled = (plugin.app as any).plugins.enabledPlugins.has('backlink-cache');
  const attemptCacheFeatures = useCacheIfAvailable && isCachePluginEnabled;
  // @ts-ignore: Accessing 'getBacklinksForFile' which might be monkey-patched by 'backlink-cache' plugin.
  const getBacklinksFn = (plugin.app.metadataCache as any).getBacklinksForFile;
  if (typeof getBacklinksFn !== 'function') {
    plugin.logError('Native function app.metadataCache.getBacklinksForFile not found!');
    throw new Error("Obsidian's native getBacklinksForFile function is missing.");
  }
  try {
    if (attemptCacheFeatures && cacheMode === 'safe') {
      // @ts-ignore: Accessing '.safe' property potentially added by 'backlink-cache' plugin.
      if (typeof getBacklinksFn.safe === 'function') {
        plugin.logDebug(
          'Attempting to call getBacklinksForFile.safe() (provided by backlink-cache)'
        );
        // @ts-ignore: Calling potentially monkey-patched '.safe' method.
        backlinksResult = await getBacklinksFn.safe.call(plugin.app.metadataCache, targetFile);
        plugin.logDebug('Call to getBacklinksForFile.safe() completed.');
      } else {
        plugin.logWarn(
          "Requested 'safe' mode, but getBacklinksForFile.safe function not found. Falling back to standard call."
        );
        backlinksResult = getBacklinksFn.call(plugin.app.metadataCache, targetFile);
      }
    } else {
      if (attemptCacheFeatures)
        plugin.logDebug(
          "Calling standard getBacklinksForFile (using backlink-cache 'fast' mode if active)"
        );
      else plugin.logDebug('Calling standard getBacklinksForFile (native Obsidian implementation)');
      backlinksResult = getBacklinksFn.call(plugin.app.metadataCache, targetFile);
      plugin.logDebug('Standard call to getBacklinksForFile completed.');
    }
  } catch (error) {
    plugin.logError(
      `Error during getBacklinksForFile call (mode: ${attemptCacheFeatures ? cacheMode : 'native'}):`,
      error
    );
    errorOccurred = `Error retrieving backlinks: ${error instanceof Error ? error.message : String(error)}`;
  }
  if (errorOccurred) throw new Error(errorOccurred);
  else if (backlinksResult !== null) {
    plugin.logDebug('Raw backlinks result from API/Native:', backlinksResult);
    const serializableBacklinks: Record<string, LinkCache[]> = {};
    try {
      // The structure returned by the cache plugin seems to be { data: Map<string, LinkCache[]> }
      // The native one might be different, adjust based on observation if needed.
      // @ts-ignore: Accessing 'data' property which might exist on the result from 'backlink-cache'.
      const backlinksMap = (backlinksResult as any)?.data;
      if (backlinksMap instanceof Map) {
        plugin.logDebug(`Iterating through Map with ${backlinksMap.size} entries.`);
        for (const [sourcePath, linkCacheArray] of backlinksMap.entries()) {
          if (typeof sourcePath === 'string' && Array.isArray(linkCacheArray))
            serializableBacklinks[sourcePath] = linkCacheArray;
          else
            plugin.logWarn(
              `Skipping invalid entry in backlinks Map: Key=${sourcePath}, Value type=${typeof linkCacheArray}`
            );
        }
      } else {
        // Fallback or handle native structure if different
        // Assuming native might return Record<string, LinkCache[]> directly?
        if (
          typeof backlinksResult === 'object' &&
          backlinksResult !== null &&
          !(backlinksResult instanceof Map)
        ) {
          plugin.logWarn(
            'Backlinks result was not the expected Map structure. Assuming Record<string, LinkCache[]>.',
            backlinksResult
          );
          // Directly assign if it looks like the right structure
          // This part might need refinement based on testing native behavior without the cache plugin
          Object.assign(serializableBacklinks, backlinksResult);
        } else {
          plugin.logWarn(
            "Backlinks result did not contain the expected 'data' Map structure or a direct Record. Raw result:",
            backlinksResult
          );
        }
      }
      plugin.logDebug('Serializable backlinks data prepared:', serializableBacklinks);
      return serializableBacklinks;
    } catch (conversionError) {
      plugin.logError('Error converting backlinks result to serializable format:', conversionError);
      throw new Error(
        `Failed to process backlink data: ${conversionError instanceof Error ? conversionError.message : String(conversionError)}`
      );
    }
  } else {
    // This case should ideally not be reached if errorOccurred is handled correctly
    plugin.logError(
      `Failed to retrieve backlinks for ${targetPath} using any method. Returning error.`
    );
    throw new Error(`Failed to retrieve backlinks for ${targetPath} using any method.`);
  }
}
