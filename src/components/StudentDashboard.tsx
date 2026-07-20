import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReputationProgress } from './ReputationProgress';
import { 
  Shield, 
  Award, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  User,
  Star,
  Zap,
  Database,
  Github,
  GitFork,
  Check,
  Loader2,
  Terminal,
  Copy,
  Lock,
  Unlock,
  RefreshCw,
  Globe,
  Sparkles,
  Code,
  FileText,
  Wifi,
  WifiOff,
  LogOut
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToMarketplace: () => void;
  onNavigateToSkillPass: () => void;
  onNavigateToInnovation: () => void;
  onSelectStudent: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onNavigateToMarketplace, 
  onNavigateToSkillPass, 
  onNavigateToInnovation,
  onSelectStudent
}) => {
  const { 
    currentStudent, 
    applications, 
    walletConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet, 
    opportunities, 
    notifications,
    dismissNotification,
    students,
    gitHubProfile,
    connectGithub,
    disconnectGithub,
    grantGithubReputationBoost,
    supabaseConfig,
    saveSupabaseConfig,
    syncStateToSupabase
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'achievements' | 'leaderboard' | 'integrations'>('applications');

  // GitHub Connection State
  const [gitHubUsernameInput, setGitHubUsernameInput] = useState('');
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [gitHubError, setGitHubError] = useState<string | null>(null);

  // Supabase Configuration State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url || '');
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(supabaseConfig.anonKey || '');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseSuccess, setSupabaseSuccess] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!currentStudent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400">
        <p>No student profile active. Please connect profile first.</p>
      </div>
    );
  }

  // Find opportunities the student applied to or has ongoing/completed contracts
  const studentApps = applications.filter(a => a.studentId === currentStudent.id);

  // Leaderboard sorting
  const leaderboard = [...students].sort((a, b) => b.reputation - a.reputation);
  const rank = leaderboard.findIndex(s => s.id === currentStudent.id) + 1;

  return (
    <div className="bg-transparent text-slate-300 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="student-dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Block / PROGRESS REPORT Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-white">
              Welcome back, {currentStudent.name}!
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Stanford University Student • Rank #{rank} on global leaderboard
            </p>
          </div>

          {/* Web3 wallet control */}
          <div className="flex items-center gap-3">
            {walletConnected ? (
              <div className="bg-cyan-950/20 border border-cyan-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/10" />
                <span className="font-mono text-xs text-cyan-300">
                  Polygon: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                </span>
                <button 
                  onClick={disconnectWallet}
                  className="text-[10px] text-slate-500 hover:text-slate-300 font-mono underline cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={() => connectWallet()}
                className="bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Connect MetaMask
              </button>
            )}
            <button 
              onClick={onNavigateToSkillPass}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 cursor-pointer"
            >
              My SkillPass
            </button>
          </div>
        </div>

        {/* PROGRESS REPORT: Level progression bar */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-200">On-Chain Reputation Level</h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">{currentStudent.reputation} Points</span>
          </div>
          <ReputationProgress reputation={currentStudent.reputation} />
        </div>

        {/* PROGRESS REPORT: Metric Widgets & Rank */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-metrics">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">SkillPass Reputation</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{currentStudent.reputation}</span>
              <span className="text-xs text-cyan-400 font-mono">pts</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Top 5% builder level
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Hiring Rating</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">★ {currentStudent.rating}</span>
              <span className="text-xs text-slate-500 font-mono">/5</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Based on audited projects</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Completed projects</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{currentStudent.completedProjectsCount}</span>
              <span className="text-xs text-slate-500 font-mono">gigs</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">All bounties securely released</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Leaderboard Rank</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">#{rank}</span>
              <span className="text-xs text-slate-500 font-mono">global</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Stanford University</p>
          </div>
        </div>

        {/* Central Split Section - 100% full-width layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-12 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex gap-4 border-b border-white/5 pb-3">
              <button 
                onClick={() => setActiveTab('applications')}
                className={`text-sm font-medium transition cursor-pointer pb-2 ${activeTab === 'applications' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                My Gigs & Tasks ({studentApps.length})
              </button>
              <button 
                onClick={() => setActiveTab('achievements')}
                className={`text-sm font-medium transition cursor-pointer pb-2 ${activeTab === 'achievements' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Verified Achievements ({(currentStudent.achievements || []).length})
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`text-sm font-medium transition cursor-pointer pb-2 ${activeTab === 'leaderboard' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Global Builder Leaderboard
              </button>
              <button 
                onClick={() => setActiveTab('integrations')}
                className={`text-sm font-medium transition cursor-pointer pb-2 flex items-center gap-1.5 ${activeTab === 'integrations' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Developer Integrations</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-full font-mono font-bold">2</span>
              </button>
            </div>

            {/* TAB CONTENT: TASKS & GIGS */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                {studentApps.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl space-y-4">
                    <p className="text-slate-400 text-sm">You haven’t applied for any micro-projects yet.</p>
                    <button 
                      onClick={onNavigateToMarketplace}
                      className="bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      Browse Available Gigs
                    </button>
                  </div>
                ) : (
                  studentApps.map(app => (
                    <div 
                      key={app.id}
                      className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/20 transition duration-300"
                      id={`student-app-${app.id}`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{app.companyName}</span>
                        <h4 className="font-bold text-slate-100">{app.opportunityTitle}</h4>
                        <p className="text-xs text-slate-400">Applied on {app.appliedAt}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase ${
                          app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          app.status === 'shortlisted' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          app.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-black/40 text-slate-400 border border-white/5'
                        }`}>
                          {app.status}
                        </span>
                        
                        {app.status === 'hired' && (
                          <span className="text-xs text-emerald-400 font-mono font-bold animate-pulse">
                            Active Contract
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="grid sm:grid-cols-2 gap-6">
                {(!currentStudent.achievements || currentStudent.achievements.length === 0) ? (
                  <div className="col-span-2 text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl space-y-4">
                    <p className="text-slate-400 text-sm">No verified achievements or certifications found on your identity card.</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Complete projects with companies or get certified by administrators to mint on-chain achievements!</p>
                  </div>
                ) : (
                  currentStudent.achievements.map((ach) => (
                    <div 
                      key={ach.id}
                      className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/20 transition duration-300 relative overflow-hidden"
                    >
                      {ach.status === 'approved' && (
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-500/20">
                            {ach.badgeType || 'Credential'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider ${
                            ach.status === 'approved' 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/25 animate-pulse'
                          }`}>
                            {ach.status === 'approved' ? 'Verified (Polygon)' : 'Pending Polygon Hashing'}
                          </span>
                        </div>
                        
                        <div className="flex items-start gap-3 pt-1">
                          <div className="w-10 h-10 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 text-sm tracking-wide">{ach.title}</h4>
                            <p className="text-[10px] text-slate-500 font-mono">Issued by: {ach.issuedBy} • {ach.issuedAt}</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
                      </div>

                      {ach.status === 'approved' && (
                        <div className="bg-black p-3.5 rounded-xl space-y-1.5 text-[10px] font-mono border border-white/5 mt-4">
                          <div className="flex justify-between text-slate-500">
                            <span>IPFS Data:</span>
                            <span className="text-amber-400/80 truncate max-w-[150px]" title={ach.ipfsHash}>
                              {ach.ipfsHash || 'ipfs://QmQr7Xy...'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Tx Hash:</span>
                            <span className="text-cyan-400/80 truncate max-w-[150px]" title={ach.transactionHash}>
                              {ach.transactionHash || '0x7e81b9c...'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-black/40 px-6 py-3 border-b border-white/5 text-xs font-mono text-slate-500 uppercase tracking-widest">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-6">Builder</div>
                  <div className="col-span-2 text-right">Gigs</div>
                  <div className="col-span-2 text-right">Reputation</div>
                </div>

                <div className="divide-y divide-white/5">
                  {leaderboard.map((student, index) => {
                    const isCurrentUser = student.id === currentStudent.id;
                    return (
                      <div 
                        key={student.id}
                        onClick={() => onSelectStudent(student.id)}
                        className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm cursor-pointer transition ${isCurrentUser ? 'bg-cyan-500/10 hover:bg-cyan-500/20' : 'hover:bg-white/5'}`}
                      >
                        <div className="col-span-2 font-mono font-bold text-slate-400">
                          #{index + 1}
                        </div>
                        <div className="col-span-6 flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <span className={`font-bold block ${isCurrentUser ? 'text-cyan-400' : 'text-slate-200'}`}>
                              {student.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">{student.school}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-right font-mono text-slate-300">
                          {student.completedProjectsCount}
                        </div>
                        <div className="col-span-2 text-right font-mono font-bold text-cyan-400">
                          {student.reputation} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                {/* GITHUB INTEGRATION CARD */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10 text-[#f5f1e6]">
                          <Github className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">GitHub Portfolio</h4>
                          <p className="text-[10px] text-slate-500 font-mono">Sync Open Source Proof-of-Work</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider ${
                        gitHubProfile 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-white/10'
                      }`}>
                        {gitHubProfile ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>

                    {gitHubProfile ? (
                      /* Connected state */
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                          <img src={gitHubProfile.avatar_url} alt={gitHubProfile.username} className="w-12 h-12 rounded-full border border-white/10" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-white text-sm truncate">{gitHubProfile.name}</h5>
                            <a href={`https://github.com/${gitHubProfile.username}`} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 font-mono flex items-center gap-1 hover:underline">
                              @{gitHubProfile.username}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <button 
                            onClick={disconnectGithub}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Disconnect</span>
                          </button>
                        </div>

                        {gitHubProfile.bio && (
                          <p className="text-xs text-slate-400 italic">"{gitHubProfile.bio}"</p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Public Repos</span>
                            <span className="text-xl font-bold text-white">{gitHubProfile.public_repos}</span>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Followers</span>
                            <span className="text-xl font-bold text-white">{gitHubProfile.followers}</span>
                          </div>
                        </div>

                        {/* Reputation boost module */}
                        {!gitHubProfile.reputationBoostGranted ? (
                          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/30 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-amber-200">Reputation Boost Pending</span>
                            </div>
                            <p className="text-[11px] text-amber-100/70">
                              Claim a permanent **+{15 + Math.min(15, (gitHubProfile.repositories?.length || 0) * 3)} Points** on-chain boost based on your public portfolio.
                            </p>
                            <button 
                              onClick={grantGithubReputationBoost}
                              className="w-full bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold py-1.5 px-3 rounded-lg text-xs transition cursor-pointer"
                            >
                              Claim Reputation Boost
                            </button>
                          </div>
                        ) : (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>GitHub On-Chain Reputation Boost claimed! (+{15 + Math.min(15, (gitHubProfile.repositories?.length || 0) * 3)} Rep)</span>
                          </div>
                        )}

                        {/* Repository List */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-white/5 pb-1.5">
                            <span>Verified Repositories ({gitHubProfile.repositories.length})</span>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {gitHubProfile.repositories.length === 0 ? (
                              <p className="text-xs text-slate-500">No public repositories found.</p>
                            ) : (
                              gitHubProfile.repositories.map(repo => (
                                <div key={repo.name} className="bg-black/20 hover:bg-black/35 border border-white/5 p-2.5 rounded-lg flex justify-between items-start gap-3 transition">
                                  <div className="space-y-1 min-w-0">
                                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-200 hover:text-cyan-400 flex items-center gap-1 hover:underline truncate">
                                      {repo.name}
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                    {repo.description && (
                                      <p className="text-[10px] text-slate-500 truncate">{repo.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 pt-0.5">
                                      {repo.language && (
                                        <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                                          {repo.language}
                                        </span>
                                      )}
                                      <span className="text-[9px] font-mono text-amber-400 flex items-center gap-0.5">
                                        ★ {repo.stargazers_count}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Disconnected state */
                      <div className="space-y-4">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Link your GitHub developer identity to sync your open-source proof-of-work. Connecting your account imports your latest active repositories and unlocks permanent on-chain Reputation Boosts to stand out to companies on the marketplace.
                        </p>
                        {gitHubError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-300">
                            {gitHubError}
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">GitHub Username</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-2 text-xs text-slate-500 font-mono">@</span>
                              <input 
                                type="text"
                                value={gitHubUsernameInput}
                                onChange={(e) => { setGitHubUsernameInput(e.target.value); setGitHubError(null); }}
                                placeholder="Enter public username"
                                className="w-full bg-[#0c0905] border border-white/10 rounded-xl py-2 pl-7 pr-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                            <button 
                              onClick={async () => {
                                if (!gitHubUsernameInput.trim()) return;
                                setIsConnectingGitHub(true);
                                setGitHubError(null);
                                try {
                                  await connectGithub(gitHubUsernameInput.trim());
                                } catch (err: any) {
                                  setGitHubError(err.message || "Failed to find GitHub user.");
                                } finally {
                                  setIsConnectingGitHub(false);
                                }
                              }}
                              disabled={isConnectingGitHub}
                              className="bg-white/10 hover:bg-white/15 text-white font-bold px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {isConnectingGitHub ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <span>Connect</span>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-white/5"></div>
                          <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">Or Secure Login</span>
                          <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        <button 
                          onClick={async () => {
                            setIsConnectingGitHub(true);
                            setGitHubError(null);
                            // Simulated OAuth popup as required by /skills/system_skills/oauth/SKILL.md
                            const w = 600, h = 600;
                            const left = (window.screen.width/2)-(w/2);
                            const top = (window.screen.height/2)-(h/2);
                            const popup = window.open("", "GitHub OAuth Connect", `width=${w},height=${h},top=${top},left=${left}`);
                            if (popup) {
                              popup.document.write(`
                                <html>
                                  <head>
                                    <title>Authorize Skill Chain India</title>
                                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
                                    <style>
                                      body { background: #0c0905; color: #f5f1e6; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                                      .card { background: #120e07; border: 1px solid rgba(230,202,101,0.2); padding: 30px; border-radius: 20px; width: 360px; text-align: center; }
                                      .logo { width: 50px; height: 50px; border-radius: 12px; background: #24292e; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
                                      h2 { font-weight: 700; font-size: 20px; margin-bottom: 8px; color: #fff; }
                                      p { font-size: 13px; color: rgba(245,241,230,0.6); margin-bottom: 24px; line-height: 1.5; }
                                      button { background: #e6ca65; color: #0c0904; font-weight: bold; border: none; padding: 12px 20px; border-radius: 12px; width: 100%; cursor: pointer; font-size: 14px; }
                                      button:hover { background: #fff; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="card">
                                      <div class="logo">🐙</div>
                                      <h2>Authorize Skill Chain India</h2>
                                      <p>Connecting your public profile, repositories, and stars statistics with on-chain profile.</p>
                                      <button id="auth-btn">Authorize via GitHub</button>
                                    </div>
                                    <script>
                                      document.getElementById('auth-btn').onclick = function() {
                                        window.opener.postMessage({ type: 'GITHUB_OAUTH_SUCCESS', username: 'indiabuilder2026' }, '*');
                                        window.close();
                                      }
                                    </script>
                                  </body>
                                </html>
                              `);
                              popup.document.close();
                            }

                            // Wait for the message from the OAuth window
                            const handler = async (e: MessageEvent) => {
                              if (e.data && e.data.type === 'GITHUB_OAUTH_SUCCESS') {
                                window.removeEventListener('message', handler);
                                try {
                                  await connectGithub(e.data.username);
                                } catch (innerErr: any) {
                                  setGitHubError(innerErr.message);
                                } finally {
                                  setIsConnectingGitHub(false);
                                }
                              }
                            };
                            window.addEventListener('message', handler);
                          }}
                          className="w-full bg-[#120e07] hover:bg-[#1a140b] border border-white/10 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Github className="w-4 h-4 text-white" />
                          <span>Authorize with GitHub Secure OAuth</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SUPABASE SYNCHRONIZATION CARD */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10 text-[#3ecf8e]">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Supabase Live Cloud DB</h4>
                          <p className="text-[10px] text-slate-500 font-mono">Decentralized SQL Sync Engine</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                        supabaseConfig.isConnected 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${supabaseConfig.isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-400'}`}></span>
                        {supabaseConfig.isConnected ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sync your verified profile ratings, completed bounties, and startup ideas to your Supabase Cloud PostgreSQL database in real-time. Use our pre-built sandbox or connect your own real Supabase URL & Anon Key.
                    </p>

                    {supabaseError && (
                      <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-300 whitespace-pre-line font-mono max-h-48 overflow-y-auto">
                        {supabaseError}
                      </div>
                    )}

                    {supabaseSuccess && !supabaseError && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                        <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>Supabase database connected successfully! Live synchronization enabled.</span>
                      </div>
                    )}

                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Supabase Project URL</label>
                        <input 
                          type="text"
                          value={supabaseUrlInput}
                          onChange={(e) => { setSupabaseUrlInput(e.target.value); setSupabaseError(null); setSupabaseSuccess(false); }}
                          placeholder="e.g., https://your-project.supabase.co"
                          className="w-full bg-[#0c0905] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Supabase Anon Public Key</label>
                        <input 
                          type="password"
                          value={supabaseAnonKeyInput}
                          onChange={(e) => { setSupabaseAnonKeyInput(e.target.value); setSupabaseError(null); setSupabaseSuccess(false); }}
                          placeholder="Enter your public anon apikey"
                          className="w-full bg-[#0c0905] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={async () => {
                          if (!supabaseUrlInput.trim() || !supabaseAnonKeyInput.trim()) {
                            setSupabaseError("Please provide both Supabase URL and Anon Key.");
                            return;
                          }
                          setIsTestingSupabase(true);
                          setSupabaseError(null);
                          setSupabaseSuccess(false);
                          try {
                            const success = await saveSupabaseConfig(supabaseUrlInput.trim(), supabaseAnonKeyInput.trim());
                            if (success) {
                              setSupabaseSuccess(true);
                            } else {
                              setSupabaseError("Connection failed. Please check your URL and Anon Key.");
                            }
                          } catch (err: any) {
                            setSupabaseError(err.message || "Failed to test Supabase connection.");
                          } finally {
                            setIsTestingSupabase(false);
                          }
                        }}
                        disabled={isTestingSupabase}
                        className="bg-white/10 hover:bg-white/15 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isTestingSupabase ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Verify DB Connection</span>
                        )}
                      </button>

                      <button 
                        onClick={async () => {
                          setIsSyncingSupabase(true);
                          setSyncMessage(null);
                          setSupabaseError(null);
                          try {
                            const res = await syncStateToSupabase();
                            if (res.success) {
                              setSyncMessage({ type: 'success', text: res.message });
                            } else {
                              setSupabaseError(res.message);
                            }
                          } catch (err: any) {
                            setSupabaseError(err.message || "An unexpected error occurred during sync.");
                          } finally {
                            setIsSyncingSupabase(false);
                          }
                        }}
                        disabled={isSyncingSupabase || !supabaseConfig.isConnected}
                        className="bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition"
                      >
                        {isSyncingSupabase ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Sync State to Cloud</span>
                          </>
                        )}
                      </button>
                    </div>

                    {syncMessage && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-400">
                        {syncMessage.text}
                      </div>
                    )}

                    {supabaseConfig.lastSyncedAt && (
                      <div className="text-[10px] font-mono text-slate-500 flex justify-between items-center bg-black/20 p-2 rounded-xl">
                        <span>Last Synced:</span>
                        <span className="text-emerald-400 font-bold">
                          {new Date(supabaseConfig.lastSyncedAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Collapsible SQL schema */}
                    <div className="border border-white/5 rounded-xl overflow-hidden bg-black/40">
                      <button 
                        onClick={() => setShowSqlSchema(!showSqlSchema)}
                        className="w-full px-3 py-2.5 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider hover:bg-white/5 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          How to setup Supabase Table (SQL)
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showSqlSchema ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {showSqlSchema && (
                        <div className="p-3 border-t border-white/5 space-y-2">
                          <p className="text-[10px] text-slate-500">Run this SQL schema in your Supabase SQL Editor to support instant live synchronizations:</p>
                          <div className="relative">
                            <pre className="text-[9px] font-mono bg-black text-amber-200/90 p-2.5 rounded-lg overflow-x-auto select-all max-h-36 whitespace-pre">
{`CREATE TABLE IF NOT EXISTS skill_chain_sync (
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
CREATE POLICY "Allow anonymous read/write access" ON skill_chain_sync FOR ALL USING (true) WITH CHECK (true);`}
                            </pre>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS skill_chain_sync (
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

ALTER TABLE skill_chain_sync ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read/write access" ON skill_chain_sync FOR ALL USING (true) WITH CHECK (true);`);
                                setCopiedSql(true);
                                setTimeout(() => setCopiedSql(false), 2000);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition text-[9px] text-slate-400 font-bold"
                            >
                              {copiedSql ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* PROGRESS REPORT: Earnings & Trajectory */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Monthly Earnings & Reputation Growth
              </h3>

              <div className="flex items-end justify-between h-40 pt-4 font-mono text-[10px] text-slate-500">
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-8 bg-white/5 rounded-t h-12 flex items-end justify-center text-slate-400 font-bold">$100</div>
                  <span>Mar 2026</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-8 bg-cyan-950/30 rounded-t h-20 flex items-end justify-center text-cyan-300 font-bold">$350</div>
                  <span>Apr 2026</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-8 bg-indigo-950/20 rounded-t h-28 flex items-end justify-center text-indigo-300 font-bold">$450</div>
                  <span>May 2026</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-8 bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t h-36 flex items-end justify-center text-white font-bold">$800</div>
                  <span>Jun 2026</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
