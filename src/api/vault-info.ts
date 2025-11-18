// --- src/api/vault-info.ts ---
// Gets vault-related information and paths.

import { FileSystemAdapter, normalizePath } from 'obsidian';
import * as path from 'path';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the absolute path of the current vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute path string or null if unavailable.
 */
export function getCurrentVaultAbsolutePath(plugin: ObsidianPythonBridge): string | null {
  const adapter = plugin.app.vault.adapter;
  if (adapter instanceof FileSystemAdapter && adapter.getBasePath) return adapter.getBasePath();
  plugin.logWarn('Vault adapter is not FileSystemAdapter or lacks getBasePath method.');
  return null;
}

/**
 * Gets the list of all Markdown file paths in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param absolute If true, returns absolute paths. Defaults to false (vault-relative).
 * @returns An array of vault-relative or absolute paths.
 * @throws Error if `absolute` is true but vault path is unavailable.
 */
export function getAllNotePaths(plugin: ObsidianPythonBridge, absolute = false): string[] {
  const relativePaths = plugin.app.vault.getMarkdownFiles().map(f => f.path);
  if (absolute) {
    const vaultPath = getCurrentVaultAbsolutePath(plugin);
    if (!vaultPath) {
      plugin.logError(
        'Cannot return absolute paths: Vault path unavailable for get_all_note_paths.'
      );
      // Throw an error as the Python client expects this possibility.
      throw new Error('Cannot get absolute note paths: Vault absolute path is unavailable.');
    }
    // Ensure vaultPath doesn't have a trailing separator for consistent joining
    const cleanVaultPath = vaultPath.endsWith(path.sep) ? vaultPath.slice(0, -1) : vaultPath;
    return relativePaths.map(p => normalizePath(path.join(cleanVaultPath, p)));
  }
  return relativePaths;
}

/**
 * Gets the name of the current vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The vault name string.
 * @throws Error if retrieval fails.
 */
export function getVaultName(plugin: ObsidianPythonBridge): string {
  try {
    const vaultName = plugin.app.vault.getName();
    plugin.logDebug(`Retrieved vault name: ${vaultName}`);
    return vaultName;
  } catch (error) {
    plugin.logError('Error retrieving vault name:', error);
    throw new Error(
      `Failed to get vault name: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
