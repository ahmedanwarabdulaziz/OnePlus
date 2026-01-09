/**
 * Script to create the first admin user with password
 * Run with: npx tsx scripts/create-first-admin.ts
 */

import { adminDb, adminAuth } from "../lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

async function createFirstAdmin() {
  const email = "anwar@a.com";
  const password = "123123";
  const role = "admin";
  const displayName = "Anwar Admin";

  try {
    console.log(`Creating first admin user: ${email}`);

    // Check if any admin users exist
    const existingAdmins = await adminDb.collection(COLLECTION_NAME).limit(1).get();
    if (!existingAdmins.empty) {
      console.log("⚠️  Admin users already exist. Use the regular create-admin-user script instead.");
      return;
    }

    // Check if user already exists in adminUsers collection
    const existingUser = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      console.log("✅ User already exists in adminUsers collection");
      const userDoc = existingUser.docs[0];
      const userData = userDoc.data();
      console.log(`   Document ID: ${userDoc.id}`);
      console.log(`   Role: ${userData.role}`);
      return;
    }

    // Create user in Firebase Auth with password
    let firebaseUserId: string;
    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      firebaseUserId = userRecord.uid;
      console.log(`✅ Created Firebase Auth user: ${firebaseUserId}`);
    } catch (authError: any) {
      if (authError.code === "auth/email-already-exists") {
        // Get existing user and update password
        const existingAuthUser = await adminAuth.getUserByEmail(email);
        firebaseUserId = existingAuthUser.uid;
        
        // Update password
        await adminAuth.updateUser(firebaseUserId, {
          password,
          displayName,
          emailVerified: true,
        });
        console.log(`✅ Updated existing Firebase Auth user: ${firebaseUserId}`);
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

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   Document ID: ${docRef.id}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
    console.log(`\n   You can now login at: http://localhost:3000/login`);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error);
    console.error("   Details:", error.message);
    process.exit(1);
  }
}

createFirstAdmin();
