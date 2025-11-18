// --- src/obsidian_api.ts ---
// Index file that re-exports all API functions from individual modules.
// This maintains backward compatibility while providing a modular structure.

// Active Note Operations
export { getActiveNoteFile } from './api/active-note-file';
export { getActiveNoteContent } from './api/active-note-content';
export {
  getActiveNoteRelativePath,
  getActiveNoteAbsolutePath,
  getActiveNoteTitle,
} from './api/active-note-path';
export { getActiveNoteFrontmatter } from './api/active-note-frontmatter';

// Vault Operations
export {
  getCurrentVaultAbsolutePath,
  getAllNotePaths,
  getVaultName,
} from './api/vault-info';
export {
  getNoteContentByPath,
  modifyNoteContentByRelativePath,
} from './api/note-content';
export { getNoteFrontmatterByPath } from './api/note-frontmatter';
export {
  createNote,
  checkPathExists,
  deletePath,
  renamePath,
} from './api/note-crud';
export { createFolder, listFolder } from './api/folder-operations';

// Link Operations
export { getLinks } from './api/links';
export { getBacklinks } from './api/backlinks';

// Editor Operations
export { getSelectedText, replaceSelectedText } from './api/editor-selection';
export { getEditorContext } from './api/editor-context';
export {
  setCursor,
  getLine,
  setLine,
  replaceRange,
  scrollIntoView,
} from './api/advanced-editor';
export { openNote } from './api/note-opening';

// Theme Operations
export { getThemeMode } from './api/theme-mode';
export { toggleTheme } from './api/theme-control';

// Utility Operations
export { getObsidianLanguage } from './api/obsidian-info';
export { runObsidianCommand } from './api/commands';
export { getAllTags } from './api/tags';
