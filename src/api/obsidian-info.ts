// --- src/api/obsidian-info.ts ---
// Gets Obsidian application information.

import type ObsidianPythonBridge from '../main';

/**
 * Gets the current language setting of Obsidian.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @returns The language code (e.g., 'en', 'fr') or 'en' as default.
 */
export function getObsidianLanguage(plugin: ObsidianPythonBridge): string {
  const obsidianLang = plugin.app.loadLocalStorage('language');
  if (obsidianLang) {
    plugin.logDebug(`Obsidian language from localStorage: ${obsidianLang}`);
    return obsidianLang;
  }
  try {
    // @ts-ignore - Accessing moment which is globally available in Obsidian
    const momentLocale = moment.locale();
    if (momentLocale) {
      plugin.logDebug(
        `Obsidian language from moment.locale(): ${momentLocale}`
      );
      return momentLocale;
    }
  } catch (e) {
    plugin.logWarn('Could not get language via moment.locale()', e);
  }
  plugin.logWarn("Could not determine Obsidian language, defaulting to 'en'.");
  return 'en';
}
