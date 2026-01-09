/**
 * Helper function to generate localized paths that preserve the current locale
 * @param path - The path without locale prefix (e.g., "/staff", "/staff/john-doe")
 * @param locale - The current locale ("en" or "ar")
 * @returns The localized path (e.g., "/staff" for en, "/ar/staff" for ar)
 */
export function getLocalizedPath(path: string, locale: string): string {
  // Ensure path starts with /
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // For English (default locale), return path as-is (no prefix)
  if (locale === "en") {
    return path;
  }

  // For Arabic, add /ar prefix
  // Handle root path specially
  if (path === "/") {
    return "/ar";
  }

  return `/ar${path}`;
}
