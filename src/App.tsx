import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { InnovationHub } from './components/InnovationHub';
import { SkillPass } from './components/SkillPass';
import { StudentDashboard } from './components/StudentDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { GmailCenter } from './components/GmailCenter';
import { NewsHub } from './components/NewsHub';
import { DashboardLockScreen } from './components/DashboardLockScreen';
import { PhoneLogin } from './components/PhoneLogin';
import { ProfileModal } from './components/ProfileModal';
import { PremiumBackground } from './components/PremiumBackground';
import { AuraSynthConsole } from './components/AuraSynthConsole';
import { 
  Shield, 
  Menu, 
  X, 
  Bell, 
  User, 
  Compass, 
  Lightbulb, 
  LayoutDashboard, 
  Home, 
  ChevronDown,
  Sparkles,
  Award,
  LogIn,
  LogOut,
  Mail,
  Newspaper,
  Lock,
  Unlock,
  Wallet
} from 'lucide-react';

type ViewState = 'home' | 'marketplace' | 'innovation-hub' | 'dashboard' | 'skillpass' | 'gmail' | 'news' | 'login';

const AppContent: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentStudent, 
    notifications, 
    walletConnected, 
    walletAddress,
    connectWallet,
    disconnectWallet,
    currentUser,
    signInWithGoogle,
    signOutUser,
    loadingAuth,
    authError,
    setAuthError,
    isDashboardUnlocked,
    verifyDashboardPassword,
    lockDashboard
  } = useApp();

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Active unread notifications
  const unreadCount = notifications.filter(n => {
    if (currentRole === 'student') return n.userId === (currentUser?.uid || 'student-current') && !n.read;
    if (currentRole === 'company') return n.userId === (currentUser?.uid || 'company-1') && !n.read;
    return n.userId === 'admin' && !n.read;
  }).length;

  const handleSelectStudentProfile = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('skillpass');
  };

  const handleSwitchRole = (role: 'student' | 'company' | 'admin') => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    // Auto-navigate to that dashboard when switching roles to make validation seamless!
    setCurrentView('dashboard');
  };

  return (
    <div className="bg-[#080603] min-h-screen text-[#f5f1e6] font-sans flex flex-col justify-between relative overflow-hidden">
      
      {authError && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2.5 text-xs text-amber-200/90 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300 relative z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{authError}</span>
          </div>
          <button 
            onClick={() => setAuthError(null)}
            className="text-amber-400 hover:text-amber-100 font-bold px-2 text-sm cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Expensive Interactive Luxury Background */}
      <PremiumBackground />

      {/* GLOBAL SAAS NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0c0905]/70 backdrop-blur-md border-b border-[#e6ca65]/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none z-10"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 rounded-xl flex items-center justify-center font-bold text-lg text-[#0c0904] shadow-[0_0_15px_rgba(230,202,101,0.4)] group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-serif-lux font-black tracking-widest text-[#fbf5b7] text-base sm:text-lg">
            SKILL CHAIN <span className="text-amber-400 font-mono text-xs sm:text-sm font-bold">INDIA</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium z-10">
          <button 
            onClick={() => { setCurrentView('home'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'home' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setCurrentView('marketplace'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'marketplace' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => { setCurrentView('innovation-hub'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'innovation-hub' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Innovation Hub
          </button>
          <button 
            onClick={() => { setCurrentView('dashboard'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'dashboard' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setCurrentView('gmail'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'gmail' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Gig Mail
          </button>
          <button 
            onClick={() => { setCurrentView('news'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'news' ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(230,202,101,0.5)]' : 'text-amber-100/60 hover:text-[#fff8dc]'}`}
          >
            Web3 News
          </button>
        </nav>

        {/* Action Controls & Role Selectors */}
        <div className="flex items-center gap-4 z-10">
          
          {/* Expensive Classical Focal Resonance Synth */}
          <div className="hidden lg:block">
            <AuraSynthConsole />
          </div>

          {/* Notifications Icon with Badge */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-200/70 hover:text-amber-100 hover:border-amber-400/50 transition relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black w-4 h-4 rounded-full text-[9px] font-bold font-mono flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(230,202,101,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role switcher widget */}
          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-[#120e07] hover:bg-[#1a140b] border border-[#e6ca65]/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-100 flex items-center gap-1.5 transition cursor-pointer select-none"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="capitalize">{currentRole} Portal</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-500/70" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0c0905] border border-[#e6ca65]/20 rounded-2xl shadow-2xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-[9px] font-mono font-bold text-amber-400/50 uppercase tracking-widest px-2 pb-1.5 border-b border-[#e6ca65]/10">
                  Switch Portal View
                </p>
                <button 
                  onClick={() => handleSwitchRole('student')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'student' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-amber-100/60 hover:bg-white/5 hover:text-[#fbf5b7]'}`}
                >
                  Student Builder Portal
                </button>
                <button 
                  onClick={() => handleSwitchRole('company')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'company' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-amber-100/60 hover:bg-white/5 hover:text-[#fbf5b7]'}`}
                >
                  Partner Company Portal
                </button>
                <button 
                  onClick={() => handleSwitchRole('admin')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'admin' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-amber-100/60 hover:bg-white/5 hover:text-[#fbf5b7]'}`}
                >
                  System Admin Console
                </button>
              </div>
            )}
          </div>

          {/* Real Web3 Wallet Connect Integration */}
          {walletConnected ? (
            <button
              onClick={() => disconnectWallet()}
              className="bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition cursor-pointer select-none animate-in fade-in zoom-in duration-200"
              title={`Wallet connected: ${walletAddress}. Click to disconnect.`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              <span>{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                connectWallet().catch(err => {
                  console.error(err);
                });
              }}
              className="bg-[#120e07] hover:bg-[#1a140b] border border-[#e6ca65]/35 hover:border-amber-400/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-100 flex items-center gap-1.5 transition cursor-pointer select-none animate-in fade-in zoom-in duration-200"
              title="Connect Web3 MetaMask / Browser Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Connect Wallet</span>
              <span className="sm:hidden font-mono">Connect</span>
            </button>
          )}

          {/* Custom Web3 Auth / Phone Integration Widget */}
          {loadingAuth ? (
            <div className="w-8 h-8 rounded-xl border border-amber-500/10 bg-amber-500/5 animate-pulse"></div>
          ) : (currentUser && (!currentUser.isAnonymous || sessionStorage.getItem('phone_auth_user') === 'true')) ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 bg-[#120e07] hover:bg-[#1a140b] border border-[#e6ca65]/35 hover:border-amber-400/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-100 transition cursor-pointer select-none"
                title="View Builder Passport (History, Policies, Support)"
              >
                <img 
                  src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                  alt="Profile" 
                  className="w-5 h-5 rounded-full border border-amber-400/60 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="max-w-[85px] truncate hidden sm:inline">{currentStudent?.name || 'Passport'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentView('login')}
              className="premium-button-gold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer select-none"
            >
              <LogIn className="w-3.5 h-3.5 text-black" />
              <span>Sign In / Join</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-200/70 hover:text-amber-100 hover:border-amber-400/50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </header>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[69px] inset-x-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 p-6 z-30 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <button 
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'home' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Home Landing
            </button>
            <button 
              onClick={() => { setCurrentView('marketplace'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'marketplace' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Opportunity Marketplace
            </button>
            <button 
              onClick={() => { setCurrentView('innovation-hub'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'innovation-hub' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Open Innovation Hub
            </button>
            <button 
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              My Dashboard
            </button>
            <button 
              onClick={() => { setCurrentView('gmail'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'gmail' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Gig Mail (Gmail)
            </button>
            <button 
              onClick={() => { setCurrentView('news'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'news' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Web3 News Hub
            </button>
          </nav>
        </div>
      )}

      {/* CORE ROUTING SECTION */}
      <main className="flex-1 z-10" id="main-frame-router">
        {currentView === 'home' && (
          <Hero 
            onNavigate={(view) => {
              if (view === 'marketplace') setCurrentView('marketplace');
              else if (view === 'student-dashboard' || view === 'company-dashboard') setCurrentView('dashboard');
              else if (view === 'innovation-hub') setCurrentView('innovation-hub');
            }}
            onSelectStudent={handleSelectStudentProfile}
          />
        )}

        {currentView === 'marketplace' && (
          <Marketplace 
            onBackToHome={() => setCurrentView('home')}
            onNavigateToDashboard={() => setCurrentView('dashboard')}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'innovation-hub' && (
          <InnovationHub 
            onBackToHome={() => setCurrentView('home')}
            onNavigateToStudent={handleSelectStudentProfile}
          />
        )}

        {currentView === 'skillpass' && (
          <SkillPass 
            studentId={selectedStudentId}
            onBack={() => {
              // Return to the previous screen intelligently
              setCurrentView('home');
              setSelectedStudentId(undefined);
            }}
            isOwnProfile={selectedStudentId === undefined || selectedStudentId === 'student-current'}
          />
        )}

        {currentView === 'dashboard' && (
          <>
            {currentRole === 'admin' ? (
              !isDashboardUnlocked ? (
                <DashboardLockScreen onUnlock={verifyDashboardPassword} />
              ) : (
                <>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-end">
                    <button
                      onClick={lockDashboard}
                      className="flex items-center gap-1.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      title="Lock dashboard to prevent unauthorized viewing"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Portal Authorized</span>
                      <span className="text-[10px] font-mono text-amber-500/50 bg-black/40 px-1.5 py-0.5 rounded">Lock</span>
                    </button>
                  </div>
                  <AdminDashboard />
                </>
              )
            ) : (
              <>
                {currentRole === 'student' && (
                  <StudentDashboard 
                    onNavigateToMarketplace={() => setCurrentView('marketplace')}
                    onNavigateToSkillPass={() => { setSelectedStudentId(undefined); setCurrentView('skillpass'); }}
                    onNavigateToInnovation={() => setCurrentView('innovation-hub')}
                    onSelectStudent={handleSelectStudentProfile}
                  />
                )}
                {currentRole === 'company' && (
                  <CompanyDashboard />
                )}
              </>
            )}
          </>
        )}

        {currentView === 'gmail' && (
          <GmailCenter />
        )}

        {currentView === 'news' && (
          <NewsHub />
        )}

        {currentView === 'login' && (
          <PhoneLogin 
            onSuccess={() => setCurrentView('home')} 
            onCancel={() => setCurrentView('home')} 
          />
        )}
      </main>

      {/* MOBILE VIEW BOTTOM NAVIGATION DOCK (Touch targets prioritized 44px) */}
      <footer className="md:hidden sticky bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/5 py-2.5 px-6 flex items-center justify-between" id="mobile-bottom-dock">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'home' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('marketplace')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'marketplace' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Market</span>
        </button>
        <button 
          onClick={() => setCurrentView('innovation-hub')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'innovation-hub' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[10px] font-medium">Hub</span>
        </button>
        <button 
          onClick={() => setCurrentView('gmail')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'gmail' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium">Mail</span>
        </button>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
      </footer>

      {/* Global Profile Modal drawer overlay */}
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
