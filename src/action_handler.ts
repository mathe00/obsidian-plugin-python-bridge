// --- src/action_handler.ts ---
// Handles dispatching incoming API actions to the appropriate functions.

import * as path from "path"; // Import path module
import { Notice, normalizePath, TFile } from "obsidian";
import type ObsidianPythonBridge from "./main"; // Import the main plugin type
import type { JsonRequest, JsonResponse } from "./types"; // Import types
import { t } from "./lang/translations"; // Import translation function
import UserInputModal from "./UserInputModal"; // Import modal

// Import functions from the new modules
import { getActiveNoteContent, getActiveNoteRelativePath, getActiveNoteAbsolutePath, getActiveNoteTitle, getActiveNoteFrontmatter, getCurrentVaultAbsolutePath, getNoteContentByPath, getNoteFrontmatterByPath, getSelectedText, replaceSelectedText, openNote, getObsidianLanguage, createNote, checkPathExists, deletePath, renamePath, runObsidianCommand, getAllTags, getVaultName, getThemeMode, createFolder, listFolder, getLinks, getEditorContext, getBacklinks, modifyNoteContentByRelativePath } from "./obsidian_api"; // Use the relative path version // Keep import even if disabled for now // Keep import even if disabled for now
import { removeListener } from "./event_handler"; // Import event helper

/**
 * Handles incoming JSON requests from the Python client.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param request The parsed JSON request object.
 * @returns A promise resolving to the JSON response object.
 */
export async function dispatchAction(plugin: ObsidianPythonBridge, request: JsonRequest): Promise<JsonResponse> {
	const { action, payload } = request;
	plugin.logDebug(`Executing action: ${action} with payload:`, payload);
	try {
		switch (action) {
			// --- Vault/Note Info ---
			case "get_all_note_paths":
				return { status: "success", data: plugin.getAllNotePaths() }; // Directly call the function from obsidian_api.ts // Use plugin method which calls obsidian_api internally
			case "get_active_note_content":
				const activeContent = await getActiveNoteContent(plugin);
				return activeContent !== null ? { status: "success", data: activeContent } : { status: "error", error: "No active Markdown note found." };
			case "get_active_note_relative_path":
				const activeRelativePath = getActiveNoteRelativePath(plugin);
				return activeRelativePath !== null ? { status: "success", data: activeRelativePath } : { status: "error", error: "No active Markdown note found." };
			case "get_active_note_absolute_path":
				const activeAbsolutePath = getActiveNoteAbsolutePath(plugin);
				return activeAbsolutePath !== null ? { status: "success", data: activeAbsolutePath } : { status: "error", error: "No active note or vault path unavailable." };
			case "get_active_note_title":
				const activeTitle = getActiveNoteTitle(plugin);
				return activeTitle !== null ? { status: "success", data: activeTitle } : { status: "error", error: "No active Markdown note found." };
			case "get_current_vault_absolute_path":
				const vaultPath = getCurrentVaultAbsolutePath(plugin);
				return vaultPath !== null ? { status: "success", data: vaultPath } : { status: "error", error: "Could not determine vault absolute path." };
			case "get_active_note_frontmatter":
				const activeFrontmatter = await getActiveNoteFrontmatter(plugin);
				return { status: "success", data: activeFrontmatter };
			case "get_note_content":
				if (typeof payload?.path !== "string") return { status: "error", error: "Invalid payload: 'path' (string) required." };
				try {
					const content = await getNoteContentByPath(plugin, payload.path);
					return { status: "success", data: content };
				} catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_note_frontmatter":
				if (typeof payload?.path !== "string") return { status: "error", error: "Invalid payload: 'path' (string) required." };
				try {
					const frontmatter = await getNoteFrontmatterByPath(plugin, payload.path);
					return { status: "success", data: frontmatter };
				} catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }

			// --- Editor Actions ---
			case "get_selected_text":
				try {
					const selectedText = getSelectedText(plugin);
					return { status: "success", data: selectedText };
				} catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "replace_selected_text":
				if (typeof payload?.replacement !== "string") return { status: "error", error: "Invalid payload: 'replacement' (string) required." };
				try {
					replaceSelectedText(plugin, payload.replacement);
					return { status: "success", data: null };
				} catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }

			// --- Note Modification/Opening ---
			case "modify_note_content": // Kept for backward compatibility
				if (typeof payload?.filePath !== "string" || typeof payload?.content !== "string") return { status: "error", error: "Invalid payload: 'filePath' (absolute path string) and 'content' (string) required." }; // Expecting absolute path here
				try {
					// Convert absolute path to relative for the preferred function
					const vaultAbsPath = getCurrentVaultAbsolutePath(plugin);
					if (!vaultAbsPath) throw new Error("Vault path unavailable for conversion.");
					const normalizedFilePath = normalizePath(payload.filePath);
					if (!normalizedFilePath.startsWith(vaultAbsPath)) throw new Error("Path is outside the current vault.");
					const relativePath = normalizePath(path.relative(vaultAbsPath, normalizedFilePath));
					await modifyNoteContentByRelativePath(plugin, relativePath, payload.content);
					return { status: "success", data: null };
				} catch (modifyError) {
					const errorMsg = modifyError instanceof Error ? modifyError.message : String(modifyError);
					plugin.logError(`Error in modifyNoteContent (compat) for ${payload.filePath}: ${errorMsg}`);
					return { status: "error", error: `Failed to modify note: ${errorMsg}` };
				}
			case "modify_note_content_by_path": // Preferred action
				if (typeof payload?.path !== "string" || typeof payload?.content !== "string") return { status: "error", error: "Invalid payload: 'path' (relative vault path string) and 'content' (string) required." }; // Expecting relative path here
				try {
					await modifyNoteContentByRelativePath(plugin, payload.path, payload.content);
					return { status: "success", data: null };
				} catch (modifyError) {
					const errorMsg = modifyError instanceof Error ? modifyError.message : String(modifyError);
					plugin.logError(`Error in modifyNoteContentByPath for ${payload.path}: ${errorMsg}`);
					return { status: "error", error: `Failed to modify note: ${errorMsg}` };
				}
			case "open_note":
				if (typeof payload?.path !== "string") return { status: "error", error: "Invalid payload: 'path' (relative vault path string) required." };
				const newLeaf = typeof payload?.new_leaf === "boolean" ? payload.new_leaf : false;
				try {
					await openNote(plugin, payload.path, newLeaf);
					return { status: "success", data: null };
				} catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }

			// --- UI Interactions ---
			case "show_notification":
				if (typeof payload?.content !== "string") return { status: "error", error: "Invalid payload: 'content' (string) required." };
				const duration = typeof payload?.duration === "number" ? payload.duration : 4000;
				plugin.showNotification(payload.content, duration); // Use plugin's method directly for Notice
				return { status: "success", data: null };
			case "request_user_input":
				if (typeof payload?.scriptName !== "string" || typeof payload?.inputType !== "string" || typeof payload?.message !== "string") return { status: "error", error: "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required." };
				// Use plugin's method which handles the modal
				const userInput = await plugin.requestUserInput(payload.scriptName, payload.inputType, payload.message, payload.validationRegex, payload.minValue, payload.maxValue, payload.step);
				if (userInput === null) { plugin.logDebug("User cancelled input modal."); return { status: "error", error: "User cancelled input." }; }
				return { status: "success", data: userInput };

			// --- Internal/Test ---
			case "_test_connection_ping":
				plugin.logDebug("Received test connection ping from client.");
				return { status: "success", data: "pong" };

			// --- Script Settings Action ---
			case "get_script_settings":
				if (typeof payload?.scriptPath !== "string") return { status: "error", error: "Invalid payload: 'scriptPath' (relative path string) required." };
				const relativePath = normalizePath(payload.scriptPath);
				plugin.logDebug(`Requesting settings for script: ${relativePath}`);
				const definitions = plugin.settings.scriptSettingsDefinitions[relativePath] || [];
				const storedValues = plugin.settings.scriptSettingsValues[relativePath] || {};
				const finalValues: Record<string, any> = {};
				for (const def of definitions) { finalValues[def.key] = storedValues.hasOwnProperty(def.key) ? storedValues[def.key] : def.default; }
				plugin.logDebug(`Returning settings for ${relativePath}:`, finalValues);
				return { status: "success", data: finalValues };

			// --- New Obsidian API Actions ---
			case "get_obsidian_language":
				try { const lang = getObsidianLanguage(plugin); return { status: "success", data: lang }; }
				catch (error) { return { status: "error", error: `Failed to get Obsidian language: ${error instanceof Error ? error.message : String(error)}` }; }
			case "create_note":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				const noteContent = typeof payload?.content === "string" ? payload.content : "";
				try { await createNote(plugin, payload.path, noteContent); return { status: "success", data: null }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "check_path_exists":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				try { const exists = await checkPathExists(plugin, payload.path); return { status: "success", data: exists }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "delete_path":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				const permanently = typeof payload?.permanently === "boolean" ? payload.permanently : false;
				try { await deletePath(plugin, payload.path, permanently); return { status: "success", data: null }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "rename_path":
				if (typeof payload?.old_path !== "string" || !payload.old_path) return { status: "error", error: "Invalid payload: 'old_path' (non-empty string) required." };
				if (typeof payload?.new_path !== "string" || !payload.new_path) return { status: "error", error: "Invalid payload: 'new_path' (non-empty string) required." };
				try { await renamePath(plugin, payload.old_path, payload.new_path); return { status: "success", data: null }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "run_obsidian_command": // Still disabled
				if (typeof payload?.command_id !== "string" || !payload.command_id) return { status: "error", error: "Invalid payload: 'command_id' (non-empty string) required." };
				try { runObsidianCommand(plugin, payload.command_id); return { status: "success", data: null }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_all_tags": // Still disabled
				try { const tags = getAllTags(plugin); return { status: "success", data: tags }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_vault_name":
				try { const name = getVaultName(plugin); return { status: "success", data: name }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_theme_mode":
				try { const mode = getThemeMode(plugin); return { status: "success", data: mode }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "create_folder":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				try { await createFolder(plugin, payload.path); return { status: "success", data: null }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "list_folder":
				if (typeof payload?.path !== "string") return { status: "error", error: "Invalid payload: 'path' (string) required." };
				try { const contents = await listFolder(plugin, payload.path); return { status: "success", data: contents }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_links":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				// Only 'outgoing' is implemented in obsidian_api for now
				// const linkType = typeof payload?.type === "string" ? payload.type : 'outgoing';
				try { const links = getLinks(plugin, payload.path); return { status: "success", data: links }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_editor_context":
				try { const context = getEditorContext(plugin); return { status: "success", data: context }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }
			case "get_backlinks":
				if (typeof payload?.path !== "string" || !payload.path) return { status: "error", error: "Invalid payload: 'path' (non-empty string) required." };
				const targetPath = normalizePath(payload.path);
				const useCache = payload.use_cache_if_available ?? true;
				const cacheMode = payload.cache_mode === "safe" ? "safe" : "fast";
				try { const backlinks = await getBacklinks(plugin, targetPath, useCache, cacheMode); return { status: "success", data: backlinks }; }
				catch (error) { return { status: "error", error: error instanceof Error ? error.message : String(error) }; }

			// --- Event Listener Actions ---
			case "register_event_listener":
				if (typeof payload?.eventName !== "string" || !payload.eventName) return { status: "error", error: "Invalid payload: 'eventName' (string) required." };
				const scriptPathForRegister = payload.scriptPath;
				if (!scriptPathForRegister || typeof scriptPathForRegister !== "string") return { status: "error", error: "Internal error: Script path not provided in payload for registration." };
				const eventNameReg = payload.eventName;
				if (!plugin.eventListeners.has(eventNameReg)) plugin.eventListeners.set(eventNameReg, new Set());
				plugin.eventListeners.get(eventNameReg)?.add(scriptPathForRegister);
				plugin.logInfo(`Script '${scriptPathForRegister}' registered for event '${eventNameReg}'. Current listeners:`, plugin.eventListeners.get(eventNameReg));
				return { status: "success", data: null };
			case "unregister_event_listener":
				if (typeof payload?.eventName !== "string" || !payload.eventName) return { status: "error", error: "Invalid payload: 'eventName' (string) required." };
				const scriptPathForUnregister = payload.scriptPath;
				if (!scriptPathForUnregister || typeof scriptPathForUnregister !== "string") return { status: "error", error: "Internal error: Script path not provided in payload for unregistration." };
				const eventNameUnreg = payload.eventName;
				removeListener(plugin, eventNameUnreg, scriptPathForUnregister); // Use helper from event_handler
				plugin.logInfo(`Script '${scriptPathForUnregister}' unregistered from event '${eventNameUnreg}'.`);
				return { status: "success", data: null };

			// --- Default ---
			default:
				plugin.logWarn(`Received unknown action: ${action}`);
				return { status: "error", error: `Unknown action: ${action}` };
		}
	} catch (error) {
		// Catch errors from synchronous API calls or unexpected issues within the switch
		const errorMessage = error instanceof Error ? error.message : String(error);
		plugin.logError(`Error executing action "${action}":`, errorMessage);
		if (error instanceof Error && error.stack) plugin.logError("Stack trace:", error.stack);
		return { status: "error", error: `Failed to execute action "${action}": ${errorMessage}` };
	}
}
