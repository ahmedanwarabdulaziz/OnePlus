import { NextRequest, NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME } from "@/lib/cloudflare-r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

/**
 * GET /api/images/[...path]
 * Serve images from Cloudflare R2
 * Example: /api/images/staff/square/uuid.jpg
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const path = params.path;

        if (!path || path.length === 0) {
            return new NextResponse("Image path not provided", { status: 400 });
        }

        // Reconstruct the full key path (e.g., "staff/square/uuid.jpg")
        const key = path.join("/");

        if (!r2Client || !R2_BUCKET_NAME) {
            return new NextResponse("R2 storage not configured", { status: 500 });
        }

        // Get the object from R2
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        });

        const response = await r2Client.send(command);

        if (!response.Body) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Convert the stream to a buffer
        const chunks = [];
        for await (const chunk of response.Body as any) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Return the image with appropriate headers
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": response.ContentType || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
                "Content-Length": buffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("Error serving image:", error);

        if (error.name === "NoSuchKey" || error.code === "NoSuchKey") {
            return new NextResponse("Image not found", { status: 404 });
        }

        return new NextResponse("Error loading image", { status: 500 });
    }
}
