// --- src/api/theme-mode.ts ---
// Theme mode detection and control.

import type ObsidianPythonBridge from '../main';

/**
 * Determines the current theme mode (light or dark).
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns 'light' or 'dark'.
 * @throws Error if checking fails.
 */
export function getThemeMode(plugin: ObsidianPythonBridge): 'light' | 'dark' {
  try {
    const isDark = document.body.classList.contains('theme-dark');
    const mode = isDark ? 'dark' : 'light';
    plugin.logDebug(`Determined theme mode: ${mode}`);
    return mode;
  } catch (error) {
    plugin.logError('Error checking document.body for theme class:', error);
    throw new Error(
      `Failed to determine theme mode: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
