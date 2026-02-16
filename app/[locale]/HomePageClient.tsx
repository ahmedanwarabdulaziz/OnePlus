"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import Link from "next/link";
import { Branch } from "@/types/branches";
import { Course } from "@/types/courses";
import { StaffMember } from "@/types/staff";
import { getText } from "@/types/translations";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedPath } from "@/lib/localized-path";
import Image from "next/image";
import Footer from "@/components/Footer";

function TracksSection({ initialBranches = [] }: { initialBranches?: Branch[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const branches = initialBranches;
  const featured = branches.filter((b) => b.isFeatured);
  const rest = branches.filter((b) => !b.isFeatured);
  const toShow = featured.length > 0 ? [...featured, ...rest].slice(0, 6) : branches.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-4">{t("branches.title")}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{t("branches.homeSubtitle")}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toShow.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">{t("branches.noBranches")}</p>
          ) : (
            toShow.map((branch) => (
              <Link
                key={branch.id}
                href={getLocalizedPath(`/branches/${branch.slug}`, locale)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                <div className="h-40 sm:h-44 relative bg-gray-200">
                  {branch.image ? (
                    <Image
                      src={branch.image.startsWith("http") ? branch.image : `/api/images/${branch.image}`}
                      alt={getText(branch.name, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0f1b4b]/10 flex items-center justify-center">
                      <span className="text-4xl text-[#0f1b4b]/20 font-bold">{getText(branch.name, locale)[0]}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: branch.color || "#0f1b4b" }} />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0f1b4b] mb-1 group-hover:text-[#701621] transition-colors">{getText(branch.name, locale)}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{getText(branch.description, locale)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="text-center mt-12">
          <Link href={getLocalizedPath("/branches", locale)} className="inline-flex items-center text-[#701621] font-bold hover:underline">
            {t("branches.viewAllTracks")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CoursesTeaserSection({ initialCourses = [] }: { initialCourses?: Course[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const toShow = initialCourses.slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-4">{t("courses.teaserTitle")}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{t("courses.teaserDesc")}</p>
        {toShow.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t("courses.noCourses")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toShow.map((course) => {
              const title = getText(course.title, locale);
              const imgSrc = course.images?.thumbnail
                ? (course.images.thumbnail.startsWith("http") ? course.images.thumbnail : `/api/images/${course.images.thumbnail}`)
                : null;
              return (
                <div key={course.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-40 bg-gray-100">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 bg-[#0f1b4b]/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#0f1b4b]/30">{title?.[0] || "?"}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-[#0f1b4b] mb-2 line-clamp-2 group-hover:text-[#701621] transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{getText(course.shortDescription, locale)}</p>
                    <Link href={getLocalizedPath(`/courses/${course.slug}`, locale)} className="text-sm font-semibold text-[#701621] hover:underline inline-flex items-center gap-1">
                      {t("courses.viewDetails")} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-12">
          <Link href={getLocalizedPath("/courses", locale)} className="inline-flex items-center text-[#701621] font-bold hover:underline">
            {t("courses.viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function TeamTeaserSection({ initialStaff = [] }: { initialStaff?: StaffMember[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const toShow = initialStaff.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-4">{t("staff.title")}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{t("staff.subtitle")}</p>
        {toShow.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t("staff.noStaff")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toShow.map((member) => {
              const firstName = getText(member.firstName, locale);
              const lastName = getText(member.lastName, locale);
              const title = member.title ? getText(member.title, locale) : "";
              const imgSrc = member.images?.square
                ? (member.images.square.startsWith("http") ? member.images.square : `/api/images/${member.images.square}`)
                : null;
              return (
                <div key={member.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <Link href={getLocalizedPath(`/staff/${member.slug || member.id}`, locale)} className="block flex-1 flex flex-col">
                    <div className="aspect-square relative bg-gray-100">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={`${firstName} ${lastName}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0f1b4b]/10">
                          <span className="text-3xl font-bold text-[#0f1b4b]/40">{firstName?.[0]}{lastName?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-[#0f1b4b] mb-0.5 group-hover:text-[#701621] transition-colors">{firstName} {lastName}</h3>
                      {title ? <p className="text-sm text-[#701621] font-medium mb-2">{title}</p> : null}
                      <span className="text-sm font-semibold text-[#701621] mt-auto inline-flex items-center gap-1">{t("staff.viewProfile")} →</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-12">
          <Link href={getLocalizedPath("/staff", locale)} className="inline-flex items-center text-[#701621] font-bold hover:underline">
            {t("staff.viewAllTeam")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

type Props = {
  initialBranches: Branch[];
  initialCourses: Course[];
  initialStaff: StaffMember[];
};

export default function HomePageClient({ initialBranches, initialCourses, initialStaff }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative min-h-[28rem] md:min-h-[32rem] flex items-center py-20">
        <div className={`absolute inset-0 ${isRtl ? "scale-x-[-1]" : ""}`}>
          <Image src="/images/hero/hero.png" alt="" fill className="object-cover object-center" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 bg-[#0f1b4b]/50" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-md">{t("home.title")}</h1>
          <p className="text-xl text-white/95 mb-8 max-w-3xl drop-shadow-md">{t("home.subtitle")}</p>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <Link href={getLocalizedPath("/branches", locale)} className="bg-[#701621] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#701621]/90 transition-colors shadow-lg">
              {t("home.explorePrograms")}
            </Link>
            <Link href="#contact" className="bg-white/20 text-white border-2 border-white/80 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/30 transition-colors">
              {t("common.contact")}
            </Link>
          </div>
          <p className="text-white/90 text-sm md:text-base drop-shadow">{t("home.heroTrustLine")}</p>
        </div>
      </section>
      <section className="py-10 md:py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#701621]/10 flex items-center justify-center" aria-hidden>
                <svg className="w-6 h-6 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("home.valueHighlight1Title")}</h3>
                <p className="text-gray-600 text-sm">{t("home.valueHighlight1Desc")}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#701621]/10 flex items-center justify-center" aria-hidden>
                <svg className="w-6 h-6 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("home.valueHighlight2Title")}</h3>
                <p className="text-gray-600 text-sm">{t("home.valueHighlight2Desc")}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#701621]/10 flex items-center justify-center" aria-hidden>
                <svg className="w-6 h-6 text-[#701621]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0f1b4b] mb-1">{t("home.valueHighlight3Title")}</h3>
                <p className="text-gray-600 text-sm">{t("home.valueHighlight3Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#0f1b4b] mb-12">{t("home.whatWeOffer")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors flex flex-col">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">{t("home.trainingPrograms")}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{t("home.trainingProgramsDesc")}</p>
              <Link href={getLocalizedPath("/courses", locale)} className="text-sm font-semibold text-[#701621] hover:underline inline-flex items-center gap-1">
                {t("common.learnMore")} →
              </Link>
            </div>
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors flex flex-col">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">{t("home.developmentWorkshops")}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{t("home.developmentWorkshopsDesc")}</p>
              <Link href={getLocalizedPath("/courses", locale)} className="text-sm font-semibold text-[#701621] hover:underline inline-flex items-center gap-1">
                {t("common.learnMore")} →
              </Link>
            </div>
            <div className="p-6 border-2 border-[#0f1b4b]/10 rounded-lg hover:border-[#701621]/30 transition-colors flex flex-col">
              <h3 className="text-xl font-semibold text-[#0f1b4b] mb-3">{t("home.expertConsultations")}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{t("home.expertConsultationsDesc")}</p>
              <Link href="#contact" className="text-sm font-semibold text-[#701621] hover:underline inline-flex items-center gap-1">
                {t("home.bookConsultation")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <TracksSection initialBranches={initialBranches} />
      <CoursesTeaserSection initialCourses={initialCourses} />
      <TeamTeaserSection initialStaff={initialStaff} />
      <section className="py-16 md:py-20 bg-[#0f1b4b]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-white/90 text-lg mb-8">{t("home.ctaText")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={getLocalizedPath("/branches", locale)} className="bg-[#701621] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#701621]/90 transition-colors shadow-lg">
              {t("home.explorePrograms")}
            </Link>
            <Link href="#contact" className="bg-white/20 text-white border-2 border-white/80 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/30 transition-colors">
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </section>
      <Footer id="contact" className="mt-20" />
    </div>
  );
}
