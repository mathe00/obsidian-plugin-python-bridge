// --- src/api/advanced-editor.ts ---
// Advanced editor operations for fine-grained control.

import { MarkdownView } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Sets the cursor position in the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param line The line number (0-based).
 * @param ch The character position within the line (0-based).
 * @throws Error if no Markdown view/editor is active.
 */
export function setCursor(
  plugin: ObsidianPythonBridge,
  line: number,
  ch: number
): void {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor)
    throw new Error('Active Markdown view does not have an editor instance.');

  editor.setCursor({ line, ch });
  plugin.logDebug(`Cursor set to line ${line}, character ${ch}`);
}

/**
 * Gets the content of a specific line in the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param lineNumber The line number (0-based).
 * @returns The content of the specified line.
 * @throws Error if no Markdown view/editor is active or line number is invalid.
 */
export function getLine(
  plugin: ObsidianPythonBridge,
  lineNumber: number
): string {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor)
    throw new Error('Active Markdown view does not have an editor instance.');

  if (lineNumber < 0 || lineNumber >= editor.lineCount()) {
    throw new Error(
      `Line number ${lineNumber} is out of range (0-${editor.lineCount() - 1})`
    );
  }

  const lineContent = editor.getLine(lineNumber);
  plugin.logDebug(`Retrieved line ${lineNumber}: "${lineContent}"`);
  return lineContent;
}

/**
 * Replaces the entire content of a specific line in the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param lineNumber The line number (0-based).
 * @param text The new text content for the line.
 * @throws Error if no Markdown view/editor is active or line number is invalid.
 */
export function setLine(
  plugin: ObsidianPythonBridge,
  lineNumber: number,
  text: string
): void {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor)
    throw new Error('Active Markdown view does not have an editor instance.');

  if (lineNumber < 0 || lineNumber >= editor.lineCount()) {
    throw new Error(
      `Line number ${lineNumber} is out of range (0-${editor.lineCount() - 1})`
    );
  }

  editor.setLine(lineNumber, text);
  plugin.logDebug(`Set line ${lineNumber} to: "${text}"`);
}

/**
 * Replaces text in a specific range in the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param replacement The text to insert.
 * @param fromLine The starting line number (0-based).
 * @param fromCh The starting character position (0-based).
 * @param toLine The ending line number (0-based). If omitted, uses fromLine.
 * @param toCh The ending character position (0-based). If omitted, uses fromCh.
 * @throws Error if no Markdown view/editor is active or positions are invalid.
 */
export function replaceRange(
  plugin: ObsidianPythonBridge,
  replacement: string,
  fromLine: number,
  fromCh: number,
  toLine?: number,
  toCh?: number
): void {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor)
    throw new Error('Active Markdown view does not have an editor instance.');

  const from = { line: fromLine, ch: fromCh };
  const to = {
    line: toLine !== undefined ? toLine : fromLine,
    ch: toCh !== undefined ? toCh : fromCh,
  };

  // Validate positions
  const lineCount = editor.lineCount();
  if (
    from.line < 0 ||
    from.line >= lineCount ||
    to.line < 0 ||
    to.line >= lineCount
  ) {
    throw new Error(`Line positions out of range (0-${lineCount - 1})`);
  }

  editor.replaceRange(replacement, from, to);
  plugin.logDebug(
    `Replaced range from (${fromLine},${fromCh}) to (${to.line},${to.ch}) with: "${replacement}"`
  );
}

/**
 * Scrolls a specific range into view in the active editor.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param fromLine The starting line number (0-based).
 * @param fromCh The starting character position (0-based).
 * @param toLine The ending line number (0-based). If omitted, uses fromLine.
 * @param toCh The ending character position (0-based). If omitted, uses fromCh.
 * @param center Whether to center the range in view. Default is false.
 * @throws Error if no Markdown view/editor is active or positions are invalid.
 */
export function scrollIntoView(
  plugin: ObsidianPythonBridge,
  fromLine: number,
  fromCh: number,
  toLine?: number,
  toCh?: number,
  center = false
): void {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) throw new Error('No active Markdown view found.');
  const editor = view.editor;
  if (!editor)
    throw new Error('Active Markdown view does not have an editor instance.');

  const from = { line: fromLine, ch: fromCh };
  const to = {
    line: toLine !== undefined ? toLine : fromLine,
    ch: toCh !== undefined ? toCh : fromCh,
  };

  // Validate positions
  const lineCount = editor.lineCount();
  if (
    from.line < 0 ||
    from.line >= lineCount ||
    to.line < 0 ||
    to.line >= lineCount
  ) {
    throw new Error(`Line positions out of range (0-${lineCount - 1})`);
  }

  editor.scrollIntoView({ from, to }, center);
  plugin.logDebug(
    `Scrolled range from (${fromLine},${fromCh}) to (${to.line},${to.ch}) into view (center: ${center})`
  );
}
