// --- src/action_registry.ts ---
// Registry-based action definitions. Replaces the giant switch/case in action_handler.
// Each action defines an optional validator and an async executor that either
// returns data (on success) or throws an Error (on failure — caught by the dispatcher).

import * as path from 'path';
import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from './main';
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Validates payload fields — returns an error string, or null if valid. */
export type PayloadValidator = (
  payload: Record<string, unknown>
) => string | null;

/** Executes the action — returns response data, or throws on error. */
export type ActionExecutor = (
  plugin: ObsidianPythonBridge,
  payload: Record<string, unknown>
) => Promise<unknown>;

export interface ActionDefinition {
  validate?: PayloadValidator;
  execute: ActionExecutor;
}

// ---------------------------------------------------------------------------
// Reusable validators
// ---------------------------------------------------------------------------

/** Requires a field to be a non-empty string. */
export function requireString(field: string): PayloadValidator {
  return (p) =>
    typeof p[field] === 'string' && p[field]
      ? null
      : `Invalid payload: '${field}' (non-empty string) required.`;
}

/** Requires a field to be of type string (allows empty). */
export function requireStringType(field: string): PayloadValidator {
  return (p) =>
    typeof p[field] === 'string'
      ? null
      : `Invalid payload: '${field}' (string) required.`;
}

/** Requires a field to be of type number. */
export function requireNumber(field: string): PayloadValidator {
  return (p) =>
    typeof p[field] === 'number'
      ? null
      : `Invalid payload: '${field}' (number) required.`;
}

/** Requires multiple fields to be non-empty strings. */
export function requireStrings(...fields: string[]): PayloadValidator {
  return (p) => {
    for (const f of fields) {
      if (typeof p[f] !== 'string' || !p[f])
        return `Invalid payload: '${f}' (non-empty string) required.`;
    }
    return null;
  };
}

// ---------------------------------------------------------------------------
// Action registry
// ---------------------------------------------------------------------------

export const actionRegistry: Record<string, ActionDefinition> = {
  // =========================================================================
  // Vault / Note Info
  // =========================================================================

  get_all_note_paths: {
    execute: async (plugin, payload) => {
      const getAbsolutePaths =
        typeof payload === 'object' && payload?.absolute === true;
      return getAllNotePaths(plugin, getAbsolutePaths);
    },
  },

  get_active_note_content: {
    execute: async (plugin, payload) => {
      const returnFormat =
        typeof payload.return_format === 'string'
          ? payload.return_format
          : 'string';
      const content = await getActiveNoteContent(plugin, returnFormat);
      if (content === null) throw new Error('No active Markdown note found.');
      return content;
    },
  },

  get_active_note_relative_path: {
    execute: async (plugin) => {
      const p = getActiveNoteRelativePath(plugin);
      if (p === null) throw new Error('No active Markdown note found.');
      return p;
    },
  },

  get_active_note_absolute_path: {
    execute: async (plugin) => {
      const p = getActiveNoteAbsolutePath(plugin);
      if (p === null)
        throw new Error('No active note or vault path unavailable.');
      return p;
    },
  },

  get_active_note_title: {
    execute: async (plugin) => {
      const t = getActiveNoteTitle(plugin);
      if (t === null) throw new Error('No active Markdown note found.');
      return t;
    },
  },

  get_current_vault_absolute_path: {
    execute: async (plugin) => {
      const vp = getCurrentVaultAbsolutePath(plugin);
      if (vp === null)
        throw new Error('Could not determine vault absolute path.');
      return vp;
    },
  },

  get_active_note_frontmatter: {
    execute: async (plugin) => getActiveNoteFrontmatter(plugin),
  },

  get_note_content: {
    validate: requireStringType('path'),
    execute: async (plugin, payload) =>
      getNoteContentByPath(plugin, payload.path as string),
  },

  get_note_frontmatter: {
    validate: requireStringType('path'),
    execute: async (plugin, payload) =>
      getNoteFrontmatterByPath(plugin, payload.path as string),
  },

  // =========================================================================
  // Theme
  // =========================================================================

  toggle_theme: {
    execute: async (plugin) => {
      toggleTheme(plugin);
      return null;
    },
  },

  get_theme_mode: {
    execute: async (plugin) => getThemeMode(plugin),
  },

  // =========================================================================
  // Editor — Selection
  // =========================================================================

  get_selected_text: {
    execute: async (plugin) => getSelectedText(plugin),
  },

  replace_selected_text: {
    validate: requireStringType('replacement'),
    execute: async (plugin, payload) => {
      replaceSelectedText(plugin, payload.replacement as string);
      return null;
    },
  },

  get_editor_context: {
    execute: async (plugin) => getEditorContext(plugin),
  },

  // =========================================================================
  // Editor — Advanced cursor / line / range
  // =========================================================================

  set_cursor: {
    validate: (p) =>
      typeof p.line !== 'number' || typeof p.ch !== 'number'
        ? "Invalid payload: 'line' and 'ch' (numbers) required."
        : null,
    execute: async (plugin, payload) => {
      setCursor(plugin, payload.line as number, payload.ch as number);
      return null;
    },
  },

  get_line: {
    validate: requireNumber('line_number'),
    execute: async (plugin, payload) =>
      getLine(plugin, payload.line_number as number),
  },

  set_line: {
    validate: (p) =>
      typeof p.line_number !== 'number' || typeof p.text !== 'string'
        ? "Invalid payload: 'line_number' (number) and 'text' (string) required."
        : null,
    execute: async (plugin, payload) => {
      setLine(plugin, payload.line_number as number, payload.text as string);
      return null;
    },
  },

  replace_range: {
    validate: (p) =>
      typeof p.replacement !== 'string' ||
      typeof p.from_line !== 'number' ||
      typeof p.from_ch !== 'number'
        ? "Invalid payload: 'replacement' (string), 'from_line' and 'from_ch' (numbers) required."
        : null,
    execute: async (plugin, payload) => {
      replaceRange(
        plugin,
        payload.replacement as string,
        payload.from_line as number,
        payload.from_ch as number,
        payload.to_line as number | undefined,
        payload.to_ch as number | undefined
      );
      return null;
    },
  },

  scroll_into_view: {
    validate: (p) => {
      if (typeof p.from_line !== 'number' || typeof p.from_ch !== 'number')
        return "Invalid payload: 'from_line' and 'from_ch' (numbers) required.";
      if (p.to_line !== undefined && typeof p.to_line !== 'number')
        return "Invalid payload: 'to_line' must be a number if provided.";
      if (p.to_ch !== undefined && typeof p.to_ch !== 'number')
        return "Invalid payload: 'to_ch' must be a number if provided.";
      if (p.center !== undefined && typeof p.center !== 'boolean')
        return "Invalid payload: 'center' must be a boolean if provided.";
      return null;
    },
    execute: async (plugin, payload) => {
      scrollIntoView(
        plugin,
        payload.from_line as number,
        payload.from_ch as number,
        payload.to_line as number | undefined,
        payload.to_ch as number | undefined,
        payload.center as boolean | undefined
      );
      return null;
    },
  },

  // =========================================================================
  // Note CRUD / Modification
  // =========================================================================

  create_note: {
    validate: requireString('path'),
    execute: async (plugin, payload) => {
      const content =
        typeof payload.content === 'string' ? payload.content : '';
      return createNote(plugin, payload.path as string, content);
    },
  },

  check_path_exists: {
    validate: requireString('path'),
    execute: async (plugin, payload) =>
      checkPathExists(plugin, payload.path as string),
  },

  delete_path: {
    validate: requireString('path'),
    execute: async (plugin, payload) => {
      const permanently =
        typeof payload.permanently === 'boolean' ? payload.permanently : false;
      return deletePath(plugin, payload.path as string, permanently);
    },
  },

  rename_path: {
    validate: requireStrings('old_path', 'new_path'),
    execute: async (plugin, payload) =>
      renamePath(
        plugin,
        payload.old_path as string,
        payload.new_path as string
      ),
  },

  // --- Note content modification (two variants) ---

  modify_note_content: {
    // Backward-compatible action: accepts absolute file path, converts to relative
    validate: (p) =>
      typeof p.filePath !== 'string' || typeof p.content !== 'string'
        ? "Invalid payload: 'filePath' (absolute path string) and 'content' (string) required."
        : null,
    execute: async (plugin, payload) => {
      const vaultAbsPath = getCurrentVaultAbsolutePath(plugin);
      if (!vaultAbsPath)
        throw new Error('Vault path unavailable for conversion.');

      const receivedFilePath = payload.filePath as string;
      const vaultPathWithSeparator = vaultAbsPath.endsWith(path.sep)
        ? vaultAbsPath
        : vaultAbsPath + path.sep;

      if (!receivedFilePath.startsWith(vaultPathWithSeparator)) {
        throw new Error(
          `Path is outside the current vault. File='${receivedFilePath}' Vault='${vaultAbsPath}'`
        );
      }

      const relativePath = normalizePath(
        path.relative(vaultAbsPath, receivedFilePath)
      );
      await modifyNoteContentByRelativePath(
        plugin,
        relativePath,
        payload.content as string
      );
      return null;
    },
  },

  modify_note_content_by_path: {
    // Preferred action: accepts relative vault path directly
    validate: (p) =>
      typeof p.path !== 'string' || typeof p.content !== 'string'
        ? "Invalid payload: 'path' (relative vault path string) and 'content' (string) required."
        : null,
    execute: async (plugin, payload) => {
      await modifyNoteContentByRelativePath(
        plugin,
        payload.path as string,
        payload.content as string
      );
      return null;
    },
  },

  open_note: {
    validate: requireStringType('path'),
    execute: async (plugin, payload) => {
      const newLeaf =
        typeof payload.new_leaf === 'boolean' ? payload.new_leaf : false;
      return openNote(plugin, payload.path as string, newLeaf);
    },
  },

  // =========================================================================
  // Folder operations
  // =========================================================================

  create_folder: {
    validate: requireString('path'),
    execute: async (plugin, payload) =>
      createFolder(plugin, payload.path as string),
  },

  list_folder: {
    validate: requireStringType('path'),
    execute: async (plugin, payload) =>
      listFolder(plugin, payload.path as string),
  },

  // =========================================================================
  // Links & Backlinks
  // =========================================================================

  get_links: {
    validate: requireString('path'),
    execute: async (plugin, payload) =>
      getLinks(plugin, payload.path as string),
  },

  get_backlinks: {
    validate: (p) => {
      if (typeof p.path !== 'string' || !p.path)
        return "Invalid payload: 'path' (non-empty string) required.";
      if (
        p.use_cache_if_available !== undefined &&
        typeof p.use_cache_if_available !== 'boolean'
      )
        return "Invalid payload: 'use_cache_if_available' must be a boolean.";
      if (
        p.cache_mode !== undefined &&
        p.cache_mode !== 'fast' &&
        p.cache_mode !== 'safe'
      )
        return "Invalid payload: 'cache_mode' must be 'fast' or 'safe'.";
      return null;
    },
    execute: async (plugin, payload) => {
      const targetPath = normalizePath(payload.path as string);
      const useCache = (payload.use_cache_if_available as boolean) ?? true;
      const cacheMode = payload.cache_mode === 'safe' ? 'safe' : 'fast';
      return getBacklinks(plugin, targetPath, useCache, cacheMode);
    },
  },

  // =========================================================================
  // UI Interactions
  // =========================================================================

  show_notification: {
    validate: requireString('content'),
    execute: async (plugin, payload) => {
      const duration =
        typeof payload.duration === 'number' ? payload.duration : 4000;
      plugin.showNotification(payload.content as string, duration);
      return null;
    },
  },

  request_user_input: {
    validate: requireStrings('scriptName', 'inputType', 'message'),
    execute: async (plugin, payload) => {
      const result = await plugin.requestUserInput(
        payload.scriptName as string,
        payload.inputType as string,
        payload.message as string,
        payload.validationRegex as string | undefined,
        payload.minValue as number | undefined,
        payload.maxValue as number | undefined,
        payload.step as number | undefined
      );
      if (result === null) throw new Error('User cancelled input.');
      return result;
    },
  },

  // =========================================================================
  // Obsidian metadata
  // =========================================================================

  get_obsidian_language: {
    execute: async (plugin) => getObsidianLanguage(plugin),
  },

  get_all_tags: {
    execute: async (plugin) => getAllTags(plugin),
  },

  get_vault_name: {
    execute: async (plugin) => getVaultName(plugin),
  },

  run_obsidian_command: {
    validate: requireString('command_id'),
    execute: async (plugin, payload) => {
      runObsidianCommand(plugin, payload.command_id as string);
      return null;
    },
  },

  // =========================================================================
  // Script Settings
  // =========================================================================

  get_script_settings: {
    validate: requireStringType('scriptPath'),
    execute: async (plugin, payload) => {
      const relativePath = normalizePath(payload.scriptPath as string);
      const definitions =
        plugin.settings.scriptSettingsDefinitions[relativePath] || [];
      const storedValues =
        plugin.settings.scriptSettingsValues[relativePath] || {};

      // Merge: stored value wins, fallback to definition default
      const finalValues: Record<string, string | number | boolean> = {};
      for (const def of definitions) {
        finalValues[def.key] = Object.prototype.hasOwnProperty.call(
          storedValues,
          def.key
        )
          ? storedValues[def.key]
          : def.default;
      }
      return finalValues;
    },
  },

  // =========================================================================
  // Event Listener Management
  // =========================================================================

  register_event_listener: {
    validate: (p) => {
      if (typeof p.eventName !== 'string' || !p.eventName)
        return "Invalid payload: 'eventName' (string) required.";
      if (typeof p.scriptPath !== 'string' || !p.scriptPath)
        return 'Internal error: Script path not provided in payload for registration.';
      return null;
    },
    execute: async (plugin, payload) => {
      const eventName = payload.eventName as string;
      const scriptPath = payload.scriptPath as string;
      if (!plugin.eventListeners.has(eventName)) {
        plugin.eventListeners.set(eventName, new Set());
      }
      plugin.eventListeners.get(eventName)?.add(scriptPath);
      plugin.logInfo(
        `Script '${scriptPath}' registered for event '${eventName}'. Current listeners:`,
        plugin.eventListeners.get(eventName)
      );
      return null;
    },
  },

  unregister_event_listener: {
    validate: (p) => {
      if (typeof p.eventName !== 'string' || !p.eventName)
        return "Invalid payload: 'eventName' (string) required.";
      if (typeof p.scriptPath !== 'string' || !p.scriptPath)
        return 'Internal error: Script path not provided in payload for unregistration.';
      return null;
    },
    execute: async (plugin, payload) => {
      const eventName = payload.eventName as string;
      const scriptPath = payload.scriptPath as string;
      removeListener(plugin, eventName, scriptPath);
      plugin.logInfo(
        `Script '${scriptPath}' unregistered from event '${eventName}'.`
      );
      return null;
    },
  },

  // =========================================================================
  // Internal / Test
  // =========================================================================

  _test_connection_ping: {
    execute: async () => 'pong',
  },
};
