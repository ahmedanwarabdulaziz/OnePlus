import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { AdminUser } from "@/types/admin";

const COLLECTION_NAME = "adminUsers";

/**
 * POST /api/auth/check-admin
 * Check if the authenticated user is an admin
 * Requires Firebase Auth token in Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized", isAdmin: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { error: "Invalid token", isAdmin: false },
        { status: 401 }
      );
    }

    // Check if user exists and is active (only admins can access admin dashboard)
    const adminQuery = adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .where("isActive", "==", true)
      .where("role", "==", "admin")
      .limit(1);

    const adminSnapshot = await adminQuery.get();

    if (adminSnapshot.empty) {
      return NextResponse.json({ isAdmin: false, adminUser: null });
    }

    const adminDoc = adminSnapshot.docs[0];
    const adminData = adminDoc.data();

    const adminUser: AdminUser = {
      id: adminDoc.id,
      ...adminData,
      createdAt: adminData.createdAt?.toDate(),
      updatedAt: adminData.updatedAt?.toDate(),
      lastLogin: adminData.lastLogin?.toDate(),
    } as AdminUser;

    return NextResponse.json({ isAdmin: true, adminUser });
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Failed to check admin status", isAdmin: false },
      { status: 500 }
    );
  }
}
