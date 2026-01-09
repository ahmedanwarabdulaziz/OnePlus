/**
 * Script to create the first admin user
 * Run with: npx tsx scripts/create-admin-user.ts
 */

import { adminDb, adminAuth } from "../lib/firebase-admin";
import { UserInput } from "../types/admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

async function createAdminUser() {
  // Get email from command line arguments or use default
  const email = process.argv[2] || "admin@oneplus.com";
  const role = (process.argv[3] as any) || "admin";
  const displayName = process.argv[4] || "Admin";

  try {
    console.log(`Creating admin user: ${email} with role: ${role}`);

    // Check if user already exists
    const existingUser = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      console.log("User already exists in adminUsers collection");
      return;
    }

    // Create user in Firebase Auth
    let firebaseUserId: string | null = null;
    try {
      const userRecord = await adminAuth.createUser({
        email,
        displayName,
        emailVerified: true,
      });
      firebaseUserId = userRecord.uid;
      console.log(`Created Firebase Auth user: ${firebaseUserId}`);
    } catch (authError: any) {
      if (authError.code === "auth/email-already-exists") {
        // Get existing user
        const existingAuthUser = await adminAuth.getUserByEmail(email);
        firebaseUserId = existingAuthUser.uid;
        console.log(`Using existing Firebase Auth user: ${firebaseUserId}`);
      } else {
        throw authError;
      }
    }


    // Create admin user document
    const now = new Date();
    const adminUserData = {
      email,
      role,
      displayName,
      isActive: true,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      firebaseUserId,
    };

    const docRef = await adminDb.collection(COLLECTION_NAME).add(adminUserData);

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Document ID: ${docRef.id}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`\n   Next steps:`);
    console.log(`   1. Set password for this user in Firebase Console`);
    console.log(`   2. Or use Firebase Auth API to set password programmatically`);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
