# Firebase Integration Guide for Skill Chain India

## Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Go to **Project Settings** > **Your apps**
4. Copy your Firebase config:
   ```
   apiKey
   authDomain
   projectId
   storageBucket
   messagingSenderId
   appId
   measurementId
   ```

## Step 2: Environment Setup

### Create `.env.local` file in root directory:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_URL=http://localhost:3000/api
```

**Do NOT commit `.env.local` to GitHub!**

## Step 3: Install Firebase SDK

```bash
npm install firebase
```

## Step 4: Enable Firebase Services

### In Firebase Console:

#### A. Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable:
   - Email/Password
   - Google (optional)

#### B. Firestore Database
1. Go to **Firestore Database**
2. Create database in **Production mode**
3. Select region (closest to your users)

#### C. Deploy Firestore Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Step 5: Use in Your React Components

### Example 1: Login Component

```tsx
import React, { useState } from 'react';
import { signIn, signInWithGoogle } from '../services/authService';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      console.log('Logged in successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      console.log('Google login successful');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button type="button" onClick={handleGoogleLogin} disabled={loading}>
        Login with Google
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginComponent;
```

### Example 2: Student Profile Component

```tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStudent, updateStudent } from '../services/firestoreService';

const StudentProfile = ({ studentId }: { studentId: string }) => {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudent(studentId);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleUpdate = async (updatedData: any) => {
    try {
      await updateStudent(studentId, updatedData);
      setStudent({ ...student, ...updatedData });
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <h1>{student.name}</h1>
      <p>Email: {student.email}</p>
      <p>Skills: {student.skills?.join(', ')}</p>
      <p>Rating: {student.rating}/5.0</p>
      <button onClick={() => handleUpdate({ reputation: (student.reputation || 0) + 1 })}>
        Add Reputation Point
      </button>
    </div>
  );
};

export default StudentProfile;
```

### Example 3: Opportunities List Component

```tsx
import React, { useEffect, useState } from 'react';
import { subscribeToOpportunities } from '../services/firestoreService';

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToOpportunities((ops) => {
      setOpportunities(ops);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Available Opportunities</h2>
      {opportunities.length === 0 ? (
        <p>No opportunities available</p>
      ) : (
        <ul>
          {opportunities.map((opp) => (
            <li key={opp.id}>
              <h3>{opp.title}</h3>
              <p>Company: {opp.companyName}</p>
              <p>Budget: {opp.budget}</p>
              <p>Category: {opp.category}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpportunitiesList;
```

## Step 6: Protect Your App

### Wrap your app with AuthProvider:

```tsx
// src/App.tsx
import { AuthProvider } from './context/AuthContext';
import AppContent from './AppContent';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

### Create Protected Routes:

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
```

## Step 7: Deploy

### Build for production:

```bash
npm run build
```

### Deploy to Firebase Hosting (optional):

```bash
firebase deploy
```

## Firestore Security Rules

Update your `firestore.rules` file:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students: read/write by owner
    match /students/{document=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
      allow create: if request.auth != null;
    }

    // Opportunities: read by all authenticated, write by company
    match /opportunities/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }

    // Agreements: read/write by involved parties
    match /agreements/{document=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.studentId || 
         request.auth.uid == resource.data.companyId);
    }
  }
}
```

## Troubleshooting

### Issue: "Firebase is not initialized"
- Check `.env.local` file exists and has correct credentials
- Ensure variables start with `VITE_` prefix
- Restart dev server: `npm run dev`

### Issue: "Permission denied" errors
- Check Firestore security rules are deployed
- Ensure user is authenticated
- Verify user ID matches the data

### Issue: Real-time updates not working
- Check `onSnapshot` subscription is properly set up
- Ensure unsubscribe is called on component unmount

## API Reference

### Authentication
- `signUp(email, password, displayName)` - Create new account
- `signIn(email, password)` - Login
- `signInWithGoogle()` - Google login
- `logOut()` - Logout
- `getCurrentUser()` - Get current user
- `onAuthChange(callback)` - Listen for auth changes

### Firestore (Students)
- `createStudent(data)` - Create new student
- `getStudent(id)` - Get student by ID
- `updateStudent(id, data)` - Update student
- `getAllStudents()` - Get all students
- `subscribeToStudents(callback)` - Real-time updates
- `searchStudentsBySkill(skill)` - Find by skill

### Firestore (Opportunities)
- `createOpportunity(data)` - Create new opportunity
- `getOpportunity(id)` - Get opportunity by ID
- `updateOpportunity(id, data)` - Update opportunity
- `getAllOpportunities()` - Get all active opportunities
- `subscribeToOpportunities(callback)` - Real-time updates
- `getOpportunitiesByCategory(category)` - Filter by category

### Firestore (Agreements)
- `createAgreement(data)` - Create new agreement
- `getAgreement(id)` - Get agreement by ID
- `updateAgreement(id, data)` - Update agreement
- `lockEscrow(id)` - Lock escrow funds
- `releaseMilestonePayment(id, index)` - Release milestone
- `subscribeToAgreements(callback)` - Real-time updates

## Next Steps

1. Set up your Firebase project
2. Add credentials to `.env.local`
3. Deploy Firestore rules
4. Test authentication flow
5. Create your UI components
6. Deploy to production

---

**Need help?** Check [Firebase Docs](https://firebase.google.com/docs)
