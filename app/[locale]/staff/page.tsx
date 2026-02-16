"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { StaffMember } from "@/types/staff";
import { getText } from "@/types/translations";
import { getLocalizedPath } from "@/lib/localized-path";
import { useLocale } from "@/hooks/useLocale";
import Footer from "@/components/Footer";

export default function StaffPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "coach" | "employee">("all");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const url = filter === "all"
          ? "/api/staff?activeOnly=true"
          : `/api/staff?activeOnly=true&type=${filter}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setStaff(data.staff || []);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [filter]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0f1b4b] mb-4">
            {t("staff.title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("staff.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === "all"
              ? "bg-[#0f1b4b] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {t("staff.all")}
          </button>
          <button
            onClick={() => setFilter("coach")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === "coach"
              ? "bg-[#0f1b4b] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {t("staff.coaches")}
          </button>
          <button
            onClick={() => setFilter("employee")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === "employee"
              ? "bg-[#0f1b4b] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {t("staff.employees")}
          </button>
        </div>

        {/* Staff Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f1b4b]"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t("staff.noStaff")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member) => {
              // Use getText helper to respect current locale - shows Arabic if available
              const firstName = getText(member.firstName, locale);
              const lastName = getText(member.lastName, locale);
              // Strict mode: Only show Arabic short bio in Arabic mode. 
              // If missing, show nothing (or empty string). 
              // This prevents English "Full Bio" from appearing if data is mixed.
              const shortBio = getText(member.shortBio, locale, false);

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
                  className="group bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#0f1b4b] transition-all hover:shadow-lg"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {member.images?.square ? (
                      <Image
                        src={
                          member.images.square.startsWith('http')
                            ? member.images.square
                            : `/api/images/${member.images.square}`
                        }
                        alt={`${firstName} ${lastName}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f1b4b]/10 to-[#701621]/10">
                        <span className="text-4xl font-bold text-[#0f1b4b]">
                          {firstName?.[0] || ""}{lastName?.[0] || ""}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0f1b4b] mb-1">
                      {firstName} {lastName}
                    </h3>
                    {title && (
                      <p className="text-sm text-[#701621] font-medium mb-2">{title}</p>
                    )}
                    {/* Positions hidden to prevent bio data leak 
                    {positions && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">{positions}</p>
                    )}
                    */}

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {shortBio.length > 150
                        ? `${shortBio.substring(0, 150)}...`
                        : shortBio || ""
                      }
                    </p>
                    <div className="mt-4 text-[#0f1b4b] font-medium text-sm group-hover:underline">
                      {t("staff.viewProfile")} →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
