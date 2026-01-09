import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { StaffInput } from "@/types/staff";
import { TranslatedText, createTranslatedText } from "@/types/translations";
import { Timestamp } from "firebase-admin/firestore";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

const COLLECTION_NAME = "staff";

/**
 * GET /api/admin/staff/[id]
 * Get a specific staff member
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    const data = doc.data();
    const staff = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    };

    return NextResponse.json({ staff });
  } catch (error: any) {
    console.error("Error fetching staff member:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff member", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/staff/[id]
 * Update a staff member
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<StaffInput> = await request.json();
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
      education,
      achievements,
      areasOfExpertise,
      languages,
      socialLinks,
      isActive,
      displayOrder,
    } = body;

    const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    };

    // Track if names changed to regenerate slug
    let namesChanged = false;
    let newFirstName = "";
    let newLastName = "";

    if (firstName !== undefined) {
      const firstNameText =
        typeof firstName === "string"
          ? createTranslatedText(firstName, "")
          : firstName;
      updateData.firstName = {
        en: firstNameText.en || "",
        ar: firstNameText.ar || "",
      };
      namesChanged = true;
      newFirstName = updateData.firstName.en || updateData.firstName.ar || "";
    }

    if (lastName !== undefined) {
      const lastNameText =
        typeof lastName === "string"
          ? createTranslatedText(lastName, "")
          : lastName;
      updateData.lastName = {
        en: lastNameText.en || "",
        ar: lastNameText.ar || "",
      };
      namesChanged = true;
      newLastName = updateData.lastName.en || updateData.lastName.ar || "";
    }

    // Regenerate slug if names changed
    if (namesChanged) {
      const currentData = doc.data();
      const firstNameForSlug = newFirstName || currentData?.firstName?.en || currentData?.firstName?.ar || "";
      const lastNameForSlug = newLastName || currentData?.lastName?.en || currentData?.lastName?.ar || "";
      const baseSlug = generateSlug(firstNameForSlug, lastNameForSlug);
      const uniqueSlug = await generateUniqueSlug(
        baseSlug,
        adminDb.collection(COLLECTION_NAME),
        params.id
      );
      updateData.slug = uniqueSlug;
    }

    if (title !== undefined) {
      const titleText =
        typeof title === "string"
          ? createTranslatedText(title, "")
          : title || createTranslatedText("", "");
      updateData.title = {
        en: titleText.en || "",
        ar: titleText.ar || "",
      };
    }

    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (type !== undefined) updateData.type = type;

    if (positions !== undefined) {
      // Ensure positions are TranslatedText objects
      updateData.positions = positions.map((pos: any) =>
        typeof pos === "string" ? createTranslatedText(pos, "") : pos
      );
    }

    if (specialties !== undefined) {
      updateData.specialties = specialties.map((spec: any) =>
        typeof spec === "string" ? createTranslatedText(spec, "") : spec
      );
    }

    if (certifications !== undefined) {
      updateData.certifications = certifications.map((cert: any) =>
        typeof cert === "string" ? createTranslatedText(cert, "") : cert
      );
    }

    if (experience !== undefined) {
      // Handle experience as array (support both old single format and new array format)
      if (Array.isArray(experience)) {
        updateData.experience = experience.map((exp: any) =>
          typeof exp === "string" ? createTranslatedText(exp, "") : exp
        );
      } else if (typeof experience === "object" && experience !== null && !Array.isArray(experience)) {
        // Convert old single experience format to array
        updateData.experience = [experience];
      } else if (typeof experience === "string") {
        // Convert string to array
        updateData.experience = [createTranslatedText(experience, "")];
      } else {
        updateData.experience = [];
      }
    }

    if (education !== undefined) {
      updateData.education = education.map((edu: any) =>
        typeof edu === "string" ? createTranslatedText(edu, "") : edu
      );
    }

    if (achievements !== undefined) {
      updateData.achievements = achievements.map((ach: any) =>
        typeof ach === "string" ? createTranslatedText(ach, "") : ach
      );
    }

    if (areasOfExpertise !== undefined) {
      updateData.areasOfExpertise = areasOfExpertise.map((area: any) =>
        typeof area === "string" ? createTranslatedText(area, "") : area
      );
    }

    if (languages !== undefined) {
      updateData.languages = languages.map((lang: any) =>
        typeof lang === "string" ? createTranslatedText(lang, "") : lang
      );
    }

    if (bio !== undefined) {
      // Ensure bio is TranslatedText object
      const bioText =
        typeof bio === "string" ? createTranslatedText(bio, "") : bio;
      // Use one language as fallback for the other if missing
      updateData.bio = {
        en: bioText.en || "",
        ar: bioText.ar || "",
      };
    }

    if (shortBio !== undefined) {
      // Ensure shortBio is TranslatedText object and limit length
      const shortBioText =
        typeof shortBio === "string"
          ? createTranslatedText(shortBio, "")
          : shortBio;
      // Use one language as fallback for the other if missing
      updateData.shortBio = {
        en: (shortBioText.en || "").substring(0, 200),
        ar: (shortBioText.ar || "").substring(0, 200),
      };
    }

    if (images !== undefined) updateData.images = images;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (experience !== undefined) updateData.experience = experience;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      staff: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate(),
        updatedAt: updatedData?.updatedAt?.toDate(),
      },
    });
  } catch (error: any) {
    console.error("Error updating staff member:", error);
    return NextResponse.json(
      { error: "Failed to update staff member", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/staff/[id]
 * Delete a staff member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting staff member:", error);
    return NextResponse.json(
      { error: "Failed to delete staff member", details: error.message },
      { status: 500 }
    );
  }
}
