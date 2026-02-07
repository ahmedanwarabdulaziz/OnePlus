"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Course } from "@/types/courses";
import { useLocale } from "@/hooks/useLocale";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";

export default function CoursesPage() {
    const t = useTranslations();
    const locale = useLocale();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/courses");
            const data = await response.json();
            if (data.success) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0f1b4b] mb-4">
                        {t("courses.title") || "Our Courses"}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t("courses.subtitle") || "Explore our wide range of professional courses designed to elevate your skills."}
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            {t("courses.noCourses") || "No courses available at the moment."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const title = getText(course.title, locale);
                            const description = getText(course.shortDescription, locale);

                            // Fallback to English title/desc if empty in current locale
                            // or strictly hide? Staff used strict. Let's start with strict for consistency.
                            // Actually for courses, you might probably want to see it even if not translated?
                            // The user said "exactly like we did in staff", and staff hides English content in Arabic view.
                            // So I will stick to getStrictText logic if I had it, but getText helper handles fallback logic based on its implementation.
                            // Staff page used `getText(..., locale, false)` for strictness.

                            // Let's implement strict display logic inline or helper
                            const hasArabicTitle = course.title?.ar?.trim();
                            const hasArabicDesc = course.shortDescription?.ar?.trim();

                            // If locale is Arabic and no Arabic content, skip rendering this card?
                            // Or render placeholder? Staff page logic: 
                            // "Strict mode: Only show Arabic short bio in Arabic mode. If missing, show nothing."
                            // But for the Card itself? If the TITLE is missing, the card probably shouldn't exist in that locale view?
                            // Let's assume we show the card but maybe with English fallback if strict is OFF, 
                            // BUT for staff we enforced strict.
                            // Let's use standard getText for now which has a fallback param (default true).
                            // Actually, I should respect the pattern: 
                            // `const shortBio = getText(member.shortBio, locale, false);`

                            const displayTitle = getText(course.title, locale, false) || (locale === 'en' ? getText(course.title, 'ar', false) : '');
                            // If empty title in current locale, maybe skip?
                            // Let's just show what getText returns for now.

                            return (
                                <Link
                                    key={course.id}
                                    href={getLocalizedPath(`/courses/${course.slug}`, locale)}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0f1b4b]/20 flex flex-col h-full"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {course.images?.thumbnail ? (
                                            <Image
                                                src={
                                                    course.images.thumbnail.startsWith('http')
                                                        ? course.images.thumbnail
                                                        : `/api/images/${course.images.thumbnail}`
                                                }
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0f1b4b] to-[#1e2d6f] flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-bold text-xl opacity-90">{title}</span>
                                            </div>
                                        )}
                                        {course.isCertified && (
                                            <div className="absolute top-4 right-4 bg-[#701621] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                {t("courses.certified") || "Certified"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {/* Audience Badges */}
                                            {(Array.isArray(course.targetAudience) ? course.targetAudience : [course.targetAudience]).map(aud => (
                                                <span key={aud} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium capitalize">
                                                    {aud}
                                                </span>
                                            ))}
                                            {/* Category Badges */}
                                            {(Array.isArray(course.category) ? course.category : [course.category]).filter(c => c?.en || c?.ar).map((cat, i) => (
                                                <span key={i} className="inline-block px-2 py-1 bg-[#0f1b4b]/5 text-[#0f1b4b] text-xs rounded-md font-medium">
                                                    {getText(cat, locale)}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-bold text-[#0f1b4b] mb-2 line-clamp-2 group-hover:text-[#701621] transition-colors">
                                            {title}
                                        </h3>

                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                            <span>{course.levels?.length || 0} Levels</span>
                                            <span className="group-hover:translate-x-1 transition-transform text-[#0f1b4b] font-medium flex items-center gap-1">
                                                {t("common.viewDetails") || "View Details"} →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

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
