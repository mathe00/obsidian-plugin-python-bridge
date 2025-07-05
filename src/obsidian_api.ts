// --- src/obsidian_api.ts ---
// Encapsulates direct interactions with the Obsidian API (app.vault, app.workspace, etc.).

import { App, TFile, TFolder, TAbstractFile, MarkdownView, FileSystemAdapter, normalizePath, LinkCache, Notice } from "obsidian"; // Keep Notice import if used directly here, though likely better in calling modules
import * as path from "path";
import type ObsidianPythonBridge from "./main"; // Import the main plugin type
import { t } from "./lang/translations"; // Import translation function if needed for errors/logs

// --- Active Note Helpers ---

/**
 * Gets the TFile object for the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The TFile object or null if no Markdown view is active.
 */
export function getActiveNoteFile(plugin: ObsidianPythonBridge): TFile | null {
	const activeView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	return activeView?.file ?? null;
}

/**
 * Gets the content of the currently active Markdown note using cachedRead.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param returnFormat The desired format for the content ("string" or "lines").
 * @returns The note content as a string, or null if no active note.
 */
export async function getActiveNoteContent(plugin: ObsidianPythonBridge, returnFormat: string = "string"): Promise<string | string[] | null> {
	const file = getActiveNoteFile(plugin);
	if (!file) return null;

	const contentString = await plugin.app.vault.cachedRead(file);

	if (returnFormat === "lines") {
		// Split by newline characters. Handles \n, \r\n, and \r.
		// Using a regex accounts for different line ending types.
		return contentString.split(/\r\n|\r|\n/);
	}
	return contentString; // Default to returning the full string
}

/**
 * Gets the vault-relative path of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The relative path string or null.
 */
export function getActiveNoteRelativePath(plugin: ObsidianPythonBridge): string | null { return getActiveNoteFile(plugin)?.path ?? null; }

/**
 * Gets the absolute filesystem path of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute path string or null if path cannot be determined.
 */
export function getActiveNoteAbsolutePath(plugin: ObsidianPythonBridge): string | null {
	const file = getActiveNoteFile(plugin);
	if (!file) {
		plugin.logWarn("Cannot get active note absolute path: No active file.");
		return null;
	}

	const adapter = plugin.app.vault.adapter;
	// Check if the adapter is a FileSystemAdapter and has the getFullPath method
	if (adapter instanceof FileSystemAdapter && typeof adapter.getFullPath === 'function') {
		try {
			// file.path is already the normalized vault-relative path
			const absolutePath = adapter.getFullPath(file.path);
			plugin.logDebug(`Returning active note absolute path via getFullPath: ${absolutePath}`);
			// Double-check with Node.js path.isAbsolute for sanity (optional)
			if (!path.isAbsolute(absolutePath)) {
				plugin.logWarn(`getActiveNoteAbsolutePath: Path "${absolutePath}" from getFullPath() not considered absolute by Node.js path.isAbsolute. Check adapter behavior.`);
			}
			return absolutePath;
		} catch (error) {
			plugin.logError(`Error calling adapter.getFullPath for "${file.path}":`, error);
			return null; // Return null if the adapter method fails
		}
	} else {
		plugin.logError("Cannot get active note absolute path: Vault adapter is not FileSystemAdapter or getFullPath is unavailable.");
		// Fallback attempt (less reliable, kept as last resort - consider removing)
		// const vaultPath = getCurrentVaultAbsolutePath(plugin);
		// if (vaultPath) {
		//     let joinedPath = path.join(vaultPath, file.path);
		//     let normalized = normalizePath(joinedPath);
		//     // Attempt correction (less reliable than getFullPath)
		//     if (vaultPath.startsWith('/') && !normalized.startsWith('/')) {
		//         normalized = '/' + normalized;
		//     } else if (/^[a-zA-Z]:\\/.test(vaultPath) && !/^[a-zA-Z]:\\/.test(normalized)) {
        //         // Basic check if Windows path lost its drive letter - very unlikely with path.join
        //         plugin.logWarn("Potential Windows path issue after join/normalize.");
        //     }
		//     return normalized;
		// }
		return null; // Return null if adapter method is unavailable and fallback fails
	}
}

/**
 * Gets the title (basename) of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The title string or null.
 */
export function getActiveNoteTitle(plugin: ObsidianPythonBridge): string | null { return getActiveNoteFile(plugin)?.basename ?? null; }

/**
 * Gets the parsed frontmatter of the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The frontmatter object or null.
 */
export async function getActiveNoteFrontmatter(plugin: ObsidianPythonBridge): Promise<Record<string, any> | null> {
	const file = getActiveNoteFile(plugin);
	if (!file) return null;
	const metadata = plugin.app.metadataCache.getFileCache(file);
	return metadata?.frontmatter ?? null;
}

// --- General Vault/File Helpers ---

/**
 * Gets the absolute path of the current vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The absolute path string or null if unavailable.
 */
export function getCurrentVaultAbsolutePath(plugin: ObsidianPythonBridge): string | null {
	const adapter = plugin.app.vault.adapter;
	if (adapter instanceof FileSystemAdapter && adapter.getBasePath) return adapter.getBasePath();
	plugin.logWarn("Vault adapter is not FileSystemAdapter or lacks getBasePath method.");
	return null;
}

/**
 * Gets the list of all Markdown file paths in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns An array of vault-relative paths.
 */
export function getAllNotePaths(plugin: ObsidianPythonBridge, absolute: boolean = false): string[] {
	const relativePaths = plugin.app.vault.getMarkdownFiles().map((f) => f.path);
	if (absolute) {
		const vaultPath = getCurrentVaultAbsolutePath(plugin);
		if (!vaultPath) {
			plugin.logError("Cannot return absolute paths: Vault path unavailable for get_all_note_paths.");
			// Throw an error as the Python client expects this possibility.
			throw new Error("Cannot get absolute note paths: Vault absolute path is unavailable.");
		}
		// Ensure vaultPath doesn't have a trailing separator for consistent joining
		const cleanVaultPath = vaultPath.endsWith(path.sep) ? vaultPath.slice(0, -1) : vaultPath;
		return relativePaths.map(p => normalizePath(path.join(cleanVaultPath, p)));
	}
	return relativePaths;
}

/**
 * Retrieves the full content of a specific note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path to the note.
 * @returns The content of the note.
 * @throws Error if the file is not found or is not a TFile.
 */
export async function getNoteContentByPath(plugin: ObsidianPythonBridge, relativePath: string): Promise<string> {
	const normalizedPath = normalizePath(relativePath);
	const file = plugin.app.vault.getFileByPath(normalizedPath); // Use getFileByPath
	if (!file) throw new Error(`File not found at path: ${normalizedPath}`);
	return plugin.app.vault.cachedRead(file); // Use cachedRead
}

/**
 * Retrieves the parsed frontmatter of a specific note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path to the note.
 * @returns The parsed frontmatter object, or null if no frontmatter exists or file not found.
 */
export async function getNoteFrontmatterByPath(plugin: ObsidianPythonBridge, relativePath: string): Promise<Record<string, any> | null> {
	const normalizedPath = normalizePath(relativePath);
	const metadata = plugin.app.metadataCache.getCache(normalizedPath);
	if (!metadata) {
		const fileExists = !!plugin.app.vault.getFileByPath(normalizedPath); // Use getFileByPath
		if (!fileExists) { plugin.logDebug(`File not found at path for frontmatter lookup: ${normalizedPath}`); return null; }
		plugin.logDebug(`No metadata cache found for existing file: ${normalizedPath}`);
		return null;
	}
	return metadata.frontmatter ?? null;
}

/**
 * Modifies the content of a note specified by its vault-relative path using app.vault.modify.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path of the note to modify.
 * @param newContent The new full content for the note.
 * @throws Error if the file is not found or modification fails.
 */
export async function modifyNoteContentByRelativePath(plugin: ObsidianPythonBridge, relativePath: string, newContent: string): Promise<void> {
	const normalizedPath = normalizePath(relativePath);
	const file = plugin.app.vault.getFileByPath(normalizedPath); // Use getFileByPath
	if (!file) throw new Error(`Cannot modify note: File not found in vault at path: ${normalizedPath}`);
	plugin.logDebug(`Attempting to modify note via Vault API: ${normalizedPath}`);
	try {
		await plugin.app.vault.modify(file, newContent);
		plugin.logInfo(`Note modified successfully: ${normalizedPath}`);
	} catch (error) {
		plugin.logError(`Error during app.vault.modify for ${normalizedPath}:`, error);
		throw new Error(`Vault API failed to modify ${normalizedPath}: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Creates a new note in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path for the new note (including .md).
 * @param content Initial content for the note.
 * @returns The created TFile object.
 * @throws Error if creation fails (e.g., file exists, invalid path).
 */
export async function createNote(plugin: ObsidianPythonBridge, relativePath: string, content: string): Promise<TFile> {
	const normalizedPath = normalizePath(relativePath);
	plugin.logDebug(`Attempting to create note: ${normalizedPath}`);
	try {
		const existingFile = plugin.app.vault.getFileByPath(normalizedPath); // Use getFileByPath
		if (existingFile) throw new Error(`File already exists at path: ${normalizedPath}`);
		const file = await plugin.app.vault.create(normalizedPath, content);
		plugin.logInfo(`Note created successfully: ${normalizedPath}`);
		return file;
	} catch (error) {
		plugin.logError(`Error creating note ${normalizedPath}:`, error);
		throw new Error(`Failed to create note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Checks if a file or folder exists using the vault adapter.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path to check.
 * @returns True if the path exists, false otherwise.
 * @throws Error if the adapter check fails unexpectedly.
 */
export async function checkPathExists(plugin: ObsidianPythonBridge, relativePath: string): Promise<boolean> {
	const normalizedPath = normalizePath(relativePath);
	try {
		const exists = await plugin.app.vault.adapter.exists(normalizedPath);
		plugin.logDebug(`Path exists check for "${normalizedPath}": ${exists}`);
		return exists;
	} catch (error) {
		plugin.logError(`Error checking existence for path ${normalizedPath}:`, error);
		throw new Error(`Failed to check existence for path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Deletes a file or folder (moves to trash or permanently).
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the item to delete.
 * @param permanently If true, delete permanently. Defaults to false (move to trash).
 * @throws Error if the item is not found or deletion fails.
 */
export async function deletePath(plugin: ObsidianPythonBridge, relativePath: string, permanently: boolean = false): Promise<void> {
	const normalizedPath = normalizePath(relativePath);
	plugin.logDebug(`Attempting to delete path: ${normalizedPath} (Permanently: ${permanently})`);
	const fileOrFolder = plugin.app.vault.getAbstractFileByPath(normalizedPath); // Keep getAbstractFileByPath here, as it can be either file or folder
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
		throw new Error(`Failed to delete path "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Renames or moves a file or folder within the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param oldRelativePath Current vault-relative path.
 * @param newRelativePath Desired new vault-relative path.
 * @throws Error if the old path is not found, the new path is invalid, or rename fails.
 */
export async function renamePath(plugin: ObsidianPythonBridge, oldRelativePath: string, newRelativePath: string): Promise<void> {
	const normalizedOldPath = normalizePath(oldRelativePath);
	const normalizedNewPath = normalizePath(newRelativePath);
	plugin.logDebug(`Attempting to rename/move: ${normalizedOldPath} -> ${normalizedNewPath}`);

	const fileOrFolder = plugin.app.vault.getAbstractFileByPath(normalizedOldPath);
	if (!fileOrFolder) throw new Error(`Cannot rename: Source path not found at "${normalizedOldPath}"`);
	if (normalizedOldPath === normalizedNewPath) throw new Error(`Cannot rename: Old path and new path are identical "${normalizedOldPath}"`);
	const destinationExists = plugin.app.vault.getAbstractFileByPath(normalizedNewPath);
	if (destinationExists) throw new Error(`Cannot rename: Destination path already exists "${normalizedNewPath}"`);

	try {
		// Use fileManager.renameFile for updating links and respecting user preferences
		await plugin.app.fileManager.renameFile(fileOrFolder, normalizedNewPath);
		plugin.logInfo(`Path renamed/moved successfully: ${normalizedOldPath} -> ${normalizedNewPath}`);
	} catch (error) {
		plugin.logError(`Error renaming path ${normalizedOldPath} to ${normalizedNewPath}:`, error);
		throw new Error(`Failed to rename path "${normalizedOldPath}" to "${normalizedNewPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Creates a new folder in the vault.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path for the new folder.
 * @throws Error if creation fails (e.g., folder exists, invalid path).
 */
export async function createFolder(plugin: ObsidianPythonBridge, relativePath: string): Promise<void> {
	const normalizedPath = normalizePath(relativePath);
	plugin.logDebug(`Attempting to create folder: ${normalizedPath}`);
	try {
		const existingPath = plugin.app.vault.getFolderByPath(normalizedPath); // Use getFolderByPath
		if (existingPath) throw new Error(`Folder already exists at "${normalizedPath}".`);
		await plugin.app.vault.createFolder(normalizedPath);
		plugin.logInfo(`Folder created successfully: ${normalizedPath}`);
	} catch (error) {
		plugin.logError(`Error creating folder ${normalizedPath}:`, error);
		throw new Error(`Failed to create folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Lists files and subfolders within a given vault folder path.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the folder to list. Use "" for root.
 * @returns An object containing lists of relative file and folder paths.
 * @throws Error if the path is not found, not a folder, or listing fails.
 */
export async function listFolder(plugin: ObsidianPythonBridge, relativePath: string): Promise<{ files: string[]; folders: string[] }> {
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
		else throw new Error(`Failed to list folder "${normalizedPath}": ${error instanceof Error ? error.message : String(error)} (Is it a folder?)`);
	}
}

/**
 * Retrieves outgoing links (including embeds) from a note's metadata cache.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the note.
 * @returns A list of outgoing link strings.
 * @throws Error if the note is not found or metadata cannot be retrieved.
 */
export function getLinks(plugin: ObsidianPythonBridge, relativePath: string): string[] {
	const normalizedPath = normalizePath(relativePath);
	plugin.logDebug(`Attempting to get outgoing links for: ${normalizedPath}`);
	const metadata = plugin.app.metadataCache.getCache(normalizedPath);
	if (!metadata) {
		const fileExists = !!plugin.app.vault.getFileByPath(normalizedPath); // Use getFileByPath
		if (!fileExists) throw new Error(`Cannot get links: File not found at path "${normalizedPath}"`);
		else { plugin.logWarn(`No metadata cache found for file "${normalizedPath}" to get links.`); return []; }
	}
	const outgoingLinks: string[] = [];
	if (metadata.links) metadata.links.forEach((link) => outgoingLinks.push(link.link));
	if (metadata.embeds) metadata.embeds.forEach((embed) => outgoingLinks.push(embed.link));
	const uniqueLinks = Array.from(new Set(outgoingLinks));
	plugin.logDebug(`Found ${uniqueLinks.length} unique outgoing links/embeds for ${normalizedPath}.`);
	return uniqueLinks;
}

/**
 * Retrieves backlinks for a specific note, optionally using the Backlink Cache plugin.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param targetPath Vault-relative path of the target note.
 * @param useCacheIfAvailable Attempt to use Backlink Cache plugin if available.
 * @param cacheMode 'fast' or 'safe' mode for Backlink Cache plugin.
 * @returns A dictionary mapping source file paths to their LinkCache arrays.
 * @throws Error if the target file is not found or backlink retrieval fails.
 */
export async function getBacklinks(plugin: ObsidianPythonBridge, targetPath: string, useCacheIfAvailable: boolean, cacheMode: "fast" | "safe"): Promise<Record<string, LinkCache[]>> {
	plugin.logDebug(`Handling get_backlinks for: ${targetPath}, useCache: ${useCacheIfAvailable}, mode: ${cacheMode}`);
	const targetFile = plugin.app.vault.getFileByPath(targetPath); // Use getFileByPath
	if (!targetFile) throw new Error(`File not found at path: ${targetPath}`);
	let backlinksResult: Record<string, LinkCache[]> | null = null;
	let errorOccurred: string | null = null;
	// @ts-ignore: Accessing internal 'plugins' property which is not part of the public API.
	const isCachePluginEnabled = (plugin.app as any).plugins.enabledPlugins.has("backlink-cache");
	const attemptCacheFeatures = useCacheIfAvailable && isCachePluginEnabled;
	// @ts-ignore: Accessing 'getBacklinksForFile' which might be monkey-patched by 'backlink-cache' plugin.
	const getBacklinksFn = (plugin.app.metadataCache as any).getBacklinksForFile;
	if (typeof getBacklinksFn !== "function") { plugin.logError("Native function app.metadataCache.getBacklinksForFile not found!"); throw new Error("Obsidian's native getBacklinksForFile function is missing."); }
	try {
		if (attemptCacheFeatures && cacheMode === "safe") {
			// @ts-ignore: Accessing '.safe' property potentially added by 'backlink-cache' plugin.
			if (typeof getBacklinksFn.safe === "function") {
				plugin.logDebug("Attempting to call getBacklinksForFile.safe() (provided by backlink-cache)");
				// @ts-ignore: Calling potentially monkey-patched '.safe' method.
				backlinksResult = await getBacklinksFn.safe.call(plugin.app.metadataCache, targetFile);
				plugin.logDebug("Call to getBacklinksForFile.safe() completed.");
			} else {
				plugin.logWarn("Requested 'safe' mode, but getBacklinksForFile.safe function not found. Falling back to standard call.");
				backlinksResult = getBacklinksFn.call(plugin.app.metadataCache, targetFile);
			}
		} else {
			if (attemptCacheFeatures) plugin.logDebug("Calling standard getBacklinksForFile (using backlink-cache 'fast' mode if active)");
			else plugin.logDebug("Calling standard getBacklinksForFile (native Obsidian implementation)");
			backlinksResult = getBacklinksFn.call(plugin.app.metadataCache, targetFile);
			plugin.logDebug("Standard call to getBacklinksForFile completed.");
		}
	} catch (error) {
		plugin.logError(`Error during getBacklinksForFile call (mode: ${attemptCacheFeatures ? cacheMode : "native"}):`, error);
		errorOccurred = `Error retrieving backlinks: ${error instanceof Error ? error.message : String(error)}`;
	}
	if (errorOccurred) throw new Error(errorOccurred);
	else if (backlinksResult !== null) {
		plugin.logDebug("Raw backlinks result from API/Native:", backlinksResult);
		const serializableBacklinks: Record<string, LinkCache[]> = {};
		try {
			// The structure returned by the cache plugin seems to be { data: Map<string, LinkCache[]> }
			// The native one might be different, adjust based on observation if needed.
			// @ts-ignore: Accessing 'data' property which might exist on the result from 'backlink-cache'.
			const backlinksMap = (backlinksResult as any)?.data;
			if (backlinksMap instanceof Map) {
				plugin.logDebug(`Iterating through Map with ${backlinksMap.size} entries.`);
				for (const [sourcePath, linkCacheArray] of backlinksMap.entries()) {
					if (typeof sourcePath === "string" && Array.isArray(linkCacheArray)) serializableBacklinks[sourcePath] = linkCacheArray;
					else plugin.logWarn(`Skipping invalid entry in backlinks Map: Key=${sourcePath}, Value type=${typeof linkCacheArray}`);
				}
			} else {
				// Fallback or handle native structure if different
				// Assuming native might return Record<string, LinkCache[]> directly?
				if (typeof backlinksResult === 'object' && backlinksResult !== null && !(backlinksResult instanceof Map)) {
					plugin.logWarn("Backlinks result was not the expected Map structure. Assuming Record<string, LinkCache[]>.", backlinksResult);
					// Directly assign if it looks like the right structure
					// This part might need refinement based on testing native behavior without the cache plugin
					Object.assign(serializableBacklinks, backlinksResult);
				} else {
					plugin.logWarn("Backlinks result did not contain the expected 'data' Map structure or a direct Record. Raw result:", backlinksResult);
				}
			}
			plugin.logDebug("Serializable backlinks data prepared:", serializableBacklinks);
			return serializableBacklinks;
		} catch (conversionError) {
			plugin.logError("Error converting backlinks result to serializable format:", conversionError);
			throw new Error(`Failed to process backlink data: ${conversionError instanceof Error ? conversionError.message : String(conversionError)}`);
		}
	} else {
		// This case should ideally not be reached if errorOccurred is handled correctly
		plugin.logError(`Failed to retrieve backlinks for ${targetPath} using any method. Returning error.`);
		throw new Error(`Failed to retrieve backlinks for ${targetPath} using any method.`);
	}
}

// --- Editor Helpers ---

/**
 * Gets the currently selected text in the active Markdown editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The selected text (can be an empty string if nothing is selected).
 * @throws Error if no Markdown view/editor is active.
 */
export function getSelectedText(plugin: ObsidianPythonBridge): string {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!view) throw new Error("No active Markdown view found.");
	const editor = view.editor;
	if (!editor) throw new Error("Active Markdown view does not have an editor instance.");
	return editor.getSelection();
}

/**
 * Replaces the currently selected text in the active Markdown editor.
 * If no text is selected, inserts the text at the cursor position.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param replacement The text to insert or replace the selection with.
 * @throws Error if no Markdown view/editor is active.
 */
export function replaceSelectedText(plugin: ObsidianPythonBridge, replacement: string): void {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!view) throw new Error("No active Markdown view found to replace selection in.");
	const editor = view.editor;
	if (!editor) throw new Error("Active Markdown view does not have an editor instance.");
	editor.replaceSelection(replacement);
}

/**
 * Opens a note in the Obsidian workspace.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath The vault-relative path of the note to open (e.g., "Folder/Note.md").
 * @param newLeaf If true, opens the note in a new leaf (tab/split). Defaults to false.
 * @throws Error if the file cannot be opened (e.g., not found, invalid path).
 */
export async function openNote(plugin: ObsidianPythonBridge, relativePath: string, newLeaf: boolean = false): Promise<void> {
	const normalizedPath = normalizePath(relativePath);
	plugin.logDebug(`Requesting to open note: ${normalizedPath} (newLeaf: ${newLeaf})`);
	try {
		await plugin.app.workspace.openLinkText(normalizedPath, "", newLeaf ? "split" : false); // sourcePath // PaneType or boolean
		plugin.logInfo(`Successfully requested to open ${normalizedPath}`);
	} catch (error) {
		plugin.logError(`Failed to open link text "${normalizedPath}":`, error);
		throw new Error(`Could not open note "${normalizedPath}": ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Retrieves context information about the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns An object with editor context, or null if no editor is active.
 * @throws Error if accessing editor properties fails unexpectedly.
 */
export function getEditorContext(plugin: ObsidianPythonBridge): Record<string, any> | null {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!view || !view.editor) { plugin.logDebug("No active Markdown editor found for get_editor_context."); return null; }
	const editor = view.editor;
	try {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();
		const context = { cursor: { line: cursor.line, ch: cursor.ch }, line_count: lineCount };
		plugin.logDebug("Retrieved editor context:", context);
		return context;
	} catch (error) {
		plugin.logError("Error retrieving editor context:", error);
		throw new Error(`Failed to get editor context: ${error instanceof Error ? error.message : String(error)}`);
	}
}

// --- Other Obsidian Info Helpers ---

/**
 * Gets the current language setting of Obsidian.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The language code (e.g., 'en', 'fr') or 'en' as default.
 */
export function getObsidianLanguage(plugin: ObsidianPythonBridge): string {
	const obsidianLang = localStorage.getItem("language");
	if (obsidianLang) { plugin.logDebug(`Obsidian language from localStorage: ${obsidianLang}`); return obsidianLang; }
	try {
		// @ts-ignore - Accessing moment which is globally available in Obsidian
		const momentLocale = moment.locale();
		if (momentLocale) { plugin.logDebug(`Obsidian language from moment.locale(): ${momentLocale}`); return momentLocale; }
	} catch (e) { plugin.logWarn("Could not get language via moment.locale()", e); }
	plugin.logWarn("Could not determine Obsidian language, defaulting to 'en'.");
	return "en";
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
		plugin.logError("Error retrieving vault name:", error);
		throw new Error(`Failed to get vault name: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Determines the current theme mode (light or dark).
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns 'light' or 'dark'.
 * @throws Error if checking fails.
 */
export function getThemeMode(plugin: ObsidianPythonBridge): "light" | "dark" {
	try {
		const isDark = document.body.classList.contains("theme-dark");
		const mode = isDark ? "dark" : "light";
		plugin.logDebug(`Determined theme mode: ${mode}`);
		return mode;
	} catch (error) {
		plugin.logError("Error checking document.body for theme class:", error);
		throw new Error(`Failed to determine theme mode: ${error instanceof Error ? error.message : String(error)}`);
	}
}

// --- Temporarily Disabled API Functions ---
// Keep these placeholders to avoid breaking imports if they are re-enabled later

/**
 * Executes an Obsidian command by its ID. (Temporarily Disabled)
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param commandId The ID of the command to execute.
 * @throws Error always (feature disabled).
 */
export function runObsidianCommand(plugin: ObsidianPythonBridge, commandId: string): void {
	plugin.logError("run_obsidian_command is temporarily disabled due to build issues.");
	throw new Error("run_obsidian_command is temporarily disabled.");
	// Original logic:
	// plugin.logDebug(`Attempting to execute command ID: ${commandId}`);
	// try {
	//  const success = plugin.app.commands.executeCommandById(commandId);
	//  if (!success) {
	//      const commandExists = !!plugin.app.commands.commands[commandId];
	//      if (!commandExists) throw new Error(`Command with ID "${commandId}" not found.`);
	//      else throw new Error(`Command "${commandId}" could not be executed (possibly disabled or inactive).`);
	//  }
	//  plugin.logInfo(`Command executed successfully: ${commandId}`);
	// } catch (error) {
	//  plugin.logError(`Error executing command ${commandId}:`, error);
	//  throw new Error(`Failed to execute command "${commandId}": ${error instanceof Error ? error.message : String(error)}`);
	// }
}

/**
 * Retrieves all unique tags from the Obsidian metadata cache. (Temporarily Disabled)
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns A sorted list of unique tags (including '#').
 * @throws Error always (feature disabled).
 */
export function getAllTags(plugin: ObsidianPythonBridge): string[] {
	plugin.logError("get_all_tags is temporarily disabled due to build issues.");
	throw new Error("get_all_tags is temporarily disabled.");
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
