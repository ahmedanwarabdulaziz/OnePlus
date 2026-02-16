import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { BranchInput } from "@/types/branches";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "branches";

// GET /api/admin/branches - List all branches
export async function GET(request: NextRequest) {
    try {
        console.log("Fetching branches...");

        // Don't use orderBy if not all documents have displayOrder field
        // Instead, fetch all and sort in-memory
        const snapshot = await adminDb.collection(COLLECTION_NAME).get();

        console.log(`Found ${snapshot.docs.length} branches in database`);

        const branches = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Timestamps to Strings/Dates if needed, for now keep simple or convert to Date
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
                // Ensure displayOrder exists
                displayOrder: data.displayOrder !== undefined ? data.displayOrder : 0,
            };
        }) as any[];

        // Sort by displayOrder in-memory
        branches.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

        console.log("Returning branches:", branches.length, "total");

        return NextResponse.json({ success: true, branches });
    } catch (error: any) {
        console.error("Error fetching branches:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/admin/branches - Create a new branch
export async function POST(request: NextRequest) {
    try {
        const data: BranchInput = await request.json();

        // Basic Validation
        if (!data.slug || !data.name.en) {
            return NextResponse.json({ error: "Slug and English Name are required" }, { status: 400 });
        }

        // Check slug uniqueness
        const slugCheck = await adminDb.collection(COLLECTION_NAME).where("slug", "==", data.slug).get();
        if (!slugCheck.empty) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }

        const docRef = adminDb.collection(COLLECTION_NAME).doc();
        const now = Timestamp.now();

        const newBranch = {
            ...data,
            id: docRef.id,
            createdAt: now,
            updatedAt: now,
            displayOrder: data.displayOrder ?? 0,
            isActive: data.isActive !== undefined ? data.isActive : true,
            isFeatured: data.isFeatured === true,
        };

        await docRef.set(newBranch);

        return NextResponse.json({ success: true, branch: newBranch });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
