import { adminDb } from "@/lib/firebase-admin";
import type { Branch } from "@/types/branches";
import type { Course } from "@/types/courses";
import type { StaffMember } from "@/types/staff";
import type { TranslatedText } from "@/types/translations";

const convertText = (v: unknown): TranslatedText => {
  if (!v) return { en: "", ar: "" };
  if (typeof v === "string") return { en: v, ar: "" };
  const o = v as { en?: string; ar?: string };
  return { en: o.en || "", ar: o.ar || "" };
};

const convertTextArray = (v: unknown): TranslatedText[] => {
  if (!v || !Array.isArray(v)) return [];
  return v.map((item) => convertText(item));
};

/** Server-only: fetch branches for home (active, sorted). */
export async function getBranchesForHome(): Promise<Branch[]> {
  try {
    const snapshot = await adminDb.collection("branches").where("isActive", "==", true).get();
    const branches = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        slug: d.slug || doc.id,
        name: convertText(d.name),
        description: convertText(d.description),
        image: d.image,
        icon: d.icon,
        color: d.color,
        displayOrder: d.displayOrder ?? 0,
        isActive: true,
        isFeatured: d.isFeatured === true,
      };
    });
    branches.sort((a, b) => a.displayOrder - b.displayOrder);
    return branches;
  } catch {
    return [];
  }
}

/** Server-only: fetch courses for home (active, sorted, first 6 only). */
export async function getCoursesForHome(): Promise<Course[]> {
  try {
    const snapshot = await adminDb.collection("courses").where("isActive", "==", true).get();
    const courses: Course[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        title: convertText(data.title),
        shortDescription: convertText(data.shortDescription),
        fullDescription: convertText(data.fullDescription),
        category: Array.isArray(data.category) ? data.category.map(convertText) : [],
        targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : [],
        isCertified: data.isCertified || false,
        certificationDetails: convertText(data.certificationDetails),
        levels: data.levels || [],
        prerequisites: data.prerequisites || [],
        learningOutcomes: data.learningOutcomes || [],
        images: data.images || {},
        isActive: true,
        displayOrder: data.displayOrder ?? 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Course;
    });
    courses.sort((a, b) => a.displayOrder - b.displayOrder);
    return courses.slice(0, 6);
  } catch {
    return [];
  }
}

/** Server-only: fetch staff for home (active, sorted, first 8). No slug generation. */
export async function getStaffForHome(): Promise<StaffMember[]> {
  try {
    const snapshot = await adminDb.collection("staff").where("isActive", "==", true).get();
    const staff: StaffMember[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date();
      const updatedAt = data.updatedAt?.toDate?.() || new Date();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        firstName: convertText(data.firstName),
        lastName: convertText(data.lastName),
        email: data.email || "",
        phone: data.phone || "",
        type: data.type || "employee",
        title: data.title ? convertText(data.title) : undefined,
        positions: convertTextArray(data.positions),
        bio: convertText(data.bio),
        shortBio: convertText(data.shortBio),
        images: data.images || {},
        specialties: convertTextArray(data.specialties),
        certifications: convertTextArray(data.certifications),
        experience: Array.isArray(data.experience) ? convertTextArray(data.experience) : [],
        education: convertTextArray(data.education),
        achievements: convertTextArray(data.achievements),
        areasOfExpertise: convertTextArray(data.areasOfExpertise),
        languages: convertTextArray(data.languages),
        socialLinks: data.socialLinks || {},
        isActive: true,
        displayOrder: data.displayOrder ?? 0,
        createdAt,
        updatedAt,
      };
    });
    staff.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      const name = (x: StaffMember) => (typeof x.lastName === "string" ? x.lastName : (x.lastName as TranslatedText)?.en || "");
      return name(a).localeCompare(name(b));
    });
    return staff.slice(0, 8);
  } catch {
    return [];
  }
}
