import { TranslatedText } from "./translations";

// Course Audience Types
export type CourseAudience = "kids" | "undergraduate" | "postgraduate" | "corporate";

// Course Level Types
export type CourseLevelType = "beginner" | "intermediate" | "advanced" | "master";

// Course Level Structure
export interface CourseLevel {
    name: TranslatedText;      // Level 1, Beginner, etc.
    description: TranslatedText;
    duration: string;         // e.g. "4 weeks"
    price: string;            // e.g. "2000 EGP"
}

// Course Images
export interface CourseImages {
    hero?: string;            // Main banner image
    thumbnail?: string;       // Card image
}

// Course Interface
export interface Course {
    id: string;
    slug: string;
    branchIds?: string[]; // Link to multiple Branches
    title: TranslatedText;
    shortDescription: TranslatedText; // For cards
    fullDescription: TranslatedText;  // For details page
    category: TranslatedText[];         // e.g. "Software", "Soft Skills"
    targetAudience: CourseAudience[];

    // Certification
    isCertified: boolean;
    certificationDetails?: TranslatedText;

    // Structure
    levels: CourseLevel[];           // Array of levels

    // Features
    prerequisites?: TranslatedText[];
    learningOutcomes?: TranslatedText[];

    images?: CourseImages;

    isActive: boolean;
    isFeatured?: boolean;
    displayOrder: number;

    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
}

// Input Type for Forms
export interface CourseInput {
    slug: string;
    branchIds?: string[]; // Link to multiple Branches
    title: TranslatedText;
    shortDescription: TranslatedText;
    fullDescription: TranslatedText;
    category: TranslatedText[];
    targetAudience: CourseAudience[];
    isCertified: boolean;
    certificationDetails?: TranslatedText;
    levels: CourseLevel[];
    prerequisites?: TranslatedText[];
    learningOutcomes?: TranslatedText[];
    images?: CourseImages;
    isActive: boolean;
    isFeatured?: boolean;
    displayOrder?: number;
}
