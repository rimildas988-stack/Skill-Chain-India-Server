# Remix: Skill Chain India

A highly polished, Web3-inspired student internship, freelancing, and micro-project marketplace featuring secure administrative gatekeeping, cryptographic progress tracking, community voting, and reputational credentials.

---

## 🚀 Step-by-Step Guide to Publish to GitHub

Follow these simple instructions to initialize a Git repository and publish your code securely to GitHub.

### Step 1: Initialize Git and Stage Files
Open your terminal in the project's root folder and run:
```bash
# Initialize a new local Git repository
git init

# Stage all files in the project
git add .

# Create the initial commit
git commit -m "Initial commit: Skill Chain India Web3 Platform"
```

### Step 2: Create a New Repository on GitHub
1. Go to your [GitHub Account](https://github.com/) and click on the **New** button (or go to `https://github.com/new`).
2. Name your repository (e.g., `skill-chain-india`).
3. Keep the repository **Public** or **Private** (according to your choice).
4. Do **NOT** initialize the repository with a README, `.gitignore`, or License (since they already exist in this project).
5. Click **Create repository**.

### Step 3: Link Local Project to GitHub and Push
Copy the repository URL from the GitHub Page (it looks like `https://github.com/your-username/skill-chain-india.git`) and run:
```bash
# Rename the default branch to 'main'
git branch -M main

# Link your local repository to the remote GitHub repository
git remote add origin https://github.com/your-username/skill-chain-india.git

# Push your code to GitHub
git push -u origin main
```

---

## 🔒 Security Best Practices for GitHub

- **Never Commit Secrets:** Your local environment variables (`.env` and `.env.local`) contain sensitive API keys and database credentials. They are already listed in `.gitignore` so they won't be pushed. Keep them safe locally.
- **Provide Template Variables:** We have provided `.env.example` in this repository to let others know which variables (e.g., `GEMINI_API_KEY`) need to be configured.

---

## 🛠️ Local Development & Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory (based on `.env.example`):
```env
# Gemini API Key for on-chain translation/generation (Server-side only)
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run Development Server
To start the full-stack server locally (runs on port `3000` with hot-reloading support):
```bash
npm run dev
```

### 4. Build and Launch Production Build
```bash
# Build the client and compile the server bundle
npm run build

# Start the compiled production server
npm run start
```

---

## 🎨 Application Capabilities

- **Amoy Testnet RPC Integrations:** Simulates on-chain status tracking, IPFS credential metadata uploads, and credential minting protocols.
- **Admin Decrypt & Audit Dashboard:** Restricts critical actions behind verified session identity (Google Admin ACL verification) and cryptographic password layers. Allows adjusting reputation credit registries and manual credential minting or revocation.
- **Web3 Internship & Micro-Project Marketplace:** Students can bid on active gigs, apply for secure internships, track milestones, and earn credential badges.
- **Reputational Progress Tracking:** Includes a real-time leaderboard showing builder reputation states, completed project registries, and current credential metrics.
