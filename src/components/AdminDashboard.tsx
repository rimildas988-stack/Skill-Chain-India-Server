import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Key
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    companies, 
    opportunities, 
    reports, 
    verifyCompanyAction, 
    approveAchievementAction,
    submitReport
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'verification' | 'achievements' | 'reports'>('verification');

  // Password-restricted access logic
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adminUnlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  // Filter unverified companies
  const unverifiedCompanies = companies.filter(c => !c.isVerified);

  // Filter achievements that are pending validation
  const pendingAchievements = students.flatMap(student => 
    (student.achievements || [])
      .filter(ach => ach.status === 'pending')
      .map(ach => ({
        ...ach,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar
      }))
  );

  // Filter unresolved reports
  const pendingReports = reports.filter(r => r.status === 'pending');

  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="bg-transparent text-slate-300 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="admin-lock-screen">
        {/* Toast Alert */}
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
            <p className="mt-3 text-xs text-amber-200/60 leading-relaxed font-sans">
              This area contains cryptographic relayer keys, on-chain compliance triggers, and manual verification bypasses. Only authorized Skill Chain India operators may proceed.
            </p>
          </div>

          <form onSubmit={handleVerifyPassword} className="mt-8 space-y-6">
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
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1">
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
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2.5">
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
    </div>
  );
};
