import { Student, Company, Opportunity, Application, InnovationIdea, AppNotification, Report } from './types';

export const initialStudents: Student[] = [
  {
    id: 'student-current',
    name: 'Alex Rivera',
    email: 'websitebuilder564@gmail.com', // match user context
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    school: 'Stanford University',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    skills: ['React', 'TypeScript', 'Node.js', 'Solidity', 'UI/UX Design'],
    rating: 4.9,
    reputation: 340,
    availability: 'Part-time',
    portfolioUrl: 'https://alexrivera.dev',
    githubUrl: 'https://github.com/alexrivera-web3',
    linkedinUrl: 'https://linkedin.com/in/alexrivera',
    personalWebsite: 'https://alexrivera.dev',
    education: [
      {
        schoolName: 'Stanford University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Web3 Technologies',
        startYear: '2023',
        endYear: '2027'
      }
    ],
    experience: [
      {
        companyName: 'Decentralized Lab',
        role: 'Frontend Contributor',
        duration: '3 Months',
        description: 'Assisted in building responsive dashboards for a decentralized lending protocol using React and Tailwind.'
      }
    ],
    certifications: ['Ethereum Developer Bootcamp Certificate', 'Scrimba Advanced React'],
    achievements: [
      {
        id: 'ach-1',
        title: 'Polygon Builder Champ',
        icon: 'Award',
        description: 'Successfully deployed and verified 5+ smart contracts on Polygon Amoy.',
        badgeType: 'Blockchain Verified',
        ipfsHash: 'ipfs://QmYwAPz23L22ZtDvw56gW5NgnfNjwzGjt9bFNDH3Y92g7m',
        transactionHash: '0x32a87c...9ef1',
        issuedBy: 'Polygon Foundation',
        issuedAt: '2026-04-12',
        status: 'approved'
      },
      {
        id: 'ach-2',
        title: 'React Master Node',
        icon: 'Code',
        description: 'Completed complex high-performance state-driven application with motion effects.',
        badgeType: 'React Master',
        ipfsHash: 'ipfs://QmZ4Y3D2t...FHDj',
        transactionHash: '0x9a8f12...34bc',
        issuedBy: 'Skill Chain India',
        issuedAt: '2026-05-18',
        status: 'approved'
      }
    ],
    completedProjectsCount: 4,
    hackathonWins: 1,
    innovationPoints: 85
  },
  {
    id: 'student-2',
    name: 'Siddharth Sharma',
    email: 'siddharth@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    school: 'IIT Bombay',
    walletAddress: '0x3aB87C1f237B6EC969B0ef69DE97b39a3E0F21bE',
    skills: ['Python', 'AI Solutions', 'PyTorch', 'Data Research'],
    rating: 4.8,
    reputation: 420,
    availability: 'Full-time',
    education: [
      {
        schoolName: 'IIT Bombay',
        degree: 'B.Tech',
        fieldOfStudy: 'Data Science & Artificial Intelligence',
        startYear: '2022',
        endYear: '2026'
      }
    ],
    experience: [],
    certifications: ['DeepLearning.AI TensorFlow Specialist'],
    achievements: [
      {
        id: 'ach-3',
        title: 'AI Innovator Prize',
        icon: 'Cpu',
        description: 'Crafted custom local model proxy with optimized processing pipelines.',
        badgeType: 'AI Expert',
        ipfsHash: 'ipfs://QmYxX9A87...82j1',
        transactionHash: '0xefab34...12cd',
        issuedBy: 'Solv AI Startup',
        issuedAt: '2026-03-01',
        status: 'approved'
      }
    ],
    completedProjectsCount: 6,
    hackathonWins: 2,
    innovationPoints: 120
  },
  {
    id: 'student-3',
    name: 'Emily Watson',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    school: 'University of Toronto',
    walletAddress: '0x7382Bdf34978EF89abefCDe9786A0F1278CDe78a',
    skills: ['UI/UX Design', 'Figma', 'Framer', 'Content Writing'],
    rating: 5.0,
    reputation: 290,
    availability: 'Part-time',
    education: [
      {
        schoolName: 'University of Toronto',
        degree: 'Bachelor of Design',
        fieldOfStudy: 'Digital Media and Interaction Design',
        startYear: '2024',
        endYear: '2028'
      }
    ],
    experience: [],
    certifications: ['Google UX Design Professional Certificate'],
    achievements: [
      {
        id: 'ach-4',
        title: 'Creative Pixel Master',
        icon: 'Palette',
        description: 'Voted top designer in community-wide UI overhaul challenge.',
        badgeType: 'Top Performer',
        ipfsHash: 'ipfs://QmUX62Jd...831f',
        transactionHash: '0x12bc6d...bc72',
        issuedBy: 'Skill Chain India',
        issuedAt: '2026-06-14',
        status: 'approved'
      }
    ],
    completedProjectsCount: 3,
    hackathonWins: 0,
    innovationPoints: 50
  },
  {
    id: 'student-4',
    name: 'Chen Wei',
    email: 'chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    school: 'Tsinghua University',
    walletAddress: '0x8BCf6DDE5498aE9abDED69Eab09A1d87EF9eC6D9',
    skills: ['Solidity', 'Rust', 'Blockchain', 'Smart Contracts'],
    rating: 4.7,
    reputation: 510,
    availability: 'Intermittent',
    education: [
      {
        schoolName: 'Tsinghua University',
        degree: 'M.S. Computer Science',
        fieldOfStudy: 'Cryptography & Distributed Systems',
        startYear: '2024',
        endYear: '2026'
      }
    ],
    experience: [],
    certifications: [],
    achievements: [
      {
        id: 'ach-5',
        title: 'Solidity Auditor',
        icon: 'ShieldAlert',
        description: 'Secured 3 core micro-project pools from complex reentrancy vectors.',
        badgeType: 'Problem Solver',
        ipfsHash: 'ipfs://QmA9b3Df...62d1',
        transactionHash: '0x73ef8d...ff12',
        issuedBy: 'BlockFlow Studios',
        issuedAt: '2026-05-30',
        status: 'approved'
      }
    ],
    completedProjectsCount: 8,
    hackathonWins: 3,
    innovationPoints: 160
  }
];

export const initialCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Solv AI Labs',
    logo: '⚡',
    industry: 'Artificial Intelligence',
    location: 'San Francisco, CA (Remote)',
    about: 'Solv AI Labs is pioneering the next generation of decentralized intelligence proxies and browser-based inference pipelines for autonomous agents.',
    website: 'https://solv.ai',
    rating: 4.8,
    isVerified: true,
    projectsPosted: 12,
    studentsHired: 19,
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Siddharth Sharma',
        rating: 5,
        comment: 'Incredibly professional team! Released crypto bounty immediately upon milestones verification.',
        createdAt: '2026-05-10'
      }
    ]
  },
  {
    id: 'company-2',
    name: 'BlockFlow Studios',
    logo: '🪐',
    industry: 'Blockchain Technology',
    location: 'Austin, TX (Remote)',
    about: 'BlockFlow Studios designs enterprise-grade smart contracts and high-speed SDKs for decentralized gaming pipelines on L2 chains.',
    website: 'https://blockflow.studio',
    rating: 4.9,
    isVerified: true,
    projectsPosted: 8,
    studentsHired: 11,
    reviews: []
  },
  {
    id: 'company-3',
    name: 'Verisign Media',
    logo: '🎨',
    industry: 'Creative & Marketing',
    location: 'New York, NY (Hybrid)',
    about: 'Verisign is a content design boutique focused on visual identities, high-impact SEO writing, and organic brand traction for Web3 startups.',
    website: 'https://verisignmedia.io',
    rating: 4.6,
    isVerified: false,
    projectsPosted: 5,
    studentsHired: 4,
    reviews: []
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'DeFi Dashboard UI Development',
    companyId: 'company-2',
    companyName: 'BlockFlow Studios',
    companyLogo: '🪐',
    budget: 450,
    duration: '2 Weeks',
    location: 'Remote',
    remote: true,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    difficulty: 'Intermediate',
    deadline: '2026-08-01',
    applicantsCount: 14,
    companyRating: 4.9,
    description: 'We are looking for a skilled student to craft a pixel-perfect, responsive dashboard for our new gasless gaming L2 hub. The UI needs to look highly technical, brutalist, and modern, implementing clean charts for transactional history.',
    responsibilities: [
      'Implement responsive layouts mapping exactly to the provided Figma guidelines.',
      'Construct animated SVG charts using Recharts or D3.',
      'Integrate simple wallet connecting indicators representing polygon networks.'
    ],
    preferredSkills: ['motion', 'Lucide Icons'],
    deliverables: [
      'GitHub repository with complete, building TypeScript code.',
      'Working live preview link (Vercel/Netlify).'
    ],
    status: 'open',
    paymentStatus: 'pending',
    paymentMethod: 'Crypto',
    expectedReleaseDate: '2026-08-05'
  },
  {
    id: 'opp-2',
    title: 'NLP Model Fine-Tuning Script',
    companyId: 'company-1',
    companyName: 'Solv AI Labs',
    companyLogo: '⚡',
    budget: 650,
    duration: '3 Weeks',
    location: 'Remote',
    remote: true,
    requiredSkills: ['Python', 'AI Solutions', 'PyTorch'],
    difficulty: 'Expert',
    deadline: '2026-08-10',
    applicantsCount: 8,
    companyRating: 4.8,
    description: 'Assist our engineering unit in customizing a small local model pipeline. We require a well-documented PyTorch/HuggingFace script to optimize context length processing over structured JSON file structures.',
    responsibilities: [
      'Draft script to load and split unstructured JSON text streams safely.',
      'Fine-tune small scale parameters on open source models (e.g. LLaMA-3-8B).',
      'Publish benchmark weights scoring speed and context retention.'
    ],
    preferredSkills: ['Transformers Library', 'CUDA acceleration knowledge'],
    deliverables: [
      'Python training script file with absolute safety guards.',
      'Short training evaluation log in markdown.'
    ],
    status: 'open',
    paymentStatus: 'pending',
    paymentMethod: 'Crypto',
    expectedReleaseDate: '2026-08-15'
  },
  {
    id: 'opp-3',
    title: 'Web3 Marketing Content Writer',
    companyId: 'company-3',
    companyName: 'Verisign Media',
    companyLogo: '🎨',
    budget: 150,
    duration: '5 Days',
    location: 'New York, NY',
    remote: true,
    requiredSkills: ['Content Writing', 'Marketing'],
    difficulty: 'Beginner',
    deadline: '2026-07-28',
    applicantsCount: 22,
    companyRating: 4.6,
    description: 'We need 3 high-quality educational blog articles introducing standard high schoolers to on-chain credentials and reputation scoring. Tone must be light, engaging, and easy to grasp.',
    responsibilities: [
      'Draft three 800-word articles matching our target keywords.',
      'Ensure readability and simple illustrations logic is described.',
      'Review and adjust formatting based on editorial review.'
    ],
    preferredSkills: ['SEO Optimization', 'Markdown writing'],
    deliverables: [
      '3 fully researched articles in Markdown format.',
      'Summary social hooks for LinkedIn and X.'
    ],
    status: 'open',
    paymentStatus: 'pending',
    paymentMethod: 'Stripe',
    expectedReleaseDate: '2026-07-30'
  },
  {
    id: 'opp-4',
    title: 'Polygon Smart Contract Audit Project',
    companyId: 'company-2',
    companyName: 'BlockFlow Studios',
    companyLogo: '🪐',
    budget: 800,
    duration: '10 Days',
    location: 'Remote',
    remote: true,
    requiredSkills: ['Solidity', 'Blockchain'],
    difficulty: 'Expert',
    deadline: '2026-07-25',
    applicantsCount: 5,
    companyRating: 4.9,
    description: 'Audit a custom ERC-1155 smart contract designed for game asset staking with modular reward distributions. We require rigorous verification of reentrancy vectors and overflows.',
    responsibilities: [
      'Thorough audit of the 350-line Solidity contract.',
      'Identify gas optimization areas and severe vulnerability exploits.',
      'Write a formal vulnerability log recommending mitigation steps.'
    ],
    preferredSkills: ['Foundry', 'Slither static analyzer'],
    deliverables: [
      'A professional static audit report in PDF/Markdown format.',
      'Corrected contract code ready for Polygon Amoy deployment.'
    ],
    status: 'open',
    paymentStatus: 'pending',
    paymentMethod: 'Crypto',
    expectedReleaseDate: '2026-07-28'
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-3',
    opportunityTitle: 'Web3 Marketing Content Writer',
    companyName: 'Verisign Media',
    studentId: 'student-current',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    studentSkills: ['React', 'TypeScript', 'Content Writing'],
    studentReputation: 340,
    status: 'applied',
    appliedAt: '2026-07-16'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-1',
    opportunityTitle: 'DeFi Dashboard UI Development',
    companyName: 'BlockFlow Studios',
    studentId: 'student-current',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    studentSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    studentReputation: 340,
    status: 'shortlisted',
    appliedAt: '2026-07-15'
  }
];

export const initialIdeas: InnovationIdea[] = [
  {
    id: 'idea-1',
    title: 'Proof-of-Learn On-Chain Micro-Credentials',
    description: 'A protocol mapping micro-projects completed by minors into highly secure, gasless NFT Soulbound credentials on Polygon. Enables trustless resume proofing without leaking personal age or email information to companies.',
    creatorId: 'student-current',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    creatorSkills: ['React', 'Solidity', 'TypeScript'],
    category: 'Blockchain',
    votesCount: 42,
    votedUserIds: ['student-2', 'student-3'],
    coFoundersNeeded: true,
    coFoundersJoined: ['student-2'],
    createdAt: '2026-07-10',
    comments: [
      {
        id: 'c-1',
        authorName: 'Siddharth Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        text: 'This is brilliant! High schools and colleges would love to adopt this as an extracurricular ledger.',
        createdAt: '2026-07-12'
      }
    ]
  },
  {
    id: 'idea-2',
    title: 'AI Smart Contract Auditor Proxy',
    description: 'An open LLM prompt agent specializing in local code static scanning. Uses deep reasoning trees to verify reentrancy hazards in Solidity before deployment, integrated directly with IDE extensions.',
    creatorId: 'student-2',
    creatorName: 'Siddharth Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    creatorSkills: ['Python', 'AI Solutions', 'PyTorch'],
    category: 'AI',
    votesCount: 31,
    votedUserIds: ['student-4'],
    coFoundersNeeded: true,
    coFoundersJoined: [],
    createdAt: '2026-07-11',
    comments: []
  },
  {
    id: 'idea-3',
    title: 'Figma-to-Tailwind Atomic Compiler',
    description: 'A lightweight client extension that generates optimized semantic classes in React styled strictly using Tailwind CSS utility classes, skipping standard messy inline style tags completely.',
    creatorId: 'student-3',
    creatorName: 'Emily Watson',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    creatorSkills: ['UI/UX Design', 'Figma', 'Framer'],
    category: 'UI/UX',
    votesCount: 19,
    votedUserIds: ['student-current'],
    coFoundersNeeded: false,
    coFoundersJoined: [],
    createdAt: '2026-07-14',
    comments: []
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'student-current',
    userRole: 'student',
    title: 'Application Shortlisted',
    message: 'Your application for "DeFi Dashboard UI Development" was shortlisted by BlockFlow Studios! They will reach out shortly.',
    type: 'success',
    createdAt: '2026-07-17',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'student-current',
    userRole: 'student',
    title: 'Reputation Milestone Passed',
    message: 'Congratulations! You passed 300 reputation points. You are now rated a Top Contributor, unlocking Expert level projects!',
    type: 'info',
    createdAt: '2026-07-15',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'student-current',
    userRole: 'student',
    title: 'Welcome to Skill Chain India',
    message: 'Welcome Alex! Connect your MetaMask wallet to verify your Student SkillPass on the Polygon Amoy blockchain.',
    type: 'success',
    createdAt: '2026-07-14',
    read: true
  }
];

export const initialReports: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'student-2',
    reporterName: 'Siddharth Sharma',
    reportedId: 'company-3',
    reportedTitle: 'Verisign Media',
    reason: 'Suspicious delays in mock interview communications.',
    createdAt: '2026-07-14',
    status: 'pending'
  }
];
