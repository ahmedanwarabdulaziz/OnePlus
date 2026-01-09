# Bilingual Support Guide (Arabic & English)

## Architecture Overview

### Admin Dashboard
- **Language**: English only (default)
- **Location**: `/admin/*` routes (excluded from i18n middleware)
- **No translation needed** - Admin interface stays in English

### Public Website
- **Languages**: English (default) + Arabic
- **Location**: All routes except `/admin/*` and `/login`
- **URL Structure**:
  - English: `/` or `/en/...` (default, no prefix needed)
  - Arabic: `/ar/...`

## Data Structure Strategy

### Recommended Approach: Nested Translation Objects

Store translations as nested objects in Firestore documents:

```typescript
// Example: Staff Member
{
  firstName: "John",  // Names don't need translation
  lastName: "Doe",
  positions: [
    { en: "Senior Trainer", ar: "مدرب أول" },
    { en: "Consultant", ar: "مستشار" }
  ],
  bio: {
    en: "John has over 10 years of experience...",
    ar: "لدى جون أكثر من 10 سنوات من الخبرة..."
  },
  shortBio: {
    en: "Expert trainer with extensive experience",
    ar: "مدرب خبير بخبرة واسعة"
  }
}
```

### Benefits:
✅ Single document per item  
✅ Easy to query and filter  
✅ No duplicate documents  
✅ Simple to add more languages later  
✅ Admin can edit both languages in one form  

## Implementation Steps

### 1. Update Data Types

Already updated `types/staff.ts` to use `TranslatedText`:
- `positions: TranslatedText[]`
- `bio: TranslatedText`
- `shortBio: TranslatedText`

### 2. Update Admin Forms

In admin forms, show both language inputs:
```tsx
<TextField label="Bio (English)" />
<TextField label="Bio (Arabic)" />
```

### 3. Use Translations in Public Pages

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations();
<h1>{t("home.title")}</h1>
```

### 4. Display Translated Data

```tsx
import { useLocale } from "next-intl";
import { getText } from "@/types/translations";

const locale = useLocale();
<p>{getText(staffMember.bio, locale)}</p>
```

## Language Switcher

Already created `LanguageSwitcher` component - shows in header.

## Next Steps

1. ✅ Basic i18n setup complete
2. ⏳ Update admin staff form to handle bilingual input
3. ⏳ Update courses data structure for bilingual content
4. ⏳ Create public staff listing page with translations
5. ⏳ Create individual coach pages with translations

## Testing

- English: http://localhost:3000/ (or /en/)
- Arabic: http://localhost:3000/ar/
- Admin: http://localhost:3000/admin/ (English only)
