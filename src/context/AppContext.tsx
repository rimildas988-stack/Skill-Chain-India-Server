import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { 
  Student, 
  Company, 
  Opportunity, 
  Application, 
  InnovationIdea, 
  AppNotification, 
  Achievement, 
  Report,
  User,
  GitHubProfile,
  GitHubRepository,
  SupabaseConfig
} from '../types';
import { 
  initialStudents, 
  initialCompanies, 
  initialOpportunities, 
  initialApplications, 
  initialIdeas, 
  initialNotifications, 
  initialReports 
} from '../initialData';

interface AppContextType {
  students: Student[];
  companies: Company[];
  opportunities: Opportunity[];
  applications: Application[];
  ideas: InnovationIdea[];
  notifications: AppNotification[];
  reports: Report[];
  
  // Auth state simulations
  currentRole: 'student' | 'company' | 'admin';
  setCurrentRole: (role: 'student' | 'company' | 'admin') => void;
  currentStudent: Student | null;
  currentCompany: Company | null;
  walletConnected: boolean;
  walletAddress: string;
  
  // Local Auth additions
  currentUser: User | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loadingAuth: boolean;
  gmailAccessToken: string | null;
  setGmailAccessToken: (token: string | null) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;

  // Action Handlers
  connectWallet: (address?: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  postOpportunity: (opp: Omit<Opportunity, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'companyRating' | 'applicantsCount' | 'status' | 'paymentStatus'>) => Promise<void>;
  applyToOpportunity: (oppId: string, submissionLink?: string, comment?: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: Application['status']) => Promise<void>;
  completeOpportunityProject: (oppId: string, studentRating: number, reviewText: string) => Promise<void>;
  createIdea: (title: string, description: string, category: InnovationIdea['category'], coFoundersNeeded: boolean) => Promise<void>;
  voteOnIdea: (ideaId: string) => Promise<void>;
  joinIdeaTeam: (ideaId: string) => Promise<void>;
  addCommentToIdea: (ideaId: string, text: string) => Promise<void>;
  verifyCompanyAction: (companyId: string) => Promise<void>;
  approveAchievementAction: (achId: string) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  updateStudentProfile: (updates: Partial<Student>) => Promise<void>;
  updateStudentProfileById: (id: string, updates: Partial<Student>) => Promise<void>;
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  submitReport: (reportedId: string, reportedTitle: string, reason: string) => Promise<void>;
  isDashboardUnlocked: boolean;
  verifyDashboardPassword: (password: string) => Promise<boolean>;
  lockDashboard: () => void;
  registerPhoneUser: (details: {
    phone: string;
    name: string;
    email: string;
    school: string;
    skills: string[];
    availability: 'Full-time' | 'Part-time' | 'Intermittent' | 'Unavailable';
  }) => Promise<void>;
  loginPhoneUser: (phone: string) => Promise<boolean>;
  gitHubProfile: GitHubProfile | null;
  connectGithub: (username: string) => Promise<void>;
  disconnectGithub: () => Promise<void>;
  grantGithubReputationBoost: () => Promise<void>;
  supabaseConfig: SupabaseConfig;
  saveSupabaseConfig: (url: string, key: string) => Promise<boolean>;
  syncStateToSupabase: () => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with initialData as fallback
  const [students, setStudents] = useState<Student[]>(() => {
    const local = localStorage.getItem('skill_chain_students');
    return local ? JSON.parse(local) : initialStudents;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const local = localStorage.getItem('skill_chain_companies');
    return local ? JSON.parse(local) : initialCompanies;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const local = localStorage.getItem('skill_chain_opportunities');
    return local ? JSON.parse(local) : initialOpportunities;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const local = localStorage.getItem('skill_chain_applications');
    return local ? JSON.parse(local) : initialApplications;
  });

  const [ideas, setIdeas] = useState<InnovationIdea[]>(() => {
    const local = localStorage.getItem('skill_chain_ideas');
    return local ? JSON.parse(local) : initialIdeas;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const local = localStorage.getItem('skill_chain_notifications');
    return local ? JSON.parse(local) : initialNotifications;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const local = localStorage.getItem('skill_chain_reports');
    return local ? JSON.parse(local) : initialReports;
  });

  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('skill_chain_saved_opps');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentRole, setCurrentRole] = useState<'student' | 'company' | 'admin'>(() => {
    const role = localStorage.getItem('skill_chain_role');
    return (role as any) || 'student';
  });

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = localStorage.getItem('skill_chain_user');
    return user ? JSON.parse(user) : null;
  });

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('dashboard_unlocked') === 'true';
  });

  const [gitHubProfile, setGitHubProfile] = useState<GitHubProfile | null>(() => {
    const local = localStorage.getItem('skill_chain_github_profile');
    return local ? JSON.parse(local) : null;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const local = localStorage.getItem('skill_chain_supabase_config');
    return local ? JSON.parse(local) : {
      url: '',
      anonKey: '',
      isConnected: false,
      lastSyncedAt: null,
    };
  });

  // Persist states to localStorage
  useEffect(() => {
    if (gitHubProfile) {
      localStorage.setItem('skill_chain_github_profile', JSON.stringify(gitHubProfile));
    } else {
      localStorage.removeItem('skill_chain_github_profile');
    }
  }, [gitHubProfile]);

  useEffect(() => {
    localStorage.setItem('skill_chain_supabase_config', JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  useEffect(() => {
    localStorage.setItem('skill_chain_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('skill_chain_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('skill_chain_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('skill_chain_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('skill_chain_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('skill_chain_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('skill_chain_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('skill_chain_saved_opps', JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds]);

  useEffect(() => {
    localStorage.setItem('skill_chain_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skill_chain_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skill_chain_user');
    }
  }, [currentUser]);

  // Finish loading state on mount
  useEffect(() => {
    setLoadingAuth(false);
  }, []);

  // Sync simulated Google Login & Signout handlers
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      // Simulate fully pre-approved sandbox user to allow seamless zero-friction testing
      const mockUser: User = {
        uid: 'websitebuilder564_sandbox_uid',
        displayName: 'Web3 Builder (Sandbox)',
        email: 'websitebuilder564@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
        providerData: [{ providerId: 'google.com', uid: 'websitebuilder564_sandbox_uid', displayName: 'Web3 Builder (Sandbox)', email: 'websitebuilder564@gmail.com', photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200' }],
        isAnonymous: false,
        emailVerified: true
      };

      // Create student profile if none exists for this sandbox user
      const exists = students.some(s => s.id === mockUser.uid);
      if (!exists) {
        const newStudent: Student = {
          id: mockUser.uid,
          name: mockUser.displayName || 'Web3 Sandbox Builder',
          email: mockUser.email || 'websitebuilder564@gmail.com',
          avatar: mockUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          school: 'Decentralized Academy',
          skills: ['Web3 Development', 'Smart Contracts', 'DeFi Protocols'],
          rating: 5.0,
          reputation: 20,
          education: [],
          experience: [],
          certifications: [],
          availability: 'Part-time',
          achievements: [],
          completedProjectsCount: 0,
          hackathonWins: 0,
          innovationPoints: 10,
          walletAddress: ''
        };
        setStudents(prev => [newStudent, ...prev]);
      }

      setCurrentUser(mockUser);
      setGmailAccessToken('mock_sandbox_token');
      setCurrentRole('admin');
    } catch (error: any) {
      console.warn("Sign-In Error: ", error);
      setAuthError(error?.message || "Authentication simulation failed");
    }
  };

  const signOutUser = async () => {
    setGmailAccessToken(null);
    sessionStorage.removeItem('phone_auth_user');
    sessionStorage.removeItem('phone_auth_uid');
    sessionStorage.removeItem('phone_auth_name');
    sessionStorage.removeItem('phone_auth_email');
    sessionStorage.removeItem('dashboard_unlocked');
    setCurrentUser(null);
    setCurrentRole('student');
  };

  // Derived current states
  const currentStudent = students.find(s => s.id === currentUser?.uid) || students.find(s => s.id === 'student-current') || students[0] || null;
  const currentCompany = companies.find(c => c.id === currentUser?.uid) || companies.find(c => c.id === 'company-1') || companies[0] || null;

  // Track student's wallet state
  useEffect(() => {
    if (currentStudent && currentStudent.walletAddress) {
      setWalletConnected(true);
      setWalletAddress(currentStudent.walletAddress);
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }
  }, [currentStudent]);

  // Action Handlers
  const connectWallet = async (address?: string) => {
    // If address is provided directly (e.g. mock bypass or initial load from profile), we can use it.
    if (address) {
      setWalletConnected(true);
      setWalletAddress(address);
      if (currentStudent) {
        setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, walletAddress: address } : s));
      }
      return;
    }

    if (typeof (window as any).ethereum === 'undefined') {
      const errorMsg = 'MetaMask or compatible Web3 provider not found. Please install MetaMask to connect a real Web3 wallet!';
      if (currentStudent) {
        await addNotification(
          currentStudent.id,
          'student',
          'Wallet Connection Failed',
          errorMsg,
          'warning'
        );
      }
      throw new Error(errorMsg);
    }

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      // Request accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from provider.");
      }
      const realAddr = accounts[0];
      setWalletConnected(true);
      setWalletAddress(realAddr);
      
      if (currentStudent) {
        setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, walletAddress: realAddr } : s));
        
        await addNotification(
          currentStudent.id,
          'student',
          'Wallet Connected',
          `MetaMask wallet connected successfully at ${realAddr.substring(0, 6)}...${realAddr.substring(realAddr.length - 4)} on Ethereum network.`,
          'success'
        );
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred during wallet connection.';
      if (currentStudent) {
        await addNotification(
          currentStudent.id,
          'student',
          'Wallet Connection Error',
          errorMsg,
          'warning'
        );
      }
      throw err;
    }
  };

  const disconnectWallet = async () => {
    setWalletConnected(false);
    setWalletAddress('');
    if (currentStudent) {
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, walletAddress: '' } : s));
    }
  };

  const addNotification = async (userId: string, role: 'student' | 'company' | 'admin', title: string, message: string, type: 'success' | 'info' | 'warning') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      userRole: role,
      title,
      message,
      type,
      createdAt: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const postOpportunity = async (opp: Omit<Opportunity, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'companyRating' | 'applicantsCount' | 'status' | 'paymentStatus'>) => {
    if (!currentCompany) return;
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logo,
      companyRating: currentCompany.rating,
      applicantsCount: 0,
      status: 'open',
      paymentStatus: 'pending'
    };

    setOpportunities(prev => [newOpp, ...prev]);
    setCompanies(prev => prev.map(c => c.id === currentCompany.id ? { ...c, projectsPosted: (c.projectsPosted || 0) + 1 } : c));
    await addNotification('admin', 'admin', 'New Opportunity Posted', `"${newOpp.title}" has been posted by ${newOpp.companyName}. Moderation pending.`, 'info');
  };

  const applyToOpportunity = async (oppId: string, submissionLink?: string, comment?: string) => {
    if (!currentStudent) return;
    const opportunity = opportunities.find(o => o.id === oppId);
    if (!opportunity) return;

    // Check if already applied
    const alreadyApplied = applications.some(a => a.opportunityId === oppId && a.studentId === currentStudent.id);
    if (alreadyApplied) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: oppId,
      opportunityTitle: opportunity.title,
      companyName: opportunity.companyName,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentAvatar: currentStudent.avatar,
      studentSkills: currentStudent.skills,
      studentReputation: currentStudent.reputation,
      status: 'applied',
      appliedAt: new Date().toISOString().split('T')[0],
      submissionLink: submissionLink || '',
      submissionText: comment || ''
    };

    setApplications(prev => [newApp, ...prev]);
    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, applicantsCount: (o.applicantsCount || 0) + 1 } : o));

    await addNotification(
      currentStudent.id,
      'student',
      'Application Submitted',
      `You successfully applied for "${opportunity.title}" at ${opportunity.companyName}!`,
      'success'
    );

    await addNotification(
      opportunity.companyId,
      'company',
      'New Applicant Alert',
      `${currentStudent.name} applied for "${opportunity.title}". Review resume & credentials!`,
      'info'
    );
  };

  const updateApplicationStatus = async (appId: string, status: Application['status']) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));

    const opportunity = opportunities.find(o => o.id === app.opportunityId);
    if (!opportunity) return;

    if (status === 'shortlisted') {
      await addNotification(
        app.studentId,
        'student',
        'Profile Shortlisted! 📄',
        `Congratulations! ${app.companyName} has shortlisted you for "${app.opportunityTitle}". Complete assignments now.`,
        'success'
      );
    } else if (status === 'hired') {
      setOpportunities(prev => prev.map(o => o.id === app.opportunityId ? { ...o, status: 'ongoing' } : o));
      
      const comp = companies.find(c => c.name === app.companyName);
      if (comp) {
        setCompanies(prev => prev.map(c => c.id === comp.id ? { ...c, studentsHired: (c.studentsHired || 0) + 1 } : c));
      }

      await addNotification(
        app.studentId,
        'student',
        'Gig Offer Unlocked 🎉',
        `You have been HIRED by ${app.companyName} for "${app.opportunityTitle}"! Real-time milestones have begun.`,
        'success'
      );

      await addNotification(
        opportunity.companyId,
        'company',
        'Onboarding Initiated',
        `Development contract started with ${app.studentName} for "${app.opportunityTitle}". Track progress on Dashboard.`,
        'info'
      );
    }
  };

  const completeOpportunityProject = async (oppId: string, studentRating: number, reviewText: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return;

    const app = applications.find(a => a.opportunityId === oppId && a.status === 'hired');
    if (!app) return;

    const pointsGranted = 50 + (studentRating * 10);

    const newAchievement: Achievement = {
      id: `ach-${Date.now()}`,
      title: `${opp.title} Graduate`,
      icon: 'Award',
      description: `Completed freelancing project for ${opp.companyName} with ${studentRating}/5 rating.`,
      badgeType: studentRating >= 4.8 ? 'Top Performer' : 'Blockchain Verified',
      issuedBy: opp.companyName,
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const mockReview = {
      id: `rev-${Date.now()}`,
      authorName: app.studentName,
      rating: studentRating,
      comment: reviewText || `Successfully completed the internship! Excellent learning curve.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: 'completed', paymentStatus: 'released' } : o));
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'completed' } : a));
    
    setStudents(prev => prev.map(s => {
      if (s.id === app.studentId) {
        const updatedAchievements = [newAchievement, ...(s.achievements || [])];
        const newRating = Number(((s.rating * s.completedProjectsCount + studentRating) / (s.completedProjectsCount + 1)).toFixed(1));
        return {
          ...s,
          reputation: (s.reputation || 0) + pointsGranted,
          completedProjectsCount: (s.completedProjectsCount || 0) + 1,
          achievements: updatedAchievements,
          rating: newRating
        };
      }
      return s;
    }));

    setCompanies(prev => prev.map(c => {
      if (c.id === opp.companyId) {
        const updatedReviews = [mockReview, ...(c.reviews || [])];
        const newCompRating = Number(((c.rating * (c.reviews?.length || 0) + studentRating) / ((c.reviews?.length || 0) + 1)).toFixed(1));
        return {
          ...c,
          reviews: updatedReviews,
          rating: newCompRating
        };
      }
      return c;
    }));

    await addNotification(
      app.studentId,
      'student',
      'Bounty Released 💰',
      `Payment of ${opp.budget} (${opp.paymentMethod}) was successfully released! Earned +${pointsGranted} Reputation.`,
      'success'
    );

    await addNotification(
      'admin',
      'admin',
      'Credential Approval Pending',
      `New achievement issued by ${opp.companyName} for ${app.studentName} is awaiting Polygon hashing.`,
      'info'
    );
  };

  const createIdea = async (title: string, description: string, category: InnovationIdea['category'], coFoundersNeeded: boolean) => {
    if (!currentStudent) return;
    const newIdea: InnovationIdea = {
      id: `idea-${Date.now()}`,
      title,
      description,
      creatorId: currentStudent.id,
      creatorName: currentStudent.name,
      creatorAvatar: currentStudent.avatar,
      creatorSkills: currentStudent.skills,
      category,
      votesCount: 1,
      votedUserIds: [currentStudent.id], // initial self-vote
      comments: [],
      coFoundersNeeded,
      coFoundersJoined: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setIdeas(prev => [newIdea, ...prev]);
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? {
      ...s,
      reputation: (s.reputation || 0) + 15,
      innovationPoints: (s.innovationPoints || 0) + 15
    } : s));

    await addNotification(
      currentStudent.id,
      'student',
      'Idea Shared 💡',
      `Successfully published "${title}" in the Innovation Hub! Earned +15 Reputation.`,
      'success'
    );
  };

  const voteOnIdea = async (ideaId: string) => {
    if (!currentStudent) return;
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const hasVoted = idea.votedUserIds.includes(currentStudent.id);
    let voteDiff = hasVoted ? -1 : 1;
    const updatedVotedIds = hasVoted 
      ? idea.votedUserIds.filter(id => id !== currentStudent.id)
      : [...idea.votedUserIds, currentStudent.id];

    setIdeas(prev => prev.map(i => i.id === ideaId ? {
      ...i,
      votesCount: (i.votesCount || 0) + voteDiff,
      votedUserIds: updatedVotedIds
    } : i));

    setStudents(prev => prev.map(s => s.id === idea.creatorId ? {
      ...s,
      reputation: (s.reputation || 0) + (voteDiff * 5),
      innovationPoints: (s.innovationPoints || 0) + (voteDiff * 5)
    } : s));
  };

  const joinIdeaTeam = async (ideaId: string) => {
    if (!currentStudent) return;
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const joined = idea.coFoundersJoined.includes(currentStudent.id);
    if (joined) return; // already joined

    setIdeas(prev => prev.map(i => i.id === ideaId ? {
      ...i,
      coFoundersJoined: [...i.coFoundersJoined, currentStudent.id]
    } : i));

    await addNotification(
      idea.creatorId,
      'student',
      'Co-Founder Joined!',
      `${currentStudent.name} has joined your innovation team for "${idea.title}"!`,
      'success'
    );

    await addNotification(
      currentStudent.id,
      'student',
      'Team Joined',
      `You joined the development team for "${idea.title}". Connect with ${idea.creatorName}!`,
      'info'
    );
  };

  const addCommentToIdea = async (ideaId: string, text: string) => {
    if (!currentStudent) return;
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: currentStudent.name,
      authorAvatar: currentStudent.avatar,
      text,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setIdeas(prev => prev.map(i => i.id === ideaId ? {
      ...i,
      comments: [...(i.comments || []), newComment]
    } : i));

    setStudents(prev => prev.map(s => s.id === currentStudent.id ? {
      ...s,
      reputation: (s.reputation || 0) + 2
    } : s));
  };

  const verifyCompanyAction = async (companyId: string) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, isVerified: true } : c));
    await addNotification(
      companyId,
      'company',
      'Verification Success ✅',
      'Your company profile was verified by administrators. A gold verification badge was issued on-chain.',
      'success'
    );
  };

  const approveAchievementAction = async (achId: string) => {
    const ipfsHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const txHash = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

    setStudents(prev => prev.map(s => {
      if (s.achievements?.some(a => a.id === achId)) {
        const updatedAchievements = s.achievements.map(a => a.id === achId ? {
          ...a,
          status: 'approved' as const,
          ipfsHash,
          transactionHash: txHash
        } : a);
        return {
          ...s,
          achievements: updatedAchievements,
          reputation: (s.reputation || 0) + 20
        };
      }
      return s;
    }));

    const stud = students.find(s => s.achievements?.some(a => a.id === achId));
    if (stud) {
      await addNotification(
        stud.id,
        'student',
        'On-Chain Credential Minted 🌟',
        `Admin approved on-chain verification! Your "SkillPass" has been stamped. Tx: ${txHash.substring(0, 10)}...`,
        'success'
      );
    }
  };

  const dismissNotification = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateStudentProfile = async (updates: Partial<Student>) => {
    if (!currentStudent) return;
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, ...updates } : s));
  };

  const updateStudentProfileById = async (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const submitReport = async (reportedId: string, reportedTitle: string, reason: string) => {
    if (!currentStudent) return;
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentStudent.id,
      reporterName: currentStudent.name,
      reportedId,
      reportedTitle,
      reason,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setReports(prev => [newReport, ...prev]);
    await addNotification('admin', 'admin', 'New Report Logged', `User reported "${reportedTitle}" for "${reason}". Moderation required.`, 'warning');
  };

  const verifyDashboardPassword = async (pass: string): Promise<boolean> => {
    const correctPass = 'skillchain@14qpe*';
    if (pass === correctPass) {
      setIsDashboardUnlocked(true);
      sessionStorage.setItem('dashboard_unlocked', 'true');
      return true;
    }
    return false;
  };

  const lockDashboard = () => {
    setIsDashboardUnlocked(false);
    sessionStorage.removeItem('dashboard_unlocked');
  };

  const registerPhoneUser = async (details: {
    phone: string;
    name: string;
    email: string;
    school: string;
    skills: string[];
    availability: 'Full-time' | 'Part-time' | 'Intermittent' | 'Unavailable';
  }) => {
    try {
      setLoadingAuth(true);
      const phoneDigits = details.phone.replace(/[^0-9]/g, '');
      const simulatedUid = `phone_${phoneDigits || 'guest'}_${Math.random().toString(36).substring(2, 8)}`;
      
      const user: User = {
        uid: simulatedUid,
        displayName: details.name,
        email: details.email,
        isAnonymous: true,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        providerData: []
      };
      
      // Write the customized student profile
      const newStudent: Student = {
        id: user.uid,
        name: details.name,
        email: details.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        school: details.school,
        skills: details.skills,
        rating: 5.0,
        reputation: 20,
        education: [],
        experience: [],
        certifications: [],
        availability: details.availability,
        achievements: [],
        completedProjectsCount: 0,
        hackathonWins: 0,
        innovationPoints: 10,
        walletAddress: '',
        personalWebsite: `Phone: ${details.phone}`
      };
      
      setStudents(prev => [newStudent, ...prev]);
      
      // Save phone auth state in session storage
      sessionStorage.setItem('phone_auth_user', 'true');
      sessionStorage.setItem('phone_auth_uid', user.uid);
      sessionStorage.setItem('phone_auth_name', details.name);
      sessionStorage.setItem('phone_auth_email', details.email);
      
      setCurrentUser(user);
      setLoadingAuth(false);
    } catch (err: any) {
      setLoadingAuth(false);
      console.error("Error registering phone user:", err);
      throw err;
    }
  };

  const loginPhoneUser = async (phone: string): Promise<boolean> => {
    try {
      setLoadingAuth(true);
      const targetPhone = `Phone: ${phone}`;
      
      // Look in the loaded state first
      const existingStudent = students.find(s => s.personalWebsite === targetPhone);
      
      if (existingStudent) {
        sessionStorage.setItem('phone_auth_user', 'true');
        sessionStorage.setItem('phone_auth_uid', existingStudent.id);
        sessionStorage.setItem('phone_auth_name', existingStudent.name);
        sessionStorage.setItem('phone_auth_email', existingStudent.email);
        
        const mockUser: User = {
          uid: existingStudent.id,
          displayName: existingStudent.name,
          email: existingStudent.email,
          isAnonymous: true,
          photoURL: existingStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          providerData: []
        };
        
        setCurrentUser(mockUser);
        setLoadingAuth(false);
        return true;
      }
      
      setLoadingAuth(false);
      return false;
    } catch (err) {
      setLoadingAuth(false);
      console.error("Error in loginPhoneUser:", err);
      return false;
    }
  };

  const connectGithub = async (username: string) => {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      const userData = await userRes.json();
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      let reposData: any[] = [];
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }

      const repositories: GitHubRepository[] = reposData.map((r: any) => ({
        name: r.name,
        description: r.description || null,
        html_url: r.html_url,
        language: r.language || null,
        stargazers_count: r.stargazers_count || 0,
        forks_count: r.forks_count || 0,
        updated_at: r.updated_at
      }));

      const newProfile: GitHubProfile = {
        username: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        bio: userData.bio || null,
        public_repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        repositories,
        reputationBoostGranted: false
      };

      setGitHubProfile(newProfile);

      if (currentStudent) {
        await addNotification(
          currentStudent.id,
          'student',
          'GitHub Connected 🐙',
          `Successfully connected GitHub account "${userData.login}" with ${repositories.length} public repositories imported.`,
          'success'
        );
      }
    } catch (err: any) {
      console.error("Error connecting GitHub:", err);
      throw new Error(err.message || "Failed to connect to GitHub. Check internet connection.");
    }
  };

  const disconnectGithub = async () => {
    setGitHubProfile(null);
    if (currentStudent) {
      await addNotification(
        currentStudent.id,
        'student',
        'GitHub Disconnected',
        `GitHub account has been disconnected from your identity.`,
        'info'
      );
    }
  };

  const grantGithubReputationBoost = async () => {
    if (!gitHubProfile || gitHubProfile.reputationBoostGranted || !currentStudent) return;
    
    const baseBoost = 15;
    const repoBonus = Math.min(15, (gitHubProfile.repositories?.length || 0) * 3);
    const totalBoost = baseBoost + repoBonus;

    setStudents(prev => prev.map(s => s.id === currentStudent.id ? {
      ...s,
      reputation: (s.reputation || 0) + totalBoost
    } : s));

    setGitHubProfile(prev => prev ? { ...prev, reputationBoostGranted: true } : null);

    await addNotification(
      currentStudent.id,
      'student',
      'GitHub Reputation Boost Approved! 🚀',
      `Earned a permanent reputation boost of +${totalBoost} Points for your verified public open-source portfolio.`,
      'success'
    );
  };

  const saveSupabaseConfig = async (url: string, key: string): Promise<boolean> => {
    if (!url || !key) {
      setSupabaseConfig(prev => ({ ...prev, url, anonKey: key, isConnected: false }));
      return false;
    }

    try {
      const testRes = await fetch(`${url}/rest/v1/?apikey=${key}`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (testRes.ok || testRes.status === 404 || testRes.status === 401) {
        setSupabaseConfig({
          url,
          anonKey: key,
          isConnected: true,
          lastSyncedAt: supabaseConfig.lastSyncedAt
        });
        
        if (currentStudent) {
          await addNotification(
            currentStudent.id,
            'student',
            'Supabase Connected ⚡',
            `Successfully connected to your custom Supabase Cloud Database: ${url.replace('https://', '')}`,
            'success'
          );
        }
        return true;
      } else {
        throw new Error("Invalid Supabase URL or Anon Key");
      }
    } catch (err) {
      console.warn("Supabase local ping error, checking via client:", err);
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        await supabase.from('skill_chain_sync').select('*').limit(1);
        
        setSupabaseConfig({
          url,
          anonKey: key,
          isConnected: true,
          lastSyncedAt: supabaseConfig.lastSyncedAt
        });
        return true;
      } catch (innerErr) {
        console.error("Supabase connection failed completely:", innerErr);
        setSupabaseConfig(prev => ({ ...prev, url, anonKey: key, isConnected: false }));
        return false;
      }
    }
  };

  const syncStateToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabaseConfig.isConnected || !supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: "Please configure and test Supabase connection first." };
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

      const syncData = {
        student_id: currentStudent?.id || 'anonymous_guest',
        student_name: currentStudent?.name || 'Anonymous Student',
        reputation: currentStudent?.reputation || 0,
        rating: currentStudent?.rating || 5.0,
        completed_projects: currentStudent?.completedProjectsCount || 0,
        wallet_address: currentStudent?.walletAddress || '0x0000',
        github_username: gitHubProfile?.username || null,
        ideas_count: ideas.filter(i => i.creatorId === currentStudent?.id).length,
        applications_count: applications.filter(a => a.studentId === currentStudent?.id).length,
        synced_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('skill_chain_sync')
        .upsert([syncData], { onConflict: 'student_id' });

      if (error) {
        console.error("Supabase sync error:", error);
        const sqlSchema = `
-- Run this SQL in your Supabase SQL Editor to create the sync table:

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

-- Enable row-level security (RLS)
ALTER TABLE skill_chain_sync ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read/write access" ON skill_chain_sync FOR ALL USING (true) WITH CHECK (true);
        `;
        return { 
          success: false, 
          message: `The sync table 'skill_chain_sync' does not exist yet.\n\nPlease copy and run the following SQL inside your Supabase dashboard's SQL Editor to set it up:\n${sqlSchema}` 
        };
      }

      setSupabaseConfig(prev => ({
        ...prev,
        lastSyncedAt: new Date().toISOString()
      }));

      if (currentStudent) {
        await addNotification(
          currentStudent.id,
          'student',
          'State Synced to Supabase ⚡',
          `Successfully pushed your verified profile, on-chain reputation stats, and GitHub connection logs to Supabase table.`,
          'success'
        );
      }

      return { success: true, message: "Sync successful! Your local student state is now live in Supabase 'skill_chain_sync' table." };
    } catch (err: any) {
      console.error("Supabase sync crash:", err);
      return { success: false, message: err.message || "An error occurred while syncing to Supabase." };
    }
  };

  return (
    <AppContext.Provider value={{
      students,
      companies,
      opportunities,
      applications,
      ideas,
      notifications,
      reports,
      currentRole,
      setCurrentRole,
      currentStudent,
      currentCompany,
      walletConnected,
      walletAddress,
      currentUser,
      signInWithGoogle,
      signOutUser,
      loadingAuth,
      gmailAccessToken,
      setGmailAccessToken,
      authError,
      setAuthError,
      connectWallet,
      disconnectWallet,
      postOpportunity,
      applyToOpportunity,
      updateApplicationStatus,
      completeOpportunityProject,
      createIdea,
      voteOnIdea,
      joinIdeaTeam,
      addCommentToIdea,
      verifyCompanyAction,
      approveAchievementAction,
      dismissNotification,
      updateStudentProfile,
      updateStudentProfileById,
      savedOpportunityIds,
      toggleSaveOpportunity,
      submitReport,
      isDashboardUnlocked,
      verifyDashboardPassword,
      lockDashboard,
      registerPhoneUser,
      loginPhoneUser,
      gitHubProfile,
      connectGithub,
      disconnectGithub,
      grantGithubReputationBoost,
      supabaseConfig,
      saveSupabaseConfig,
      syncStateToSupabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
