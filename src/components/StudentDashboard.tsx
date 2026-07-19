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
  Zap
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
    students
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'achievements' | 'leaderboard'>('applications');

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
