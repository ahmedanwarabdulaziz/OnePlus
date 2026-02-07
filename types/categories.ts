import { TranslatedText } from "./translations";

/**
 * Category - Reusable course category
 */
export interface Category {
    id: string;                    // Firestore document ID
    name: TranslatedText;          // Bilingual category name
    createdAt: Date;
    updatedAt: Date;
    usageCount?: number;           // Optional: track how many courses use it
}

/**
 * CategoryInput - For creating/updating categories
 */
export interface CategoryInput {
    name: TranslatedText;
}
