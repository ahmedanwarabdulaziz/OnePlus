"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import { useState } from "react";
import Footer from "@/components/Footer";

type FaqItem = { q: string; a: string };
const SECTIONS = 5;
const COUNTS = [3, 3, 3, 3, 2];

export default function FAQPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);

  const getItems = (section: number): FaqItem[] => {
    const n = COUNTS[section - 1];
    const items: FaqItem[] = [];
    for (let i = 1; i <= n; i++) {
      items.push({
        q: t(`faq.section${section}Q${i}`),
        a: t(`faq.section${section}A${i}`),
      });
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative bg-[#0f1b4b] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#701621] rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("faq.pageTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t("faq.heroDesc")}
          </p>
        </div>
      </section>

      {/* Accordion sections */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {[1, 2, 3, 4, 5].map((sectionIndex) => {
            const title = t(`faq.section${sectionIndex}Title`);
            const items = getItems(sectionIndex);
            return (
              <div key={sectionIndex} className="mb-12">
                <h2 className="text-xl font-bold text-[#0f1b4b] mb-4 pb-2 border-b-2 border-[#701621]/30">
                  {title}
                </h2>
                <div className="space-y-2">
                  {items.map((item, itemIndex) => {
                    const id = `${sectionIndex}-${itemIndex}`;
                    const isOpen = openId === id;
                    return (
                      <div
                        key={itemIndex}
                        className="rounded-xl border-2 border-gray-100 overflow-hidden bg-white shadow-sm hover:border-[#0f1b4b]/20 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : id)}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right text-[#0f1b4b] font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex-1">{item.q}</span>
                          <span
                            className={`shrink-0 w-8 h-8 rounded-full bg-[#701621]/10 flex items-center justify-center text-[#701621] transition-transform ${isOpen ? "rotate-180" : ""}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-gray-600 leading-relaxed pl-0">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f1b4b]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t("faq.ctaTitle")}
          </h2>
          <p className="text-white/90 mb-8">
            {t("faq.ctaDesc")}
          </p>
          <Link
            href={getLocalizedPath("/contact", locale)}
            className="inline-flex items-center bg-[#701621] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#701621]/90 transition-colors shadow-lg"
          >
            {t("common.contact")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
