// --- src/api/theme-control.ts ---
// Theme setting and toggling functionality.

import type ObsidianPythonBridge from '../main';
import { getThemeMode } from './theme-mode';

/**
 * Sets the Obsidian theme to light or dark mode, inspired by ThemeDesignUtilities.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param mode The desired theme mode: 'light' or 'dark'.
 * @throws Error if setting the theme fails.
 */
export function setTheme(plugin: ObsidianPythonBridge, mode: 'light' | 'dark'): void {
  plugin.logDebug(`Attempting to set theme to: ${mode}`);

  const lightThemeName = 'moonstone'; // Default light theme
  const darkThemeName = 'obsidian'; // Default dark theme (confusingly named 'obsidian')

  const targetThemeToSetConfig = mode === 'light' ? lightThemeName : darkThemeName;
  const targetThemeToApplyVisual = mode === 'light' ? lightThemeName : darkThemeName;

  try {
    // 1. Set the visual theme using app.setTheme (if available) or app.changeTheme
    // @ts-ignore: setTheme might exist on app but not in typings
    if (typeof plugin.app.setTheme === 'function') {
      // @ts-ignore
      plugin.app.setTheme(targetThemeToApplyVisual);
      plugin.logInfo(
        `Visual theme set to ${mode} (using ${targetThemeToApplyVisual}) via app.setTheme.`
      );
      // @ts-ignore: changeTheme might exist on app but not in typings
    } else if (typeof plugin.app.changeTheme === 'function') {
      // @ts-ignore
      plugin.app.changeTheme(targetThemeToApplyVisual);
      plugin.logInfo(
        `Visual theme set to ${mode} (using ${targetThemeToApplyVisual}) via app.changeTheme.`
      );
    } else {
      // Fallback visual change
      document.body.removeClass('theme-light', 'theme-dark');
      document.body.addClass(mode === 'dark' ? 'theme-dark' : 'theme-light');
      plugin.logWarn(
        'Neither app.setTheme nor app.changeTheme found. Used direct body class manipulation.'
      );
    }

    // 2. Set the persistent configuration using app.vault.setConfig
    // We use @ts-ignore because your compiler reported errors with these on Vault.
    // This assumes the methods exist but are not typed.
    // @ts-ignore TS2339: Property 'getConfig' does not exist on type 'Vault'.
    const currentConfiguredTheme = plugin.app.vault.getConfig('theme');
    plugin.logDebug(`Current configured theme in vault: ${currentConfiguredTheme}`);

    // @ts-ignore TS2339: Property 'setConfig' does not exist on type 'Vault'.
    if (currentConfiguredTheme !== targetThemeToSetConfig) {
      // @ts-ignore TS2339: Property 'setConfig' does not exist on type 'Vault'.
      plugin.app.vault.setConfig('theme', targetThemeToSetConfig);
      plugin.logInfo(`Persistent theme config set to: ${targetThemeToSetConfig}`);
    } else {
      plugin.logDebug(`Persistent theme config already matched: ${targetThemeToSetConfig}.`);
    }

    // 3. Trigger a CSS change to ensure UI updates
    plugin.app.workspace.trigger('css-change');
    plugin.logDebug("Triggered 'css-change'.");
  } catch (error) {
    plugin.logError(`Error setting theme to ${mode}:`, error);
    throw new Error(
      `Failed to set theme to "${mode}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Toggles the Obsidian theme between light and dark mode.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @throws Error if toggling the theme fails.
 */
export function toggleTheme(plugin: ObsidianPythonBridge): void {
  plugin.logDebug('Attempting to toggle theme.');
  const currentMode = getThemeMode(plugin); // Visual check based on body class
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  try {
    setTheme(plugin, newMode); // setTheme now correctly uses app.setConfig/getConfig
    plugin.logInfo(`Theme successfully toggled to ${newMode}.`);
  } catch (error) {
    // setTheme already logs the specific error
    plugin.logError('Error toggling theme.'); // General toggle error
    throw new Error(
      `Failed to toggle theme: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
