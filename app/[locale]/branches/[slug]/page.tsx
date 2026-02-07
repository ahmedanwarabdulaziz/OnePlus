"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Branch } from "@/types/branches";
import { Course } from "@/types/courses";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";

export default function BranchDetailPage() {
    const t = useTranslations();
    const locale = useLocale();
    const params = useParams();
    const slug = params.slug as string;

    const [branch, setBranch] = useState<Branch | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                // 1. Fetch all branches to find the matching one (Optimization: Create single branch public API later)
                const branchRes = await fetch("/api/branches");
                const branchData = await branchRes.json();

                if (branchData.success) {
                    const foundBranch = branchData.branches.find((b: Branch) => b.slug === slug);

                    if (foundBranch) {
                        setBranch(foundBranch);

                        // 2. Fetch courses for this branch
                        // Optimization: Filter server-side in API ideally, but client-side fine for now
                        const coursesRes = await fetch("/api/courses");
                        const coursesData = await coursesRes.json();

                        if (coursesData.success) {
                            const filtered = coursesData.courses.filter((c: Course) =>
                                (c.branchIds && c.branchIds.includes(foundBranch.id)) ||
                                ((c as any).branchId === foundBranch.id)
                            );
                            setCourses(filtered);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

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

    if (!branch) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Not Found</h1>
                    <Link href={getLocalizedPath("/branches", locale)} className="text-[#0f1b4b] hover:underline">
                        Back to Tracks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-[#0f1b4b] text-white overflow-hidden">
                <div className="absolute inset-0">
                    {branch.image && (
                        <Image
                            src={
                                branch.image.startsWith('http')
                                    ? branch.image
                                    : `/api/images/${branch.image}`
                            }
                            alt={getText(branch.name, locale)}
                            fill
                            className="object-cover opacity-20"
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1b4b] via-[#0f1b4b]/90 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <Link
                            href={getLocalizedPath("/branches", locale)}
                            className="inline-flex items-center text-white/70 hover:text-white mb-6 text-sm font-medium transition-colors"
                        >
                            ← {t("branches.backToTracks") || "All Tracks"}
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                            {branch.icon && (
                                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={
                                                branch.icon.startsWith('http')
                                                    ? branch.icon
                                                    : `/api/images/${branch.icon}`
                                            }
                                            alt="icon"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                {getText(branch.name, locale)}
                            </h1>
                        </div>

                        <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                            {getText(branch.description, locale)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-[#0f1b4b]">
                        {t("courses.availableCourses") || "Available Courses"}
                        <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {courses.length}
                        </span>
                    </h2>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            {t("courses.noCoursesFound") || "No courses available in this track yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                href={getLocalizedPath(`/courses/${course.slug}`, locale)}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#0f1b4b]/30 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    {course.images?.thumbnail ? (
                                        <Image
                                            src={
                                                course.images.thumbnail.startsWith('http')
                                                    ? course.images.thumbnail
                                                    : `/api/images/${course.images.thumbnail}`
                                            }
                                            alt={getText(course.title, locale)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#0f1b4b]/5">
                                            <span className="text-lg font-bold text-[#0f1b4b]/20">
                                                {getText(course.title, locale)}
                                            </span>
                                        </div>
                                    )}
                                    {course.isCertified && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#701621] text-xs font-bold px-2 py-1 rounded shadow-sm border border-[#701621]/20">
                                            Certified
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                            {course.levels?.length || 0} Levels
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#0f1b4b] mb-2 group-hover:text-[#701621] transition-colors line-clamp-2">
                                        {getText(course.title, locale)}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                                        {getText(course.shortDescription, locale)}
                                    </p>

                                    <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                            {(Array.isArray(course.targetAudience) ? course.targetAudience[0] : course.targetAudience) || 'General'}
                                        </span>
                                        <span className="text-[#0f1b4b] text-sm font-bold group-hover:underline">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-[#0f1b4b] text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-300">
                        © 2024 One Plus Training & Development. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
