import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { UserInput } from "@/types/admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

/**
 * GET /api/admin/users/[id]
 * Get a specific admin user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = doc.data();
    const user = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
      lastLogin: data?.lastLogin?.toDate(),
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error fetching admin user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update a user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const body: Partial<UserInput> = await request.json();
    const { role, password, displayName, isActive } = body;

    const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (role !== undefined) {
      updateData.role = role;
    }

    if (displayName !== undefined) {
      updateData.displayName = displayName;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update Firebase Auth user
    const userData = doc.data();
    if (userData?.firebaseUserId) {
      try {
        const authUpdateData: any = {};
        
        if (password !== undefined) {
          authUpdateData.password = password;
        }
        
        if (displayName !== undefined) {
          authUpdateData.displayName = displayName;
        }
        
        if (isActive !== undefined) {
          authUpdateData.disabled = !isActive;
        }

        if (Object.keys(authUpdateData).length > 0) {
          await adminAuth.updateUser(userData.firebaseUserId, authUpdateData);
        }
      } catch (authError) {
        console.warn("Could not update Firebase Auth user:", authError);
      }
    }

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate(),
        updatedAt: updatedData?.updatedAt?.toDate(),
        lastLogin: updatedData?.lastLogin?.toDate(),
      },
    });
  } catch (error: any) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete an admin user (requires manageUsers permission)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optionally delete Firebase Auth user
    const userData = doc.data();
    if (userData?.firebaseUserId) {
      try {
        await adminAuth.deleteUser(userData.firebaseUserId);
      } catch (authError) {
        console.warn("Could not delete Firebase Auth user:", authError);
      }
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
