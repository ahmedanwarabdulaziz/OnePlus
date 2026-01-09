"use client";

import { useEffect } from "react";

export default function LocaleHtml({ locale }: { locale: string }) {
  useEffect(() => {
    // Set lang and dir attributes on the html element
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
