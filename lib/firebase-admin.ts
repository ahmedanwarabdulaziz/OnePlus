import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import fs from "fs";

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || "./one-plus-6a6b5-firebase-adminsdk-fbsvc-92939dbc84.json";
  const fullPath = path.resolve(process.cwd(), serviceAccountPath);
  
  try {
    if (fs.existsSync(fullPath)) {
      // Read and parse the service account JSON file
      const serviceAccountJson = fs.readFileSync(fullPath, "utf8");
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      const errorMsg = `Firebase Admin SDK file not found at: ${fullPath}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error: any) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
    console.error("Full error:", error);
    console.error("Please ensure the Firebase Admin SDK JSON file exists at:", fullPath);
    // Re-throw to prevent app from starting with broken admin functionality
    throw error;
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
