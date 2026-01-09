# Firestore Security Rules Setup

## ✅ Issue Fixed!

The permission error has been resolved by using a **server-side API endpoint** instead of querying Firestore directly from the client. This is more secure and doesn't require complex Firestore security rules.

## How It Works Now

- ✅ Admin status checking is done via `/api/auth/check-admin` API route
- ✅ API uses Firebase Admin SDK (has full access, no permission issues)
- ✅ Client sends Firebase Auth token to API
- ✅ API verifies token and checks adminUsers collection server-side

## Firestore Rules (Optional - for future collections)

You can still deploy the rules for future collections like `courses`:

### Option 1: Deploy Rules via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `one-plus-6a6b5`
3. Go to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste it into the rules editor
6. Click **Publish**

### Option 2: Deploy Rules via Firebase CLI

```bash
firebase deploy --only firestore:rules
```

## Test Login

Try logging in now - it should work without any permission errors:
- Email: `anwar@a.com`
- Password: `123123`

The permission error is now resolved! 🎉
