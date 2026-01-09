import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

/**
 * POST /api/admin/users/[id]/last-login
 * Update last login timestamp
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await docRef.update({
      lastLogin: Timestamp.fromDate(new Date()),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating last login:", error);
    return NextResponse.json(
      { error: "Failed to update last login", details: error.message },
      { status: 500 }
    );
  }
}
