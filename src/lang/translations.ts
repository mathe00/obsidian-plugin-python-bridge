// --- src/lang/translations.ts ---
import { Notice } from "obsidian"; // Import Notice for debugging
import * as moment from "moment"; // Keep moment for potential fallback/consistency

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

// Define the structure of the translation object (optional but good practice)
interface TranslationSet {
	[key: string]: string;
}

// Register all available languages
const translations: Record<string, TranslationSet> = {
	en, // English is the default/fallback
	fr,
	es,
	de,
	zh,
	ar,
	pt,
	ru,
	ja,
	hi,
	ko,
	it,
	tr,
	id,
	pl,
	// Add other languages here if needed
};

let activeTranslations: TranslationSet = en; // Default to English

/**
 * Loads the translations for the current Obsidian language.
 * Attempts to use localStorage first, then moment.locale(), falls back to English.
 */
export function loadTranslations(): void {
	// --- Debugging ---
	const momentLocale = moment.locale();
	const storageLocale = window.localStorage.getItem("language"); // Can be null
	// Comment out or remove the Notice for production
	// new Notice(`Debug Locales:\nlocalStorage: ${storageLocale}\nmoment.locale(): ${momentLocale}`, 10000);
	console.log(
		`Obsidian Python Bridge: Debug Locales - localStorage: ${storageLocale}, moment.locale(): ${momentLocale}`,
	);
	// --- End Debugging ---

	let targetLocale: string | null = null;

	// 1. Try localStorage first (seems more direct for Obsidian's setting)
	if (storageLocale && typeof storageLocale === "string") {
		targetLocale = storageLocale;
		console.log(
			`Obsidian Python Bridge: Using locale from localStorage: ${targetLocale}`,
		);
	}
	// 2. If localStorage is empty, try moment.locale() as a fallback
	else if (momentLocale) {
		targetLocale = momentLocale;
		console.log(
			`Obsidian Python Bridge: localStorage empty, using locale from moment.locale(): ${targetLocale}`,
		);
	} else {
		console.log(
			`Obsidian Python Bridge: Both localStorage and moment.locale() are unavailable.`,
		);
		// Fallback to English handled below if targetLocale remains null
	}

	// Now, load translations based on the determined targetLocale
	if (targetLocale && translations[targetLocale]) {
		// Exact match (e.g., 'fr', 'en')
		activeTranslations = translations[targetLocale];
		console.log(
			`Obsidian Python Bridge: Loaded translations for exact locale '${targetLocale}'`,
		);
	} else if (targetLocale) {
		// Try base language if exact match failed (e.g., 'en' from 'en-gb')
		const baseLocale = targetLocale.split("-")[0];
		if (translations[baseLocale]) {
			activeTranslations = translations[baseLocale];
			console.log(
				`Obsidian Python Bridge: Loaded translations for base locale '${baseLocale}' (from '${targetLocale}')`,
			);
		} else {
			// Fallback to English if neither exact nor base locale is found
			activeTranslations = en;
			console.log(
				`Obsidian Python Bridge: Locale '${targetLocale}' (or base '${baseLocale}') not found, falling back to 'en'.`,
			);
		}
	} else {
		// Fallback to English if no locale could be determined
		activeTranslations = en;
		console.log(
			`Obsidian Python Bridge: No target locale determined, falling back to 'en'.`,
		);
	}
}

/**
 * Gets the translated string for a given key.
 *
 * @param key The key of the string to translate.
 * @returns The translated string, or the key itself if not found.
 */
export function t(key: string): string {
	// Return the translation if found, otherwise return the key itself
	// This makes it easy to spot missing translations
	return activeTranslations[key] ?? key;
}
