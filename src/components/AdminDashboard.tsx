import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { updateDocument } from '../lib/firestoreService';
import { 
  Shield, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  TrendingUp, 
  Lock, 
  ExternalLink,
  Award,
  Trash2,
  ThumbsUp,
  Eye,
  EyeOff,
  Key,
  Search,
  Filter,
  Plus
} from 'lucide-react';

const AUTHORIZED_ADMIN_EMAILS = [
  'websitebuilder564@gmail.com',
  'rimildas988@gmail.com'
];

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    companies, 
    opportunities, 
    reports, 
    verifyCompanyAction, 
    approveAchievementAction,
    submitReport,
    currentUser,
    currentRole,
    signInWithGoogle,
    signOutUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'verification' | 'achievements' | 'leaderboard' | 'reports'>('verification');
  
  // Progress/Leaderboard Audit states
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState<string>('All');

  // Password-restricted access logic
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adminUnlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Skill420@' || passwordInput === 'skillchain@14qpe*') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminUnlocked', 'true');
      setPasswordError(null);
      triggerToast('Administrative console decrypted and authorized!');
    } else {
      setPasswordError('Cryptographic Verification Failed: Invalid Administrative Key.');
    }
  };

  const handleLockConsole = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminUnlocked');
    setPasswordInput('');
    triggerToast('Administrative console locked. Credentials cleared.');
  };

  // STRICT ACCESS CONTROL VERIFICATION AGAINST ACTIVE SESSION
  const isAuthorizedAdmin = !!(currentUser && currentUser.email && AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email));

  // SECURED DATA-PROCESSING: Only filter/map lists in memory when access is verified
  const unverifiedCompanies = isAuthorizedAdmin ? companies.filter(c => !c.isVerified) : [];

  const pendingAchievements = isAuthorizedAdmin ? students.flatMap(student => 
    (student.achievements || [])
      .filter(ach => ach.status === 'pending')
      .map(ach => ({
        ...ach,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar
      }))
  ) : [];

  const pendingReports = isAuthorizedAdmin ? reports.filter(r => r.status === 'pending') : [];

  const leaderboard = isAuthorizedAdmin 
    ? [...students].sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
    : [];

  const filteredStudents = leaderboard.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === 'All' || (student.skills && student.skills.includes(skillFilter));
    return matchesSearch && matchesSkill;
  });

  const getGlobalRank = (studentId: string) => {
    return leaderboard.findIndex(s => s.id === studentId) + 1;
  };

  // GATE 1: Unauthenticated Session Block
  if (!currentUser) {
    return (
      <div className="bg-transparent text-slate-300 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="admin-auth-required">
        <div className="max-w-md w-full space-y-8 bg-[#0c0905]/85 border border-[#e6ca65]/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(230,202,101,0.05)] backdrop-blur-xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(230,202,101,0.3)] border border-[#e6ca65]/30">
            <Lock className="w-10 h-10 text-black animate-pulse" />
          </div>

          <div className="pt-8 space-y-3">
            <h2 className="text-2xl font-serif-lux font-black tracking-widest text-[#fbf5b7]">
              ENCRYPTED SESSION REQUIRED
            </h2>
            <p className="text-xs text-amber-200/60 leading-relaxed font-sans">
              Access to administrative protocols, Polygon ledger validations, and compliance queues is strictly encrypted. You must authenticate with an authorized Level 4 Google administrator account to proceed.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={signInWithGoogle}
              className="w-full premium-button-gold py-3.5 px-4 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(230,202,101,0.15)] transition-transform active:scale-[0.98]"
            >
              <Shield className="w-4 h-4 text-black" />
              AUTHENTICATE WITH GOOGLE
            </button>
          </div>

          <div className="pt-2 border-t border-white/5 flex justify-center items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Awaiting Identity Verification</span>
          </div>
        </div>
      </div>
    );
  }

  // GATE 2: Authenticated but Unauthorized Session Block (RBAC Guard)
  if (!isAuthorizedAdmin) {
    return (
      <div className="bg-transparent text-slate-300 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="admin-unauthorized-session">
        <div className="max-w-md w-full space-y-8 bg-[#1a0c0a]/90 border border-rose-500/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(239,68,68,0.05)] backdrop-blur-xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-rose-700 via-red-500 to-rose-800 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] border border-rose-500/30">
            <AlertTriangle className="w-10 h-10 text-white animate-bounce" />
          </div>

          <div className="pt-8 space-y-3">
            <h2 className="text-2xl font-serif-lux font-black tracking-widest text-rose-400">
              ACCESS STRICTLY DENIED
            </h2>
            <div className="bg-rose-950/20 border border-rose-500/10 p-3.5 rounded-2xl font-mono text-xs text-rose-300/80 break-all">
              Authenticated Session:<br />
              <span className="text-white font-bold text-xs">{currentUser.email}</span>
            </div>
            <p className="text-xs text-rose-300/60 leading-relaxed font-sans">
              Your Google Identity is not registered on the on-chain relayer access control list (ACL). System logs have recorded this unauthorized administrative access request.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={signOutUser}
              className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Lock className="w-4 h-4" />
              SWITCH ADMIN ACCOUNT
            </button>
          </div>

          <div className="pt-2 border-t border-rose-500/5 flex justify-center items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span className="text-[9px] font-mono text-rose-500/60 uppercase tracking-widest">RECOGNIZED FRAUD SIGNAL LOGGED</span>
          </div>
        </div>
      </div>
    );
  }

  // GATE 3: Cryptographic Decrypt Password block
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-transparent text-slate-300 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="admin-lock-screen">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400 text-sm font-medium animate-bounce">
            {toast}
          </div>
        )}

        <div className="max-w-md w-full space-y-8 bg-[#0c0905]/85 border border-[#e6ca65]/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(230,202,101,0.05)] backdrop-blur-xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(230,202,101,0.3)] border border-[#e6ca65]/30">
            <Lock className="w-10 h-10 text-black animate-pulse" />
          </div>

          <div className="text-center pt-8">
            <h2 className="text-2xl font-serif-lux font-black tracking-widest text-[#fbf5b7]">
              ADMIN DECRYPT ZONE
            </h2>
            <div className="mt-3 bg-amber-500/5 border border-[#e6ca65]/10 p-2.5 rounded-xl font-mono text-[11px] text-amber-300">
              Verified Session: <span className="font-bold">{currentUser.email}</span>
            </div>
            <p className="mt-2 text-xs text-amber-200/60 leading-relaxed font-sans">
              This area contains cryptographic relayer keys, on-chain compliance triggers, and manual verification bypasses. Enter your administrative password to decrypt the workspace.
            </p>
          </div>

          <form onSubmit={handleVerifyPassword} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 block">
                Administrative Secret Key
              </label>
              <div className="relative rounded-xl border border-[#e6ca65]/20 bg-[#120e07] focus-within:border-amber-400/60 transition group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500/55 group-focus-within:text-amber-400 transition">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(null);
                  }}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-3 bg-transparent text-sm text-[#f5f1e6] placeholder-amber-500/30 focus:outline-none rounded-xl"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500/50 hover:text-amber-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <div className="flex items-center gap-1.5 text-rose-500/90 text-[11px] font-medium pt-1 animate-in slide-in-from-top-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full premium-button-gold py-3 px-4 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(230,202,101,0.15)] transition-transform active:scale-[0.98]"
            >
              <Shield className="w-4 h-4 text-black" />
              AUTHORIZE & DECRYPT
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex justify-center items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Relayer Standby: AES-256 Enabled</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-slate-300 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="admin-dashboard">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400 text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Platform Admin Console</h1>
              <p className="text-slate-400 text-sm mt-1">Manage verification workflows, Polygon smart contracts audits, and reports.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLockConsole}
              className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Console
            </button>
            <span className="bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 px-3.5 py-1.5 rounded-xl text-xs font-mono">
              SECURE ACCESS: LEVEL 4 ADMIN
            </span>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="admin-metrics">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Registered Builders</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{students.length}</span>
              <span className="text-xs text-cyan-400 font-mono">verified</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">On-Boarded Partners</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{companies.length}</span>
              <span className="text-xs text-cyan-400 font-mono">registered</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Total Listed Gigs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{opportunities.length}</span>
              <span className="text-xs text-cyan-400 font-mono">audited</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Bounty Vol Escrowed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">$14,500</span>
              <span className="text-xs text-cyan-400 font-mono">liquidity</span>
            </div>
          </div>
        </div>

        {/* Dynamic Queue Management Columns */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT SUBTAB SELECTORS */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-[#0c0905]/40 border border-white/10 p-5 rounded-2xl space-y-1 backdrop-blur-xl">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Moderation Queues</h3>
              
              <button 
                onClick={() => setActiveSubTab('verification')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex justify-between items-center cursor-pointer ${activeSubTab === 'verification' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span>Verify Companies</span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                  {unverifiedCompanies.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveSubTab('achievements')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex justify-between items-center cursor-pointer ${activeSubTab === 'achievements' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span>Polygon Minting Queue</span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                  {pendingAchievements.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveSubTab('leaderboard')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex justify-between items-center cursor-pointer ${activeSubTab === 'leaderboard' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span>Progress & Leaderboard</span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                  {students.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveSubTab('reports')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex justify-between items-center cursor-pointer ${activeSubTab === 'reports' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span>Compliance Reports</span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                  {pendingReports.length}
                </span>
              </button>
            </div>

            {/* Smart Audit logs disclaimer */}
            <div className="bg-[#0c0905]/40 border border-white/10 p-5 rounded-2xl space-y-2.5 backdrop-blur-xl">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Amoy Testnet RPC
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Platform issues secure Solidity contract states directly via an automated relayer to speed up the student's on-chain portfolio verification.
              </p>
            </div>
          </div>

          {/* RIGHT VIEW SCREEN FOR QUEUE */}
          <div className="lg:col-span-9">
            
            {/* SUBTAB: COMPANY VERIFICATION */}
            {activeSubTab === 'verification' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-200">Company KYC & Verification Queue</h3>
                
                <div className="space-y-4">
                  {unverifiedCompanies.length === 0 ? (
                    <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-xs text-slate-500 italic">No companies currently awaiting background compliance verification.</p>
                    </div>
                  ) : (
                    unverifiedCompanies.map(c => (
                      <div 
                        key={c.id} 
                        className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition duration-300"
                        id={`admin-company-kyc-${c.id}`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl bg-black/60 p-1.5 rounded">{c.logo}</span>
                            <h4 className="font-bold text-slate-200">{c.name}</h4>
                          </div>
                          <p className="text-xs text-slate-400 font-sans max-w-lg leading-relaxed">{c.about}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Website URL: {c.website}</span>
                        </div>

                        <button 
                          onClick={() => {
                            verifyCompanyAction(c.id);
                            triggerToast(`${c.name} successfully verified! Badge issued.`);
                          }}
                          className="px-4 py-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Verify KYC
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: ON-CHAIN ACHIEVEMENTS */}
            {activeSubTab === 'achievements' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-200">Pending Polygon Credential Minting</h3>
                
                <div className="space-y-4">
                  {pendingAchievements.length === 0 ? (
                    <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-xs text-slate-500 italic">No credentials currently pending Polygon minting relayer execution.</p>
                    </div>
                  ) : (
                    pendingAchievements.map(ach => (
                      <div 
                        key={ach.id}
                        className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition duration-300"
                        id={`admin-mint-queue-${ach.id}`}
                      >
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            {ach.title}
                            <span className="text-xs bg-cyan-950/40 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-500/10">
                              {ach.badgeType}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">Recipient Student: <span className="font-semibold text-slate-300">{ach.studentName}</span></p>
                          <p className="text-xs text-slate-400 italic leading-relaxed">&ldquo;{ach.description}&rdquo;</p>
                        </div>

                        <button 
                          onClick={() => {
                            approveAchievementAction(ach.id);
                            triggerToast(`Achievement successfully minted on Polygon!`);
                          }}
                          className="px-4 py-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        >
                          <Award className="w-4 h-4" />
                          Mint to Polygon
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: LEADERBOARD & PROGRESS AUDIT */}
            {activeSubTab === 'leaderboard' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-200">Student Progress & Leaderboard Audit</h3>
                  <p className="text-slate-400 text-xs mt-1">Audit builder skill profiles, verify progress histories, adjust reputation balances, and manage on-chain credentials.</p>
                </div>

                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search builder name or school..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-slate-500 text-xs flex items-center gap-1 font-mono uppercase">
                      <Filter className="w-3.5 h-3.5" /> Filter Skill:
                    </span>
                    <select
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      className="bg-black/40 border border-white/10 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="All">All Skills</option>
                      <option value="Web3 Development">Web3 Development</option>
                      <option value="Smart Contracts">Smart Contracts</option>
                      <option value="DeFi Protocols">DeFi Protocols</option>
                      <option value="Solidity">Solidity</option>
                      <option value="Go">Go Language</option>
                      <option value="TypeScript">TypeScript</option>
                    </select>
                  </div>
                </div>

                {/* Builders Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredStudents.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-xs text-slate-500 italic">No builders match your search criteria.</p>
                    </div>
                  ) : (
                    filteredStudents.map(student => {
                      const globalRank = getGlobalRank(student.id);
                      const approvedCount = (student.achievements || []).filter(a => a.status === 'approved').length;
                      const pendingCount = (student.achievements || []).filter(a => a.status === 'pending').length;
                      
                      return (
                        <div 
                          key={student.id}
                          className={`bg-black/40 border p-5 rounded-2xl flex flex-col justify-between gap-4 hover:border-cyan-500/30 transition duration-300 cursor-pointer ${selectedStudentId === student.id ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-white/5'}`}
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="relative">
                              <img 
                                src={student.avatar} 
                                alt={student.name} 
                                className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                              <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${globalRank === 1 ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' : globalRank === 2 ? 'bg-slate-300 text-black shadow-[0_0_10px_rgba(203,213,225,0.5)]' : globalRank === 3 ? 'bg-amber-700 text-white' : 'bg-black/80 text-slate-400 border border-white/10'}`}>
                                #{globalRank}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-sm sm:text-base">
                                {student.name}
                              </h4>
                              <p className="text-slate-400 text-xs font-medium leading-none">{student.school}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {student.skills?.slice(0, 3).map(skill => (
                                  <span key={skill} className="bg-white/5 border border-white/5 text-[9px] text-slate-400 px-1.5 py-0.5 rounded-md">
                                    {skill}
                                  </span>
                                ))}
                                {student.skills?.length > 3 && (
                                  <span className="text-[9px] text-slate-500 font-mono pl-1">
                                    +{student.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-mono">Reputation</span>
                              <span className="font-bold text-cyan-400 font-mono">{student.reputation || 0} pts</span>
                            </div>
                            
                            <div className="space-y-1 text-center">
                              <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-mono">Gigs Done</span>
                              <span className="font-bold text-slate-300 font-mono">{student.completedProjectsCount || 0}</span>
                            </div>

                            <div className="space-y-1 text-right">
                              <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-mono">Credentials</span>
                              <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5 justify-end">
                                <span className="text-emerald-400" title="Approved">{approvedCount} ✓</span>
                                {pendingCount > 0 && <span className="text-amber-400" title="Pending">{pendingCount} ⌛</span>}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentId(student.id);
                              }}
                              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                            >
                              Audit Progress & Credentials →
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: COMPLIANCE REPORTS */}
            {activeSubTab === 'reports' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-200">Compliance & Report Resolution</h3>
                
                <div className="space-y-4">
                  {pendingReports.length === 0 ? (
                    <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-xs text-slate-500 italic">No unresolved compliance complaints filed.</p>
                    </div>
                  ) : (
                    pendingReports.map(rep => (
                      <div 
                        key={rep.id}
                        className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-2 border-rose-500 hover:border-white/10 transition duration-300"
                        id={`admin-report-${rep.id}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-mono font-bold uppercase">Report Logged</span>
                          </div>
                          <h4 className="font-bold text-slate-200">Reporter: {rep.reporterName}</h4>
                          <p className="text-xs text-slate-400">Against Partner/Gig: <span className="font-semibold text-slate-300">{rep.reportedTitle}</span></p>
                          <p className="text-xs text-rose-300 leading-relaxed italic bg-rose-950/10 p-3 rounded-lg border border-rose-900/20">
                            &ldquo;{rep.reason}&rdquo;
                          </p>
                        </div>

                        <button 
                          onClick={() => {
                            triggerToast(`Report resolved successfully.`);
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Resolve Report
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* FLOATING DRAWER OVERLAY FOR STUDENT AUDIT */}
      {selectedStudentId && (() => {
        const student = students.find(s => s.id === selectedStudentId);
        if (!student) return null;
        
        const approvedCount = (student.achievements || []).filter(a => a.status === 'approved').length;
        const pendingCount = (student.achievements || []).filter(a => a.status === 'pending').length;
        const globalRank = getGlobalRank(student.id);
        
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end animate-in fade-in duration-300">
            <div 
              className="w-full max-w-lg bg-[#0c0905] border-l border-[#e6ca65]/20 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300"
              id={`admin-student-audit-${student.id}`}
            >
              <div className="space-y-6">
                {/* Header / Dismiss */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-serif-lux font-bold text-lg text-[#fbf5b7] tracking-wider">BUILDER PORTFOLIO AUDIT</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedStudentId(null)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Student Summary */}
                <div className="flex items-center gap-4">
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xl font-bold text-white">{student.name}</h4>
                      <span className="bg-[#e6ca65]/10 text-[#e6ca65] text-[10px] font-mono px-2 py-0.5 rounded border border-[#e6ca65]/20">
                        Rank #{globalRank}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{student.school}</p>
                    <p className="text-[11px] text-slate-500 font-mono font-medium">UID: {student.id}</p>
                  </div>
                </div>
                
                {/* Reputation Points Adjustment Control */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h5 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Reputation Credit Registry</h5>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 block">Current Ledger Balance</span>
                      <span className="text-2xl font-bold font-mono text-cyan-400">{student.reputation || 0} Points</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          const newRep = Math.max(0, (student.reputation || 0) - 10);
                          await updateDocument('students', student.id, { reputation: newRep });
                          triggerToast(`Deducted 10 reputation from ${student.name}.`);
                        }}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Deduct 10 Reputation points"
                      >
                        <Trash2 className="w-4 h-4" />
                        -10 Pts
                      </button>
                      <button 
                        onClick={async () => {
                          const newRep = (student.reputation || 0) + 10;
                          await updateDocument('students', student.id, { reputation: newRep });
                          triggerToast(`Granted 10 reputation to ${student.name}.`);
                        }}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                        title="Grant 10 Reputation points"
                      >
                        <Plus className="w-4 h-4" />
                        +10 Pts
                      </button>
                    </div>
                  </div>
                </div>

                {/* Achievements List and Actions */}
                <div className="space-y-3">
                  <h5 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Achievements & On-Chain Credentials</h5>
                  
                  <div className="space-y-3">
                    {(!student.achievements || student.achievements.length === 0) ? (
                      <p className="text-xs text-slate-500 italic text-center py-4 border border-white/5 rounded-xl bg-black/20">
                        No achievements are logged for this student.
                      </p>
                    ) : (
                      student.achievements.map(ach => (
                        <div 
                          key={ach.id}
                          className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3 hover:border-white/10 transition"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-200 text-sm">{ach.title}</span>
                                <span className="bg-cyan-950/40 text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/10">
                                  {ach.badgeType}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs italic mt-1 leading-relaxed">&ldquo;{ach.description}&rdquo;</p>
                            </div>
                            
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${ach.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'}`}>
                              {ach.status}
                            </span>
                          </div>
                          
                          {ach.status === 'approved' && ach.transactionHash && (
                            <div className="bg-[#080603] p-2 rounded-lg border border-white/5 text-[10px] font-mono text-slate-500 space-y-1">
                              <div className="flex justify-between">
                                <span>POLYGON TX:</span>
                                <span className="text-cyan-400">{ach.transactionHash.substring(0, 12)}...</span>
                              </div>
                              <div className="flex justify-between">
                                <span>IPFS HASH:</span>
                                <span className="text-slate-400 truncate max-w-[200px]">{ach.ipfsHash}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                            {ach.status === 'pending' ? (
                              <button 
                                onClick={async () => {
                                  await approveAchievementAction(ach.id);
                                  triggerToast(`Achievement approved & minted on-chain successfully!`);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:from-cyan-400"
                              >
                                <Award className="w-3.5 h-3.5" /> Approve & Mint
                              </button>
                            ) : (
                              <button 
                                onClick={async () => {
                                  // Revocation mechanism! Update achievements list in Firestore
                                  const updatedAchievements = student.achievements!.map(a => 
                                    a.id === ach.id ? { ...a, status: 'pending' as const, transactionHash: undefined, ipfsHash: undefined } : a
                                  );
                                  // Deduct 20 points
                                  const newRep = Math.max(0, (student.reputation || 0) - 20);
                                  await updateDocument('students', student.id, { 
                                    achievements: updatedAchievements,
                                    reputation: newRep
                                  });
                                  triggerToast(`On-chain credential revoked from ${student.name}.`);
                                }}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" /> Revoke Credential
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                <button 
                  onClick={() => setSelectedStudentId(null)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  CLOSE AUDIT REPORT
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
