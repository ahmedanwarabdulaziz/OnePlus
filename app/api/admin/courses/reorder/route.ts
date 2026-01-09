import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
    try {
        const { updates } = await request.json();

        if (!Array.isArray(updates)) {
            return NextResponse.json(
                { error: "Invalid updates format" },
                { status: 400 }
            );
        }

        const batch = adminDb.batch();

        updates.forEach((update: { id: string; displayOrder: number }) => {
            const docRef = adminDb.collection("courses").doc(update.id);
            batch.update(docRef, { displayOrder: update.displayOrder });
        });

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error reordering courses:", error);
        return NextResponse.json(
            { error: "Failed to reorder courses" },
            { status: 500 }
        );
    }
}
