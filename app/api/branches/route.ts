import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const COLLECTION_NAME = "branches";

// GET /api/branches - List active branches
export async function GET(request: NextRequest) {
    try {
        const activeOnly = request.nextUrl.searchParams.get("activeOnly") !== "false";

        let query = adminDb.collection(COLLECTION_NAME);

        if (activeOnly) {
            query = query.where("isActive", "==", true) as any;
        }

        const snapshot = await query.get();
        const branches = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            }))
            .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

        return NextResponse.json({ success: true, branches });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
