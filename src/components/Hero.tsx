import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Shield, Award, Users, Briefcase, DollarSign, ArrowUpRight, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SovereignLedgerTicker } from './SovereignLedgerTicker';

interface HeroProps {
  onNavigate: (view: 'marketplace' | 'student-dashboard' | 'company-dashboard' | 'innovation-hub') => void;
  onSelectStudent: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSelectStudent }) => {
  const { opportunities, students, companies } = useApp();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const featuredOpps = opportunities.slice(0, 3);
  const featuredStudents = students.slice(0, 3);

  const faqs = [
    {
      q: "How does the blockchain identity/SkillPass work?",
      a: "Every project you complete, credential you earn, or skill verified by a company gets hashed and stamped on the Polygon Amoy blockchain. This creates a secure, tamper-proof, public 'SkillPass' portfolio that employers can verify instantly."
    },
    {
      q: "Can minors use this platform to earn money?",
      a: "Yes! Students under 18 can participate with simplified parental consent logs built into the wallet alignment. It gives young builders a chance to secure real-world experience early."
    },
    {
      q: "What payment methods are supported?",
      a: "Companies can fund milestone bounties using standard fiat rails (Stripe, Razorpay) or instantly via secure Web3 crypto smart contract escrows on Polygon."
    },
    {
      q: "How does the Community Voting system work?",
      a: "Students can post start-up ideas or hackathon entries in the Innovation Hub. The community votes on submissions transparently. Points are translated automatically into student reputation upgrades."
    }
  ];

  return (
    <div className="bg-transparent text-slate-300 min-h-screen relative overflow-hidden" id="hero-page">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="hero-section">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-300 text-sm font-mono tracking-wide shadow-[0_0_15px_rgba(230,202,101,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Empowering the Next Generation of Builders in India
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-none"
          >
            Turn Your Skills Into <br className="hidden sm:inline" />
            <span className="gold-text-shimmer font-serif-lux font-black italic block mt-2 text-5xl sm:text-8xl">On-Chain Gold</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-amber-100/70 font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Find premium micro-projects, Web3 internships, and high-converting gigs. Build your elite on-chain reputation and verify your credentials using Gemini intelligence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => onNavigate('student-dashboard')}
              className="w-full sm:w-auto premium-button-gold px-8 py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer group"
              id="get-started-btn"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-black" />
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="w-full sm:w-auto bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 text-amber-400 font-medium px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              id="browse-projects-btn"
            >
              Browse Projects
              <Briefcase className="w-5 h-5 text-amber-400" />
            </button>
          </motion.div>
        </div>

        {/* Dynamic Trust badging & Floating Polygon elements */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 border-t border-white/5 pt-12" id="statistics-grid">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active Talents</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">12,450+</p>
            <p className="text-xs text-slate-500 mt-1">Students worldwide</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Verified Partners</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">420+</p>
            <p className="text-xs text-slate-500 mt-1">Startups & scaleups</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Credentials Issued</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">8,900+</p>
            <p className="text-xs text-slate-500 mt-1">Polygon Amoy hashes</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Bounties Distributed</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">$340K+</p>
            <p className="text-xs text-slate-500 mt-1">Prompt smart escrow payouts</p>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="bg-white/[0.02] border-y border-white/5 py-12 px-4" id="partners-section">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Vetted & Supported by Industry Leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-bold tracking-wider text-slate-300">⚡ SOLV AI LABS</span>
            <span className="text-xl font-bold tracking-wider text-slate-300">🪐 BLOCKFLOW</span>
            <span className="text-xl font-bold tracking-wider text-slate-300">🎨 VERISIGN MEDIA</span>
            <span className="text-xl font-bold tracking-wider text-slate-300">💎 POLYGON</span>
          </div>
        </div>
      </section>

      {/* Latest Opportunities Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="opportunities-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Latest High-Yield Opportunities</h2>
            <p className="text-slate-400 max-w-xl">Apply for real, funded micro-projects. Every job releases payment instantly upon approval.</p>
          </div>
          <button 
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-305 font-medium transition cursor-pointer"
          >
            Explore Marketplace
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpps.map(opp => (
            <div 
              key={opp.id}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 hover:bg-white/[0.08] shadow-[inset_0_0_10px_rgba(99,102,241,0.05)] hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-white/5 border border-white/10 p-2.5 rounded-xl">{opp.companyLogo}</span>
                    <div>
                      <h4 className="font-semibold text-slate-200 group-hover:text-cyan-300 transition">{opp.title}</h4>
                      <p className="text-xs text-slate-400">{opp.companyName}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-emerald-500/20">
                    ${opp.budget}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{opp.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  {opp.requiredSkills.map(skill => (
                    <span key={skill} className="bg-black/40 border border-white/5 text-slate-300 px-2 py-0.5 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Duration: {opp.duration}</span>
                  <span className="text-indigo-400 font-mono">{opp.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Student Builders */}
      <section className="bg-white/[0.01] border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8" id="leaderboard-preview-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">Top Student Talent</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Browse verified profiles, on-chain credential hashes, and completed projects log.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {featuredStudents.map((student, idx) => (
              <div 
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center space-y-4 hover:bg-white/[0.08] transition duration-300 cursor-pointer relative group"
              >
                <div className="absolute top-4 left-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  #{idx + 1}
                </div>
                
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition" 
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1">
                  <h4 className="font-semibold text-lg text-slate-100 group-hover:text-cyan-300 transition flex items-center justify-center gap-1.5">
                    {student.name}
                    {student.walletAddress && <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/10" />}
                  </h4>
                  <p className="text-xs text-slate-400">{student.school}</p>
                </div>

                <div className="flex justify-center gap-6 py-2 border-y border-white/5 font-mono text-xs">
                  <div>
                    <span className="block text-slate-500">Reputation</span>
                    <span className="font-bold text-slate-200">{student.reputation} pts</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Completed</span>
                    <span className="font-bold text-slate-200">{student.completedProjectsCount} gigs</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {student.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-black/40 text-slate-400 px-2 py-0.5 rounded text-[10px] font-medium border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sovereign Consensus Ledger Ticker Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="live-ledger-section">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(230,202,101,0.7)]"></span>
              Live Cryptographic Credentials Stream
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Real-time audit of talent milestones, sovereign digital pass hashes, and escrow settlements validated across India.
            </p>
          </div>
          <SovereignLedgerTicker />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12" id="faq-section">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="w-7 h-7 text-cyan-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">Everything you need to know about starting your decentralized journey.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] transition duration-200"
            >
              <button 
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/[0.02] transition cursor-pointer"
              >
                <span className="font-semibold text-slate-100">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${faqOpen === index ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>
              {faqOpen === index && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 text-center text-slate-500 text-sm font-sans" id="footer-section">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-wider text-white">SKILL CHAIN <span className="text-amber-400 font-mono text-lg">INDIA</span></span>
          </div>
          <p>© 2026 Skill Chain India. Built securely on the Polygon network.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
