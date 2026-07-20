# Supabase Integration Documentation

Welcome to the **Sovereign Talent Network (SkillChain)** Supabase Integration workspace! This directory contains production-ready database schemas and migration scripts designed to transition this applet's state engine into a full-scale Postgres database with live row-level security.

---

## Directory Structure

```text
├── supabase/
│   ├── schema.sql                         # Combined PostgreSQL Schema script for one-click SQL Editor setup.
│   ├── migrations/
│   │   └── 20260720000000_init_schema.sql # Standard Supabase CLI migration file for local/production pushes.
│   └── README.md                          # Integration manual and usage guide (this file).
└── src/
    └── lib/
        └── supabaseClient.ts              # Fail-safe lazy-initializing Supabase Client wrapper.
```

---

## How to Set Up the Database

### Method A: One-Click Setup via Supabase Web Dashboard (Recommended)
1. Navigate to your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** tab on the left-hand navigation.
3. Open a **New Query**.
4. Copy the entire contents of `supabase/schema.sql` from this project.
5. Paste it into the editor and click **Run**.
6. Your tables, indexes, and Row Level Security (RLS) policies are instantly live!

### Method B: Using Supabase CLI (For Local or GitOps Dev)
If you manage your project using the Supabase CLI, you can push migrations to your linked project:
```bash
# Link your project (requires project ref and DB password)
supabase link --project-ref your-project-ref

# Apply existing migrations
supabase db push
```

---

## How to Configure Your Applet Credentials

To enable real-time database connections, define the following variables in your environment:

1. Click on the **Settings** menu inside your AI Studio Build workspace, then navigate to **Secrets**.
2. Add the following keys:
   - `VITE_SUPABASE_URL` : Enter your Supabase Project URL (e.g., `https://xxxx.supabase.co`).
   - `VITE_SUPABASE_ANON_KEY` : Enter your Public API Key (found in Project Settings -> API).
   - `SUPABASE_SERVICE_ROLE_KEY` : (Optional) Service role key for admin privileges.

---

## Developer Usage Guide

### 1. Fail-Safe Client Initialization
We use lazy initialization in `src/lib/supabaseClient.ts` to ensure that if keys are missing initially, the applet doesn't crash on startup. 

```typescript
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

if (isSupabaseConfigured()) {
  const supabase = getSupabase();
  // Call database queries securely...
} else {
  console.log("Supabase is not configured yet. Falling back to local state.");
}
```

### 2. Fetching & Pushing Data Examples

#### Fetching Student Profiles:
```typescript
const { data, error } = await supabase
  .from('students')
  .select('*')
  .order('reputation', { ascending: false });
```

#### Inserting/Upserting Opportunities (Gig Escrows):
```typescript
const { error } = await supabase
  .from('opportunities')
  .upsert([{
    id: 'opp-102',
    title: 'DeFi Smart Contract Auditor',
    budget: 1500.00,
    required_skills: ['Solidity', 'Go', 'Rust'],
    status: 'open'
  }]);
```

#### Synchronizing Student Metrics on Ledger Updates:
```typescript
const { error } = await supabase
  .from('skill_chain_sync')
  .upsert([{
    student_id: 'student-01',
    student_name: 'Ananya Sharma',
    reputation: 920,
    completed_projects: 14,
    synced_at: new Date().toISOString()
  }]);
```

---

## Security Best Practices
- **Row Level Security (RLS)** is enabled by default on all tables inside `schema.sql` to guard tables against malicious manipulation.
- Adjust policy filters in `supabase/schema.sql` to strictly limit update actions based on user context.
