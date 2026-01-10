import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import fs from "fs";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Option 1: Full JSON in one variable
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log("Using Firebase Admin SDK from FIREBASE_SERVICE_ACCOUNT_KEY");
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Format should be valid JSON.");
      // Don't throw yet, try Option 2
    }
  }

  if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    // Option 2: Individual variables (Safer for newlines)
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      serviceAccount = {
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: privateKey,
      };
      console.log("Using Firebase Admin SDK from individual environment variables");
    } catch (error) {
      console.error("Failed to construct credentials from individual variables:", error);
    }
  }

  // Option 3: Local file (fallback)
  if (!serviceAccount) {
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || "./one-plus-6a6b5-firebase-adminsdk-fbsvc-92939dbc84.json";
    const fullPath = path.resolve(process.cwd(), serviceAccountPath);

    if (fs.existsSync(fullPath)) {
      try {
        const serviceAccountJson = fs.readFileSync(fullPath, "utf8");
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log("Using Firebase Admin SDK from local file");
      } catch (error: any) {
        console.error("Failed to read/parse local service account file:", error);
      }
    }
  }

  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } catch (error: any) {
      console.error("Failed to initialize Firebase Admin SDK with credentials:", error);
      // Throwing here is necessary because if init fails, db calls will crash anyway.
      throw error;
    }
  } else {
    // If we are in specific build phases (like linting) we might not want to crash,
    // but for 'next build' which generates static pages from DB, we MUST crash if no creds.
    // We can try to detect if we are in a build environment.
    console.error("No valid Firebase Admin credentials found.");
    console.error("Checked: FIREBASE_SERVICE_ACCOUNT_KEY, Individual Vars, and Local File.");
    console.error("Please set FIREBASE_SERVICE_ACCOUNT_KEY in Netlify Environment Variables.");
    throw new Error("Missing Firebase Admin Credentials");
  }
}

// Get Firestore and Auth instances
let adminDb: ReturnType<typeof getFirestore>;
let adminAuth: ReturnType<typeof getAuth>;

try {
  adminDb = getFirestore();
  adminAuth = getAuth();
  console.log("Firebase Admin Firestore and Auth instances created");
} catch (error: any) {
  console.error("Failed to get Firestore/Auth instances:", error.message);
  throw error;
}

export { adminDb, adminAuth };
