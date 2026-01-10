import { TranslatedText } from "./translations";

export interface Branch {
    id: string;
    slug: string;
    name: TranslatedText;
    description: TranslatedText;
    image?: string; // Hero image URL
    icon?: string; // Small icon URL
    color?: string; // Hex color code
    displayOrder: number;
    isActive: boolean;
    isFeatured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BranchInput {
    slug: string;
    name: TranslatedText;
    description: TranslatedText;
    image?: string;
    icon?: string;
    color?: string;
    displayOrder?: number;
    isActive: boolean;
    isFeatured?: boolean;
}
