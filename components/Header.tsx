"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { StaffMember } from "@/types/staff";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Lazy load staff only when dropdown is opened (on hover)
  const fetchStaff = async () => {
    // Don't fetch if already fetched or currently loading
    if (hasFetched || loading) return;

    try {
      setLoading(true);
      // Fetch minimal data for dropdown - API route handles caching
      const response = await fetch("/api/staff?minimal=true");
      const data = await response.json();
      if (data.success) {
        setStaff(data.staff || []);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setShowStaffDropdown(true);
    // Fetch staff when dropdown opens (lazy loading)
    if (!hasFetched && !loading) {
      fetchStaff();
    }
  };

  // Check for staff page with locale awareness
  const isStaffPage = pathname?.includes("/staff") && !pathname?.includes("/admin");
  const isHomePage = pathname === "/" || pathname === "/ar" || (locale === "ar" && pathname === "/ar");

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href={getLocalizedPath("/", locale)} className="flex items-center">
            <Image
              src="/Logo.svg"
              alt="One Plus Logo"
              width={150}
              height={60}
              style={{ width: "auto", height: "auto" }}
              className="h-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={getLocalizedPath("/", locale)}
              className={`transition-colors ${isHomePage
                ? "text-[#0f1b4b] font-semibold"
                : "text-gray-700 hover:text-[#0f1b4b]"
                }`}
            >
              {t("common.home")}
            </Link>
            <Link
              href={getLocalizedPath("/courses", locale)}
              className={`transition-colors ${pathname?.includes("/courses")
                ? "text-[#0f1b4b] font-semibold"
                : "text-gray-700 hover:text-[#0f1b4b]"
                }`}
            >
              {t("courses.title") || t("common.courses") || "Courses"}
            </Link>
            <Link
              href={getLocalizedPath("/branches", locale)}
              className={`transition-colors ${pathname?.includes("/branches")
                ? "text-[#0f1b4b] font-semibold"
                : "text-gray-700 hover:text-[#0f1b4b]"
                }`}
            >
              {t("branches.title") || "Tracks"}
            </Link>
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowStaffDropdown(false)}
            >
              <Link
                href={getLocalizedPath("/staff", locale)}
                className={`transition-colors flex items-center gap-1 ${isStaffPage
                  ? "text-[#0f1b4b] font-semibold"
                  : "text-gray-700 hover:text-[#0f1b4b]"
                  }`}
              >
                {t("common.staff")}
                <svg
                  className={`w-4 h-4 transition-transform ${showStaffDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {showStaffDropdown && (
                <div
                  className="absolute top-full left-0 pt-2 w-80 z-50"
                  onMouseEnter={() => setShowStaffDropdown(true)}
                  onMouseLeave={() => setShowStaffDropdown(false)}
                >
                  <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        {t("common.loading") || "Loading..."}
                      </div>
                    ) : staff.length > 0 ? (
                      <div className="p-2">
                        {staff.map((member) => {
                          // Use getText helper to respect current locale
                          const firstName = getText(member.firstName, locale);
                          const lastName = getText(member.lastName, locale);
                          const title = member.title
                            ? getText(member.title, locale)
                            : "";
                          const positions = member.positions?.map(p =>
                            getText(p, locale)
                          ).join(", ") || "";

                          return (
                            <Link
                              key={member.id}
                              href={getLocalizedPath(`/staff/${member.slug || member.id}`, locale)}
                              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                              onClick={() => setShowStaffDropdown(false)}
                            >
                              <div className="font-semibold text-[#0f1b4b] group-hover:text-[#701621] transition-colors">
                                {firstName} {lastName}
                              </div>
                              {title && (
                                <div className="text-sm text-[#701621] mt-1">{title}</div>
                              )}
                              {positions && !title && (
                                <div className="text-sm text-gray-600 mt-1">{positions}</div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t("staff.noStaff") || "No staff members found"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="bg-[#0f1b4b] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0f1b4b]/90 transition-colors"
            >
              {t("common.login")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
