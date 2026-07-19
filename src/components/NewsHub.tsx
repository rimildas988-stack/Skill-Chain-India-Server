import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  Globe, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Terminal, 
  ExternalLink, 
  RefreshCw, 
  BrainCircuit, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  relevance?: string;
}

export const NewsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'freelance' | 'india' | 'smart-contracts'>('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Custom Grounding Query State
  const [customQuery, setCustomQuery] = useState<string>('');
  const [customResponse, setCustomResponse] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState<boolean>(false);

  // Fetch grounded news based on active category
  const fetchNews = async (cat: typeof activeCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ai/news?category=${cat}`);
      if (!response.ok) {
        throw new Error('Failed to download Web3 intelligence.');
      }
      const data = await response.json();
      setNews(data.news || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while synchronizing news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  // Handle Custom Grounding Query Submission
  const handleCustomQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setCustomLoading(true);
    setCustomResponse(null);

    try {
      // Prompt with strict formatting instructions and use of chatbot/api endpoints
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please use your real-time Google Search grounding tools to look up the following request and give an accurate answer for 2026: "${customQuery}". Offer 3 actionable, highly valuable bullet points for student developer careers or building portfolios.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Intelligence downlink timed out.');
      }

      const data = await response.json();
      setCustomResponse(data.content || 'No response returned from the news brain.');
    } catch (err: any) {
      setCustomResponse(`Decryption Failed: ${err.message || 'The Google Search Grounding service is currently busy. Please try again soon.'}`);
    } finally {
      setCustomLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Global Web3 Feed', desc: 'Consolidated blockchain news' },
    { id: 'freelance', name: 'Gig Trends & Remote Jobs', desc: 'Freelance gig insights & rates' },
    { id: 'india', name: 'Web3 India Hub', desc: 'Indian ecosystem & startup policy' },
    { id: 'smart-contracts', name: 'Solidity & Security Updates', desc: 'EVM developments, bugs, and audits' }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" id="web3-news-hub-root">
      
      {/* Background Decorative Atmosphere */}
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Elegant Header Block */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-500/10 pb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 mb-3 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GOOGLE SEARCH GROUNDED INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-lux font-black tracking-widest text-[#fbf5b7] flex items-center justify-center md:justify-start gap-3">
            <Newspaper className="w-8 h-8 text-amber-400" />
            WEB3 NEWS INTELLIGENCE
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Stay ahead of the curve. Dynamically queries real-time Google search indices to deliver the most accurate, up-to-date industry updates, gig trends, and smart contract security breakthroughs.
          </p>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
          <button 
            onClick={() => fetchNews(activeCategory)}
            disabled={loading}
            className="px-4 py-2.5 bg-[#120e07] border border-[#e6ca65]/20 hover:border-amber-400/50 rounded-xl text-xs font-semibold text-amber-200/90 flex items-center gap-2 transition cursor-pointer hover:bg-amber-500/5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh Downlink
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Category Tabs & Custom Terminal Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0c0905]/80 border border-[#e6ca65]/15 rounded-3xl p-5 backdrop-blur-xl shadow-lg">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400/80 mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              INTELLIGENCE CHANNELS
            </h2>

            <div className="space-y-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-250 cursor-pointer flex flex-col gap-0.5 ${
                    activeCategory === cat.id
                      ? 'bg-amber-500/10 border-amber-400/55 text-white shadow-[0_0_15px_rgba(230,202,101,0.06)]'
                      : 'bg-transparent border-white/5 text-slate-400 hover:border-amber-500/15 hover:text-amber-100/90 hover:bg-amber-500/5'
                  }`}
                >
                  <span className={`text-xs font-bold ${activeCategory === cat.id ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {cat.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Live Grounding Terminal */}
          <div className="bg-[#0a0704]/90 border border-[#e6ca65]/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              LIVE NEWS RADAR (GROUNDED)
            </h2>
            <p className="text-[11px] text-slate-400 mb-4">
              Enter any current topic (e.g., Ethereum gas trends, Solang Solidity, remote gig regulations) to retrieve grounded live intelligence.
            </p>

            <form onSubmit={handleCustomQuerySubmit} className="space-y-3.5">
              <div className="relative rounded-xl border border-white/10 bg-[#120e07] focus-within:border-amber-400/50 transition">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="h-4 w-4 text-amber-500/60" />
                </div>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask for real-time news..."
                  className="block w-full pl-10 pr-4 py-3 bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={customLoading || !customQuery.trim()}
                className="w-full premium-button-gold py-2.5 px-4 rounded-xl text-[11px] font-bold font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98] disabled:opacity-40"
              >
                {customLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    QUERYING GOOGLE ENGINE...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3.5 h-3.5 text-black" />
                    RETRIEVE LIVE FEED
                  </>
                )}
              </button>
            </form>

            {/* Custom Grounding Response Box */}
            {customResponse && (
              <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-60 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Drago AI Grounded Analysis</span>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {customResponse}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Primary News Feed display */}
        <div className="lg:col-span-8">
          
          {loading ? (
            // Shimmer / Loading State
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="p-6 bg-[#0c0905]/40 border border-white/5 rounded-3xl space-y-3.5 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-28 bg-white/10 rounded-full"></div>
                    <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-white/10 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-full bg-white/5 rounded-full"></div>
                    <div className="h-3.5 w-5/6 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-rose-950/15 border border-rose-500/20 rounded-3xl space-y-3">
              <span className="text-amber-500/80 font-mono text-sm block">INTELLIGENCE OFFLINE</span>
              <p className="text-slate-400 text-xs">{error}</p>
              <button 
                onClick={() => fetchNews(activeCategory)}
                className="px-4 py-2 bg-amber-500/10 border border-amber-500/35 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs transition cursor-pointer"
              >
                Attempt Retry
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="p-12 text-center bg-white/5 border border-white/5 rounded-3xl">
              <span className="text-slate-400 text-xs block">No news feed is currently available for this channel.</span>
            </div>
          ) : (
            // News Feed Cards
            <div className="space-y-4">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="bg-[#0d0a06]/90 border border-[#e6ca65]/15 hover:border-amber-400/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(230,202,101,0.03)] group"
                >
                  {/* Meta tag, date & source */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider flex items-center gap-1 uppercase">
                        <Globe className="w-3 h-3" />
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                      <Calendar className="w-3.5 h-3.5 text-amber-500/50" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif-lux font-bold text-[#fbf5b7] group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                    {item.summary}
                  </p>

                  {/* AI Relevance Breakdown */}
                  {item.relevance && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 flex gap-2.5 items-start">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                          Ecosystem Impact Analysis
                        </span>
                        <p className="text-[11px] text-amber-100/70 leading-relaxed">
                          {item.relevance}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Open Source Article Link */}
                  {item.url && (
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-400 text-[11px] font-semibold transition cursor-pointer"
                      >
                        Explore Grounding Source
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}

              <div className="p-4 bg-amber-500/[0.02] border border-dashed border-amber-500/25 rounded-3xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-mono uppercase text-amber-400/80">Continuous Search Sync Active</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Next validation: Automated on navigation</span>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
