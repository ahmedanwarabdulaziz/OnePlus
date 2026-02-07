import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Category, CategoryInput } from "@/types/categories";
import { TranslatedText } from "@/types/translations";

const COLLECTION_NAME = "categories";

/**
 * GET /api/admin/categories
 * Get all categories
 */
export async function GET(request: NextRequest) {
    try {
        const snapshot = await adminDb
            .collection(COLLECTION_NAME)
            .orderBy("name.en", "asc")
            .get();

        const categories: Category[] = [];
        const { Timestamp } = await import("firebase-admin/firestore");

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            categories.push({
                id: doc.id,
                name: data.name || { en: "", ar: "" },
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
                usageCount: data.usageCount || 0,
            });
        });

        return NextResponse.json({ success: true, categories });
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories", details: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/categories
 * Create a new category
 */
export async function POST(request: NextRequest) {
    try {
        const body: CategoryInput = await request.json();

        // Validate input
        if (!body.name || (!body.name.en && !body.name.ar)) {
            return NextResponse.json(
                { error: "Category name (English or Arabic) is required" },
                { status: 400 }
            );
        }

        // Check if category with same name already exists
        const existingQuery = await adminDb
            .collection(COLLECTION_NAME)
            .where("name.en", "==", body.name.en)
            .limit(1)
            .get();

        if (!existingQuery.empty) {
            return NextResponse.json(
                { error: "A category with this English name already exists" },
                { status: 409 }
            );
        }

        const { Timestamp } = await import("firebase-admin/firestore");
        const now = Timestamp.now();

        const docRef = await adminDb.collection(COLLECTION_NAME).add({
            name: body.name,
            createdAt: now,
            updatedAt: now,
            usageCount: 0,
        });

        const category: Category = {
            id: docRef.id,
            name: body.name,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
            usageCount: 0,
        };

        return NextResponse.json({ success: true, category }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category", details: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category (Optional - for future use)
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            );
        }

        await adminDb.collection(COLLECTION_NAME).doc(id).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category", details: error.message },
            { status: 500 }
        );
    }
}
