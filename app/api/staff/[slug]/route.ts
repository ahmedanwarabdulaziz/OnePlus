import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { StaffMember } from "@/types/staff";
import { TranslatedText } from "@/types/translations";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

const COLLECTION_NAME = "staff";

/**
 * GET /api/staff/[slug]
 * Get a single staff member by slug (public API)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Try to find by slug first
    let snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    // If not found by slug, try by ID (for backward compatibility with old links)
    if (snapshot.empty) {
      console.log("Not found by slug, trying by ID:", slug);
      const docRef = adminDb.collection(COLLECTION_NAME).doc(slug);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        console.log("Found by ID, isActive:", data?.isActive);

        // Check if active
        if (!data?.isActive) {
          console.log("Staff member is not active");
          return NextResponse.json(
            { error: "Staff member not found" },
            { status: 404 }
          );
        }

        // Generate and save slug if missing
        if (!data?.slug) {
          console.log("Generating slug for staff member");
          const firstName = typeof data?.firstName === "string"
            ? data.firstName
            : data?.firstName?.en || data?.firstName?.ar || "";
          const lastName = typeof data?.lastName === "string"
            ? data.lastName
            : data?.lastName?.en || data?.lastName?.ar || "";

          if (firstName || lastName) {
            const baseSlug = generateSlug(firstName, lastName);
            const uniqueSlug = await generateUniqueSlug(
              baseSlug,
              adminDb.collection(COLLECTION_NAME),
              doc.id
            );

            // Save the slug for future use
            const { Timestamp } = await import("firebase-admin/firestore");
            await docRef.update({
              slug: uniqueSlug,
              updatedAt: Timestamp.fromDate(new Date()),
            });

            // Update data with the new slug
            data.slug = uniqueSlug;
          } else {
            // Fallback: use ID as slug if no name available
            data.slug = doc.id;
          }
        }

        // Use the document directly
        snapshot = {
          docs: [doc],
          empty: false,
        } as any;
      } else {
        console.log("Not found by ID either");
      }
    }

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Convert Firestore Timestamps to Dates
    const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
    const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);

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

    const staffMember: StaffMember = {
      id: doc.id,
      slug: data.slug || slug,
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
    };

    return NextResponse.json({ success: true, staff: staffMember });
  } catch (error: any) {
    console.error("Error fetching staff member:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff member", details: error.message },
      { status: 500 }
    );
  }
}
