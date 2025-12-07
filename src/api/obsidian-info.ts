// --- src/api/obsidian-info.ts ---
// Gets Obsidian application information.

import type ObsidianPythonBridge from '../main';

/**
 * Gets the current language setting of Obsidian.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The language code (e.g., 'en', 'fr') or 'en' as default.
 */
export function getObsidianLanguage(plugin: ObsidianPythonBridge): string {
  try {
    // Use the official getLanguage API from Obsidian (requires minAppVersion 1.8.7)
    // @ts-ignore - getLanguage might not be in the type definitions yet
    const obsidianLang = (plugin.app as any).getLanguage();
    if (obsidianLang) {
      plugin.logDebug(`Obsidian language from getLanguage(): ${obsidianLang}`);
      return obsidianLang;
    }
  } catch (e) {
    plugin.logWarn('Could not get language via app.getLanguage()', e);
  }

  // Fallback to localStorage method for older versions or if getLanguage fails
  try {
    const obsidianLang = plugin.app.loadLocalStorage('language');
    if (obsidianLang) {
      plugin.logDebug(
        `Obsidian language from localStorage fallback: ${obsidianLang}`
      );
      return obsidianLang;
    }
  } catch (e) {
    plugin.logWarn('Could not get language via localStorage fallback', e);
  }

  try {
    // @ts-ignore - Accessing moment which is globally available in Obsidian
    const momentLocale = moment.locale();
    if (momentLocale) {
      plugin.logDebug(
        `Obsidian language from moment.locale() fallback: ${momentLocale}`
      );
      return momentLocale;
    }
  } catch (e) {
    plugin.logWarn('Could not get language via moment.locale() fallback', e);
  }

  plugin.logWarn("Could not determine Obsidian language, defaulting to 'en'.");
  return 'en';
}
