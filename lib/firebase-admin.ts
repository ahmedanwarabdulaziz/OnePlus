import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import fs from "fs";

// Initialize Firebase Admin SDK
try {
  if (getApps().length === 0) {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (error) {
        console.warn("Could not parse FIREBASE_SERVICE_ACCOUNT_KEY.");
      }
    }

    if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        serviceAccount = {
          project_id: process.env.FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: privateKey,
        };
      } catch (error) {
        console.warn("Could not construct credentials from individual vars.");
      }
    }

    if (!serviceAccount) {
      const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || "./one-plus-6a6b5-firebase-adminsdk-fbsvc-92939dbc84.json";
      const fullPath = path.resolve(process.cwd(), serviceAccountPath);
      if (fs.existsSync(fullPath)) {
        const serviceAccountJson = fs.readFileSync(fullPath, "utf8");
        serviceAccount = JSON.parse(serviceAccountJson);
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      console.warn("No valid Firebase Admin credentials found. Skipping initialization. (This is expected during build if env vars are missing)");
    }
  }
} catch (error) {
  console.warn("Firebase Admin Initialization Check Failed:", error);
}

// Get Firestore and Auth instances
// We cast these to their types to satisfy TypeScript, but they might be undefined at runtime if init failed.
// This allows the BUILD to succeed. Runtime will throw if accessed without init.
let adminDb: ReturnType<typeof getFirestore> = undefined as any;
let adminAuth: ReturnType<typeof getAuth> = undefined as any;

try {
  if (getApps().length > 0) {
    adminDb = getFirestore();
    adminAuth = getAuth();
  }
} catch (error) {
  console.error("Failed to get Firestore/Auth instances:", error);
}

export { adminDb, adminAuth };
