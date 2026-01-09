/**
 * Script to update existing user roles from old system to new system
 * Run with: npx tsx scripts/update-user-role.ts
 */

import { adminDb } from "../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION_NAME = "adminUsers";

async function updateUserRoles() {
  try {
    console.log("Updating user roles...");

    // Get all users
    const snapshot = await adminDb.collection(COLLECTION_NAME).get();

    if (snapshot.empty) {
      console.log("No users found");
      return;
    }

    let updated = 0;
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      const updates: any = {};

      // Update old roles to new roles
      if (data.role === "superAdmin") {
        updates.role = "admin";
        updated++;
      }
      // Keep admin, user, subscribed as is
      // Remove permissions field if it exists (no longer needed)
      if (data.permissions !== undefined) {
        updates.permissions = FieldValue.delete();
      }

      if (Object.keys(updates).length > 0) {
        await doc.ref.update(updates);
        console.log(`✅ Updated user: ${data.email} - Role: ${data.role} → ${updates.role || data.role}`);
      } else {
        console.log(`   Skipped user: ${data.email} - Role: ${data.role} (already correct)`);
      }
    });

    console.log(`\n✅ Updated ${updated} user(s)`);
  } catch (error: any) {
    console.error("❌ Error updating user roles:", error);
    process.exit(1);
  }
}

updateUserRoles();
