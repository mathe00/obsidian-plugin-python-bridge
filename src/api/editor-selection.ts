// --- src/api/editor-selection.ts ---
// Editor selection manipulation functions.

import { MarkdownView } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Gets the currently selected text in the active Markdown editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The selected text (can be an empty string if nothing is selected).
 * @throws Error if no Markdown view/editor is active.
 */
export function getSelectedText(plugin: ObsidianPythonBridge): string {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor) throw new Error('Active Markdown view does not have an editor instance.');
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
  if (!view) throw new Error('No active Markdown view found to replace selection in.');
  const editor = view.editor;
  if (!editor) throw new Error('Active Markdown view does not have an editor instance.');
  editor.replaceSelection(replacement);
}
