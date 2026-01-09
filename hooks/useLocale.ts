"use client";

import { useLocale as useNextIntlLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

/**
 * Custom hook that provides robust locale detection
 * Checks multiple sources to ensure locale is always correct:
 * 1. URL params (for dynamic routes)
 * 2. Pathname (checks for /ar prefix)
 * 3. next-intl hook (fallback)
 */
export function useLocale(): "en" | "ar" {
  const nextIntlLocale = useNextIntlLocale() as "en" | "ar";
  const pathname = usePathname();
  const params = useParams();
  
  // First, try to get locale from URL params (most reliable for dynamic routes)
  const urlLocale = params?.locale as string | undefined;
  if (urlLocale && (urlLocale === "en" || urlLocale === "ar")) {
    return urlLocale as "en" | "ar";
  }
  
  // Second, check pathname for /ar prefix
  const pathLocale = pathname?.startsWith("/ar") ? "ar" : "en";
  
  // Use next-intl locale if available, otherwise fall back to pathname detection
  return nextIntlLocale || pathLocale;
}
