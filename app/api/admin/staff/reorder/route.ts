import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "staff";

/**
 * POST /api/admin/staff/reorder
 * Update display order for multiple staff members
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Updates array is required" },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();
    const now = Timestamp.fromDate(new Date());

    for (const update of updates) {
      const { id, displayOrder } = update;
      const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
      batch.update(docRef, {
        displayOrder,
        updatedAt: now,
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering staff:", error);
    return NextResponse.json(
      { error: "Failed to reorder staff", details: error.message },
      { status: 500 }
    );
  }
}
