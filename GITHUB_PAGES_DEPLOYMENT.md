# GitHub Pages Deployment Guide for Skill Chain India

## Target Architecture

```
┌─────────────────────────────────────────────────────────┐
│          GitHub Pages (Frontend - React/Vite)           │
│  https://rimildas988-stack.github.io/Skill-Chain...     │
└──────────────────────┬──────────────────────────────────┘
                       │ API Calls
                       ▼
        ┌──────────────────────────────┐
        │   Express Backend Server     │
        │   (Your Server - Port 3000)  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
  ┌─────────────┐            ┌──────────────────┐
  │  Firebase   │            │  Firebase        │
  │  Auth       │            │  Firestore DB    │
  └─────────────┘            │  Storage         │
                             └──────────────────┘
```

## Step 1: Update `vite.config.ts` for GitHub Pages

Your `vite.config.ts` needs to be configured for GitHub Pages:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Skill-Chain-India-Server/',  // GitHub repo name
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

## Step 2: Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build frontend
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
        VITE_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Step 3: Add GitHub Secrets

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add these secrets:

```
FIREBASE_API_KEY=AIzaSyCEjMAeZAtgRyhGqPIqEd5Rcy4KJH4IYog
FIREBASE_AUTH_DOMAIN=skill-chain-india.firebaseapp.com
FIREBASE_PROJECT_ID=skill-chain-india
FIREBASE_STORAGE_BUCKET=skill-chain-india.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1058823004215
FIREBASE_APP_ID=1:1058823004215:web:42b675f0fc8f34a2eedfb2
FIREBASE_MEASUREMENT_ID=G-PMEYB8PS6E
API_URL=https://your-backend-url.com/api  # Your Express server URL
```

## Step 4: Configure GitHub Pages in Repository Settings

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)
5. Click Save

## Step 5: Update Your Backend API URL

In `src/services/firebaseClient.ts` and `src/services/authService.ts`, use:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## Deployment Process

### Local Development
```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# In another terminal, start backend
node dist/server.cjs
# or
npm start
```

### Deploy to GitHub Pages
```bash
# Just push to main branch
git add .
git commit -m "Update feature"
git push origin main

# GitHub Actions will automatically:
# 1. Build your React app
# 2. Deploy to gh-pages branch
# 3. Site updates at: https://rimildas988-stack.github.io/Skill-Chain-India-Server/
```

### Deploy Backend Separately

You can host your Express server on:
- **Heroku** (free tier deprecated)
- **Railway.app** (recommended)
- **Render.com**
- **Vercel** (serverless functions)
- **AWS EC2**
- **DigitalOcean**
- **Replit**

**Example: Deploy to Railway.app**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway init

# Deploy
railway up
```

## Updated .env.local for GitHub Pages

```env
# Firebase (used by frontend)
VITE_FIREBASE_API_KEY=AIzaSyCEjMAeZAtgRyhGqPIqEd5Rcy4KJH4IYog
VITE_FIREBASE_AUTH_DOMAIN=skill-chain-india.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skill-chain-india
VITE_FIREBASE_STORAGE_BUCKET=skill-chain-india.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1058823004215
VITE_FIREBASE_APP_ID=1:1058823004215:web:42b675f0fc8f34a2eedfb2
VITE_FIREBASE_MEASUREMENT_ID=G-PMEYB8PS6E

# Backend API (your Express server)
VITE_API_URL=http://localhost:3000/api  # Local development
# Production: VITE_API_URL=https://your-backend.railway.app/api

NODE_ENV=development
```

## CORS Configuration for Backend

Update your `server.ts` to allow requests from GitHub Pages:

```typescript
import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',  // Vite dev server
    'https://rimildas988-stack.github.io'  // GitHub Pages
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
```

Add to package.json dependencies:
```bash
npm install cors
```

## File Structure for GitHub Pages

```
Skill-Chain-India-Server/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions workflow
├── src/
│   ├── services/
│   │   ├── firebaseClient.ts       # Firebase config
│   │   ├── authService.ts          # Auth functions
│   │   └── firestoreService.ts     # Database functions
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── App.tsx
├── server.ts                        # Backend (NOT deployed to GitHub)
├── vite.config.ts                   # Has GitHub Pages base path
├── package.json
├── .env.local                       # Local only (in .gitignore)
└── dist/                            # Built files (deployed to gh-pages)
```

## What Gets Deployed Where

### GitHub Pages (Frontend)
✅ React/Vite app (`/dist` folder)
✅ Static assets
✅ JavaScript bundles
❌ Environment secrets (use GitHub Secrets)
❌ Node modules
❌ server.ts

### Firebase (Backend Data)
✅ User authentication
✅ Firestore database
✅ Cloud storage
✅ Security rules
❌ Express server

### Your Own Server (Backend API)
✅ Express server (port 3000)
✅ API routes
✅ Gemini AI integration
✅ Database operations

## Verify Deployment

1. **Check GitHub Actions:** Settings → Actions → See workflow runs
2. **View live site:** https://rimildas988-stack.github.io/Skill-Chain-India-Server/
3. **Test Firebase:** Verify login works
4. **Test API:** Check backend calls succeed

## Troubleshooting

### Build fails on GitHub Actions
- Check GitHub Secrets are set correctly
- Run `npm run build` locally first
- Check for TypeScript errors: `npm run lint`

### CORS errors in console
- Verify backend is running and has CORS enabled
- Check API_URL in .env
- Verify backend origin is whitelisted

### Firebase not working
- Check .env variables are in GitHub Secrets
- Verify firebaseClient.ts is imported in App.tsx
- Check Firestore security rules allow access

### Blank page on GitHub Pages
- Check browser console for errors
- Verify `base` in vite.config.ts matches repo name
- Check dist/ folder has index.html

## .gitignore (Important!)

```
# Environment
.env.local
.env.*.local

# Build
dist/
*.log

# Dependencies
node_modules/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase/
.firebaserc
```

## Summary

✅ **Frontend:** GitHub Pages (automatic deployment on push)  
✅ **Backend:** Your own server (Railway, Render, etc.)  
✅ **Database:** Firebase Firestore  
✅ **Auth:** Firebase Authentication  
✅ **Storage:** Firebase Cloud Storage  

## Next Steps

1. Update `vite.config.ts` with base path
2. Create `.github/workflows/deploy.yml`
3. Add GitHub Secrets
4. Enable GitHub Pages in repository settings
5. Push to main branch
6. Deploy backend separately
7. Update backend API URL in .env
8. Verify everything works!

---

**Your app is now set up for production deployment! 🚀**
