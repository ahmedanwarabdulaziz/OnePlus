import { S3Client } from "@aws-sdk/client-s3";

const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME_ENV = process.env.CLOUDFLARE_R2_BUCKET_NAME;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME_ENV) {
  console.warn("⚠️ Cloudflare R2 environment variables are missing. Image uploads will fail.");
  console.warn("Required variables:", {
    CLOUDFLARE_R2_ENDPOINT: !!R2_ENDPOINT,
    CLOUDFLARE_R2_ACCESS_KEY_ID: !!R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: !!R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET_NAME: !!R2_BUCKET_NAME_ENV,
  });
}

// Clean and validate credentials - remove all whitespace including newlines
const cleanEndpoint = R2_ENDPOINT?.trim().replace(/\/$/, "").replace(/\s+/g, "") || "";
const cleanAccessKey = R2_ACCESS_KEY_ID?.trim().replace(/\s+/g, "") || "";
const cleanSecretKey = R2_SECRET_ACCESS_KEY?.trim().replace(/\s+/g, "") || "";

// Debug: Log credential info (not values) to verify they're being read
if (cleanEndpoint && cleanAccessKey && cleanSecretKey) {
  console.log("R2 Client Initialization:", {
    endpointLength: cleanEndpoint.length,
    accessKeyLength: cleanAccessKey.length,
    secretKeyLength: cleanSecretKey.length,
    endpointPrefix: cleanEndpoint.substring(0, 50),
    endpointFormat: cleanEndpoint.includes("r2.cloudflarestorage.com") ? "✓ Correct format" : "✗ Check format",
    endpointHasHttps: cleanEndpoint.startsWith("https://") ? "✓" : "✗",
  });
}

// Only initialize R2 client if all credentials are available
// R2 uses S3-compatible API but requires specific configuration
// IMPORTANT: R2 endpoint should be: https://[account-id].r2.cloudflarestorage.com
// For R2, we need to use path-style URLs and ensure proper signing
export const r2Client = (cleanEndpoint && cleanAccessKey && cleanSecretKey)
  ? new S3Client({
      region: "auto", // R2 requires "auto" region
      endpoint: cleanEndpoint,
      credentials: {
        accessKeyId: cleanAccessKey,
        secretAccessKey: cleanSecretKey,
      },
      forcePathStyle: true, // R2 requires path-style URLs: https://endpoint/bucket/key
      // Don't use virtual-hosted-style for R2
    })
  : null as any; // Type assertion to allow null check in route

export const R2_BUCKET_NAME = R2_BUCKET_NAME_ENV?.trim() || "";
