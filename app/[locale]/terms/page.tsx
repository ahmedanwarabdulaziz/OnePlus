"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import Footer from "@/components/Footer";

const SECTIONS = 14;

export default function TermsPage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative bg-[#0f1b4b] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#701621] rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("terms.pageTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t("terms.heroDesc")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {Array.from({ length: SECTIONS }, (_, i) => i + 1).map((n) => {
            const title = t(`terms.s${n}Title`);
            const content = t(`terms.s${n}Content`);
            const paragraphs = content.split("\n").filter(Boolean);
            return (
              <div key={n} className="mb-12">
                <h2 className="text-xl font-bold text-[#0f1b4b] mb-4 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#701621]/10 text-[#701621] flex items-center justify-center text-sm font-bold">
                    {n}
                  </span>
                  {title}
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-3 pl-10">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-16 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-600 mb-4">
              {t("terms.contactCta")}
            </p>
            <Link
              href={getLocalizedPath("/contact", locale)}
              className="inline-flex items-center bg-[#701621] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#701621]/90 transition-colors"
            >
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
