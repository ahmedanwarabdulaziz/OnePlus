import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { StaffMember } from "@/types/staff";
import { TranslatedText } from "@/types/translations";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

const COLLECTION_NAME = "staff";

/**
 * GET /api/staff
 * Get all active staff members (public API)
 * 
 * Query params:
 * - type: Filter by type (coach or employee)
 * - minimal: Return only essential fields for dropdown (id, slug, firstName, lastName, title)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // Filter by type: coach or employee
    const minimal = searchParams.get("minimal") === "true"; // Minimal data for dropdown

    let query = adminDb.collection(COLLECTION_NAME).where("isActive", "==", true);

    if (type) {
      query = query.where("type", "==", type) as any;
    }

    // Order by displayOrder first, then lastName
    // Fallback to simple get and sort in memory to avoid missing index errors during build
    const snapshot = await query.get();

    const staff: StaffMember[] = [];
    const { Timestamp } = await import("firebase-admin/firestore");

    // Helper to convert TranslatedText
    const convertTranslatedText = (value: any): TranslatedText => {
      if (!value) return { en: "", ar: "" };
      if (typeof value === "string") return { en: value, ar: "" };
      return { en: value.en || "", ar: value.ar || "" };
    };

    // Helper to convert TranslatedText array
    const convertTranslatedTextArray = (value: any): TranslatedText[] => {
      if (!value || !Array.isArray(value)) return [];
      return value.map((item: any) => convertTranslatedText(item));
    };

    // Process each document with async operations
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Convert Firestore Timestamps to Dates
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
      const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);

      // Generate and save slug if missing (for backward compatibility)
      let slug = data.slug;
      if (!slug) {
        const firstName = typeof data.firstName === "string"
          ? data.firstName
          : data.firstName?.en || data.firstName?.ar || "";
        const lastName = typeof data.lastName === "string"
          ? data.lastName
          : data.lastName?.en || data.lastName?.ar || "";

        if (firstName || lastName) {
          const baseSlug = generateSlug(firstName, lastName);
          slug = await generateUniqueSlug(
            baseSlug,
            adminDb.collection(COLLECTION_NAME),
            doc.id
          );

          // Save the slug to the database
          await doc.ref.update({
            slug,
            updatedAt: Timestamp.fromDate(new Date()),
          });
        } else {
          slug = doc.id; // Fallback to ID
        }
      }

      // For minimal requests (dropdown), only return essential fields
      if (minimal) {
        staff.push({
          id: doc.id,
          slug,
          firstName: convertTranslatedText(data.firstName),
          lastName: convertTranslatedText(data.lastName),
          email: "", // Not needed for dropdown
          phone: "",
          type: data.type,
          title: data.title ? convertTranslatedText(data.title) : undefined,
          positions: convertTranslatedTextArray(data.positions),
          bio: { en: "", ar: "" },
          shortBio: { en: "", ar: "" },
          images: {},
          specialties: [],
          certifications: [],
          experience: undefined,
          education: [],
          achievements: [],
          areasOfExpertise: [],
          languages: [],
          socialLinks: {},
          isActive: true,
          displayOrder: data.displayOrder ?? 0,
          createdAt,
          updatedAt,
        });
      } else {
        // Full data for staff listing pages
        staff.push({
          id: doc.id,
          slug,
          firstName: convertTranslatedText(data.firstName),
          lastName: convertTranslatedText(data.lastName),
          email: data.email,
          phone: data.phone || "",
          type: data.type,
          title: data.title ? convertTranslatedText(data.title) : undefined,
          positions: convertTranslatedTextArray(data.positions),
          bio: convertTranslatedText(data.bio),
          shortBio: convertTranslatedText(data.shortBio),
          images: data.images || {},
          specialties: convertTranslatedTextArray(data.specialties),
          certifications: convertTranslatedTextArray(data.certifications),
          experience: Array.isArray(data.experience)
            ? convertTranslatedTextArray(data.experience)
            : (data.experience ? [convertTranslatedText(data.experience)] : []),
          education: convertTranslatedTextArray(data.education),
          achievements: convertTranslatedTextArray(data.achievements),
          areasOfExpertise: convertTranslatedTextArray(data.areasOfExpertise),
          languages: convertTranslatedTextArray(data.languages),
          socialLinks: data.socialLinks || {},
          isActive: data.isActive ?? true,
          displayOrder: data.displayOrder ?? 0,
          createdAt,
          updatedAt,
          createdBy: data.createdBy,
        });
      }
    }

    // If no ordering was applied, sort in memory
    if (snapshot.empty || !snapshot.docs[0].data().displayOrder) {
      staff.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        const getName = (v: any) => typeof v === 'string' ? v : (v?.en || "");
        return getName(a.lastName || "").localeCompare(getName(b.lastName || ""));
      });
    }

    // Add caching headers for better performance
    const response = NextResponse.json({ success: true, staff });

    // Cache for longer periods - reduces database queries significantly
    // Minimal requests (dropdown) can be cached longer since they change less frequently
    const cacheTime = minimal ? 600 : 300; // 10 min for minimal, 5 min for full
    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff", details: error.message },
      { status: 500 }
    );
  }
}
