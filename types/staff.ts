import { TranslatedText } from "./translations";

// Staff Types
export type StaffType = "coach" | "employee";

// Image Types
export interface StaffImages {
  square?: string;      // Square image (profile picture)
  vertical?: string;    // Vertical/rectangle image
  hero?: string;        // Hero section image
}

// Staff Member Interface
export interface StaffMember {
  id: string;                    // Firestore document ID
  slug: string;                   // URL-friendly slug (e.g., "john-doe")
  firstName: TranslatedText | string; // First name (bilingual or string)
  lastName: TranslatedText | string;  // Last name (bilingual or string)
  email: string;                  // Email (unique)
  phone?: string;                 // Phone number
  type: StaffType;                // coach or employee
  title?: TranslatedText;         // Main title (bilingual)
  positions: TranslatedText[];    // Multiple job titles/positions (bilingual)
  bio: TranslatedText;            // Full bio (bilingual)
  shortBio: TranslatedText;       // Short bio for summaries (bilingual, max 200 chars)
  images?: StaffImages;           // Different image types
  specialties?: TranslatedText[];  // Areas of expertise/specialties (bilingual)
  certifications?: TranslatedText[]; // Certifications/qualifications (bilingual)
  experience?: TranslatedText[];     // Years of experience (bilingual) - array format
  education?: TranslatedText[];   // Education background (bilingual)
  achievements?: TranslatedText[]; // Achievements/awards (bilingual)
  areasOfExpertise?: TranslatedText[]; // Detailed areas of expertise (bilingual)
  languages?: TranslatedText[];   // Languages spoken (bilingual)
  socialLinks?: {                 // Social media links
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isActive: boolean;              // Active status
  displayOrder: number;           // Order for display (set by drag and drop)
  createdAt: Date;                // Creation date
  updatedAt: Date;                // Last update date
  createdBy?: string;             // Email of admin who created
}

// Staff Input (for creating/updating)
export interface StaffInput {
  firstName: TranslatedText;
  lastName: TranslatedText;
  email: string;
  phone?: string;
  type: StaffType;
  title?: TranslatedText;         // Main title (bilingual)
  positions: TranslatedText[];    // Multiple positions (bilingual)
  bio: TranslatedText;
  shortBio: TranslatedText;
  images?: StaffImages;           // Different image types
  specialties?: TranslatedText[];  // Areas of expertise (bilingual)
  certifications?: TranslatedText[]; // Certifications (bilingual)
  experience?: TranslatedText[];     // Experience (bilingual) - array format
  education?: TranslatedText[];    // Education (bilingual)
  achievements?: TranslatedText[]; // Achievements (bilingual)
  areasOfExpertise?: TranslatedText[]; // Detailed expertise areas (bilingual)
  languages?: TranslatedText[];   // Languages (bilingual)
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isActive?: boolean;
  displayOrder?: number;
}
