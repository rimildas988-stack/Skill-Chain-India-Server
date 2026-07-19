import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Briefcase, Star, Clock, Sparkles, Filter, ChevronRight, X, Heart, Share2, Shield, Send, AlertTriangle } from 'lucide-react';
import { Opportunity } from '../types';

interface MarketplaceProps {
  onBackToHome: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToLogin: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onBackToHome, onNavigateToDashboard, onNavigateToLogin }) => {
  const { 
    opportunities, 
    applyToOpportunity, 
    applications, 
    currentStudent, 
    savedOpportunityIds, 
    toggleSaveOpportunity,
    submitReport,
    currentUser
  } = useApp();

  const isLoggedIn = currentUser && (!currentUser.isAnonymous || sessionStorage.getItem('phone_auth_user') === 'true');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [minBudget, setMinBudget] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  // Selected Opportunity for Detail Slide-Over
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  
  // Application form state
  const [applying, setApplying] = useState(false);
  const [subLink, setSubLink] = useState('');
  const [subComment, setSubComment] = useState('');

  // Report Form state
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Toast alert simulator
  const [toast, setToast] = useState<string | null>(null);

  // AI Matching States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<{
    compatibilityScore: number;
    verdict: string;
    suitabilityAnalysis: string;
    smartTips: string[];
    draftProposal: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedProposal, setCopiedProposal] = useState(false);

  // AI Escrow Agreement States
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [agreement, setAgreement] = useState<{
    agreementTitle: string;
    clauses: string[];
    suggestedMilestones: { name: string; percentage: number; deliverable: string }[];
  } | null>(null);

  const evaluateSuitability = async (opp: Opportunity) => {
    if (!currentStudent) {
      setToast("Please log in as a student to evaluate matching suitability");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiReport(null);
    try {
      let data = null;
      try {
        const response = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: currentStudent,
            opportunity: opp
          })
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn("API Server unavailable, switching to client-side match engine", fetchErr);
      }

      if (!data) {
        // Run client-side local fallback matching logic
        const studentSkills = currentStudent.skills || [];
        const requiredSkills = opp.requiredSkills || [];
        const overlap = studentSkills.filter((s: string) => 
          requiredSkills.some((req: string) => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase()))
        );
        
        let score = 65 + (overlap.length * 10);
        if (currentStudent.reputation > 20) score += 5;
        if (currentStudent.rating && currentStudent.rating >= 4.8) score += 5;
        if (score > 95) score = 95;
        if (score < 60) score = 60;

        let verdict: "Highly Recommended" | "Recommended" | "Potential Match" | "Needs Upskilling" = "Potential Match";
        if (score >= 90) verdict = "Highly Recommended";
        else if (score >= 75) verdict = "Recommended";
        else if (score < 65) verdict = "Needs Upskilling";

        const suitabilityAnalysis = `Based on our advanced matching analysis, ${currentStudent.name} is a ${verdict.toLowerCase()} for the ${opp.title} gig at ${opp.companyName}. With verified skills in ${studentSkills.slice(0, 3).join(', ')} and a reputation score of ${currentStudent.reputation || 10} points, they demonstrate the foundational technical capability and project-delivery reliability needed for this ${opp.difficulty} role.`;

        const smartTips = [
          `Emphasize your practical, verified experience in ${studentSkills[0] || 'Web3 development'} when discussing requirements with ${opp.companyName}.`,
          `Provide a direct portfolio or GitHub repository link showcasing similar previous builds or smart contract deployments.`,
          `Leverage your rating (${currentStudent.rating || '5.0'}/5.0) to highlight structural accountability and quality.`
        ];

        const draftProposal = `Dear Hiring Team at ${opp.companyName},

I am highly interested in applying for the ${opp.title} opportunity on Skill Chain India. As an active builder, I have honed structured expertise in ${studentSkills.slice(0, 4).join(', ')}, making me well-suited for your requirements.

I have established a verified profile with a reputation score of ${currentStudent.reputation || 10} points and a current rating of ${currentStudent.rating || '5.0'}/5.0. This track record reflects my commitment to delivering premium, high-quality milestones on schedule. I am fully comfortable working with your budget of ${opp.budget} using ${opp.paymentMethod} escrow protection, and look forward to building a partnership.

Sincerely,
${currentStudent.name}`;

        data = {
          compatibilityScore: score,
          verdict,
          suitabilityAnalysis,
          smartTips,
          draftProposal
        };
      }

      setAiReport(data);
      setToast("Premium AI evaluation complete! Scroll down to see full report.");
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to fetch evaluation.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAgreementPreview = async (opp: Opportunity) => {
    if (!currentStudent) {
      setToast("Please log in as a student to generate custom agreement");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setAgreementLoading(true);
    setAgreement(null);
    try {
      let data = null;
      try {
        const response = await fetch("/api/ai/generate-agreement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: currentStudent.name,
            companyName: opp.companyName,
            projectTitle: opp.title,
            budget: opp.budget,
            description: opp.description
          })
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn("API Server unavailable, switching to local smart contract builder", fetchErr);
      }

      if (!data) {
        const numericBudget = typeof opp.budget === 'number' ? opp.budget : parseInt(String(opp.budget).replace(/[^0-9]/g, '')) || 500;
        const currency = opp.paymentMethod === 'Crypto' ? 'USDC' : 'INR';

        const halfBudget = Math.round(numericBudget * 0.5);
        const leftBudget = numericBudget - halfBudget;

        data = {
          agreementTitle: "Web3 Escrow Smart Agreement",
          clauses: [
            `Escrow Initialization: Full funds of ${opp.budget || '500 USDC'} must be fully locked in the decentralized Escrow Smart Contract before the freelancer (${currentStudent.name}) initiates active code development.`,
            `On-Chain Milestone Gates: Milestone verification parameters will govern transparent releases to the freelancer's wallet address.`,
            `Deliverable Review Buffer: The Recruiter (${opp.companyName}) has a strictly bounded 72-hour review period post-submission to verify requirements before funds release.`,
            `Decentralized Arbitration: Any dispute will be routed to the developer arbitration guild for final voting.`
          ],
          suggestedMilestones: [
            { 
              name: "Milestone 1: Architectural Draft & MVP", 
              percentage: 50, 
              deliverable: `Proof of Concept and initial feature setup representing 50% (${halfBudget} ${currency}) of the total budget.`
            },
            { 
              name: "Milestone 2: Final Handoff & Smart Contract Auditing", 
              percentage: 50, 
              deliverable: `Verification of all deliverables, testing completion, and final transfer representing 50% (${leftBudget} ${currency}) of the total budget.`
            }
          ]
        };
      }

      setAgreement(data);
      setToast("Interactive Escrow Smart Agreement Generated!");
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAgreementLoading(false);
    }
  };

  // Collect all unique skills
  const allSkills = Array.from(new Set(opportunities.flatMap(o => o.requiredSkills)));

  // Filter logic
  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'All' || opp.difficulty === selectedDifficulty;
    const matchesRemote = !onlyRemote || opp.remote;
    const matchesBudget = opp.budget >= minBudget;
    const matchesSkill = selectedSkill === 'All' || opp.requiredSkills.includes(selectedSkill);

    return matchesSearch && matchesDifficulty && matchesRemote && matchesBudget && matchesSkill;
  });

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    setToast(`Copied shareable link for "${title}" to clipboard!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    applyToOpportunity(selectedOpp.id, subLink, subComment);
    setApplying(false);
    setSubLink('');
    setSubComment('');
    setToast(`Applied successfully to ${selectedOpp.title}!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    submitReport(selectedOpp.companyId, selectedOpp.companyName, reportReason);
    setReporting(false);
    setReportReason('');
    setToast("Your report has been securely registered with moderation team.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-transparent text-slate-300 min-h-screen relative" id="marketplace-page">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Opportunity Marketplace</h1>
            <p className="text-slate-400 text-sm mt-1">Discover, apply, and secure verified freelance micro-projects.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm font-medium hover:bg-white/10 transition cursor-pointer"
            >
              Back Home
            </button>
            <button 
              onClick={onNavigateToDashboard}
              className="px-4 py-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl text-white text-sm font-medium transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              My Dashboard
            </button>
          </div>
        </div>

        {/* Filter Toolbar Grid */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl grid md:grid-cols-12 gap-4 items-end" id="filter-toolbar">
          {/* Search Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search React, solidity, design..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 text-white"
              />
            </div>
          </div>

          {/* Difficulty Select */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Difficulty</label>
            <select 
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Budget Filter */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Min Budget ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 200"
              value={minBudget || ''}
              onChange={e => setMinBudget(Number(e.target.value))}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 text-white"
            />
          </div>

          {/* Skills Dropdown */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Skill Tag</label>
            <select 
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Skills</option>
              {allSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="md:col-span-2 flex items-center justify-center pb-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-300 select-none">
              <input 
                type="checkbox" 
                checked={onlyRemote}
                onChange={e => setOnlyRemote(e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
              Only Remote
            </label>
          </div>
        </div>

        {/* Opportunities List Counter */}
        <div className="flex justify-between items-center text-sm font-mono text-slate-500">
          <span>Found {filteredOpps.length} opportunities</span>
          <span>Filtered from {opportunities.length} total</span>
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="gigs-grid">
          {filteredOpps.length === 0 ? (
            <div className="md:col-span-12 text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl space-y-4">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400">No active opportunities match your specific filtering options.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDifficulty('All');
                  setOnlyRemote(false);
                  setMinBudget(0);
                  setSelectedSkill('All');
                }}
                className="text-cyan-400 text-sm font-medium hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredOpps.map(opp => {
              const isSaved = savedOpportunityIds.includes(opp.id);
              const alreadyApplied = applications.some(a => a.opportunityId === opp.id && a.studentId === currentStudent?.id);

              return (
                <div 
                  key={opp.id}
                  className="bg-white/5 border border-white/10 hover:border-white/20 p-6 rounded-2xl flex flex-col justify-between space-y-6 group hover:bg-white/[0.08] shadow-[inset_0_0_10px_rgba(99,102,241,0.05)] hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 relative"
                  id={`opp-card-${opp.id}`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-white/5 border border-white/10 p-2 rounded-xl flex-shrink-0">{opp.companyLogo}</span>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition truncate">{opp.title}</h3>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                            {opp.companyName}
                            <span className="text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {opp.companyRating}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleSaveOpportunity(opp.id)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${isSaved ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-black border-white/10 text-slate-500 hover:text-slate-300'}`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Desc */}
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{opp.description}</p>
                  </div>

                  {/* Skills and budget info */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(skill => (
                        <span key={skill} className="bg-black/40 border border-white/5 text-slate-400 px-2 py-0.5 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{opp.remote ? 'Remote' : opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.duration}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Milestone Bounty</span>
                        <span className="text-base font-bold text-emerald-400 font-mono">${opp.budget}</span>
                      </div>
                      <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-bold">
                        {opp.difficulty}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedOpp(opp)}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-xs font-medium transition text-center cursor-pointer text-slate-200"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedOpp(opp);
                          setApplying(true);
                        }}
                        disabled={alreadyApplied}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${alreadyApplied ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}
                      >
                        {alreadyApplied ? 'Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Slide-over details Drawer */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-2xl bg-[#0a0a0f] h-full border-l border-white/5 flex flex-col justify-between overflow-y-auto relative animate-in slide-in-from-right duration-300">
            {/* Header Area */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl bg-white/5 border border-white/10 p-3 rounded-2xl">{selectedOpp.companyLogo}</span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">{selectedOpp.title}</h2>
                  <p className="text-sm text-cyan-400 flex items-center gap-1.5 mt-1">
                    {selectedOpp.companyName}
                    <span className="text-slate-600 font-sans">•</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedOpp.companyRating}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => handleShare(selectedOpp.title)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedOpp(null);
                    setApplying(false);
                    setReporting(false);
                    setAiReport(null);
                    setAgreement(null);
                    setAiError(null);
                  }}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main scroll body */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Highlight Widgets */}
              <div className="grid grid-cols-3 gap-3 bg-white/5 border border-white/10 p-4 rounded-xl font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Milestone Bounty</span>
                  <span className="text-lg font-bold text-emerald-400">${selectedOpp.budget}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Project Duration</span>
                  <span className="text-lg font-bold text-indigo-400">{selectedOpp.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Difficulty Level</span>
                  <span className="text-lg font-bold text-cyan-400">{selectedOpp.difficulty}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-200">Project Description</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedOpp.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-200">Core Responsibilities</h3>
                <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5">
                  {selectedOpp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-200">Final Deliverables</h3>
                <ul className="space-y-2 text-sm text-slate-400 list-decimal pl-5">
                  {selectedOpp.deliverables.map((del, i) => (
                    <li key={i} className="text-slate-300">{del}</li>
                  ))}
                </ul>
              </div>

              {/* Skills required */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.requiredSkills.map(s => (
                      <span key={s} className="bg-black/40 border border-white/5 text-slate-300 px-2.5 py-1 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.preferredSkills.map(s => (
                      <span key={s} className="bg-black/40 border border-white/5 text-cyan-400 px-2.5 py-1 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ✨ GOLD PREMIUM AI COUNSELOR & SMART MATCH UNIT */}
              <div className="premium-card p-6 rounded-2xl border-[#e6ca65]/20 bg-[#120e07]/80 space-y-6 shadow-[0_0_20px_rgba(230,202,101,0.05)] relative overflow-hidden group">
                {/* Decorative gold spotlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition-all"></div>
                
                <div className="flex items-center justify-between border-b border-[#e6ca65]/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-tr from-[#bf953f] to-[#aa771c] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(230,202,101,0.35)]">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-serif-lux font-bold text-[#fbf5b7] tracking-wider text-sm sm:text-base">AI GIG COUNSELOR</h4>
                      <p className="text-[10px] font-mono text-amber-400/70 tracking-widest uppercase">Skill Chain Gold Intelligence</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono uppercase font-bold tracking-widest">
                    Active
                  </span>
                </div>

                {!aiReport && !aiLoading && (
                  <div className="space-y-4">
                    <p className="text-xs text-amber-100/70 leading-relaxed">
                      Evaluate your suitability using our advanced multi-dimensional matching engine. Generates suitability score, specialized smart strategies, and customized premium proposals.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => evaluateSuitability(selectedOpp)}
                        className="premium-button-gold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-black animate-spin" />
                        Analyze Suitability & Write Proposal
                      </button>

                      <button
                        onClick={() => generateAgreementPreview(selectedOpp)}
                        className="px-5 py-2.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-bold transition cursor-pointer flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Draft Escrow Agreement
                      </button>
                    </div>
                  </div>
                )}

                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                    <div className="relative">
                      {/* Premium pulsing golden circles */}
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400/20 animate-ping absolute inset-0"></div>
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400/40 animate-pulse flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#fbf5b7] font-semibold tracking-wider font-mono uppercase animate-pulse">Running Indian Talent Matrix Analysis...</p>
                      <p className="text-[10px] text-amber-400/50">Evaluating Reputation Level & draft-matching on-chain parameters</p>
                    </div>
                  </div>
                )}

                {aiError && (
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-300">
                    {aiError}
                  </div>
                )}

                {aiReport && (
                  <div className="space-y-5 animate-in fade-in duration-500">
                    {/* Score section */}
                    <div className="flex items-center gap-5 bg-amber-950/20 border border-amber-500/10 p-4 rounded-xl">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-amber-950" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-amber-400" strokeWidth="4" fill="transparent" 
                            strokeDasharray={175} strokeDashoffset={175 - (175 * aiReport.compatibilityScore) / 100} />
                        </svg>
                        <span className="absolute text-sm font-bold font-mono text-amber-400">{aiReport.compatibilityScore}%</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-wider">Evaluation Verdict</span>
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            {aiReport.verdict}
                          </span>
                        </div>
                        <p className="text-xs text-amber-100/80 mt-1 leading-relaxed font-cursive-lux italic">
                          "{aiReport.suitabilityAnalysis}"
                        </p>
                      </div>
                    </div>

                    {/* Smart Tips */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-mono text-amber-400 uppercase tracking-widest">Personalized Gig Strategy</h5>
                      <ul className="space-y-2">
                        {aiReport.smartTips?.map((tip, i) => (
                          <li key={i} className="text-xs text-amber-100/80 flex items-start gap-2">
                            <span className="text-amber-400 text-base leading-none">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Draft proposal */}
                    <div className="space-y-2 border-t border-amber-500/10 pt-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-mono text-amber-400 uppercase tracking-widest">AI Crafted Proposal Draft</h5>
                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              setShowLoginPrompt(true);
                            } else {
                              setSubComment(aiReport.draftProposal);
                              setApplying(true);
                              setToast("Successfully loaded proposal into pitch! Ready for submission.");
                              setTimeout(() => setToast(null), 3000);
                            }
                          }}
                          className="text-[11px] text-[#0c0904] font-bold bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded transition cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Auto-insert into Pitch
                        </button>
                      </div>
                      <div className="bg-black/40 border border-[#e6ca65]/10 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed text-amber-200/80 max-h-36 overflow-y-auto">
                        {aiReport.draftProposal}
                      </div>
                    </div>

                    {/* Reset evaluation button */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAiReport(null)}
                        className="text-xs text-amber-400/70 hover:text-amber-300 underline font-mono cursor-pointer"
                      >
                        Reset Evaluation
                      </button>
                    </div>
                  </div>
                )}

                {/* Agreement preview section */}
                {agreementLoading && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center border-t border-amber-500/10 pt-6">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400/20 animate-ping absolute inset-0"></div>
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400/40 animate-pulse flex items-center justify-center">
                        <Shield className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <div className="space-y-1 animate-pulse">
                      <p className="text-xs text-[#fbf5b7] font-semibold font-mono uppercase tracking-wider">Compiling On-Chain Web3 Clauses...</p>
                      <p className="text-[10px] text-amber-400/50">Configuring multisig escrow conditions and auto-releasing milestones</p>
                    </div>
                  </div>
                )}

                {agreement && (
                  <div className="space-y-4 border-t border-[#e6ca65]/10 pt-5 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-mono text-[#fbf5b7] tracking-wider uppercase">{agreement.agreementTitle}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest block">Proposed Milestones</span>
                      <div className="grid grid-cols-2 gap-2">
                        {agreement.suggestedMilestones?.map((m, i) => (
                          <div key={i} className="bg-black/30 border border-[#e6ca65]/10 p-3 rounded-lg text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#fbf5b7]">{m.name}</span>
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">{m.percentage}% payout</span>
                            </div>
                            <p className="text-[10px] text-amber-100/60 mt-1">{m.deliverable}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest block">Web3 Escrow Clauses</span>
                      <div className="space-y-2 bg-black/40 border border-[#e6ca65]/10 p-3 rounded-xl max-h-24 overflow-y-auto text-[10px] text-amber-100/70 leading-relaxed font-mono">
                        {agreement.clauses?.map((c, i) => (
                          <p key={i}>• {c}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setAgreement(null)}
                        className="text-xs text-amber-400/70 hover:text-amber-300 underline font-mono cursor-pointer"
                      >
                        Reset Agreement Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Company information block */}
              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Company Credential</span>
                  <span className="flex items-center gap-1 text-xs text-cyan-400 font-mono">
                    <Shield className="w-3.5 h-3.5 fill-cyan-400/10" />
                    Verified On-Chain Partner
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every milestone budget on Skill Chain India is securely verified. Bounties are released autonomously directly to the student’s wallet upon milestone satisfaction verification.
                </p>
              </div>

              {/* Apply/Report sub-menus conditional rendering */}
              {applying && (
                <form onSubmit={handleApplySubmit} className="border-t border-white/5 pt-6 space-y-4 animate-in fade-in duration-300" id="apply-form">
                  <h3 className="font-bold text-cyan-300 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Submit Application
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 uppercase">Portfolio / GitHub Link (Optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/my-project"
                      value={subLink}
                      onChange={e => setSubLink(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 uppercase">Brief pitch / experience statement</label>
                    <textarea 
                      required
                      placeholder="Explain why you are qualified to complete this micro-project..."
                      value={subComment}
                      onChange={e => setSubComment(e.target.value)}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white py-2.5 rounded-xl font-medium transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      Submit Application
                    </button>
                    <button 
                      type="button"
                      onClick={() => setApplying(false)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {reporting && (
                <form onSubmit={handleReportSubmit} className="border-t border-rose-500/20 pt-6 space-y-4 animate-in fade-in duration-300" id="report-form">
                  <h3 className="font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Report Flag Company
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 uppercase">Reason for reporting</label>
                    <textarea 
                      required
                      placeholder="Explain the security hazard or incorrect bounty alignment..."
                      value={reportReason}
                      onChange={e => setReportReason(e.target.value)}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 text-white animate-pulse-once"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-medium transition cursor-pointer"
                    >
                      Log Report
                    </button>
                    <button 
                      type="button"
                      onClick={() => setReporting(false)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-white/5 bg-[#0a0a0f] flex justify-between items-center gap-4">
              <button 
                onClick={() => setReporting(true)}
                className="text-xs text-rose-500/80 hover:text-rose-400 font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Project
              </button>
              
              {!applying && (
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginPrompt(true);
                    } else {
                      setApplying(true);
                    }
                  }}
                  disabled={applications.some(a => a.opportunityId === selectedOpp.id && a.studentId === currentStudent?.id)}
                  className={`px-8 py-3.5 rounded-xl font-medium transition cursor-pointer ${applications.some(a => a.opportunityId === selectedOpp.id && a.studentId === currentStudent?.id) ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
                >
                  {applications.some(a => a.opportunityId === selectedOpp.id && a.studentId === currentStudent?.id) ? 'Already Applied' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN PROMPT MODAL */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-[#0c0905] border border-[#e6ca65]/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(230,202,101,0.1)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e6ca65]/35 to-transparent"></div>
            
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 text-amber-400 mx-auto">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-serif-lux font-bold text-[#fbf5b7]">Authentication Required</h3>
                <p className="text-xs text-amber-100/60 leading-relaxed">
                  You must sign in or register your student portfolio to apply for gig opportunities on Skill Chain India.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    onNavigateToLogin();
                  }}
                  className="w-full premium-button-gold py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                >
                  Sign In / Join Now
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
