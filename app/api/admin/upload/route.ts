import { NextRequest, NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME } from "@/lib/cloudflare-r2";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/admin/upload
 * Upload file to Cloudflare R2
 */
export async function POST(request: NextRequest) {
  try {
    // Validate R2 configuration
    console.log("R2 Config Check:", {
      bucket: R2_BUCKET_NAME ? "✓" : "✗",
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT ? "✓" : "✗",
      accessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? "✓" : "✗",
      secretKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? "✓" : "✗",
      r2Client: r2Client ? "✓" : "✗",
      endpointValue: process.env.CLOUDFLARE_R2_ENDPOINT?.substring(0, 30) + "...",
    });

    if (!R2_BUCKET_NAME || !process.env.CLOUDFLARE_R2_ENDPOINT || !r2Client) {
      console.error("R2 configuration missing:", {
        bucket: R2_BUCKET_NAME,
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        r2Client: !!r2Client,
      });
      return NextResponse.json(
        { error: "R2 storage not configured. Please check environment variables." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "staff"; // Default folder

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    if (!r2Client || !R2_BUCKET_NAME) {
      return NextResponse.json(
        { error: "R2 storage not configured. Please check environment variables." },
        { status: 500 }
      );
    }

    console.log("Uploading to R2:", {
      bucket: R2_BUCKET_NAME,
      key: fileName,
      contentType: file.type,
      size: buffer.length,
    });

    // Create PutObjectCommand with explicit parameters
    // R2 requires ContentType to be set for proper signature calculation
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type || "application/octet-stream", // Ensure ContentType is always set
      // Metadata is optional but can help with organization
    });

    try {
      const result = await r2Client.send(command);
      console.log("R2 upload successful:", result);
    } catch (r2Error: any) {
      console.error("R2 upload error details:", {
        message: r2Error.message,
        code: r2Error.code,
        name: r2Error.name,
        $metadata: r2Error.$metadata,
      });
      throw new Error(`R2 upload failed: ${r2Error.message || r2Error.code || "Unknown error"}`);
    }

    // Generate presigned URL for accessing the uploaded file
    // Presigned URLs are valid for 7 days (604800 seconds)
    const getObjectCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    let presignedUrl: string;
    try {
      presignedUrl = await getSignedUrl(r2Client, getObjectCommand, {
        expiresIn: 604800, // 7 days
      });
      console.log("Presigned URL generated:", presignedUrl.substring(0, 80) + "...");
    } catch (presignError: any) {
      console.error("Error generating presigned URL:", presignError);
      // If presigned URL fails, construct a basic URL (may not work without public access)
      const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || "";
      presignedUrl = `${endpoint}/${R2_BUCKET_NAME}/${fileName}`;
    }

    // Also construct a direct URL if public access is enabled
    let publicUrl: string;
    if (process.env.CLOUDFLARE_R2_PUBLIC_URL) {
      publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`;
    } else {
      // Use presigned URL as fallback (works even without public access)
      publicUrl = presignedUrl;
    }

    console.log("Returning URL:", {
      url: publicUrl.substring(0, 80) + "...",
      presignedUrl: presignedUrl.substring(0, 80) + "...",
      key: fileName,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      presignedUrl: presignedUrl, // Include presigned URL for immediate access
      key: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: "Failed to upload file", 
        details: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
