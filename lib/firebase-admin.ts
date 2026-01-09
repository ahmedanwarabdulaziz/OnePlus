import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import fs from "fs";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Production/Netlify: Use environment variable
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log("Using Firebase Admin SDK from environment variable");
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
    }
  } else {
    // Local: Use file
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || "./one-plus-6a6b5-firebase-adminsdk-fbsvc-92939dbc84.json";
    const fullPath = path.resolve(process.cwd(), serviceAccountPath);

    if (fs.existsSync(fullPath)) {
      try {
        const serviceAccountJson = fs.readFileSync(fullPath, "utf8");
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log("Using Firebase Admin SDK from local file");
      } catch (error: any) {
        console.error("Failed to read/parse local service account file:", error);
        throw error;
      }
    } else {
      console.error(`Firebase Admin SDK file not found at: ${fullPath} and FIREBASE_SERVICE_ACCOUNT_KEY not set.`);
      // In build environment if we don't need DB access strictly (e.g. linting), we might not want to crash, 
      // but typically we do need it for getStaticProps/migration. 
      // We will throw to be safe and ensure correct setup.
      throw new Error("Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY or ensure file exists.");
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
      throw error;
    }
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
