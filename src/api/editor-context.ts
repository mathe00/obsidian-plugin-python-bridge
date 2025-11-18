// --- src/api/editor-context.ts ---
// Retrieves context information about the active editor.

import { MarkdownView } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Retrieves context information about the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns An object with editor context, or null if no editor is active.
 * @throws Error if accessing editor properties fails unexpectedly.
 */
export function getEditorContext(
  plugin: ObsidianPythonBridge
): Record<string, any> | null {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view || !view.editor) {
    plugin.logDebug('No active Markdown editor found for get_editor_context.');
    return null;
  }
  const editor = view.editor;
  try {
    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();
    const context = {
      cursor: { line: cursor.line, ch: cursor.ch },
      line_count: lineCount,
    };
    plugin.logDebug('Retrieved editor context:', context);
    return context;
  } catch (error) {
    plugin.logError('Error retrieving editor context:', error);
    throw new Error(
      `Failed to get editor context: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
