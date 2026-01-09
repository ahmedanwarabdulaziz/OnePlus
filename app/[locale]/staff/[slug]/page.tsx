"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { StaffMember } from "@/types/staff";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";

// Note: generateStaticParams is not needed for client components,
// but Next.js needs the route file to exist for dynamic routing

export default function StaffDetailPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("StaffDetailPage - Current locale:", locale, "slug:", slug);
    if (slug) {
      fetchStaff();
    } else {
      console.error("No slug found in params:", params);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale]); // Re-fetch when locale changes to get correct language

  const fetchStaff = async () => {
    try {
      setLoading(true);
      console.log("Fetching staff with slug:", slug);
      const response = await fetch(`/api/staff/${slug}`);
      const data = await response.json();
      console.log("API Response:", { status: response.status, data });

      if (response.ok && data.success && data.staff) {
        setStaff(data.staff);
      } else {
        console.error("API Error:", data.error || "Failed to fetch staff", response.status);
        setStaff(null);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f1b4b]"></div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("staff.notFound")}
          </h1>
          <Link href={getLocalizedPath("/staff", locale)} className="text-[#0f1b4b] hover:underline">
            {t("staff.backToStaff")}
          </Link>
        </div>
      </div>
    );
  }

  // Helper to check if text is valid for the current locale using Regex
  const isValidForLocale = (text: string, locale: string) => {
    if (!text) return false;

    const ARABIC_REGEX = /[\u0600-\u06FF]/;
    const ENGLISH_REGEX = /[a-zA-Z]/;

    // If we are in English mode, but the text contains Arabic characters -> invalid
    if (locale === 'en' && ARABIC_REGEX.test(text)) {
      return false;
    }

    // If we are in Arabic mode, but the text contains English characters -> invalid
    if (locale === 'ar' && ENGLISH_REGEX.test(text)) {
      // If it has NO Arabic characters, it's definitely invalid for Arabic view
      if (!ARABIC_REGEX.test(text)) {
        return false;
      }
    }

    return true;
  };

  // Helper to get strictly validated text
  const getStrictText = (field: any, loc: string) => {
    const text = getText(field, loc as any, false);
    return isValidForLocale(text, loc) ? text : "";
  };

  const firstName = getStrictText(staff.firstName, locale);
  const lastName = getStrictText(staff.lastName, locale);
  const bio = getStrictText(staff.bio, locale);
  const title = staff.title ? getStrictText(staff.title, locale) : "";

  const positions = staff.positions?.map(p => getText(p, locale, false))
    .filter(Boolean) || [];

  // Handle experience as array (support both old single format and new array format)
  const experience = Array.isArray(staff.experience)
    ? staff.experience.map(e => getText(e, locale, false)).filter(Boolean)
    : staff.experience
      ? [getText(staff.experience, locale, false)].filter(Boolean)
      : [];

  const specialties = staff.specialties?.map(s => getText(s, locale, false))
    .filter(Boolean) || [];

  const certifications = staff.certifications?.map(c => getText(c, locale, false))
    .filter(Boolean) || [];

  const education = staff.education?.map(e => getText(e, locale, false))
    .filter(Boolean) || [];

  const achievements = staff.achievements?.map(a => getText(a, locale, false))
    .filter(Boolean) || [];

  const areasOfExpertise = staff.areasOfExpertise?.map(a => getText(a, locale, false))
    .filter(Boolean) || [];

  const languages = staff.languages?.map(l => getText(l, locale, false))
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={getLocalizedPath("/staff", locale)}
          className="inline-flex items-center text-[#0f1b4b] hover:underline mb-8"
        >
          ← {t("staff.backToStaff")}
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6">
                {staff.images?.square ? (
                  <Image
                    src={staff.images.square}
                    alt={`${firstName} ${lastName}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f1b4b]/10 to-[#701621]/10">
                    <span className="text-6xl font-bold text-[#0f1b4b]">
                      {firstName[0]}{lastName[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#0f1b4b] mb-2">
                    {firstName} {lastName}
                  </h1>
                  {title && (
                    <p className="text-lg text-[#701621] font-medium mb-4">{title}</p>
                  )}
                  {positions.length > 0 && (
                    <div className="bg-[#0f1b4b] rounded-xl p-6 shadow-lg text-white">
                      <div className="space-y-3">
                        {positions.map((pos, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#701621] ring-2 ring-white/20 shrink-0" />
                            <span className="text-sm font-medium leading-relaxed text-gray-100">{pos}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {staff.socialLinks && (
                  <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                    {staff.socialLinks.linkedin && (
                      <a
                        href={staff.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f1b4b] hover:text-[#701621] transition-colors font-medium flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {staff.socialLinks.website && (
                      <a
                        href={staff.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f1b4b] hover:text-[#701621] transition-colors font-medium flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("staff.website")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio Section */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                {t("staff.biography")}
              </h2>
              {bio && (
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {bio}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />


            {experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.experience")}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {experience.map((exp, idx) => (
                    <li key={idx}>{exp}</li>
                  ))}
                </ul>
              </section>
            )}

            {specialties.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.specialties")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialties.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#0f1b4b]/20 transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#0f1b4b]/10 text-[#0f1b4b]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700 font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.certifications")}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.education")}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {education.map((edu, idx) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              </section>
            )}

            {achievements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.achievements")}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </section>
            )}

            {areasOfExpertise.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f1b4b] mb-4">
                  {t("staff.areasOfExpertise")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {areasOfExpertise.map((area, idx) => (
                    <div
                      key={idx}
                      className={`p-4 bg-gray-200 shadow-sm hover:shadow-md transition-all duration-200
                        ${locale === 'ar'
                          ? 'rounded-l-lg border-r-4 border-[#0f1b4b] hover:-translate-x-1'
                          : 'rounded-r-lg border-l-4 border-[#0f1b4b] hover:translate-x-1'
                        }`}
                    >
                      <span className="text-gray-900 font-medium block leading-relaxed">{area}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}


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
