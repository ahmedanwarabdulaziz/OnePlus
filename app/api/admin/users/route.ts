import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { AdminUser, UserInput } from "@/types/admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

/**
 * GET /api/admin/users
 * Get all admin users (requires manageUsers permission)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const user = await verifyAdminAuth(request);
    // if (!hasPermission(user.role, "manageUsers", user.permissions)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    const users: AdminUser[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLogin: data.lastLogin?.toDate(),
      } as AdminUser);
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body: UserInput = await request.json();
    const { email, password, role, displayName, isActive = true } = body;

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    let firebaseUserId: string | null = null;
    try {
      const userRecord = await adminAuth.createUser({
        email,
        password: password || undefined, // Set password if provided
        displayName: displayName || email.split("@")[0],
        disabled: !isActive,
        emailVerified: false,
      });
      firebaseUserId = userRecord.uid;
    } catch (authError: any) {
      if (authError.code === "auth/email-already-exists") {
        // Get existing user
        const existingAuthUser = await adminAuth.getUserByEmail(email);
        firebaseUserId = existingAuthUser.uid;
        
        // Update password if provided
        if (password) {
          await adminAuth.updateUser(firebaseUserId, {
            password,
            displayName: displayName || email.split("@")[0],
            disabled: !isActive,
          });
        }
      } else {
        throw authError;
      }
    }

    // Create user document
    const now = new Date();
    const userData: Omit<AdminUser, "id"> = {
      email,
      role,
      displayName: displayName || email.split("@")[0],
      isActive,
      createdAt: now,
      updatedAt: now,
      // createdBy: currentUser.email, // TODO: Get from auth
    };

    const docRef = await adminDb
      .collection(COLLECTION_NAME)
      .add({
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
        updatedAt: Timestamp.fromDate(userData.updatedAt),
        firebaseUserId, // Store Firebase Auth UID for reference
      });

    return NextResponse.json({
      success: true,
      user: {
        id: docRef.id,
        ...userData,
      },
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}
