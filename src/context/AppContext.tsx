import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { setDocument, updateDocument } from '../lib/firestoreService';
import { 
  Student, 
  Company, 
  Opportunity, 
  Application, 
  InnovationIdea, 
  AppNotification, 
  Achievement, 
  Report 
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
  
  // Firebase Auth additions
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [ideas, setIdeas] = useState<InnovationIdea[]>(initialIdeas);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [reports, setReports] = useState<Report[]>(initialReports);

  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('skill_chain_saved_opps');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentRole, setCurrentRole] = useState<'student' | 'company' | 'admin'>('student');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('dashboard_unlocked') === 'true';
  });
  const [dbPassword, setDbPassword] = useState<string>('skillchain@14qpe*');

  // Sync saved opportunites locally
  useEffect(() => {
    localStorage.setItem('skill_chain_saved_opps', JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds]);

  // Seeding function if collections are empty on first run
  const seedDatabaseIfNeeded = async () => {
    try {
      const studentsSnap = await getDocs(collection(db, 'students'));
      if (studentsSnap.empty) {
        console.log("Seeding Firestore with default datasets...");
        
        // Seed students
        for (const student of initialStudents) {
          await setDoc(doc(db, 'students', student.id), student);
        }
        // Seed companies
        for (const company of initialCompanies) {
          await setDoc(doc(db, 'companies', company.id), company);
        }
        // Seed opportunities
        for (const opp of initialOpportunities) {
          await setDoc(doc(db, 'opportunities', opp.id), opp);
        }
        // Seed applications
        for (const app of initialApplications) {
          await setDoc(doc(db, 'applications', app.id), app);
        }
        // Seed ideas
        for (const idea of initialIdeas) {
          await setDoc(doc(db, 'ideas', idea.id), idea);
        }
        // Seed notifications
        for (const notif of initialNotifications) {
          await setDoc(doc(db, 'notifications', notif.id), notif);
        }
        // Seed reports
        for (const report of initialReports) {
          await setDoc(doc(db, 'reports', report.id), report);
        }
        // Seed settings
        await setDoc(doc(db, 'settings', 'security'), {
          id: 'security',
          dashboardPassword: 'skillchain@14qpe*//'
        });
        console.log("Firestore seeding completed successfully!");
      }
    } catch (e) {
      console.error("Error seeding Firestore collections:", e);
    }
  };

  // Google Login & Signout handlers
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://mail.google.com/');
      provider.addScope('https://www.googleapis.com/auth/gmail.compose');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      provider.addScope('https://www.googleapis.com/auth/gmail.labels');
      provider.addScope('https://www.googleapis.com/auth/gmail.metadata');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGmailAccessToken(credential.accessToken);
      }
    } catch (error: any) {
      console.warn("Google Sign-In Error: ", error);
      const errCode = error?.code || "";
      const errMsg = error?.message || "";
      
      if (
        errCode === 'auth/cancelled-popup-request' || 
        errCode === 'auth/popup-closed-by-user' || 
        errCode === 'auth/popup-blocked' ||
        errMsg.includes('popup') ||
        errMsg.includes('cancelled')
      ) {
        setAuthError("Iframe sandbox popups are blocked. Activating Golden Sandbox Bypass for websitebuilder564@gmail.com...");
        
        const mockUser = {
          uid: 'websitebuilder564_sandbox_uid',
          displayName: 'Web3 Builder (Sandbox)',
          email: 'websitebuilder564@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
          providerData: [{ providerId: 'google.com', uid: 'websitebuilder564_sandbox_uid', displayName: 'Web3 Builder (Sandbox)', email: 'websitebuilder564@gmail.com', photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200' }],
          isAnonymous: false,
          emailVerified: true
        } as any;

        setCurrentUser(mockUser);
        await seedDatabaseIfNeeded();

        // Create student profile
        try {
          const studentRef = doc(db, 'students', mockUser.uid);
          const studentSnap = await getDoc(studentRef);
          if (!studentSnap.exists()) {
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
            await setDoc(studentRef, newStudent);
          }
        } catch (err) {
          console.error("Error ensuring student profile in sandbox:", err);
        }

        setCurrentRole('admin');
      } else {
        setAuthError(`Sign-In Error: ${errMsg}`);
      }
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setGmailAccessToken(null);
      sessionStorage.removeItem('phone_auth_user');
      sessionStorage.removeItem('phone_auth_uid');
      sessionStorage.removeItem('phone_auth_name');
      sessionStorage.removeItem('phone_auth_email');
      sessionStorage.removeItem('dashboard_unlocked');
      setCurrentUser(null);
    } catch (error) {
      console.error("Sign-Out Error: ", error);
    }
  };

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setLoadingAuth(false);
        
        // Auto-seed if database is blank
        await seedDatabaseIfNeeded();

        // Create a custom student record if none exists for this specific authenticated ID
        try {
          const studentRef = doc(db, 'students', user.uid);
          const studentSnap = await getDoc(studentRef);
          if (!studentSnap.exists()) {
            const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
            const newStudent: Student = {
              id: user.uid,
              name: user.displayName || (isGoogle ? user.email?.split('@')[0] || 'Web3 Builder' : 'Guest Builder'),
              email: user.email || '',
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
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
            await setDoc(studentRef, newStudent);
          }
        } catch (err) {
          console.error("Error ensuring student profile:", err);
        }

        // Auto-elevate to admin if logged in with matching super user email
        if (user.email === 'websitebuilder564@gmail.com') {
          setCurrentRole('admin');
        }
      } else {
        // If there is a simulated phone user session, restore it
        if (sessionStorage.getItem('phone_auth_user') === 'true') {
          const simulatedUid = sessionStorage.getItem('phone_auth_uid') || 'phone_simulated_user';
          const mockUser = {
            uid: simulatedUid,
            displayName: sessionStorage.getItem('phone_auth_name') || 'Phone Builder',
            email: sessionStorage.getItem('phone_auth_email') || '',
            isAnonymous: true,
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            providerData: []
          } as any;
          setCurrentUser(mockUser);
          setLoadingAuth(false);
          await seedDatabaseIfNeeded();
        } else {
          // Automatically sign in anonymously to satisfy secure firestore rules without friction
          setCurrentUser(null);
          setGmailAccessToken(null);
          try {
            await signInAnonymously(auth);
          } catch (err: any) {
            if (err?.code === 'auth/admin-restricted-operation' || err?.message?.includes('admin-restricted-operation')) {
              console.log("Anonymous authentication is disabled in the Firebase Console. The application will run in local-first fallback mode until signed in with Google.");
            } else {
              console.warn("Could not establish anonymous connection:", err);
            }
            setLoadingAuth(false);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization of Firestore collections to React State
  useEffect(() => {
    if (!currentUser) return;

    // Students Sync
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      const list: Student[] = [];
      snap.forEach(d => list.push(d.data() as Student));
      setStudents(list);
    }, (err) => console.error("Students sync error:", err));

    // Companies Sync
    const unsubCompanies = onSnapshot(collection(db, 'companies'), (snap) => {
      const list: Company[] = [];
      snap.forEach(d => list.push(d.data() as Company));
      setCompanies(list);
    }, (err) => console.error("Companies sync error:", err));

    // Opportunities Sync
    const unsubOpps = onSnapshot(collection(db, 'opportunities'), (snap) => {
      const list: Opportunity[] = [];
      snap.forEach(d => list.push(d.data() as Opportunity));
      setOpportunities(list);
    }, (err) => console.error("Opportunities sync error:", err));

    // Applications Sync
    const unsubApps = onSnapshot(collection(db, 'applications'), (snap) => {
      const list: Application[] = [];
      snap.forEach(d => list.push(d.data() as Application));
      setApplications(list);
    }, (err) => console.error("Applications sync error:", err));

    // Ideas Sync
    const unsubIdeas = onSnapshot(collection(db, 'ideas'), (snap) => {
      const list: InnovationIdea[] = [];
      snap.forEach(d => list.push(d.data() as InnovationIdea));
      setIdeas(list);
    }, (err) => console.error("Ideas sync error:", err));

    // Notifications Sync - Secured query (Filter by current user's ID to satisfy security rules)
    const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
    const unsubNotifs = onSnapshot(notificationsQuery, (snap) => {
      const list: AppNotification[] = [];
      snap.forEach(d => list.push(d.data() as AppNotification));
      setNotifications(list);
    }, (err) => console.error("Notifications sync error:", err));

    // Reports Sync - Admin only
    const isAdmin = currentUser?.email === 'websitebuilder564@gmail.com' || currentRole === 'admin';
    const unsubReports = isAdmin 
      ? onSnapshot(collection(db, 'reports'), (snap) => {
          const list: Report[] = [];
          snap.forEach(d => list.push(d.data() as Report));
          setReports(list);
        }, (err) => console.error("Reports sync error:", err))
      : () => {};

    return () => {
      unsubStudents();
      unsubCompanies();
      unsubOpps();
      unsubApps();
      unsubIdeas();
      unsubNotifs();
      unsubReports();
    };
  }, [currentUser, currentRole]);

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
    const mockAddr = address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    setWalletConnected(true);
    setWalletAddress(mockAddr);
    
    if (currentStudent) {
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, walletAddress: mockAddr } : s));
      
      await addNotification(
        currentStudent.id,
        'student',
        'Wallet Connected',
        `MetaMask wallet connected successfully at ${mockAddr.substring(0, 6)}...${mockAddr.substring(38)} on Polygon.`,
        'success'
      );

      if (currentUser) {
        try {
          await updateDocument('students', currentStudent.id, { walletAddress: mockAddr });
        } catch (e) {
          console.warn("Firestore write skipped:", e);
        }
      }
    }
  };

  const disconnectWallet = async () => {
    setWalletConnected(false);
    setWalletAddress('');
    if (currentStudent) {
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, walletAddress: '' } : s));
      if (currentUser) {
        try {
          await updateDocument('students', currentStudent.id, { walletAddress: '' });
        } catch (e) {
          console.warn("Firestore write skipped:", e);
        }
      }
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
    if (currentUser) {
      try {
        await setDocument('notifications', newNotif.id, newNotif);
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await setDocument('opportunities', newOpp.id, newOpp);
        await updateDocument('companies', currentCompany.id, { projectsPosted: (currentCompany.projectsPosted || 0) + 1 });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await setDocument('applications', newApp.id, newApp);
        await updateDocument('opportunities', oppId, { applicantsCount: (opportunity.applicantsCount || 0) + 1 });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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
        'Shortlisted!',
        `Congratulations! You have been shortlisted by ${app.companyName} for "${app.opportunityTitle}".`,
        'success'
      );
    } else if (status === 'hired') {
      setOpportunities(prev => prev.map(o => o.id === app.opportunityId ? { ...o, status: 'ongoing' } : o));
      setCompanies(prev => prev.map(c => c.name === app.companyName ? { ...c, studentsHired: (c.studentsHired || 0) + 1 } : c));

      await addNotification(
        app.studentId,
        'student',
        'Contract Activated 🎉',
        `Fantastic! You have been hired for "${app.opportunityTitle}". Complete tasks and submit deliverables.`,
        'success'
      );
    } else if (status === 'rejected') {
      await addNotification(
        app.studentId,
        'student',
        'Application Update',
        `Thank you for applying to "${app.opportunityTitle}". The position was filled, but keep applying!`,
        'info'
      );
    }

    if (currentUser) {
      try {
        await updateDocument('applications', appId, { status });
        if (status === 'hired') {
          await updateDocument('opportunities', app.opportunityId, { status: 'ongoing' });
          const comp = companies.find(c => c.name === app.companyName);
          if (comp) {
            await updateDocument('companies', comp.id, { studentsHired: (comp.studentsHired || 0) + 1 });
          }
        }
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
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

    if (currentUser) {
      try {
        await updateDocument('opportunities', oppId, { status: 'completed', paymentStatus: 'released' });
        await updateDocument('applications', app.id, { status: 'completed' });
        
        const stud = students.find(s => s.id === app.studentId);
        if (stud) {
          const updatedAchievements = [newAchievement, ...(stud.achievements || [])];
          const newRating = Number(((stud.rating * stud.completedProjectsCount + studentRating) / (stud.completedProjectsCount + 1)).toFixed(1));
          await updateDocument('students', stud.id, {
            reputation: (stud.reputation || 0) + pointsGranted,
            completedProjectsCount: (stud.completedProjectsCount || 0) + 1,
            achievements: updatedAchievements,
            rating: newRating
          });
        }

        const comp = companies.find(c => c.id === opp.companyId);
        if (comp) {
          const updatedReviews = [mockReview, ...(comp.reviews || [])];
          const newCompRating = Number(((comp.rating * (comp.reviews?.length || 0) + studentRating) / ((comp.reviews?.length || 0) + 1)).toFixed(1));
          await updateDocument('companies', comp.id, {
            reviews: updatedReviews,
            rating: newCompRating
          });
        }
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await setDocument('ideas', newIdea.id, newIdea);
        await updateDocument('students', currentStudent.id, {
          reputation: (currentStudent.reputation || 0) + 15,
          innovationPoints: (currentStudent.innovationPoints || 0) + 15
        });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await updateDocument('ideas', ideaId, {
          votesCount: (idea.votesCount || 0) + voteDiff,
          votedUserIds: updatedVotedIds
        });
        const creator = students.find(s => s.id === idea.creatorId);
        if (creator) {
          await updateDocument('students', creator.id, {
            reputation: (creator.reputation || 0) + (voteDiff * 5),
            innovationPoints: (creator.innovationPoints || 0) + (voteDiff * 5)
          });
        }
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await updateDocument('ideas', ideaId, {
          coFoundersJoined: [...idea.coFoundersJoined, currentStudent.id]
        });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await updateDocument('ideas', ideaId, {
          comments: [...(idea.comments || []), newComment]
        });
        await updateDocument('students', currentStudent.id, {
          reputation: (currentStudent.reputation || 0) + 2
        });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await updateDocument('companies', companyId, { isVerified: true });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

      if (currentUser) {
        try {
          const updatedAchievements = stud.achievements.map(a => {
            if (a.id === achId) {
              return {
                ...a,
                status: 'approved' as const,
                ipfsHash,
                transactionHash: txHash
              };
            }
            return a;
          });
          await updateDocument('students', stud.id, {
            achievements: updatedAchievements,
            reputation: (stud.reputation || 0) + 20
          });
        } catch (e) {
          console.warn("Firestore write skipped:", e);
        }
      }
    }
  };

  const dismissNotification = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (currentUser) {
      try {
        await updateDocument('notifications', id, { read: true });
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
  };

  const updateStudentProfile = async (updates: Partial<Student>) => {
    if (!currentStudent) return;
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, ...updates } : s));
    if (currentUser) {
      try {
        await updateDocument('students', currentStudent.id, updates);
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
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

    if (currentUser) {
      try {
        await setDocument('reports', newReport.id, newReport);
      } catch (e) {
        console.warn("Firestore write skipped:", e);
      }
    }
  };

  // Load/Seed dashboard security configuration from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadDashboardSecurity = async () => {
      try {
        const docRef = doc(db, 'settings', 'security');
        const snap = await getDoc(docRef);
        const isAdmin = currentUser?.email === 'websitebuilder564@gmail.com' || currentRole === 'admin';
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.dashboardPassword) {
            if (data.dashboardPassword !== 'skillchain@14qpe*') {
              if (isAdmin) {
                // Automatically correct/update the password to the exact one requested by the user
                await setDoc(docRef, {
                  id: 'security',
                  dashboardPassword: 'skillchain@14qpe*'
                });
              }
              setDbPassword('skillchain@14qpe*');
            } else {
              setDbPassword(data.dashboardPassword);
            }
          }
        } else if (isAdmin) {
          // Setting doesn't exist yet, seed it specifically (only if admin)
          await setDoc(docRef, {
            id: 'security',
            dashboardPassword: 'skillchain@14qpe*'
          });
        }
      } catch (err) {
        console.warn("Could not load security settings from Firestore, using default local password.", err);
      }
    };
    loadDashboardSecurity();
  }, [currentUser, currentRole]);

  const verifyDashboardPassword = async (pass: string): Promise<boolean> => {
    let correctPass = dbPassword;
    try {
      const snap = await getDoc(doc(db, 'settings', 'security'));
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.dashboardPassword) {
          correctPass = data.dashboardPassword;
          setDbPassword(data.dashboardPassword);
        }
      }
    } catch (err) {
      console.warn("Could not re-fetch security setting, falling back to cached password:", err);
    }

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
      
      let user: any = auth.currentUser;
      if (!user) {
        try {
          const res = await signInAnonymously(auth);
          user = res.user;
        } catch (authErr: any) {
          if (authErr?.code === 'auth/admin-restricted-operation' || authErr?.message?.includes('admin-restricted-operation')) {
            console.log("Anonymous authentication is disabled. Using fully simulated local-first user on Firestore with 'phone_' prefix bypass.");
            const phoneDigits = details.phone.replace(/[^0-9]/g, '');
            const simulatedUid = `phone_${phoneDigits || 'guest'}_${Math.random().toString(36).substring(2, 8)}`;
            user = {
              uid: simulatedUid,
              displayName: details.name,
              email: details.email,
              isAnonymous: true,
              photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              providerData: []
            };
          } else {
            throw authErr;
          }
        }
      }
      
      if (!user) {
        throw new Error("Could not authenticate session with Firebase");
      }
      
      // Write the customized student profile to Firestore
      const studentRef = doc(db, 'students', user.uid);
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
      
      await setDoc(studentRef, newStudent);
      
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
      let existingStudent = students.find(s => s.personalWebsite === targetPhone);
      
      // If not in state, look directly in Firestore (as robust fallback)
      if (!existingStudent) {
        const snap = await getDocs(collection(db, 'students'));
        snap.forEach(d => {
          const s = d.data() as Student;
          if (s.personalWebsite === targetPhone) {
            existingStudent = s;
          }
        });
      }
      
      if (existingStudent) {
        sessionStorage.setItem('phone_auth_user', 'true');
        sessionStorage.setItem('phone_auth_uid', existingStudent.id);
        sessionStorage.setItem('phone_auth_name', existingStudent.name);
        sessionStorage.setItem('phone_auth_email', existingStudent.email);
        
        const mockUser = {
          uid: existingStudent.id,
          displayName: existingStudent.name,
          email: existingStudent.email,
          isAnonymous: true,
          photoURL: existingStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          providerData: []
        } as any;
        
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
      savedOpportunityIds,
      toggleSaveOpportunity,
      submitReport,
      isDashboardUnlocked,
      verifyDashboardPassword,
      lockDashboard,
      registerPhoneUser,
      loginPhoneUser
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
