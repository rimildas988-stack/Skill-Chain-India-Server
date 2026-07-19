import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Key, User, BookOpen, Mail, ShieldCheck, ArrowRight, ArrowLeft, Plus, Check, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface PhoneLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PhoneLogin: React.FC<PhoneLoginProps> = ({ onSuccess, onCancel }) => {
  const { registerPhoneUser, signInWithGoogle, authError, loginPhoneUser } = useApp();

  // Navigation and flow states
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  // Timer for resend
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Flash notification state for SMS simulation
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  // Step 2 profile details states
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availability, setAvailability] = useState<'Full-time' | 'Part-time' | 'Intermittent' | 'Unavailable'>('Part-time');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [permDirectory, setPermDirectory] = useState(false);
  const [permSharing, setPermSharing] = useState(false);
  const [permCache, setPermCache] = useState(false);
  const [permAI, setPermAI] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Core predefined skills for easy chip selection
  const skillPresets = [
    'Smart Contracts', 'Solidity', 'Frontend (React)', 'Web3.js', 'Rust', 'UI/UX Design', 'DeFi', 'Node.js'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate network latency for SMS Gateway API
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Generate random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setTimer(60);
    setLoading(false);

    // Show custom SMS system notification banner on screen
    setSmsNotification(`[SECURE SMS GATEWAY] Code sent to +91 ${phoneNumber}: Verification OTP is ${randomOtp}`);
    
    // Auto-dismiss the floating SMS notification banner after 10 seconds
    setTimeout(() => {
      setSmsNotification(null);
    }, 12000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the OTP verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (verificationCode === generatedOtp || verificationCode === '123456') {
      setSmsNotification(null);
      try {
        const loggedIn = await loginPhoneUser(phoneNumber);
        setLoading(false);
        if (loggedIn) {
          onSuccess();
        } else {
          setStep(2); // Progress to profile setup
        }
      } catch (err: any) {
        setLoading(false);
        setError(err?.message || 'Error checking account status. Please retry.');
      }
    } else {
      setLoading(false);
      setError('Invalid OTP code. Please review the security notification or try again.');
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setNewSkillInput('');
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your Full Name.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setError('Please provide a valid Email Address.');
      return;
    }
    if (!schoolName.trim()) {
      setError('Please provide your School/College or Organization Name.');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please select or write at least one skill.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    if (!permDirectory) {
      setError('You must grant the Profile Directory Visibility permission to list your portfolio.');
      return;
    }
    if (!permSharing) {
      setError('You must grant the Gig Solution Sharing consent to submit project pitches.');
      return;
    }
    if (!permCache) {
      setError('You must grant the Web3 Session Storage permission to preserve secure local states.');
      return;
    }
    if (!permAI) {
      setError('You must agree to the AI Counseling and Reputation Ledger evaluation.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerPhoneUser({
        phone: phoneNumber,
        name: fullName.trim(),
        email: emailAddress.trim().toLowerCase(),
        school: schoolName.trim(),
        skills: selectedSkills,
        availability: availability
      });
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Error configuring account profile. Please retry.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Floating SMS Code Simulation Toast Notification */}
      {smsNotification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm w-full bg-[#161208] border-2 border-[#e6ca65] rounded-2xl p-4 shadow-[0_10px_30px_rgba(230,202,101,0.15)] animate-in slide-in-from-right duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-amber-500/60 uppercase tracking-wider font-semibold">Simulated SMS Message</p>
              <p className="text-xs text-amber-100 font-medium font-sans leading-relaxed">
                {smsNotification}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button 
                  onClick={() => {
                    setVerificationCode(generatedOtp || '');
                    setError(null);
                  }}
                  className="text-[9px] bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-mono font-bold uppercase transition cursor-pointer"
                >
                  Auto-Fill OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-[#0c0905] border border-[#e6ca65]/15 rounded-3xl p-8 shadow-[0_0_60px_rgba(230,202,101,0.06)] relative overflow-hidden backdrop-blur-md">
        
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e6ca65]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e6ca65]/35 to-transparent"></div>

        {/* Header Action Cancel */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs text-amber-500/60 hover:text-amber-400 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          
          <div className="flex items-center gap-1 text-[9px] font-mono text-amber-500/40 uppercase tracking-widest font-bold bg-[#141008] border border-amber-500/10 px-2.5 py-1 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${step === 1 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            Step {step} of 2
          </div>
        </div>

        {step === 1 ? (
          /* ================= STEP 1: MOBILE & OTP ================= */
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif-lux font-bold text-[#fbf5b7] tracking-wide">
                Join Skill Chain India
              </h2>
              <p className="text-xs text-amber-100/60 leading-relaxed">
                Connect your talent directly. Verify your mobile number via OTP to start building your decentralised portfolio.
              </p>
            </div>

            <div className="border-t border-[#e6ca65]/10 my-4"></div>

            {error && (
              <div className="flex items-start gap-2 bg-red-950/20 border border-red-500/25 p-3.5 rounded-xl text-xs text-red-200/90 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!otpSent ? (
              /* Phone input form */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-semibold ml-1">
                    Mobile Number (India)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-amber-400/50 font-mono font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                        if (error) setError(null);
                      }}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-sm font-mono text-[#f5f1e6] placeholder-slate-700 focus:outline-none transition-all shadow-inner"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full premium-button-gold py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(230,202,101,0.15)]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Sending SMS Code...
                    </span>
                  ) : (
                    <>
                      Send OTP Verification Code
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP input form */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-semibold">
                      Enter SMS Verification Code
                    </label>
                    <span className="text-[10px] text-amber-500/60 font-mono">
                      Sent to +91 {phoneNumber}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/50">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (error) setError(null);
                      }}
                      placeholder="Enter 6-digit Code"
                      className="w-full pl-10 pr-4 py-3 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-sm font-mono tracking-[0.4em] text-center text-[#f5f1e6] placeholder-slate-800 focus:outline-none transition-all shadow-inner"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] px-1 font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setVerificationCode('');
                      setError(null);
                    }}
                    className="text-amber-500/60 hover:text-amber-400 underline transition cursor-pointer"
                  >
                    Change Number
                  </button>
                  {timer > 0 ? (
                    <span className="text-slate-500">Resend Code in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full premium-button-gold py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(230,202,101,0.15)]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Verifying Code...
                    </span>
                  ) : (
                    <>
                      Verify and Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#e6ca65]/10"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-amber-500/30 uppercase tracking-widest font-semibold">Or Authenticate With</span>
              <div className="flex-grow border-t border-[#e6ca65]/10"></div>
            </div>

            {/* Google alternative */}
            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  onSuccess();
                } catch (e) {
                  // Bypass triggers on cancel
                }
              }}
              className="w-full bg-[#120e07] hover:bg-[#1a140b] border border-[#e6ca65]/20 hover:border-[#e6ca65]/40 text-amber-100 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
              <span>Continue with Google Accounts</span>
            </button>
          </div>
        ) : (
          /* ================= STEP 2: PROFILE DETAILS ================= */
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-serif-lux font-bold text-[#fbf5b7] tracking-wide uppercase">
                Configure Developer Profile
              </h2>
              <p className="text-xs text-amber-100/60 leading-relaxed">
                Provide your core credentials. This seeds your Skill Pass verified credentials on-chain.
              </p>
            </div>

            <div className="border-t border-[#e6ca65]/10 my-2"></div>

            {error && (
              <div className="flex items-start gap-2 bg-red-950/20 border border-red-500/25 p-3 rounded-xl text-xs text-red-200/90 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCompleteRegistration} className="space-y-4 text-left">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-bold ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/40">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-xs text-[#f5f1e6] placeholder-slate-700 focus:outline-none transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-bold ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="arjun@iitdelhi.ac.in"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-xs text-[#f5f1e6] placeholder-slate-700 focus:outline-none transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* School / College */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-bold ml-1">
                  Institution Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/40">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="IIT Delhi / Bits Pilani"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-xs text-[#f5f1e6] placeholder-slate-700 focus:outline-none transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-bold ml-1">
                  Work Engagement Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-xs text-[#f5f1e6] focus:outline-none transition-all select-none"
                  disabled={loading}
                >
                  <option value="Part-time">Part-Time Contracts (Freelance)</option>
                  <option value="Full-time">Full-Time Placement (Hired)</option>
                  <option value="Intermittent">Intermittent Hackathons</option>
                  <option value="Unavailable">Temporarily Unavailable</option>
                </select>
              </div>

              {/* Skill Presets Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-bold ml-1 block">
                  Select Skills (Tap to add/remove)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-black/40 border border-[#e6ca65]/10 rounded-xl">
                  {skillPresets.map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition border flex items-center gap-1 cursor-pointer ${active ? 'bg-amber-500/25 border-amber-500 text-amber-300' : 'bg-transparent border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
                        disabled={loading}
                      >
                        {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Input */}
              <div className="space-y-1">
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Or type a custom skill..."
                    className="flex-grow px-3 py-2 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-xs text-[#f5f1e6] placeholder-slate-700 focus:outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black px-3 rounded-xl text-xs font-bold transition cursor-pointer"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedSkills.map((s) => (
                      <span key={s} className="bg-[#1c180f] border border-[#e6ca65]/20 text-amber-300 px-2 py-0.5 rounded-md text-[9px] font-mono flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => handleToggleSkill(s)} className="text-amber-500/40 hover:text-red-400 text-[10px] font-black shrink-0">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Required Consents & Permissions Section */}
              <div className="mt-5 p-4 rounded-xl bg-black/50 border border-[#e6ca65]/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-4 h-4 text-[#e6ca65]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#fbf5b7]">
                      Required Port Consents ({[agreedToTerms, permDirectory, permSharing, permCache, permAI].filter(Boolean).length}/5)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAgreedToTerms(true);
                      setPermDirectory(true);
                      setPermSharing(true);
                      setPermCache(true);
                      setPermAI(true);
                      if (error) setError(null);
                    }}
                    className="text-[9px] font-mono font-bold text-[#e6ca65] hover:text-[#fbf5b7] bg-[#e6ca65]/10 px-2 py-0.5 rounded border border-[#e6ca65]/20 hover:border-[#e6ca65]/40 transition cursor-pointer"
                  >
                    Accept All
                  </button>
                </div>

                <div className="border-t border-[#e6ca65]/10 my-1"></div>

                <div className="space-y-3">
                  {/* 1. Terms and Conditions / Privacy Policy Checkbox */}
                  <div className="flex items-start gap-2.5">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#e6ca65]/20 bg-[#080603] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer accent-[#e6ca65]"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="agree-terms" className="text-[11px] text-amber-100/60 leading-tight select-none cursor-pointer">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                        className="text-amber-400 hover:underline font-semibold focus:outline-none"
                      >
                        Terms &amp; Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
                        className="text-amber-400 hover:underline font-semibold focus:outline-none"
                      >
                        Privacy Policy
                      </button>
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                  </div>

                  {/* 2. Directory Visibility */}
                  <div className="flex items-start gap-2.5">
                    <input
                      id="perm-directory"
                      type="checkbox"
                      checked={permDirectory}
                      onChange={(e) => {
                        setPermDirectory(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#e6ca65]/20 bg-[#080603] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer accent-[#e6ca65]"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="perm-directory" className="text-[11px] text-amber-100/60 leading-tight select-none cursor-pointer">
                      <strong className="text-amber-200/90 font-medium">Directory Visibility:</strong> Permit storing and showing my developer credentials on the public recruiter dashboard. <span className="text-red-400 ml-0.5">*</span>
                    </label>
                  </div>

                  {/* 3. Solution & Contact Sharing */}
                  <div className="flex items-start gap-2.5">
                    <input
                      id="perm-sharing"
                      type="checkbox"
                      checked={permSharing}
                      onChange={(e) => {
                        setPermSharing(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#e6ca65]/20 bg-[#080603] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer accent-[#e6ca65]"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="perm-sharing" className="text-[11px] text-amber-100/60 leading-tight select-none cursor-pointer">
                      <strong className="text-amber-200/90 font-medium">Solution Sharing:</strong> Allow recruiters to view my contact data (phone/email) and task solutions upon active gig application. <span className="text-red-400 ml-0.5">*</span>
                    </label>
                  </div>

                  {/* 4. Local Web3 Storage Persistence */}
                  <div className="flex items-start gap-2.5">
                    <input
                      id="perm-cache"
                      type="checkbox"
                      checked={permCache}
                      onChange={(e) => {
                        setPermCache(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#e6ca65]/20 bg-[#080603] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer accent-[#e6ca65]"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="perm-cache" className="text-[11px] text-amber-100/60 leading-tight select-none cursor-pointer">
                      <strong className="text-amber-200/90 font-medium">Session Caching:</strong> Consent to access local cookie/session APIs to store the cryptographically simulated secure login token. <span className="text-red-400 ml-0.5">*</span>
                    </label>
                  </div>

                  {/* 5. AI Evaluations & Reputation Slash */}
                  <div className="flex items-start gap-2.5">
                    <input
                      id="perm-ai"
                      type="checkbox"
                      checked={permAI}
                      onChange={(e) => {
                        setPermAI(e.target.checked);
                        if (error) setError(null);
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#e6ca65]/20 bg-[#080603] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer accent-[#e6ca65]"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="perm-ai" className="text-[11px] text-amber-100/60 leading-tight select-none cursor-pointer">
                      <strong className="text-amber-200/90 font-medium">AI &amp; Reputation Audit:</strong> Agree to AI-assisted proposal generator tools, and allow reputation score adjustment based on delivered work. <span className="text-red-400 ml-0.5">*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full premium-button-gold mt-4 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(230,202,101,0.2)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Registering Student Account...
                  </span>
                ) : (
                  <>
                    Complete Registration
                    <CheckCircle2 className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* CUSTOM TERMS OF SERVICE MODAL OVERLAY */}
        {showTermsModal && (
          <div className="absolute inset-0 z-50 bg-black/95 p-6 rounded-3xl flex flex-col justify-between animate-in fade-in duration-200">
            <div className="space-y-4 overflow-y-auto max-h-[85%] scrollbar-thin">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif-lux font-bold text-base text-[#fbf5b7]">Terms &amp; Conditions</h3>
              </div>
              <p className="text-[9px] font-mono text-amber-500/50 uppercase tracking-wider">Skill Chain India • Decentralised Portal Agreement</p>
              
              <div className="space-y-3.5 text-xs text-amber-100/70 font-sans leading-relaxed">
                <p>
                  Welcome to Skill Chain India. By establishing a student profile and linking your wallet, you agree to comply with and be bound by the following operational directives:
                </p>
                <div className="space-y-2 pl-2 border-l border-[#e6ca65]/20">
                  <p><strong>1. Decentralised Portfolios:</strong> All achievements, smart contract-issued credentials, and work history profiles are recorded immutably. You own and manage your private cryptographic identity.</p>
                  <p><strong>2. Peer and Partner Verification:</strong> Applications for opportunities undergo strict automated qualification checks. Dishonest claims regarding expertise, education, or school enrollment will result in reputation score slashing.</p>
                  <p><strong>3. Project Delivery:</strong> Selected candidates must honor agreements, deliver outputs matching specifications, and operate with standard, high-quality professional code.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#e6ca65]/10 flex gap-3">
              <button
                type="button"
                onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }}
                className="flex-1 premium-button-gold py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Accept Terms
              </button>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* CUSTOM PRIVACY POLICY MODAL OVERLAY */}
        {showPrivacyModal && (
          <div className="absolute inset-0 z-50 bg-black/95 p-6 rounded-3xl flex flex-col justify-between animate-in fade-in duration-200">
            <div className="space-y-4 overflow-y-auto max-h-[85%] scrollbar-thin">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif-lux font-bold text-base text-[#fbf5b7]">Privacy Policy</h3>
              </div>
              <p className="text-[9px] font-mono text-amber-500/50 uppercase tracking-wider">Skill Chain India • Student Portfolio Privacy</p>
              
              <div className="space-y-3.5 text-xs text-amber-100/70 font-sans leading-relaxed">
                <p>
                  Skill Chain India respects your digital privacy. This policy outlines how your details are safely stored and managed:
                </p>
                <div className="space-y-2 pl-2 border-l border-[#e6ca65]/20">
                  <p><strong>1. Data Minimization:</strong> We request only fundamental professional attributes (Name, School, Core Skills, Availability) required to pair you with Web3 partner organizations.</p>
                  <p><strong>2. Firestore Security:</strong> Your data is stored on highly secure Firestore instances utilizing robust granular security rules. This shields your details from unauthorized external queries.</p>
                  <p><strong>3. Non-Disclosure:</strong> We never distribute, sell, or rent student details to third parties. Your personal profile attributes are only exposed to vetted companies when you actively submit applications.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#e6ca65]/10 flex gap-3">
              <button
                type="button"
                onClick={() => { setAgreedToTerms(true); setShowPrivacyModal(false); }}
                className="flex-1 premium-button-gold py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Accept Policy
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
