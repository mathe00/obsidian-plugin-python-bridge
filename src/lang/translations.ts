// --- src/lang/translations.ts ---
import { Notice } from "obsidian";
import * as moment from "moment";
import ObsidianPythonBridge from "../main"; // Import the main plugin class type

// Import language files
import en from "./en";
import fr from "./fr";
import es from "./es";
import de from "./de";
import zh from "./zh";
import ar from "./ar";
import pt from "./pt";
import ru from "./ru";
import ja from "./ja";
import hi from "./hi";
import ko from "./ko";
import it from "./it";
import tr from "./tr";
import id from "./id";
import pl from "./pl";

// Define the structure of the translation object
interface TranslationSet {
	[key: string]: string;
}

// Register all available languages with their translation objects
const translations: Record<string, TranslationSet> = {
	en, fr, es, de, zh, ar, pt, ru, ja, hi, ko, it, tr, id, pl,
};

// Define display names for languages (in their own language ideally)
export const languageDisplayNames: Record<string, string> = {
	auto: "Automatic (Obsidian Language)", // Special key for automatic detection
	en: "English",
	fr: "Français",
	es: "Español",
	de: "Deutsch",
	zh: "中文",
	ar: "العربية",
	pt: "Português",
	ru: "Русский",
	ja: "日本語",
	hi: "हिन्दी",
	ko: "한국어",
	it: "Italiano",
	tr: "Türkçe",
	id: "Bahasa Indonesia",
	pl: "Polski",
};

let activeTranslations: TranslationSet = en; // Default to English

/**
 * Loads the translations based on the plugin setting or Obsidian's locale.
 * @param plugin The instance of the ObsidianPythonBridge plugin to access settings.
 */
export function loadTranslations(plugin: ObsidianPythonBridge): void {
	const userChoice = plugin.settings.pluginLanguage;
	let targetLocale: string | null = null;

	console.log(`Obsidian Python Bridge: User language choice: ${userChoice}`);

	// 1. Check user's explicit choice in settings
	if (userChoice && userChoice !== 'auto' && translations[userChoice]) {
		targetLocale = userChoice;
		console.log(`Obsidian Python Bridge: Using locale from plugin setting: ${targetLocale}`);
	}
	// 2. If choice is 'auto' or invalid, use detection logic
	else {
		const storageLocale = window.localStorage.getItem("language");
		const momentLocale = moment.locale();
		console.log(`Obsidian Python Bridge: Debug Locales - localStorage: ${storageLocale}, moment.locale(): ${momentLocale}`);

		if (storageLocale && typeof storageLocale === "string") {
			targetLocale = storageLocale;
			console.log(`Obsidian Python Bridge: Using locale from localStorage: ${targetLocale}`);
		} else if (momentLocale) {
			targetLocale = momentLocale;
			console.log(`Obsidian Python Bridge: localStorage empty, using locale from moment.locale(): ${targetLocale}`);
		} else {
			console.log(`Obsidian Python Bridge: Both localStorage and moment.locale() are unavailable.`);
		}
	}

	// Now, load translations based on the determined targetLocale
	if (targetLocale && translations[targetLocale]) {
		// Exact match (e.g., 'fr', 'en')
		activeTranslations = translations[targetLocale];
		console.log(`Obsidian Python Bridge: Loaded translations for exact locale '${targetLocale}'`);
	} else if (targetLocale) {
		// Try base language if exact match failed (e.g., 'en' from 'en-gb')
		const baseLocale = targetLocale.split("-")[0];
		if (translations[baseLocale]) {
			activeTranslations = translations[baseLocale];
			console.log(`Obsidian Python Bridge: Loaded translations for base locale '${baseLocale}' (from '${targetLocale}')`);
		} else {
			// Fallback to English if neither exact nor base locale is found
			activeTranslations = en;
			console.log(`Obsidian Python Bridge: Locale '${targetLocale}' (or base '${baseLocale}') not found, falling back to 'en'.`);
		}
	} else {
		// Fallback to English if no locale could be determined
		activeTranslations = en;
		console.log(`Obsidian Python Bridge: No target locale determined, falling back to 'en'.`);
	}
}

/**
 * Gets the translated string for a given key.
 * @param key The key of the string to translate.
 * @returns The translated string, or the key itself if not found.
 */
export function t(key: string): string {
	return activeTranslations[key] ?? key;
}

/**
 * Returns a dictionary of available language codes mapped to their display names.
 * Includes the 'auto' option.
 * @returns Record<string, string>
 */
export function getAvailableLanguages(): Record<string, string> {
	const available: Record<string, string> = { 'auto': languageDisplayNames['auto'] };
	for (const code in translations) {
		if (languageDisplayNames[code]) {
			available[code] = languageDisplayNames[code];
		} else {
			available[code] = code; // Fallback to code if display name is missing
		}
	}
	return available;
}
