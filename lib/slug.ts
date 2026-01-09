/**
 * Generate a URL-friendly slug from a name
 * Example: "John Doe" -> "john-doe"
 */
export function generateSlug(firstName: string, lastName: string = ""): string {
  // Combine first and last name
  const fullName = `${firstName} ${lastName}`.trim();

  // Convert to lowercase
  let slug = fullName.toLowerCase();

  // Remove special characters and replace spaces with hyphens
  slug = slug
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  return slug || "staff-member"; // Fallback if empty
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  collection: any, // FirebaseFirestore.CollectionReference
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check if slug exists
    const query = collection.where("slug", "==", slug);
    const snapshot = await query.get();

    // Filter out the current document if updating
    const existingDocs = excludeId
      ? snapshot.docs.filter((doc: any) => doc.id !== excludeId)
      : snapshot.docs;

    if (existingDocs.length === 0) {
      return slug; // Slug is unique
    }

    // Append counter and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
