import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { AdminUser } from "@/types/admin";
import { NextRequest } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

/**
 * Verify admin authentication from request
 * Returns the admin user if authenticated
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AdminUser | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify Firebase Auth token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get admin user from Firestore
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", decodedToken.email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      lastLogin: data.lastLogin?.toDate(),
    } as AdminUser;
  } catch (error) {
    console.error("Error verifying admin auth:", error);
    return null;
  }
}

/**
 * Update last login timestamp for admin user
 */
export async function updateLastLogin(email: string): Promise<void> {
  try {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({
        lastLogin: Timestamp.fromDate(new Date()),
      });
    }
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}
