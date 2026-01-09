import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { TranslatedText } from "@/types/translations";

const COLLECTION_NAME = "staff";

/**
 * GET /api/admin/staff/options
 * Get all unique values for specialties, certifications, areasOfExpertise, and languages
 * from existing staff members
 */
export async function GET(request: NextRequest) {
  let field: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    field = searchParams.get("field"); // 'specialties', 'certifications', 'areasOfExpertise', 'languages'

    if (!field || !["specialties", "certifications", "areasOfExpertise", "languages"].includes(field)) {
      return NextResponse.json(
        { error: "Invalid field. Must be one of: specialties, certifications, areasOfExpertise, languages" },
        { status: 400 }
      );
    }

    // Fetch all staff members
    const staffSnapshot = await adminDb.collection(COLLECTION_NAME).get();

    // Collect all unique values for the specified field
    const uniqueValues = new Map<string, TranslatedText>();

    staffSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const fieldValues = data[field as string] || [];

      fieldValues.forEach((value: TranslatedText | string) => {
        if (typeof value === "string") {
          // If it's a string, use it as English and create a key
          const key = value.toLowerCase().trim();
          if (key && !uniqueValues.has(key)) {
            uniqueValues.set(key, { en: value, ar: "" });
          }
        } else if (value && typeof value === "object") {
          // If it's a TranslatedText object, use English as key
          const enValue = value.en || value.ar || "";
          const key = enValue.toLowerCase().trim();
          if (key && !uniqueValues.has(key)) {
            uniqueValues.set(key, {
              en: value.en || "",
              ar: value.ar || "",
            });
          }
        }
      });
    });

    // Convert map to array and sort by English text
    const options = Array.from(uniqueValues.values()).sort((a, b) => {
      const aText = (a.en || a.ar || "").toLowerCase();
      const bText = (b.en || b.ar || "").toLowerCase();
      return aText.localeCompare(bText);
    });

    return NextResponse.json({
      success: true,
      options,
    });
  } catch (error: any) {
    console.error(`Error fetching ${field} options:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${field} options`, details: error.message },
      { status: 500 }
    );
  }
}
