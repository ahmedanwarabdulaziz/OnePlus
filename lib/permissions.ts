import { UserRole } from "@/types/admin";

/**
 * Check if user is an admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Check if user can access admin dashboard
 */
export function canAccessAdmin(role: UserRole): boolean {
  return role === "admin";
}
