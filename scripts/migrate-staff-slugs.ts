/**
 * Migration script to generate slugs for existing staff members
 * Run this script once to add slugs to all existing staff members in Firestore
 * 
 * Usage: npx ts-node scripts/migrate-staff-slugs.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";
import { generateSlug, generateUniqueSlug } from "../lib/slug";

// Initialize Firebase Admin
const serviceAccountPath = path.join(
  __dirname,
  "..",
  "one-plus-6a6b5-firebase-adminsdk-fbsvc-92939dbc84.json"
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Service account file not found at:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const COLLECTION_NAME = "staff";

async function migrateStaffSlugs() {
  try {
    console.log("🔄 Starting staff slug migration...");

    // Get all staff members
    const snapshot = await db.collection(COLLECTION_NAME).get();

    if (snapshot.empty) {
      console.log("ℹ️  No staff members found.");
      return;
    }

    console.log(`📋 Found ${snapshot.size} staff members to process...`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();

        // Skip if slug already exists
        if (data.slug) {
          console.log(`⏭️  Skipping ${doc.id} - already has slug: ${data.slug}`);
          skipped++;
          continue;
        }

        // Generate slug from name
        const firstName = typeof data.firstName === "string"
          ? data.firstName
          : data.firstName?.en || data.firstName?.ar || "";
        const lastName = typeof data.lastName === "string"
          ? data.lastName
          : data.lastName?.en || data.lastName?.ar || "";

        if (!firstName && !lastName) {
          console.log(`⚠️  Skipping ${doc.id} - no name data found`);
          skipped++;
          continue;
        }

        const baseSlug = generateSlug(firstName, lastName);
        const uniqueSlug = await generateUniqueSlug(
          baseSlug,
          db.collection(COLLECTION_NAME),
          doc.id
        );

        // Update the document with the slug
        await doc.ref.update({
          slug: uniqueSlug,
          updatedAt: new Date(),
        });

        console.log(`✅ Updated ${doc.id}: ${uniqueSlug}`);
        updated++;
      } catch (error: any) {
        console.error(`❌ Error processing ${doc.id}:`, error.message);
        errors++;
      }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log("\n✨ Migration completed!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
migrateStaffSlugs()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
