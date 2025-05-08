// --- src/lang/translations.ts ---
import { Notice } from "obsidian";
import * as moment from "moment";
import type ObsidianPythonBridge from "../main"; // Use import type

// Import language files
import en from "./en";
import fr from "./fr";
import es from "./es";
import de from "./de";
import zh from "./zh"; // Assumed Simplified Chinese
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
import bn from "./bn";
import ur from "./ur";
import vi from "./vi";
import th from "./th";
import fil from "./fil";
import fa from "./fa";
import ms from "./ms";
import nl from "./nl";
import uk from "./uk";
import el from "./el";
import sv from "./sv"; // Represents Scandinavian for now
import fi from "./fi";
import hu from "./hu";
import ro from "./ro";
import cs from "./cs";
import sw from "./sw";
import ha from "./ha";
import yo from "./yo";
import ig from "./ig";
import zht from "./zht"; // Assumed Traditional Chinese

// Define the structure of the translation object
interface TranslationSet {
	[key: string]: string;
}

// Register all available languages with their translation objects
const translations: Record<string, TranslationSet> = {
	en, fr, es, de, zh, ar, pt, ru, ja, hi, ko, it, tr, id, pl,
	bn, ur, vi, th, fil, fa, ms, nl, uk, el, sv, fi, hu, ro, cs,
	sw, ha, yo, ig, zht
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
 * Returns a record of available languages, mapping the language code
 * to its native name (or English name if native is unavailable/unsuitable).
 */
export function getAvailableLanguages(): Record<string, string> {
	// Add new languages here with their native names
	return {
		en: "English",
		fr: "Français",
		es: "Español",
		de: "Deutsch",
		zh: "简体中文", // Simplified Chinese
		ar: "العربية",
		pt: "Português", // Assumed Brazilian/Generic
		ru: "Русский",
		ja: "日本語",
		hi: "हिन्दी",
		ko: "한국어",
		it: "Italiano",
		tr: "Türkçe",
		id: "Bahasa Indonesia",
		pl: "Polski",
		bn: "বাংলা", // Bengali
		ur: "اردو", // Urdu
		vi: "Tiếng Việt", // Vietnamese
		th: "ไทย", // Thai
		fil: "Filipino", // Filipino (Tagalog)
		fa: "فارسی", // Persian (Farsi)
		ms: "Bahasa Melayu", // Malay
		nl: "Nederlands", // Dutch
		uk: "Українська", // Ukrainian
		el: "Ελληνικά", // Greek
		sv: "Svenska", // Swedish (Represents Scandinavian)
		fi: "Suomi", // Finnish
		hu: "Magyar", // Hungarian
		ro: "Română", // Romanian
		cs: "Čeština", // Czech
		sw: "Kiswahili", // Swahili
		ha: "Hausa", // Hausa
		yo: "Yorùbá", // Yoruba
		ig: "Igbo", // Igbo
		zht: "繁體中文", // Traditional Chinese
	};
}
