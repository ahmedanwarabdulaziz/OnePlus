import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { BranchInput } from "@/types/branches";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "branches";

// GET /api/admin/branches/[id] - Get single branch
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const doc = await adminDb.collection(COLLECTION_NAME).doc(params.id).get();
        if (!doc.exists) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, branch: { id: doc.id, ...doc.data() } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/admin/branches/[id] - Update branch
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data: BranchInput = await request.json();

        // Basic Validation
        if (!data.slug || !data.name.en) {
            return NextResponse.json({ error: "Slug and English Name are required" }, { status: 400 });
        }

        // Check unique slug if changed (simplified check for now)
        // Ideally exclude current ID

        const docRef = adminDb.collection(COLLECTION_NAME).doc(params.id);

        await docRef.update({
            ...data,
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/branches/[id] - Delete branch
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await adminDb.collection(COLLECTION_NAME).doc(params.id).delete();
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
