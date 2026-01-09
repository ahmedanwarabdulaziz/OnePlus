"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/Header";

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
