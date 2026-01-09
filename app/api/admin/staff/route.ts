import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { StaffMember, StaffInput } from "@/types/staff";
import { TranslatedText, createTranslatedText } from "@/types/translations";
import { Timestamp } from "firebase-admin/firestore";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

const COLLECTION_NAME = "staff";

/**
 * GET /api/admin/staff
 * Get all staff members
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // Filter by type: coach or employee
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = adminDb.collection(COLLECTION_NAME);

    if (type) {
      query = query.where("type", "==", type) as any;
    }

    if (activeOnly) {
      query = query.where("isActive", "==", true) as any;
    }

    // Order by displayOrder first, then lastName
    // Handle case where displayOrder might not exist on all documents
    let snapshot;
    try {
      // Try composite index first (fastest if available)
      snapshot = await query.orderBy("displayOrder", "asc").orderBy("lastName", "asc").get();
    } catch (error: any) {
      // If composite index doesn't exist, fall back to single orderBy
      console.warn("Composite index not found, using single orderBy:", error.message);
      try {
        snapshot = await query.orderBy("displayOrder", "asc").get();
      } catch (err: any) {
        // If displayOrder index doesn't exist, just get without ordering (fastest fallback)
        console.warn("displayOrder index not found, fetching without order:", err.message);
        snapshot = await query.get();
      }
    }
    const staff: StaffMember[] = [];

    // Process staff - generate slugs synchronously only if missing (use doc.id as fallback)
    // Slug generation will happen lazily when needed, not blocking the response
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Use existing slug or generate a simple one from name (without uniqueness check for speed)
      // Full uniqueness check can be done later if needed
      let slug = data.slug;
      if (!slug) {
        // Generate a simple slug without uniqueness check for performance
        const firstName = typeof data.firstName === "string"
          ? data.firstName
          : data.firstName?.en || data.firstName?.ar || "";
        const lastName = typeof data.lastName === "string"
          ? data.lastName
          : data.lastName?.en || data.lastName?.ar || "";

        if (firstName || lastName) {
          slug = generateSlug(firstName, lastName);
          // Note: We're not checking uniqueness here for performance
          // If a duplicate slug exists, it will be handled when the staff member is viewed/edited
        } else {
          slug = doc.id; // Fallback to ID if no name
        }
      }

      staff.push({
        id: doc.id,
        slug,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as StaffMember);
    });

    // Sort in memory if Firestore ordering failed or wasn't applied
    staff.sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Handle lastName comparison (could be string or TranslatedText)
      const lastNameA = typeof a.lastName === "string"
        ? a.lastName
        : a.lastName?.en || a.lastName?.ar || "";
      const lastNameB = typeof b.lastName === "string"
        ? b.lastName
        : b.lastName?.en || b.lastName?.ar || "";
      return lastNameA.localeCompare(lastNameB);
    });

    return NextResponse.json({ staff });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: "Failed to fetch staff", details: error.message || "Unknown error", code: error.code },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/staff
 * Create a new staff member
 */
export async function POST(request: NextRequest) {
  try {
    const body: StaffInput = await request.json();
    const {
      firstName,
      lastName,
      title,
      email,
      phone,
      type,
      positions,
      bio,
      shortBio,
      images,
      specialties,
      certifications,
      experience,
      socialLinks,
      isActive = true,
      displayOrder,
    } = body;

    // Validate input
    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required" },
        { status: 400 }
      );
    }

    // Ensure firstName and lastName are TranslatedText objects
    const firstNameText: TranslatedText =
      typeof firstName === "string"
        ? createTranslatedText(firstName, "")
        : firstName || createTranslatedText("", "");

    const lastNameText: TranslatedText =
      typeof lastName === "string"
        ? createTranslatedText(lastName, "")
        : lastName || createTranslatedText("", "");

    // Validate that at least one language is provided for names
    if ((!firstNameText.en && !firstNameText.ar) || (!lastNameText.en && !lastNameText.ar)) {
      return NextResponse.json(
        { error: "First name and last name must have at least English or Arabic text" },
        { status: 400 }
      );
    }

    // Use one language as fallback for the other if missing
    const finalFirstName: TranslatedText = {
      en: firstNameText.en || "",
      ar: firstNameText.ar || "",
    };

    const finalLastName: TranslatedText = {
      en: lastNameText.en || "",
      ar: lastNameText.ar || "",
    };

    // Ensure title is TranslatedText object
    const titleText: TranslatedText =
      typeof title === "string"
        ? createTranslatedText(title, "")
        : title || createTranslatedText("", "");

    // Use one language as fallback for the other if missing
    const finalTitle: TranslatedText = {
      en: titleText.en || "",
      ar: titleText.ar || "",
    };

    // Ensure bio and shortBio are TranslatedText objects
    const bioText: TranslatedText =
      typeof bio === "string"
        ? createTranslatedText(bio, "")
        : bio || createTranslatedText("", "");

    const shortBioText: TranslatedText =
      typeof shortBio === "string"
        ? createTranslatedText(shortBio, "")
        : shortBio || createTranslatedText("", "");

    // Validate that at least one language is provided
    if ((!bioText.en && !bioText.ar) || (!shortBioText.en && !shortBioText.ar)) {
      return NextResponse.json(
        { error: "Bio and short bio must have at least English or Arabic text" },
        { status: 400 }
      );
    }

    // Use English as fallback if Arabic is missing, or Arabic if English is missing
    const finalBio: TranslatedText = {
      en: bioText.en || "",
      ar: bioText.ar || "",
    };

    const finalShortBio: TranslatedText = {
      en: shortBioText.en || "",
      ar: shortBioText.ar || "",
    };

    // Ensure positions is an array of TranslatedText
    const positionsArray: TranslatedText[] = positions
      ? positions.map((pos) =>
        typeof pos === "string" ? createTranslatedText(pos, "") : pos
      )
      : [];

    // Ensure specialties and certifications are TranslatedText arrays
    const specialtiesArray: TranslatedText[] = specialties
      ? specialties.map((spec) =>
        typeof spec === "string" ? createTranslatedText(spec, "") : spec
      )
      : [];

    const certificationsArray: TranslatedText[] = certifications
      ? certifications.map((cert) =>
        typeof cert === "string" ? createTranslatedText(cert, "") : cert
      )
      : [];

    // Handle other bilingual arrays
    const educationArray: TranslatedText[] = (body.education || []).map((edu: any) =>
      typeof edu === "string" ? createTranslatedText(edu, "") : edu
    );

    const achievementsArray: TranslatedText[] = (body.achievements || []).map((ach: any) =>
      typeof ach === "string" ? createTranslatedText(ach, "") : ach
    );

    const areasOfExpertiseArray: TranslatedText[] = (body.areasOfExpertise || []).map((area: any) =>
      typeof area === "string" ? createTranslatedText(area, "") : area
    );

    const languagesArray: TranslatedText[] = (body.languages || []).map((lang: any) =>
      typeof lang === "string" ? createTranslatedText(lang, "") : lang
    );

    // Ensure experience is TranslatedText array (handle both old single format and new array format)
    const experienceArray: TranslatedText[] = Array.isArray(body.experience)
      ? body.experience.map((exp: any) =>
        typeof exp === "string" ? createTranslatedText(exp, "") : exp
      )
      : body.experience && typeof body.experience === "object" && !Array.isArray(body.experience)
        ? [body.experience] // Convert old single experience to array
        : [];

    // Check if staff member already exists
    const existingStaff = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingStaff.empty) {
      return NextResponse.json(
        { error: "Staff member with this email already exists" },
        { status: 400 }
      );
    }

    // Get current max displayOrder to add new item at the end
    let maxDisplayOrder = 0;
    try {
      const existingStaffSnapshot = await adminDb
        .collection(COLLECTION_NAME)
        .orderBy("displayOrder", "desc")
        .limit(1)
        .get();

      maxDisplayOrder = existingStaffSnapshot.empty
        ? 0
        : (existingStaffSnapshot.docs[0].data().displayOrder || 0);
    } catch (error) {
      // If index doesn't exist, count existing documents
      const countSnapshot = await adminDb.collection(COLLECTION_NAME).get();
      maxDisplayOrder = countSnapshot.size;
    }

    // Generate slug from English names (fallback to Arabic if English not available)
    const firstNameForSlug = finalFirstName.en || finalFirstName.ar || "";
    const lastNameForSlug = finalLastName.en || finalLastName.ar || "";
    const baseSlug = generateSlug(firstNameForSlug, lastNameForSlug);
    const uniqueSlug = await generateUniqueSlug(
      baseSlug,
      adminDb.collection(COLLECTION_NAME)
    );

    // Create staff member document
    const now = new Date();
    const staffData: Omit<StaffMember, "id"> = {
      slug: uniqueSlug,
      firstName: finalFirstName,
      lastName: finalLastName,
      email,
      phone,
      type,
      title: finalTitle.en || finalTitle.ar ? finalTitle : undefined,
      positions: positionsArray,
      bio: finalBio,
      shortBio: {
        en: finalShortBio.en.substring(0, 200),
        ar: finalShortBio.ar.substring(0, 200),
      },
      images: images || {},
      specialties: specialtiesArray,
      certifications: certificationsArray,
      experience: experienceArray,
      education: educationArray,
      achievements: achievementsArray,
      areasOfExpertise: areasOfExpertiseArray,
      languages: languagesArray,
      socialLinks: socialLinks || {},
      isActive,
      displayOrder: maxDisplayOrder + 1, // Add at the end
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTION_NAME).add({
      ...staffData,
      createdAt: Timestamp.fromDate(staffData.createdAt),
      updatedAt: Timestamp.fromDate(staffData.updatedAt),
    });

    return NextResponse.json({
      success: true,
      staff: {
        id: docRef.id,
        ...staffData,
      },
    });
  } catch (error: any) {
    console.error("Error creating staff member:", error);
    return NextResponse.json(
      { error: "Failed to create staff member", details: error.message },
      { status: 500 }
    );
  }
}
