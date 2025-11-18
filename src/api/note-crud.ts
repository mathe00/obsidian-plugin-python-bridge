// --- src/api/note-crud.ts ---
// Note and file CRUD operations.

import { TFile, normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Creates a new note in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path for the new note (including .md).
 * @param content Initial content for the note.
 * @returns The created TFile object.
 * @throws Error if creation fails (e.g., file exists, invalid path).
 */
export async function createNote(
  plugin: ObsidianPythonBridge,
  relativePath: string,
  content: string
): Promise<TFile> {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Attempting to create note: ${normalizedPath}`);
  try {
    const existingFile = plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (existingFile) throw new Error(`File already exists at path: ${normalizedPath}`);
    const file = await plugin.app.vault.create(normalizedPath, content);
    plugin.logInfo(`Note created successfully: ${normalizedPath}`);
    return file;
  } catch (error) {
    plugin.logError(`Error creating note ${normalizedPath}:`, error);
    throw new Error(
      `Failed to create note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Checks if a file or folder exists using the vault adapter.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path to check.
 * @returns True if the path exists, false otherwise.
 * @throws Error if the adapter check fails unexpectedly.
 */
export async function checkPathExists(
  plugin: ObsidianPythonBridge,
  relativePath: string
): Promise<boolean> {
  const normalizedPath = normalizePath(relativePath);
  try {
    const exists = await plugin.app.vault.adapter.exists(normalizedPath);
    plugin.logDebug(`Path exists check for "${normalizedPath}": ${exists}`);
    return exists;
  } catch (error) {
    plugin.logError(`Error checking existence for path ${normalizedPath}:`, error);
    throw new Error(
      `Failed to check existence for path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Deletes a file or folder (moves to trash or permanently).
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the item to delete.
 * @param permanently If true, delete permanently. Defaults to false (move to trash).
 * @throws Error if the item is not found or deletion fails.
 */
export async function deletePath(
  plugin: ObsidianPythonBridge,
  relativePath: string,
  permanently = false
): Promise<void> {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Attempting to delete path: ${normalizedPath} (Permanently: ${permanently})`);
  const fileOrFolder = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  if (!fileOrFolder) throw new Error(`Cannot delete: Path not found at "${normalizedPath}"`);
  try {
    if (permanently) {
      plugin.logWarn(`Permanently deleting path: ${normalizedPath}`);
      await plugin.app.vault.delete(fileOrFolder, true); // true for 'force' permanent delete
    } else {
      plugin.logDebug(`Moving path to trash: ${normalizedPath}`);
      // Use fileManager.trashFile for moving to Obsidian/system trash
      await plugin.app.fileManager.trashFile(fileOrFolder);
    }
    plugin.logInfo(`Path deleted successfully: ${normalizedPath} (Permanently: ${permanently})`);
  } catch (error) {
    plugin.logError(`Error deleting path ${normalizedPath}:`, error);
    throw new Error(
      `Failed to delete path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Renames or moves a file or folder within the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param oldRelativePath Current vault-relative path.
 * @param newRelativePath Desired new vault-relative path.
 * @throws Error if the old path is not found, the new path is invalid, or rename fails.
 */
export async function renamePath(
  plugin: ObsidianPythonBridge,
  oldRelativePath: string,
  newRelativePath: string
): Promise<void> {
  const normalizedOldPath = normalizePath(oldRelativePath);
  const normalizedNewPath = normalizePath(newRelativePath);
  plugin.logDebug(`Attempting to rename/move: ${normalizedOldPath} -> ${normalizedNewPath}`);
  const fileOrFolder = plugin.app.vault.getAbstractFileByPath(normalizedOldPath);
  if (!fileOrFolder)
    throw new Error(`Cannot rename: Source path not found at "${normalizedOldPath}"`);
  if (normalizedOldPath === normalizedNewPath)
    throw new Error(`Cannot rename: Old path and new path are identical "${normalizedOldPath}"`);
  const destinationExists = plugin.app.vault.getAbstractFileByPath(normalizedNewPath);
  if (destinationExists)
    throw new Error(`Cannot rename: Destination path already exists "${normalizedNewPath}"`);
  try {
    await plugin.app.vault.rename(fileOrFolder, normalizedNewPath);
    plugin.logInfo(`Path renamed/moved successfully: ${normalizedOldPath} -> ${normalizedNewPath}`);
  } catch (error) {
    plugin.logError(`Error renaming path ${normalizedOldPath} to ${normalizedNewPath}:`, error);
    throw new Error(
      `Failed to rename path "${normalizedOldPath}" to "${normalizedNewPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
