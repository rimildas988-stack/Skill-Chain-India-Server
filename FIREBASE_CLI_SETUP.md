# Skill Chain India - Firebase Integration Guide

## Setup Instructions

### 1. Install Firebase CLI Globally

```bash
npm install -g firebase-tools
```

This installs the Firebase command-line tool for managing your Firebase project.

### 2. Login to Firebase

```bash
firebase login
```

This will:
- Open your browser
- Ask you to authorize the Firebase CLI
- Save your authentication token locally

### 3. Initialize Firebase Project

```bash
firebase init
```

When prompted, select:
- ✅ **Firestore Database** (for data storage)
- ✅ **Authentication** (for user management)
- ✅ **Storage** (for file uploads)
- ✅ **Hosting** (optional, for deployment)
- ✅ **Functions** (optional, for backend logic)

When asked about your Firebase project, select: **skill-chain-india**

### 4. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

This deploys your Firestore security rules from `firestore.rules`.

### 5. Deploy All Services

```bash
firebase deploy
```

This deploys:
- Firestore rules
- Storage rules
- Hosting (if configured)
- Functions (if any)

---

## Project Structure After Setup

```
Skill-Chain-India-Server/
├── .env.local                    # Your Firebase credentials (DO NOT COMMIT)
├── firebase.json                 # Firebase project configuration
├── firestore.rules              # Firestore security rules
├── storage.rules                # Storage security rules
├── src/
│   ├── services/
│   │   ├── firebaseClient.ts    # Firebase initialization
│   │   ├── authService.ts       # Authentication functions
│   │   └── firestoreService.ts  # Firestore operations
│   ├── context/
│   │   └── AuthContext.tsx      # Auth provider
│   ├── hooks/
│   │   └── useAuth.ts           # Auth hook
│   └── api/
│       ├── students.ts          # Student API routes
│       ├── opportunities.ts     # Opportunity API routes
│       └── agreements.ts        # Agreement API routes
├── package.json                  # Project dependencies
├── server.ts                     # Express server
└── FIREBASE_SETUP_GUIDE.md      # Complete guide
```

---

## Firebase CLI Commands Reference

### Authentication
```bash
firebase login              # Login to Firebase
firebase logout             # Logout from Firebase
firebase login:ci           # Login for CI/CD
```

### Project Management
```bash
firebase projects:list      # List your Firebase projects
firebase use <project-id>   # Switch projects
firebase init               # Initialize a new project
```

### Deployment
```bash
firebase deploy             # Deploy everything
firebase deploy --only hosting              # Deploy only hosting
firebase deploy --only firestore:rules      # Deploy only Firestore rules
firebase deploy --only firestore:indexes    # Deploy indexes
firebase deploy --only storage:rules        # Deploy storage rules
firebase deploy --only functions            # Deploy functions
```

### Local Development
```bash
firebase emulators:start    # Start local emulators
firebase emulators:start --import=./data    # Start with saved data
```

### Firestore Management
```bash
firebase firestore:delete <collection>      # Delete collection
firebase firestore:indexes:list             # List indexes
```

---

## Firestore Rules (firestore.rules)

Your current rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection
    match /students/{document=**} {
      // Allow read/write for authenticated users (own documents)
      allow read, write: if request.auth != null;
      allow create: if request.auth != null;
    }

    // Opportunities collection
    match /opportunities/{document=**} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      // Allow write for owner
      allow write: if request.auth != null;
    }

    // Agreements collection
    match /agreements/{document=**} {
      // Allow read/write for involved parties
      allow read, write: if request.auth != null;
    }
  }
}
```

### Deploy updated rules:
```bash
firebase deploy --only firestore:rules
```

---

## Storage Rules (storage.rules)

Example for allowing user file uploads:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow uploads to user directories
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow public read
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Environment Variables (.env.local)

**IMPORTANT: DO NOT COMMIT THIS FILE TO GITHUB!**

Your `.env.local` should contain:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCEjMAeZAtgRyhGqPIqEd5Rcy4KJH4IYog
VITE_FIREBASE_AUTH_DOMAIN=skill-chain-india.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skill-chain-india
VITE_FIREBASE_STORAGE_BUCKET=skill-chain-india.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1058823004215
VITE_FIREBASE_APP_ID=1:1058823004215:web:42b675f0fc8f34a2eedfb2
VITE_FIREBASE_MEASUREMENT_ID=G-PMEYB8PS6E

# Backend API
VITE_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

---

## Testing Firebase Locally

### 1. Start Firebase Emulators

```bash
firebase emulators:start
```

This runs:
- Firestore Emulator (localhost:8080)
- Authentication Emulator (localhost:9099)
- Storage Emulator (localhost:9199)

### 2. Use Emulators in Development

Add to your `firebaseClient.ts`:

```typescript
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## Quick Start Checklist

- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Initialize: `firebase init`
- [ ] Update `.env.local` with credentials
- [ ] Run locally: `npm run dev`
- [ ] Test authentication
- [ ] Deploy: `firebase deploy`
- [ ] Monitor in Firebase Console

---

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Check `.env.local` has correct credentials

### "Firebase is not initialized"
- Ensure `.env.local` exists with VITE_ prefix variables
- Restart dev server: `npm run dev`
- Check `src/services/firebaseClient.ts` is imported

### "Cannot find module 'firebase'"
- Run `npm install`
- Check `package.json` has firebase dependency
- Clear node_modules: `rm -rf node_modules && npm install`

### Emulator not connecting
- Ensure emulator is running: `firebase emulators:start`
- Check localhost ports are available (8080, 9099, 9199)
- Check firewall settings

---

## Monitoring & Analytics

### View Project in Firebase Console

```bash
https://console.firebase.google.com/project/skill-chain-india
```

Monitor:
- ✅ Authentication users
- ✅ Firestore data usage
- ✅ Storage usage
- ✅ Real-time analytics

---

## Next Steps

1. ✅ Install Firebase CLI
2. ✅ Login to Firebase
3. ✅ Initialize your project
4. ✅ Deploy Firestore rules
5. ✅ Start development server
6. ✅ Create sample data
7. ✅ Test authentication flow
8. ✅ Deploy to production

---

## Resources

- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

**Your Firebase setup is complete! Ready to build amazing features! 🚀**
