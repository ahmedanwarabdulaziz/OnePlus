"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Branch } from "@/types/branches";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";

export default function BranchesPage() {
    const t = useTranslations();
    const locale = useLocale();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/branches");
                const data = await response.json();
                if (data.success) {
                    setBranches(data.branches || []);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0f1b4b] mb-6">
                        {t("branches.title") || "Our Training Tracks"}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t("branches.subtitle") || "Explore our specialized training paths designed to help you master specific skills and advance your career."}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center h-64 items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f1b4b]"></div>
                    </div>
                ) : branches.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {branches.map((branch) => (
                            <Link
                                key={branch.id}
                                href={getLocalizedPath(`/branches/${branch.slug}`, locale)}
                                className="group block h-full"
                            >
                                <div className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Image Area */}
                                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                        {branch.image ? (
                                            <Image
                                                src={branch.image}
                                                alt={getText(branch.name, locale)}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center"
                                                style={{ backgroundColor: branch.color || '#0f1b4b' }}
                                            >
                                                <span className="text-4xl font-bold text-white opacity-20">
                                                    {getText(branch.name, locale).charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        {/* Icon Overlay */}
                                        {branch.icon && (
                                            <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-xl shadow-lg p-3 z-10">
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={branch.icon}
                                                        alt="icon"
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 pt-10">
                                        <h3 className="text-xl font-bold text-[#0f1b4b] mb-3 group-hover:text-[#701621] transition-colors">
                                            {getText(branch.name, locale)}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                                            {getText(branch.description, locale)}
                                        </p>
                                        <div className="mt-4 flex items-center text-[#701621] font-bold text-sm">
                                            {t("common.learnMore") || "Explore Track"}
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>

                                    {/* Color Stripe */}
                                    <div className="h-1 w-full" style={{ backgroundColor: branch.color || '#0f1b4b' }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                            {t("branches.noBranches") || "No training tracks found."}
                        </p>
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
