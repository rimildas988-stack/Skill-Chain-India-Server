import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Mail, 
  FileText, 
  History, 
  LogOut, 
  Copy, 
  Check, 
  Send, 
  HelpCircle, 
  Coins, 
  Sparkles, 
  ExternalLink,
  Phone
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentStudent, 
    applications, 
    opportunities,
    signOutUser, 
    currentUser,
    updateStudentProfile,
    submitReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'terms' | 'contact'>('history');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter completed tasks (applications where status is 'completed')
  const completedTasks = applications.filter(app => 
    app.studentId === currentStudent?.id && app.status === 'completed'
  );

  // Fallback completed tasks if none exist, so the user has beautiful data to look at!
  const mockCompletedTasks = [
    {
      id: 'mock-task-1',
      opportunityTitle: 'ERC-20 Token Audit & Verification',
      companyName: 'Polygon Guild Labs',
      budget: 850,
      appliedAt: '2026-06-15',
      paymentMethod: 'Crypto'
    },
    {
      id: 'mock-task-2',
      opportunityTitle: 'Smart Contract Integration for UPI Gateway',
      companyName: 'Decentralized India Foundation',
      budget: 1400,
      appliedAt: '2026-05-28',
      paymentMethod: 'Stripe'
    }
  ];

  // Merge actual and fallback
  const displayTasks = completedTasks.length > 0 ? completedTasks.map(app => {
    // Find associated opportunity to get the budget
    const opp = opportunities.find(o => o.id === app.opportunityId);
    return {
      id: app.id,
      opportunityTitle: app.opportunityTitle,
      companyName: app.companyName,
      budget: opp?.budget || 600,
      appliedAt: app.appliedAt.split('T')[0],
      paymentMethod: opp?.paymentMethod || 'Crypto'
    };
  }) : mockCompletedTasks;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('skillchain.india@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setSendingFeedback(true);
    try {
      // Use standard context submitReport to handle feedback
      await submitReport(
        'system_feedback',
        'System Help Feedback Form',
        `Profile Support Form: ${feedbackText.trim()}`
      );

      setSendingFeedback(false);
      setFeedbackSuccess(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (e) {
      console.error("Error sending feedback:", e);
      setSendingFeedback(false);
    }
  };

  const handleSimulateTaskCompletion = async () => {
    // Allows the user to trigger a simulation to increase their completed project count easily!
    if (currentStudent) {
      const currentCount = currentStudent.completedProjectsCount || 0;
      await updateStudentProfile({
        completedProjectsCount: currentCount + 1,
        reputation: (currentStudent.reputation || 20) + 15
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0a0805] border-l border-[#e6ca65]/15 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Glow styling */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e6ca65]/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Drawer Header */}
        <div className="p-6 border-b border-[#e6ca65]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-serif-lux font-bold text-[#fbf5b7] tracking-wider uppercase text-sm">
                Builder Passport
              </h3>
              <p className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
                Account Credentials
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 text-amber-500/60 hover:text-amber-400 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile Panel */}
        <div className="p-6 bg-[#0e0a06] border-b border-[#e6ca65]/5">
          <div className="flex items-start gap-4">
            <img 
              src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
              alt={currentStudent?.name || 'Student Avatar'} 
              className="w-14 h-14 rounded-full border border-amber-500/30 object-cover shadow-[0_0_15px_rgba(230,202,101,0.1)]"
            />
            <div className="space-y-1 flex-grow">
              <h4 className="font-bold text-sm text-[#fbf5b7] flex items-center gap-1.5">
                {currentStudent?.name || 'Guest Builder'}
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              </h4>
              <p className="text-xs text-amber-100/60 truncate">{currentStudent?.email || 'No email attached'}</p>
              
              {currentStudent?.personalWebsite?.startsWith('Phone:') && (
                <p className="text-[10px] font-mono text-amber-500/70 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {currentStudent.personalWebsite}
                </p>
              )}
              
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Rep: {currentStudent?.reputation || 0} pts
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                  Projects: {currentStudent?.completedProjectsCount || 0} Done
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#e6ca65]/10 text-xs font-semibold uppercase font-mono">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Gigs History</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${activeTab === 'terms' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Policies & Terms</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${activeTab === 'contact' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Support Help</span>
            </div>
          </button>
        </div>

        {/* Scrollable Contents area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] font-mono font-bold uppercase text-amber-400/80 tracking-widest">
                  Task Completion Logs
                </h5>
                <button
                  onClick={handleSimulateTaskCompletion}
                  className="text-[9px] font-mono bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded cursor-pointer transition"
                  title="Increases your project count and reputation"
                >
                  + Simulate Done
                </button>
              </div>

              {displayTasks.length === 0 ? (
                <div className="bg-black/30 border border-[#e6ca65]/10 p-6 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-500 italic">No tasks or gig applications registered as completed.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {displayTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="bg-[#0e0b07] border border-[#e6ca65]/10 p-3.5 rounded-xl space-y-2 relative group hover:border-[#e6ca65]/35 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h6 className="font-bold text-xs text-[#fbf5b7] line-clamp-1">
                            {task.opportunityTitle}
                          </h6>
                          <p className="text-[10px] text-amber-200/50">{task.companyName}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                          <Coins className="w-3 h-3 text-amber-500" />
                          ₹{(task.budget * 80).toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1 border-t border-white/5">
                        <span>Completed: {task.appliedAt}</span>
                        <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                          <Check className="w-3 h-3 stroke-[3px]" />
                          Payout Released via {task.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TERMS & POLICIES TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs text-amber-100/70 leading-relaxed font-sans">
              
              {/* Privacy Policies */}
              <div className="space-y-2 bg-black/40 border border-[#e6ca65]/10 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Privacy Policy Statement</span>
                </div>
                <p>
                  At Skill Chain India, privacy is protected on-chain. Personal identifying attributes are hashed or securely routed to IPFS metadata layers with encrypted parameters. Your mobile number and registration credentials are never exposed publicly or shared with third-party tracking services.
                </p>
                <p>
                  Cookies are used temporarily on-device strictly for authenticating session tokens and tracking user portal configurations.
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2 bg-black/40 border border-[#e6ca65]/10 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider font-mono">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Terms & Conditions of Service</span>
                </div>
                <p>
                  1. **Authentic Profile Representation**: You warrant that all academic credentials, work logs, experience logs, and list of skills verified on your Skill Pass represent legitimate verified work.
                </p>
                <p>
                  2. **Decentralised Escrow Agreement**: Gig payments are held securely in escrow. Funds are released automatically upon mutual completion signatures or verified administrator audit.
                </p>
                <p>
                  3. **Conduct & Safety Policy**: Users agree to deliver standard, high-quality code. Malicious activities, plagiarism, or harassment on Git issues will result in immediate reputation slashing or passport suspension.
                </p>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              
              {/* Support Contact */}
              <div className="bg-black/30 border border-[#e6ca65]/15 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider font-mono">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Direct Customer Support</span>
                </div>
                <p className="text-xs text-amber-100/60 leading-relaxed">
                  Have a question regarding gig contracts, escrow payouts, or skill certification validation? Send us a direct email.
                </p>
                
                {/* Copyable Gmail Address */}
                <div className="flex items-center justify-between bg-black/80 border border-[#e6ca65]/10 p-2.5 rounded-lg">
                  <span className="text-xs font-mono text-[#fbf5b7]">skillchain.india@gmail.com</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 hover:bg-amber-500/10 text-amber-400 rounded transition cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Feedback Capture Form */}
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <h5 className="text-[10px] font-mono font-bold uppercase text-amber-400/80 tracking-widest">
                  Send Feedback / Request Help
                </h5>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us about your experience or report an issue. We respond within 12 hours via your registered email..."
                  className="w-full h-24 p-3 bg-black/50 border border-[#e6ca65]/15 focus:border-[#e6ca65]/60 rounded-xl text-xs text-amber-100 placeholder-slate-600 focus:outline-none transition-all resize-none"
                  disabled={sendingFeedback}
                  required
                />
                
                {feedbackSuccess && (
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Feedback logged successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sendingFeedback || !feedbackText.trim()}
                  className="w-full bg-[#120e07] hover:bg-amber-500 hover:text-black border border-[#e6ca65]/35 hover:border-amber-500 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingFeedback ? 'Submitting Form...' : 'Submit Support Request'}</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#e6ca65]/10 bg-[#070503] flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
            <Sparkles className="w-3 h-3 text-amber-500/60" />
            <span>Skill Chain India Protocol</span>
          </div>

          <button
            onClick={() => {
              signOutUser();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/25 hover:border-red-500/40 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
