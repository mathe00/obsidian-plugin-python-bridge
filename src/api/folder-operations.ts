// --- src/api/folder-operations.ts ---
// Folder-related operations.

import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';
import { checkPathExists } from './note-crud';

/**
 * Creates a new folder in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path for the new folder.
 * @throws Error if creation fails (e.g., folder exists, invalid path).
 */
export async function createFolder(
  plugin: ObsidianPythonBridge,
  relativePath: string
): Promise<void> {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Attempting to create folder: ${normalizedPath}`);
  try {
    const existingPath = plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (existingPath)
      throw new Error(`Path already exists at "${normalizedPath}" (cannot create folder).`);
    await plugin.app.vault.createFolder(normalizedPath);
    plugin.logInfo(`Folder created successfully: ${normalizedPath}`);
  } catch (error) {
    plugin.logError(`Error creating folder ${normalizedPath}:`, error);
    throw new Error(
      `Failed to create folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Lists files and subfolders within a given vault folder path.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the folder to list. Use "" for root.
 * @returns An object containing lists of relative file and folder paths.
 * @throws Error if the path is not found, not a folder, or listing fails.
 */
export async function listFolder(
  plugin: ObsidianPythonBridge,
  relativePath: string
): Promise<{ files: string[]; folders: string[] }> {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Attempting to list folder contents: ${normalizedPath}`);
  try {
    const listResult = await plugin.app.vault.adapter.list(normalizedPath);
    plugin.logDebug(`Folder listed successfully: ${normalizedPath}`);
    return { files: listResult.files || [], folders: listResult.folders || [] };
  } catch (error) {
    plugin.logError(`Error listing folder ${normalizedPath}:`, error);
    const pathExists = await checkPathExists(plugin, normalizedPath);
    if (!pathExists) throw new Error(`Cannot list folder: Path not found at "${normalizedPath}"`);
    else
      throw new Error(
        `Failed to list folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)} (Is it a folder?)`
      );
  }
}
