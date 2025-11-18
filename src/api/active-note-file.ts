// --- src/api/active-note-file.ts ---
// Gets the TFile object for the currently active Markdown note.

import { TFile, MarkdownView } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the TFile object for the currently active Markdown note.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The TFile object or null if no Markdown view is active.
 */
export function getActiveNoteFile(plugin: ObsidianPythonBridge): TFile | null {
  const activeView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  return activeView?.file ?? null;
}
