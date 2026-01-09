import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // Don't use locale prefix for default locale (English)
  localePrefix: "as-needed",
  // Disable automatic locale detection - always use default unless explicitly specified in URL
  localeDetection: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match root path
    "/",
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // - … admin and login routes
    "/((?!api|_next|_vercel|admin|login|.*\\..*).*)",
  ],
};
