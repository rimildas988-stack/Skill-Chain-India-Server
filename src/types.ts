export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school: string;
  walletAddress?: string;
  skills: string[];
  rating: number;
  reputation: number;
  education: Education[];
  experience: Experience[];
  certifications: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  availability: 'Full-time' | 'Part-time' | 'Intermittent' | 'Unavailable';
  resumeUrl?: string;
  achievements: Achievement[];
  completedProjectsCount: number;
  hackathonWins: number;
  innovationPoints: number;
}

export interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  companyName: string;
  role: string;
  duration: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  about: string;
  website: string;
  rating: number;
  isVerified: boolean;
  projectsPosted: number;
  studentsHired: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  budget: number;
  duration: string;
  location: string;
  remote: boolean;
  requiredSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  deadline: string;
  applicantsCount: number;
  companyRating: number;
  description: string;
  responsibilities: string[];
  preferredSkills: string[];
  deliverables: string[];
  status: 'open' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'released' | 'not-applicable';
  paymentMethod: 'Stripe' | 'Crypto' | 'Razorpay';
  expectedReleaseDate?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentSkills: string[];
  studentReputation: number;
  status: 'applied' | 'shortlisted' | 'hired' | 'completed' | 'rejected';
  appliedAt: string;
  submissionText?: string;
  submissionLink?: string;
}

export interface InnovationIdea {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorSkills: string[];
  category: 'Programming' | 'UI/UX' | 'Blockchain' | 'AI' | 'Marketing' | 'Business' | 'Other';
  votesCount: number;
  votedUserIds: string[];
  comments: Comment[];
  coFoundersNeeded: boolean;
  coFoundersJoined: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  badgeType: 'Top Performer' | 'Fast Learner' | 'Blockchain Verified' | 'Hackathon Winner' | 'AI Expert' | 'React Master' | 'Problem Solver' | 'Community Leader';
  ipfsHash?: string;
  transactionHash?: string;
  issuedBy: string;
  issuedAt: string;
  status: 'pending' | 'approved';
}

export interface AppNotification {
  id: string;
  userId: string;
  userRole: 'student' | 'company' | 'admin';
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  createdAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string; // Opportunity id or student id
  reportedTitle: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  emailVerified?: boolean;
  providerData?: any[];
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubProfile {
  username: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  repositories: GitHubRepository[];
  reputationBoostGranted: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt: string | null;
}

