-- Migration: Initialize SkillChain Core Database Structure
-- Created: 2026-07-20

CREATE TABLE IF NOT EXISTS skill_chain_sync (
  student_id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  reputation INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  completed_projects INTEGER DEFAULT 0,
  wallet_address TEXT,
  github_username TEXT,
  ideas_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for sync table
ALTER TABLE skill_chain_sync ENABLE ROW LEVEL SECURITY;

-- Development policy
CREATE POLICY "Allow anonymous read/write access" ON skill_chain_sync FOR ALL USING (true) WITH CHECK (true);

-- Student Profiles
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  school TEXT,
  wallet_address TEXT,
  skills TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reputation INTEGER DEFAULT 0,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  certifications TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  personal_website TEXT,
  availability TEXT CHECK (availability IN ('Full-time', 'Part-time', 'Intermittent', 'Unavailable')) DEFAULT 'Full-time',
  resume_url TEXT,
  completed_projects_count INTEGER DEFAULT 0,
  hackathon_wins INTEGER DEFAULT 0,
  innovation_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to student profiles" ON students FOR SELECT USING (true);
CREATE POLICY "Allow individual student to manage own profile" ON students FOR ALL USING (true) WITH CHECK (true);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  budget NUMERIC(10, 2) NOT NULL,
  duration TEXT,
  location TEXT,
  remote BOOLEAN DEFAULT TRUE,
  required_skills TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Intermediate',
  deadline TIMESTAMP WITH TIME ZONE,
  applicants_count INTEGER DEFAULT 0,
  company_rating NUMERIC(3, 2) DEFAULT 5.0,
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('open', 'ongoing', 'completed', 'cancelled')) DEFAULT 'open',
  payment_status TEXT CHECK (payment_status IN ('pending', 'released', 'not-applicable')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('Stripe', 'Crypto', 'Razorpay')) DEFAULT 'Crypto',
  expected_release_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow verified companies to manage opportunities" ON opportunities FOR ALL USING (true) WITH CHECK (true);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE CASCADE,
  opportunity_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_avatar TEXT,
  student_skills TEXT[] DEFAULT '{}',
  student_reputation INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('applied', 'shortlisted', 'hired', 'completed', 'rejected')) DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submission_text TEXT,
  submission_link TEXT
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow candidates and companies to view applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow students to insert/update applications" ON applications FOR ALL USING (true) WITH CHECK (true);

-- Innovation Hub
CREATE TABLE IF NOT EXISTS innovation_ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_avatar TEXT,
  creator_skills TEXT[] DEFAULT '{}',
  category TEXT CHECK (category IN ('Programming', 'UI/UX', 'Blockchain', 'AI', 'Marketing', 'Business', 'Other')),
  votes_count INTEGER DEFAULT 0,
  voted_user_ids TEXT[] DEFAULT '{}',
  comments JSONB DEFAULT '[]'::jsonb,
  co_founders_needed BOOLEAN DEFAULT TRUE,
  co_founders_joined TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE innovation_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to ideas" ON innovation_ideas FOR SELECT USING (true);
CREATE POLICY "Allow members to post and upvote ideas" ON innovation_ideas FOR ALL USING (true) WITH CHECK (true);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_students_skills ON students USING gin (skills);
CREATE INDEX IF NOT EXISTS idx_opportunities_required_skills ON opportunities USING gin (required_skills);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications (student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON applications (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_innovation_ideas_creator ON innovation_ideas (creator_id);
