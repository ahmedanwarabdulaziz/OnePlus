import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Course } from "@/types/courses";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION_NAME = "courses";

export async function GET(request: NextRequest) {
    try {
        const snapshot = await adminDb
            .collection(COLLECTION_NAME)
            .orderBy("displayOrder", "asc")
            .get();

        const courses: Course[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            courses.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Course);
        });

        return NextResponse.json({ success: true, courses });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Required fields validation
        if (!body.title?.en && !body.title?.ar) {
            return NextResponse.json(
                { error: "Title is required in at least one language" },
                { status: 400 }
            );
        }

        // Generate slug from title
        const baseSlug = generateSlug(body.title.en || body.title.ar || "course");
        const slug = await generateUniqueSlug(
            baseSlug,
            adminDb.collection(COLLECTION_NAME)
        );

        // Get max order
        const snapshot = await adminDb
            .collection(COLLECTION_NAME)
            .orderBy("displayOrder", "desc")
            .limit(1)
            .get();

        const maxOrder = snapshot.empty ? -1 : snapshot.docs[0].data().displayOrder;

        // Clean arrays
        const cleanArray = (arr: any[]) => {
            if (!Array.isArray(arr)) return [];
            return arr.filter(item => {
                if (typeof item === 'string') return item.trim() !== '';
                if (item.en || item.ar) return true;
                return false;
            });
        };

        const newCourse = {
            ...body,
            shortDescription: body.shortDescription || { en: "", ar: "" },
            category: cleanArray(body.category),
            fullDescription: body.fullDescription || { en: "", ar: "" },
            levels: body.levels || [],
            prerequisites: cleanArray(body.prerequisites),
            learningOutcomes: cleanArray(body.learningOutcomes),
            slug,
            displayOrder: maxOrder + 1,
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const docRef = await adminDb.collection(COLLECTION_NAME).add(newCourse);

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            { error: "Failed to create course" },
            { status: 500 }
        );
    }
}
