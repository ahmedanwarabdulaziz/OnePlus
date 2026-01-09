import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "courses";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Remove empty strings from arrays
        const cleanArray = (arr: any[]) => {
            if (!Array.isArray(arr)) return [];
            return arr.filter(item => {
                if (typeof item === 'string') return item.trim() !== '';
                if (item.en || item.ar) return true;
                return false;
            });
        };

        const updateData = {
            ...body,
            shortDescription: body.shortDescription || { en: "", ar: "" },
            fullDescription: body.fullDescription || { en: "", ar: "" },
            category: cleanArray(body.category),
            levels: body.levels || [],
            prerequisites: cleanArray(body.prerequisites),
            learningOutcomes: cleanArray(body.learningOutcomes),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key]
        );

        await adminDb.collection(COLLECTION_NAME).doc(id).update(updateData);

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            { error: "Failed to update course" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await adminDb.collection(COLLECTION_NAME).doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { error: "Failed to delete course" },
            { status: 500 }
        );
    }
}
