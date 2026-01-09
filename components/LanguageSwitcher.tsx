"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>(locale);

  // Update locale when it changes (from useLocale hook or pathname)
  useEffect(() => {
    // Check pathname as fallback
    const pathLocale = pathname?.startsWith("/ar") ? "ar" : "en";
    // Use locale from hook if available, otherwise use pathname detection
    setCurrentLocale(locale || pathLocale);
  }, [locale, pathname]);

  // Also check window location on mount and changes
  useEffect(() => {
    const updateLocale = () => {
      if (typeof window !== "undefined") {
        const browserPath = window.location.pathname;
        const detectedLocale = browserPath.startsWith("/ar") ? "ar" : "en";
        setCurrentLocale(detectedLocale);
      }
    };

    updateLocale();
    window.addEventListener("popstate", updateLocale);
    
    return () => {
      window.removeEventListener("popstate", updateLocale);
    };
  }, []);

  const switchLanguage = (newLocale: string) => {
    // Always use window.location for accurate current path
    const browserPath = typeof window !== "undefined" ? window.location.pathname : pathname || "/";
    let currentPath = browserPath;
    
    console.log("Switching language - Current path:", currentPath, "To:", newLocale);
    
    // Remove any existing locale prefix
    if (currentPath === "/ar") {
      currentPath = "/";
    } else if (currentPath.startsWith("/ar/")) {
      currentPath = currentPath.replace("/ar/", "/");
    } else if (currentPath.startsWith("/en/")) {
      currentPath = currentPath.replace("/en/", "/");
    } else if (currentPath === "/en") {
      currentPath = "/";
    }
    
    // Ensure we have a valid path
    if (!currentPath || currentPath === "") {
      currentPath = "/";
    }
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + currentPath;
    }
    
    // Build new path based on locale
    let newPath: string;
    if (newLocale === "en") {
      // Switching to English (default locale) - no prefix
      newPath = currentPath;
    } else {
      // Switching to Arabic - add /ar prefix
      if (currentPath === "/") {
        newPath = `/${newLocale}`;
      } else {
        newPath = `/${newLocale}${currentPath}`;
      }
    }
    
    console.log("Navigating to:", newPath);
    
    // Navigate to new path using full URL
    if (typeof window !== "undefined") {
      const targetUrl = `${window.location.origin}${newPath}`;
      console.log("Full URL:", targetUrl);
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentLocale === "en"
            ? "bg-[#0f1b4b] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("ar")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentLocale === "ar"
            ? "bg-[#0f1b4b] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        AR
      </button>
    </div>
  );
}
