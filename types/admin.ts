// User Roles - Simplified
export type UserRole = 
  | "admin"        // Full admin access
  | "user"         // Regular user
  | "subscribed";  // Subscribed user

// User Interface
export interface AdminUser {
  id: string;                    // Firestore document ID
  email: string;                 // User email (unique)
  role: UserRole;                // User role: admin, user, or subscribed
  displayName?: string;          // Display name
  createdAt: Date;              // Account creation date
  updatedAt: Date;               // Last update date
  createdBy?: string;            // Email of user who created this account
  isActive: boolean;             // Account status
  lastLogin?: Date;              // Last login timestamp
}

// User Input (for creating/updating)
export interface UserInput {
  email: string;
  password?: string;             // Optional: for new users
  role: UserRole;
  displayName?: string;
  isActive?: boolean;
}
