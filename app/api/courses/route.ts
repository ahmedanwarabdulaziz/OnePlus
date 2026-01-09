import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Course } from "@/types/courses";

const COLLECTION_NAME = "courses";

/**
 * GET /api/courses
 * Get all active courses (public API)
 */
export async function GET(request: NextRequest) {
    try {
        const query = adminDb.collection(COLLECTION_NAME).where("isActive", "==", true);

        // Fallback to simple get and sort in memory to avoid missing index errors during build
        const snapshot = await query.get();

        const courses: Course[] = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();

            // Convert Firestore Timestamps
            const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
            const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);

            courses.push({
                id: doc.id,
                slug: data.slug || doc.id,
                title: data.title || { en: "", ar: "" },
                shortDescription: data.shortDescription || { en: "", ar: "" },
                fullDescription: data.fullDescription || { en: "", ar: "" },
                category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []),
                targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : (data.targetAudience ? [data.targetAudience] : []),
                isCertified: data.isCertified || false,
                certificationDetails: data.certificationDetails || { en: "", ar: "" },
                levels: data.levels || [],
                prerequisites: data.prerequisites || [],
                learningOutcomes: data.learningOutcomes || [],
                images: data.images || {},
                isActive: true,
                displayOrder: data.displayOrder ?? 0,
                createdAt,
                updatedAt,
            } as Course);
        }

        // In-memory sort fallback
        if (courses.length > 0 && snapshot.docs[0].data().displayOrder === undefined) {
            courses.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }

        const response = NextResponse.json({ success: true, courses });

        // Cache for 5 minutes
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
        );

        return response;
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses", details: error.message },
            { status: 500 }
        );
    }
}
