"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import Footer from "@/components/Footer";

const valueIcons = [
  <svg key="v1" className="w-8 h-8 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" /></svg>,
  <svg key="v2" className="w-8 h-8 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="v3" className="w-8 h-8 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  <svg key="v4" className="w-8 h-8 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  <svg key="v5" className="w-8 h-8 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
];

const offerIcons = [
  <svg key="o1" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  <svg key="o2" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  <svg key="o3" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
];

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero — full-bleed accent strip */}
      <section className="relative bg-[#0f1b4b] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#701621] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#701621] rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#701621] font-semibold text-sm uppercase tracking-wider mb-4">
            {t("about.pageTitle")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t("about.pageTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            {t("about.intro")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={getLocalizedPath("/branches", locale)}
              className="bg-[#701621] text-white px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-[#701621]/90 transition-all shadow-lg hover:shadow-xl"
            >
              {t("home.explorePrograms")}
            </Link>
            <Link
              href="#contact"
              className="bg-white/10 text-white border-2 border-white/60 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all"
            >
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* Who we are — single statement block */}
      <section className="py-16 md:py-20 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f1b4b] mb-6 text-center">
            {t("about.whoWeAreTitle")}
          </h2>
          <div className="h-1 w-16 bg-[#701621] mx-auto mb-8" aria-hidden />
          <p className="text-lg text-gray-600 leading-relaxed text-center">
            {t("about.whoWeAreText")}
          </p>
        </div>
      </section>

      {/* Vision & Mission — two cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-white border-2 border-[#0f1b4b]/10 shadow-sm hover:shadow-lg hover:border-[#701621]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#0f1b4b]/10 flex items-center justify-center mb-6 text-[#0f1b4b] group-hover:bg-[#701621]/10 group-hover:text-[#701621] transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0f1b4b] mb-3">
                {t("about.visionTitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("about.visionText")}
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-white border-2 border-[#0f1b4b]/10 shadow-sm hover:shadow-lg hover:border-[#701621]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#0f1b4b]/10 flex items-center justify-center mb-6 text-[#0f1b4b] group-hover:bg-[#701621]/10 group-hover:text-[#701621] transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0f1b4b] mb-3">
                {t("about.missionTitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("about.missionText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values — grid of icon cards */}
      <section className="py-16 md:py-20 bg-[#0f1b4b] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t("about.valuesTitle")}
          </h2>
          <div className="h-1 w-16 bg-[#701621] mx-auto mb-12" aria-hidden />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="shrink-0">{valueIcons[i - 1]}</div>
                <div>
                  <h4 className="font-bold text-white mb-1">{t(`about.value${i}Title`)}</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{t(`about.value${i}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer — 3 cards with icons */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f1b4b] text-center mb-12">
            {t("about.whatWeOfferTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-8 rounded-2xl border-2 border-[#0f1b4b]/10 hover:border-[#701621]/30 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-[#701621]/10 text-[#701621] flex items-center justify-center mx-auto mb-5">
                  {offerIcons[i - 1]}
                </div>
                <h4 className="font-bold text-[#0f1b4b] text-lg mb-2">{t(`about.offer${i}Title`)}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{t(`about.offer${i}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve — two audience cards */}
      <section className="py-16 md:py-20 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f1b4b] text-center mb-12">
            {t("about.whoWeServeTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white shadow-md border border-gray-100 flex gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-[#0f1b4b]/10 flex items-center justify-center shrink-0 text-[#0f1b4b]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-[#701621] text-lg mb-2">{t("about.forIndividualsTitle")}</h4>
                <p className="text-gray-600 leading-relaxed">{t("about.forIndividualsText")}</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-white shadow-md border border-gray-100 flex gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-[#0f1b4b]/10 flex items-center justify-center shrink-0 text-[#0f1b4b]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-[#701621] text-lg mb-2">{t("about.forCompaniesTitle")}</h4>
                <p className="text-gray-600 leading-relaxed">{t("about.forCompaniesText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why One Plus — checklist strip */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f1b4b] text-center mb-12">
            {t("about.whyTitle")}
          </h2>
          <ul className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex gap-4 items-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#701621]/20 transition-all">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#701621]/10 flex items-center justify-center text-[#701621]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <span className="text-gray-700 font-medium">{t(`about.why${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team CTA card */}
      <section className="py-16 md:py-20 bg-gray-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 md:p-12 rounded-2xl bg-[#0f1b4b] text-white text-center shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("about.teamTitle")}
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              {t("about.teamText")}
            </p>
            <Link
              href={getLocalizedPath("/staff", locale)}
              className="inline-flex items-center gap-2 bg-[#701621] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#701621]/90 transition-colors shadow-lg"
            >
              {t("about.meetTeam")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA — full width */}
      <section id="contact" className="py-20 md:py-24 bg-[#0f1b4b]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("about.finalCtaTitle")}
          </h2>
          <p className="text-white/90 text-lg mb-10">
            {t("about.finalCtaText")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={getLocalizedPath("/courses", locale)}
              className="bg-[#701621] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#701621]/90 transition-colors shadow-lg"
            >
              {t("about.exploreCourses")}
            </Link>
            <Link
              href="#contact"
              className="bg-white/15 text-white border-2 border-white/70 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/25 transition-colors"
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
