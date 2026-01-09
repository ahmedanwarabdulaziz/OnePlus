# Admin User Management System

## Overview

The admin user management system allows you to control access to the admin dashboard with different roles and permissions.

## Roles

1. **superAdmin** - Full access to everything
   - Manage users
   - Manage courses
   - Manage content
   - View reports
   - Manage settings

2. **admin** - Can manage courses and content
   - Manage courses
   - Manage content
   - View reports

3. **editor** - Can edit courses but not delete
   - Manage courses
   - Manage content

4. **viewer** - Read-only access
   - View reports

## Firestore Collection Structure

**Collection:** `adminUsers`

**Document Structure:**
```typescript
{
  email: string;                    // User email (unique)
  role: "superAdmin" | "admin" | "editor" | "viewer";
  permissions: Permission[];         // Explicit permissions (can override role)
  displayName?: string;              // Display name
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;                // Email of user who created this account
  isActive: boolean;                 // Account status
  lastLogin?: Timestamp;             // Last login timestamp
  firebaseUserId?: string;           // Firebase Auth UID
}
```

## API Endpoints

### Get All Admin Users
```
GET /api/admin/users
```

### Create Admin User
```
POST /api/admin/users
Body: {
  email: string;
  role: AdminRole;
  permissions?: Permission[];
  displayName?: string;
  isActive?: boolean;
}
```

### Get Admin User by ID
```
GET /api/admin/users/[id]
```

### Update Admin User
```
PUT /api/admin/users/[id]
Body: {
  role?: AdminRole;
  permissions?: Permission[];
  displayName?: string;
  isActive?: boolean;
}
```

### Delete Admin User
```
DELETE /api/admin/users/[id]
```

## Creating the First Admin User

### Option 1: Using the Script
```bash
npx tsx scripts/create-admin-user.ts admin@example.com superAdmin "Admin Name"
```

### Option 2: Using Firebase Console
1. Go to Firebase Console → Authentication
2. Add a user with email/password
3. Then add them to the `adminUsers` collection in Firestore with the structure above

### Option 3: Using API (after setting up authentication)
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "role": "superAdmin",
    "displayName": "Super Admin"
  }'
```

## Permissions

Permissions are checked using the `hasPermission()` function:
- Role-based permissions are automatically assigned
- Explicit permissions can override role permissions
- Use `hasPermission(role, permission, explicitPermissions)` to check access

## Next Steps

1. ✅ Admin user collection structure created
2. ✅ API routes for CRUD operations
3. ⏳ Authentication integration (Firebase Auth)
4. ⏳ Admin UI for managing users
5. ⏳ Permission checks in admin routes
