// Translation Types
export type Language = "en" | "ar";

// Bilingual text structure
export interface TranslatedText {
  en: string;
  ar: string;
}

// Helper function to get text in a specific language
export function getText(text: TranslatedText | string, lang: Language = "en", fallback: boolean = true): string {
  if (typeof text === "string") {
    return text; // Fallback for non-translated strings
  }
  if (!fallback) {
    return text[lang] || "";
  }
  return text[lang] || text.en || ""; // Fallback to English if translation missing
}

// Helper function to create translated text
export function createTranslatedText(en: string, ar: string = ""): TranslatedText {
  return {
    en,
    ar: ar || en, // Fallback to English if Arabic not provided
  };
}
