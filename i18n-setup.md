# Bilingual Setup Guide (Arabic & English)

## Architecture Decision

**Admin Dashboard**: English only (default)
**Public Website**: English + Arabic (bilingual)

## Recommended Approach

We'll use **next-intl** - the best i18n solution for Next.js 14 App Router.

### Data Structure Strategy

Store translations as nested objects in the same document:
```typescript
{
  title: {
    en: "Course Title",
    ar: "عنوان الدورة"
  },
  description: {
    en: "Course description...",
    ar: "وصف الدورة..."
  }
}
```

### Benefits:
- ✅ Single document per item
- ✅ Easy to query and filter
- ✅ No duplicate documents
- ✅ Simple to add more languages later
- ✅ Admin can edit both languages in one form

## Implementation Plan

1. Install next-intl
2. Set up middleware for language detection
3. Update data types to support translations
4. Create translation utilities
5. Update admin forms to handle bilingual input
6. Create language switcher component
7. Update public pages to use translations
