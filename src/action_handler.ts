// --- src/action_handler.ts ---
// Handles dispatching incoming API actions to the appropriate functions.

import * as path from 'path'; // Import path module
import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from './main'; // Import the main plugin type
import type { JsonRequest, JsonResponse } from './types'; // Import types
// import { t } from './lang/translations'; // Import translation function (not used)

// Import functions from the new modules
import {
  getAllNotePaths,
  getActiveNoteContent,
  getActiveNoteRelativePath,
  getActiveNoteAbsolutePath,
  getActiveNoteTitle,
  getActiveNoteFrontmatter,
  getCurrentVaultAbsolutePath,
  getNoteContentByPath,
  getNoteFrontmatterByPath,
  getSelectedText,
  replaceSelectedText,
  getEditorContext,
  setCursor,
  getLine,
  setLine,
  replaceRange,
  scrollIntoView,
  openNote,
  toggleTheme,
  getObsidianLanguage,
  createNote,
  checkPathExists,
  deletePath,
  renamePath,
  runObsidianCommand,
  getAllTags,
  getVaultName,
  getThemeMode,
  createFolder,
  listFolder,
  getLinks,
  getBacklinks,
  modifyNoteContentByRelativePath,
} from './obsidian_api';
import { removeListener } from './event_handler';
import { logApiAction } from './audit_logger';

/**
 * Handles incoming JSON requests from the Python client.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param request The parsed JSON request object.
 * @returns A promise resolving to the JSON response object.
 */
export async function dispatchAction(
  plugin: ObsidianPythonBridge,
  request: JsonRequest
): Promise<JsonResponse> {
  const { action, payload } = request;
  plugin.logDebug(`Executing action: ${action} with payload:`, payload);

  // Extract source script from payload if available
  const sourceScript = payload?.scriptPath as string | undefined;

  try {
    switch (action) {
      // --- Vault/Note Info ---
      case 'get_all_note_paths': {
        // The payload structure is now { absolute?: boolean }
        // Default to false if not provided or if payload is undefined or not an object
        const getAbsolutePaths =
          typeof payload === 'object' &&
          payload !== null &&
          payload.absolute === true;
        try {
          // Call the updated function from obsidian_api.ts
          const paths = getAllNotePaths(plugin, getAbsolutePaths);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: paths };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          plugin.logError(
            `Error in get_all_note_paths (absolute=${getAbsolutePaths}): ${errorMsg}`
          );
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return {
            status: 'error',
            error: `Failed to get note paths: ${errorMsg}`,
          };
        }
      }
      case 'get_active_note_content': {
        const returnFormat =
          typeof payload === 'object' &&
          payload !== null &&
          typeof payload.return_format === 'string'
            ? payload.return_format
            : 'string';
        try {
          const activeContent = await getActiveNoteContent(
            plugin,
            returnFormat
          );
          if (activeContent !== null) {
            logApiAction(plugin, action, 'success', sourceScript);
            return { status: 'success', data: activeContent };
          } else {
            const errorMsg = 'No active Markdown note found.';
            logApiAction(plugin, action, 'error', sourceScript, errorMsg);
            return { status: 'error', error: errorMsg };
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          plugin.logError(
            `Error in get_active_note_content (format=${returnFormat}): ${errorMsg}`
          );
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return {
            status: 'error',
            error: `Failed to get active note content: ${errorMsg}`,
          };
        }
      }
      case 'get_active_note_relative_path': {
        const activeRelativePath = getActiveNoteRelativePath(plugin);
        if (activeRelativePath !== null) {
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: activeRelativePath };
        } else {
          const errorMsg = 'No active Markdown note found.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'get_active_note_absolute_path': {
        const activeAbsolutePath = getActiveNoteAbsolutePath(plugin);
        if (activeAbsolutePath !== null) {
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: activeAbsolutePath };
        } else {
          const errorMsg = 'No active note or vault path unavailable.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'get_active_note_title': {
        const activeTitle = getActiveNoteTitle(plugin);
        if (activeTitle !== null) {
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: activeTitle };
        } else {
          const errorMsg = 'No active Markdown note found.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'get_current_vault_absolute_path': {
        const vaultPath = getCurrentVaultAbsolutePath(plugin);
        if (vaultPath !== null) {
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: vaultPath };
        } else {
          const errorMsg = 'Could not determine vault absolute path.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'get_active_note_frontmatter':
        try {
          const activeFrontmatter = getActiveNoteFrontmatter(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: activeFrontmatter };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_note_content':
        if (typeof payload?.path !== 'string') {
          const errorMsg = "Invalid payload: 'path' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const content = await getNoteContentByPath(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: content };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }

      // --- Theme Management Actions ---
      // Note: Due to Obsidian API changes, only toggle_theme is supported.
      case 'toggle_theme':
        try {
          toggleTheme(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          plugin.logError(`Error in toggle_theme: ${errorMsg}`);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return {
            status: 'error',
            error: `Failed to toggle theme: ${errorMsg}`,
          };
        }
      case 'get_note_frontmatter':
        if (typeof payload?.path !== 'string') {
          const errorMsg = "Invalid payload: 'path' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const frontmatter = getNoteFrontmatterByPath(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: frontmatter };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }

      // --- Editor Actions ---
      case 'get_selected_text':
        try {
          const selectedText = getSelectedText(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: selectedText };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'replace_selected_text':
        if (typeof payload?.replacement !== 'string') {
          const errorMsg = "Invalid payload: 'replacement' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          replaceSelectedText(plugin, payload.replacement);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }

      // --- Note Modification/Opening ---
      case 'modify_note_content': // Kept for backward compatibility
        // Check if payload and required fields exist and have the correct type
        if (
          typeof payload?.filePath !== 'string' ||
          typeof payload?.content !== 'string'
        ) {
          return {
            status: 'error',
            error:
              "Invalid payload: 'filePath' (absolute path string) and 'content' (string) required.",
          };
        }
        try {
          // Get the absolute path of the vault
          const vaultAbsPath = getCurrentVaultAbsolutePath(plugin);
          if (!vaultAbsPath) {
            throw new Error('Vault path unavailable for conversion.');
          }

          // --- FIX: Do NOT normalize the absolute path received from Python ---
          // Assume the path received from the Python client is already the correct absolute path for the OS.
          const receivedFilePath = payload.filePath;
          // Optional: Add a check here if needed, e.g., using path.isAbsolute(receivedFilePath)
          // if (!path.isAbsolute(receivedFilePath)) {
          //     plugin.logError(`Received non-absolute path in modify_note_content: ${receivedFilePath}`);
          //     throw new Error(`Received non-absolute path: ${receivedFilePath}`);
          // }

          // Ensure the vault path ends with a path separator for reliable comparison
          const vaultPathWithSeparator = vaultAbsPath.endsWith(path.sep)
            ? vaultAbsPath
            : vaultAbsPath + path.sep;

          // Check if the received file path starts with the vault path (including separator)
          // Use the received path directly, without normalizePath()
          if (!receivedFilePath.startsWith(vaultPathWithSeparator)) {
            plugin.logError(
              `Path Mismatch Debug: File='${receivedFilePath}' Vault='${vaultAbsPath}' VaultWithSep='${vaultPathWithSeparator}'`
            );
            throw new Error('Path is outside the current vault.');
          }

          // Calculate the relative path from the vault root to the file
          // Use the original vaultAbsPath and the received path here
          const relativePath = normalizePath(
            path.relative(vaultAbsPath, receivedFilePath)
          );

          // Call the internal function that modifies content using the relative path
          await modifyNoteContentByRelativePath(
            plugin,
            relativePath,
            payload.content
          );

          // Return success if modification was successful
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (modifyError) {
          // Catch any errors during the process
          const errorMsg =
            modifyError instanceof Error
              ? modifyError.message
              : String(modifyError);
          plugin.logError(
            `Error in modifyNoteContent (compat) for ${payload.filePath}: ${errorMsg}`
          );
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          // Return an error response to the Python client
          return {
            status: 'error',
            error: `Failed to modify note: ${errorMsg}`,
          };
        }
      // The case "modify_note_content_by_path" remains unchanged as it uses relative paths
      case 'modify_note_content_by_path': // Preferred action
        // Check if payload and required fields exist and have the correct type
        if (
          typeof payload?.path !== 'string' ||
          typeof payload?.content !== 'string'
        ) {
          return {
            status: 'error',
            error:
              "Invalid payload: 'path' (relative vault path string) and 'content' (string) required.",
          };
        }
        try {
          // Directly call the modification function with the relative path
          await modifyNoteContentByRelativePath(
            plugin,
            payload.path,
            payload.content
          );
          // Return success
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (modifyError) {
          // Catch errors during modification
          const errorMsg =
            modifyError instanceof Error
              ? modifyError.message
              : String(modifyError);
          plugin.logError(
            `Error in modifyNoteContentByPath for ${payload.path}: ${errorMsg}`
          );
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          // Return an error response
          return {
            status: 'error',
            error: `Failed to modify note: ${errorMsg}`,
          };
        }

      case 'open_note': {
        if (typeof payload?.path !== 'string') {
          const errorMsg =
            "Invalid payload: 'path' (relative vault path string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const newLeaf =
          typeof payload?.new_leaf === 'boolean' ? payload.new_leaf : false;
        try {
          await openNote(plugin, payload.path, newLeaf);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }

      // --- UI Interactions ---
      case 'show_notification': {
        if (typeof payload?.content !== 'string') {
          const errorMsg = "Invalid payload: 'content' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const duration =
          typeof payload?.duration === 'number' ? payload.duration : 4000;
        try {
          plugin.showNotification(payload.content, duration); // Use plugin's method directly for Notice
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'request_user_input':
        if (
          typeof payload?.scriptName !== 'string' ||
          typeof payload?.inputType !== 'string' ||
          typeof payload?.message !== 'string'
        ) {
          const errorMsg =
            "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        // Use plugin's method which handles the modal
        try {
          const userInput = await plugin.requestUserInput(
            payload.scriptName,
            payload.inputType,
            payload.message,
            payload.validationRegex as string | undefined,
            payload.minValue as number | undefined,
            payload.maxValue as number | undefined,
            payload.step as number | undefined
          );
          if (userInput === null) {
            plugin.logDebug('User cancelled input modal.');
            const errorMsg = 'User cancelled input.';
            logApiAction(plugin, action, 'error', sourceScript, errorMsg);
            return { status: 'error', error: errorMsg };
          }
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: userInput };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }

      // --- Internal/Test ---
      case '_test_connection_ping':
        plugin.logDebug('Received test connection ping from client.');
        logApiAction(plugin, action, 'success', sourceScript);
        return { status: 'success', data: 'pong' };

      // --- Script Settings Action ---
      case 'get_script_settings':
        if (typeof payload?.scriptPath !== 'string') {
          const errorMsg =
            "Invalid payload: 'scriptPath' (relative path string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const relativePath = normalizePath(payload.scriptPath);
          plugin.logDebug(`Requesting settings for script: ${relativePath}`);
          const definitions =
            plugin.settings.scriptSettingsDefinitions[relativePath] || [];
          const storedValues =
            plugin.settings.scriptSettingsValues[relativePath] || {};
          const finalValues: Record<string, string | number | boolean> = {};
          for (const def of definitions) {
            finalValues[def.key] = Object.prototype.hasOwnProperty.call(
              storedValues,
              def.key
            )
              ? storedValues[def.key]
              : def.default;
          }
          plugin.logDebug(
            `Returning settings for ${relativePath}:`,
            finalValues
          );
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: finalValues };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }

      // --- New Obsidian API Actions ---
      case 'get_obsidian_language':
        try {
          const lang = getObsidianLanguage(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: lang };
        } catch (error) {
          const errorMsg = `Failed to get Obsidian language: ${error instanceof Error ? error.message : String(error)}`;
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'create_note': {
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const noteContent =
          typeof payload?.content === 'string' ? payload.content : '';
        try {
          await createNote(plugin, payload.path, noteContent);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'check_path_exists':
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const exists = await checkPathExists(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: exists };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'delete_path': {
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const permanently =
          typeof payload?.permanently === 'boolean'
            ? payload.permanently
            : false;
        try {
          await deletePath(plugin, payload.path, permanently);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }
      case 'rename_path':
        if (typeof payload?.old_path !== 'string' || !payload.old_path) {
          const errorMsg =
            "Invalid payload: 'old_path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        if (typeof payload?.new_path !== 'string' || !payload.new_path) {
          const errorMsg =
            "Invalid payload: 'new_path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          await renamePath(plugin, payload.old_path, payload.new_path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'run_obsidian_command':
        if (typeof payload?.command_id !== 'string' || !payload.command_id) {
          const errorMsg =
            "Invalid payload: 'command_id' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          runObsidianCommand(plugin, payload.command_id);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_all_tags':
        try {
          const tags = getAllTags(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: tags };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_vault_name':
        try {
          const name = getVaultName(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: name };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_theme_mode':
        try {
          const mode = getThemeMode(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: mode };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'create_folder':
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          await createFolder(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'list_folder':
        if (typeof payload?.path !== 'string') {
          const errorMsg = "Invalid payload: 'path' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const contents = await listFolder(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: contents };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_links':
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        // Only 'outgoing' is implemented in obsidian_api for now
        // const linkType = typeof payload?.type === "string" ? payload.type : 'outgoing';
        try {
          const links = getLinks(plugin, payload.path);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: links };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_editor_context':
        try {
          const context = getEditorContext(plugin);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: context };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'set_cursor':
        if (
          typeof payload?.line !== 'number' ||
          typeof payload?.ch !== 'number'
        ) {
          const errorMsg =
            "Invalid payload: 'line' and 'ch' (numbers) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          setCursor(plugin, payload.line, payload.ch);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_line':
        if (typeof payload?.line_number !== 'number') {
          const errorMsg = "Invalid payload: 'line_number' (number) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          const lineContent = getLine(plugin, payload.line_number);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: lineContent };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'set_line':
        if (
          typeof payload?.line_number !== 'number' ||
          typeof payload?.text !== 'string'
        ) {
          const errorMsg =
            "Invalid payload: 'line_number' (number) and 'text' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          setLine(plugin, payload.line_number, payload.text);
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'replace_range':
        if (
          typeof payload?.replacement !== 'string' ||
          typeof payload?.from_line !== 'number' ||
          typeof payload?.from_ch !== 'number'
        ) {
          const errorMsg =
            "Invalid payload: 'replacement' (string), 'from_line' and 'from_ch' (numbers) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          replaceRange(
            plugin,
            payload.replacement,
            payload.from_line,
            payload.from_ch,
            payload.to_line as number,
            payload.to_ch as number
          );
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'scroll_into_view':
        if (
          typeof payload?.from_line !== 'number' ||
          typeof payload?.from_ch !== 'number' ||
          (payload.to_line !== undefined &&
            typeof payload.to_line !== 'number') ||
          (payload.to_ch !== undefined && typeof payload.to_ch !== 'number') ||
          (payload.center !== undefined && typeof payload.center !== 'boolean')
        ) {
          const errorMsg =
            "Invalid payload: 'from_line' and 'from_ch' (numbers) required, 'to_line', 'to_ch' (optional numbers), and 'center' (optional boolean) must be correct types.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        try {
          scrollIntoView(
            plugin,
            payload.from_line,
            payload.from_ch,
            payload.to_line,
            payload.to_ch,
            payload.center
          );
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: null };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      case 'get_backlinks': {
        if (typeof payload?.path !== 'string' || !payload.path) {
          const errorMsg =
            "Invalid payload: 'path' (non-empty string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        if (
          payload.use_cache_if_available !== undefined &&
          typeof payload.use_cache_if_available !== 'boolean'
        ) {
          const errorMsg =
            "Invalid payload: 'use_cache_if_available' must be a boolean.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        if (
          payload.cache_mode !== undefined &&
          payload.cache_mode !== 'fast' &&
          payload.cache_mode !== 'safe'
        ) {
          const errorMsg =
            "Invalid payload: 'cache_mode' must be 'fast' or 'safe'.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const targetPath = normalizePath(payload.path);
        const useCache = payload.use_cache_if_available ?? true;
        const cacheMode = payload.cache_mode === 'safe' ? 'safe' : 'fast';
        try {
          const backlinks = await getBacklinks(
            plugin,
            targetPath,
            useCache,
            cacheMode
          );
          logApiAction(plugin, action, 'success', sourceScript);
          return { status: 'success', data: backlinks };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
      }

      // --- Event Listener Actions ---
      case 'register_event_listener': {
        if (typeof payload?.eventName !== 'string' || !payload.eventName) {
          const errorMsg = "Invalid payload: 'eventName' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const scriptPathForRegister = payload.scriptPath;
        if (
          !scriptPathForRegister ||
          typeof scriptPathForRegister !== 'string'
        ) {
          const errorMsg =
            'Internal error: Script path not provided in payload for registration.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const eventNameReg = payload.eventName;
        if (!plugin.eventListeners.has(eventNameReg))
          plugin.eventListeners.set(eventNameReg, new Set());
        plugin.eventListeners.get(eventNameReg)?.add(scriptPathForRegister);
        plugin.logInfo(
          `Script '${scriptPathForRegister}' registered for event '${eventNameReg}'. Current listeners:`,
          plugin.eventListeners.get(eventNameReg)
        );
        logApiAction(plugin, action, 'success', sourceScript);
        return { status: 'success', data: null };
      }
      case 'unregister_event_listener': {
        if (typeof payload?.eventName !== 'string' || !payload.eventName) {
          const errorMsg = "Invalid payload: 'eventName' (string) required.";
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const scriptPathForUnregister = payload.scriptPath;
        if (
          !scriptPathForUnregister ||
          typeof scriptPathForUnregister !== 'string'
        ) {
          const errorMsg =
            'Internal error: Script path not provided in payload for unregistration.';
          logApiAction(plugin, action, 'error', sourceScript, errorMsg);
          return { status: 'error', error: errorMsg };
        }
        const eventNameUnreg = payload.eventName;
        removeListener(plugin, eventNameUnreg, scriptPathForUnregister); // Use helper from event_handler
        plugin.logInfo(
          `Script '${scriptPathForUnregister}' unregistered from event '${eventNameUnreg}'.`
        );
        logApiAction(plugin, action, 'success', sourceScript);
        return { status: 'success', data: null };
      }

      // --- Default ---
      default: {
        const errorMsg = `Unknown action: ${action}`;
        plugin.logWarn(`Received unknown action: ${action}`);
        logApiAction(plugin, action, 'error', sourceScript, errorMsg);
        return { status: 'error', error: errorMsg };
      }
    }
  } catch (error) {
    // Catch errors from synchronous API calls or unexpected issues within the switch
    const errorMessage = error instanceof Error ? error.message : String(error);
    plugin.logError(`Error executing action "${action}":`, errorMessage);
    if (error instanceof Error && error.stack)
      plugin.logError('Stack trace:', error.stack);

    await logApiAction(plugin, action, 'error', sourceScript, errorMessage);

    return {
      status: 'error',
      error: `Failed to execute action "${action}": ${errorMessage}`,
    };
  }
}
