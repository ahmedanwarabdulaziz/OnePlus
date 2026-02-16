/**
 * Generates content-inventory.txt from messages (en, ar) and known routes.
 * Run: node scripts/generate-content-inventory.js
 * Or: npm run content-inventory
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "messages");
const OUTPUT_FILE = path.join(ROOT, "content-inventory.txt");

const LOCALES = ["en", "ar"];
const LOCALE_URL_PREFIX = { en: "", ar: "/ar" };

// Which message keys appear on which path (path without locale prefix for en)
const ROUTES = [
  {
    path: "/",
    pathAr: "/ar",
    section: "home",
    headlineKey: "title",
    keys: ["title", "subtitle", "explorePrograms", "whatWeOffer", "trainingPrograms", "trainingProgramsDesc", "developmentWorkshops", "developmentWorkshopsDesc", "expertConsultations", "expertConsultationsDesc"],
  },
  {
    path: "/courses",
    pathAr: "/ar/courses",
    section: "courses",
    headlineKey: "title",
    keys: ["title", "subtitle", "noCourses", "viewDetails"],
  },
  {
    path: "/branches",
    pathAr: "/ar/branches",
    section: "branches",
    headlineKey: "title",
    keys: ["title", "subtitle", "homeSubtitle", "backToTracks", "noBranches"],
  },
  {
    path: "/staff",
    pathAr: "/ar/staff",
    section: "staff",
    headlineKey: "title",
    keys: ["title", "subtitle", "coaches", "employees", "all", "viewProfile", "noStaff", "notFound", "backToStaff", "phone", "email", "website", "biography", "experience", "specialties", "certifications", "education", "achievements", "areasOfExpertise", "languages"],
  },
];

// Common (nav) – list once at end
const COMMON_KEYS = ["welcome", "login", "logout", "home", "about", "contact", "courses", "staff", "readMore", "learnMore", "loading", "viewDetails"];

function loadMessages(locale) {
  const p = path.join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function flattenMessages(messages, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(messages)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenMessages(v, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

function buildInventory() {
  const messages = {};
  LOCALES.forEach((locale) => {
    messages[locale] = flattenMessages(loadMessages(locale));
  });

  const lines = [
    "ONE PLUS TRAINING & DEVELOPMENT – CONTENT INVENTORY",
    "====================================================",
    "This file lists user-facing content by URL and headline. Generated from messages (en, ar).",
    "Dynamic pages (e.g. /courses/[slug], /branches/[slug], /staff/[slug]) show content from the database; only list-page content is below.",
    "",
    "Last generated: " + new Date().toISOString(),
    "To regenerate: npm run content-inventory",
    "",
    "---",
    "",
  ];

  ROUTES.forEach((route) => {
    LOCALES.forEach((locale) => {
      const basePath = locale === "ar" ? route.pathAr : route.path;
      const url = basePath || "/";
      const flat = messages[locale];
      const headline = flat[`${route.section}.${route.headlineKey}`] || route.section;
      lines.push("URL: " + url + (locale === "ar" ? " (Arabic)" : " (English)"));
      lines.push("Headline: " + headline);
      route.keys.forEach((key) => {
        const text = flat[`${route.section}.${key}`];
        if (text) lines.push("  - " + key + ": " + text);
      });
      lines.push("");
    });
  });

  lines.push("---");
  lines.push("COMMON (navigation / shared labels)");
  lines.push("Used across pages. Keys: " + COMMON_KEYS.join(", "));
  lines.push("");
  LOCALES.forEach((locale) => {
    lines.push("Locale: " + locale);
    const flat = messages[locale];
    COMMON_KEYS.forEach((k) => {
      const text = flat["common." + k];
      if (text) lines.push("  common." + k + ": " + text);
    });
    lines.push("");
  });

  lines.push("---");
  lines.push("DYNAMIC PAGES (content from database)");
  lines.push("/courses/[slug]  – Course detail (title, description, etc. from Firestore)");
  lines.push("/branches/[slug] – Branch/track detail (name, description, etc. from Firestore)");
  lines.push("/staff/[slug]    – Staff profile (name, bio, etc. from Firestore)");
  lines.push("");
  lines.push("Other URLs: /login (login page), /admin/* (admin only).");
  lines.push("");

  return lines.join("\n");
}

const out = buildInventory();
fs.writeFileSync(OUTPUT_FILE, out, "utf8");
console.log("Written: " + OUTPUT_FILE);
