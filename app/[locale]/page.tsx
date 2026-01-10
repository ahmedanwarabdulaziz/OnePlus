"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Branch } from "@/types/branches";
import { getText } from "@/types/translations";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import Image from "next/image";

function TracksSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();
        if (data.success) {
          setBranches(data.branches || []);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  if (branches.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-4">
          {t("branches.title") || "Specialized Tracks"}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t("branches.homeSubtitle") || "Choose your path to success with our focused training tracks."}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.slice(0, 4).map((branch) => (
            <Link
              key={branch.id}
              href={getLocalizedPath(`/branches/${branch.slug}`, locale)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
            >
              <div className="h-32 relative bg-gray-200">
                {branch.image ? (
                  <Image src={branch.image} alt={getText(branch.name, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-[#0f1b4b]/10 flex items-center justify-center">
                    <span className="text-4xl text-[#0f1b4b]/20 font-bold">{getText(branch.name, locale)[0]}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: branch.color || '#0f1b4b' }} />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0f1b4b] mb-1 group-hover:text-[#701621] transition-colors">
                  {getText(branch.name, locale)}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {getText(branch.description, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={getLocalizedPath("/branches", locale)}
            className="inline-flex items-center text-[#701621] font-bold hover:underline"
          >
            {t("common.viewAll") || "View All Tracks"} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0f1b4b]/5 to-[#701621]/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-[#0f1b4b] mb-6">
            {t("home.title")}
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl">
            {t("home.subtitle")}
          </p>
          <button className="bg-[#0f1b4b] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#0f1b4b]/90 transition-colors">
            {t("home.explorePrograms")}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-12">
            {t("home.whatWeOffer")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">
                {t("home.trainingPrograms")}
              </h3>
              <p className="text-gray-600">
                {t("home.trainingProgramsDesc")}
              </p>
            </div>
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">
                {t("home.developmentWorkshops")}
              </h3>
              <p className="text-gray-600">
                {t("home.developmentWorkshopsDesc")}
              </p>
            </div>
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">
                {t("home.expertConsultations")}
              </h3>
              <p className="text-gray-600">
                {t("home.expertConsultationsDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section (New) */}
      <TracksSection />

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
