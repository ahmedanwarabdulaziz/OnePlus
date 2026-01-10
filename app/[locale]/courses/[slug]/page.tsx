"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Course } from "@/types/courses";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";

export default function CourseDetailPage() {
    const t = useTranslations();
    const locale = useLocale();
    const params = useParams();
    const slug = params.slug as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                // Fetch all courses and filter by slug client-side because our API logic is simple for now
                // Or better, let's just reuse the /api/courses and find it. 
                // Ideally we should have a /api/courses/[slug] endpoint but for now I can fetch all or filter.
                // Wait, staff had /api/staff/[slug]. I should verify if I have /api/courses/[slug] public endpoint.
                // I only created /api/courses (GET all) in standard route.
                // I DO NOT have a public single course endpoint yet. 
                // I should update my plan or implement it.
                // FOR NOW, I will use /api/courses and find the matching slug to save time, 
                // as the course list is likely small < 100.
                const response = await fetch("/api/courses");
                const data = await response.json();

                if (data.success && data.courses) {
                    const found = data.courses.find((c: Course) => c.slug === slug || c.id === slug);
                    setCourse(found || null);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCourse();
        } else {
            setLoading(false);
        }
    }, [slug]);

    const hasContent = (val: any) => {
        const txt = getText(val, locale, false);
        return txt && txt.trim().length > 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f1b4b]"></div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
                    <Link href={getLocalizedPath("/courses", locale)} className="text-[#0f1b4b] hover:underline">
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    const levels = course.levels || [];
    const prerequisites = (course.prerequisites || []).filter(p => hasContent(p));
    const outcomes = (course.learningOutcomes || []).filter(o => hasContent(o));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full bg-[#0f1b4b]">
                {course.images?.hero ? (
                    <Image
                        src={course.images.hero}
                        alt={getText(course.title, locale)}
                        fill
                        className="object-cover opacity-50"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1b4b] to-[#701621] opacity-90" />
                )}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-3xl">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(course.targetAudience) ? course.targetAudience : [course.targetAudience]).map(aud => (
                                    <span key={aud} className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium capitalize border border-white/30">
                                        {aud}
                                    </span>
                                ))}
                                {course.isCertified && (
                                    <span className="inline-block px-3 py-1 bg-[#701621] text-white text-sm rounded-full font-bold shadow-lg">
                                        {t("courses.certified") || "Certified"}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {getText(course.title, locale)}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 line-clamp-3">
                                {getText(course.shortDescription, locale)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href={getLocalizedPath("/courses", locale)}
                    className="inline-flex items-center text-[#0f1b4b] hover:underline mb-8"
                >
                    ← {t("common.back") || "Back to Courses"}
                </Link>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">

                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                                {t("courses.description") || "Course Description"}
                            </h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                                {getText(course.fullDescription, locale) || getText(course.shortDescription, locale)}
                            </div>
                        </section>

                        {/* Learning Outcomes */}
                        {outcomes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                                    {t("courses.whatYouLearn") || "What You'll Learn"}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {outcomes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="mt-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#0f1b4b]/10 text-[#0f1b4b]">
                                                ✓
                                            </span>
                                            <span className="text-gray-700">{getText(item, locale)}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Curriculum / Levels */}
                        {levels.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                                    {t("courses.curriculum") || "Course Curriculum"}
                                </h2>
                                <div className="space-y-4">
                                    {levels.map((level, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-4">
                                                <h3 className="font-bold text-lg text-[#0f1b4b]">
                                                    {getText(level.name, locale) || `Level ${i + 1}`}
                                                </h3>
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    {level.duration && (
                                                        <span className="flex items-center gap-1">
                                                            ⏱ {level.duration}
                                                        </span>
                                                    )}
                                                    {level.price && (
                                                        <span className="flex items-center gap-1 font-semibold text-[#701621]">
                                                            💲 {level.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Prerequisites Card */}
                        {prerequisites.length > 0 && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-[#0f1b4b] mb-4">
                                    {t("courses.prerequisites") || "Prerequisites"}
                                </h3>
                                <ul className="space-y-3">
                                    {prerequisites.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <span className="text-[#701621] mt-1">•</span>
                                            {getText(req, locale)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Certification Card */}
                        {course.isCertified && (
                            <div className="bg-[#f8f9fa] p-6 rounded-xl border-l-4 border-[#701621]">
                                <h3 className="text-lg font-bold text-[#0f1b4b] mb-2">
                                    Offers Certification
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {getText(course.certificationDetails || { en: "", ar: "" }, locale) || "Upon successful completion of this course, you will receive a recognized certificate."}
                                </p>
                            </div>
                        )}

                        {/* Contact / CTA */}
                        <div className="bg-[#0f1b4b] p-6 rounded-xl text-white text-center">
                            <h3 className="text-xl font-bold mb-2">
                                Interested?
                            </h3>
                            <p className="text-white/80 text-sm mb-6">
                                Contact us to register or learn more about this course.
                            </p>
                            <Link href="/contact" className="block w-full py-3 bg-white text-[#0f1b4b] font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                Contact Us
                            </Link>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0f1b4b] text-white py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-300">
                        © 2024 One Plus Training & Development. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
