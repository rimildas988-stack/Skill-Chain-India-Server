import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lightbulb, Plus, ThumbsUp, MessageSquare, UserPlus, Users, HelpCircle, Code, Cpu, Palette, Search, Sparkles, Send, X } from 'lucide-react';
import { InnovationIdea } from '../types';

interface InnovationHubProps {
  onBackToHome: () => void;
  onNavigateToStudent: (id: string) => void;
}

export const InnovationHub: React.FC<InnovationHubProps> = ({ onBackToHome, onNavigateToStudent }) => {
  const { 
    ideas, 
    students, 
    createIdea, 
    voteOnIdea, 
    joinIdeaTeam, 
    addCommentToIdea,
    currentStudent 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hub' | 'finder'>('hub');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Idea Creation Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<InnovationIdea['category']>('Programming');
  const [coFoundersNeeded, setCoFoundersNeeded] = useState(false);

  // Active Idea Comments Panel
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Team Finder Selected Skills
  const [finderSkills, setFinderSkills] = useState<string[]>([]);

  // User notifications / feedback toast
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const categories: InnovationIdea['category'][] = ['Programming', 'UI/UX', 'Blockchain', 'AI', 'Marketing', 'Business', 'Other'];

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) {
      setErrorMessage("Please sign in as a student to pitch startup concepts!");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    if (!newTitle || !newDesc) return;
    createIdea(newTitle, newDesc, newCategory, coFoundersNeeded);
    
    // Reset
    setNewTitle('');
    setNewDesc('');
    setCoFoundersNeeded(false);
    setShowCreateModal(false);
  };

  const handleVote = (ideaId: string) => {
    if (!currentStudent) {
      setErrorMessage("Please sign in as a student to upvote and support startup ideas!");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    voteOnIdea(ideaId);
  };

  const handleJoinTeam = (ideaId: string) => {
    if (!currentStudent) {
      setErrorMessage("Please sign in as a student to join startup teams!");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    joinIdeaTeam(ideaId);
  };

  const handlePostComment = (ideaId: string) => {
    if (!currentStudent) {
      setErrorMessage("Please sign in as a student to review and comment!");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    if (!commentText) return;
    addCommentToIdea(ideaId, commentText);
    setCommentText('');
  };

  // Filter ideas by category
  const filteredIdeas = selectedCategory === 'All' 
    ? ideas 
    : ideas.filter(i => i.category === selectedCategory);

  // Team Finder matching logic
  // Returns students who possess at least one of the selected skills
  const matchedStudents = students.filter(student => {
    if (student.id === 'student-current') return false; // exclude self
    if (finderSkills.length === 0) return true; // show all other students if no filter selected
    return finderSkills.every(skill => student.skills.includes(skill));
  });

  const availableFinderSkills = Array.from(new Set(students.flatMap(s => s.skills))) as string[];

  const toggleFinderSkill = (skill: string) => {
    setFinderSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="bg-transparent text-slate-300 min-h-screen pb-16" id="innovation-page">
      {/* Top Hero Header */}
      <div className="bg-white/5 border-b border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-white">
              <Lightbulb className="w-8 h-8 text-cyan-400 animate-pulse" />
              Open Innovation Hub
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Pitch concepts, secure transparent voting points on Polygon, and utilize our SkillPass alignment to find co-founders.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm font-medium hover:bg-white/10 transition cursor-pointer"
            >
              Back Home
            </button>
            <button 
              onClick={() => {
                if (!currentStudent) {
                  setErrorMessage("Please sign in as a student to pitch startup concepts!");
                  setTimeout(() => setErrorMessage(null), 4000);
                  return;
                }
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl text-white text-sm font-medium transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Plus className="w-4 h-4" />
              Pitch Idea
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-white/5 pb-4">
          <button 
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2 text-sm font-medium transition flex items-center gap-2 cursor-pointer ${activeTab === 'hub' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Users className="w-4 h-4" />
            Concepts & Submissions
          </button>
          <button 
            onClick={() => setActiveTab('finder')}
            className={`px-4 py-2 text-sm font-medium transition flex items-center gap-2 cursor-pointer ${activeTab === 'finder' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Code className="w-4 h-4" />
            Web3 Team Finder
          </button>
        </div>

        {/* HUB SUBSECTION */}
        {activeTab === 'hub' && (
          <div className="grid lg:grid-cols-12 gap-8 mt-8">
            
            {/* Left sidebar: categories */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Focus Categories</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${selectedCategory === 'All' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${selectedCategory === cat ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voting Reward Box */}
              <div className="bg-gradient-to-br from-cyan-950/10 to-indigo-950/10 border border-cyan-500/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="font-bold text-xs font-mono tracking-widest uppercase">Reputation Loop</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Earn points! You get <span className="text-cyan-300 font-bold">+15 points</span> for pitching an idea, <span className="text-indigo-400 font-bold">+5 points</span> for every vote received, and <span className="text-slate-300 font-bold">+2 points</span> for community reviews.
                </p>
              </div>
            </div>

            {/* Middle: Ideas Feed */}
            <div className="lg:col-span-9 space-y-6">
              {filteredIdeas.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-slate-500">No startup proposals are currently published in this division.</p>
                </div>
              ) : (
                filteredIdeas.map(idea => {
                  const hasVoted = currentStudent && idea.votedUserIds.includes(currentStudent.id);
                  const isCreator = currentStudent && idea.creatorId === currentStudent.id;

                  return (
                    <div 
                      key={idea.id}
                      className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-5"
                      id={`idea-card-${idea.id}`}
                    >
                      {/* Idea Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide">
                            {idea.category}
                          </span>
                          <h3 className="text-xl font-bold text-slate-100">{idea.title}</h3>
                          
                          <div className="flex items-center gap-2 pt-1">
                            <img 
                              src={idea.creatorAvatar} 
                              alt={idea.creatorName} 
                              className="w-5 h-5 rounded-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-xs text-slate-400">
                              By <span className="text-slate-300 hover:underline cursor-pointer" onClick={() => onNavigateToStudent(idea.creatorId)}>{idea.creatorName}</span>
                            </p>
                          </div>
                        </div>

                        {/* Vote Counter Badge (Top Right) */}
                        <button 
                          onClick={() => handleVote(idea.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${hasVoted ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-black border-white/10 text-slate-500 hover:text-slate-300'}`}
                          title="Community Upvote"
                        >
                          <ThumbsUp className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
                          <span className="text-sm font-bold font-mono mt-1">{idea.votesCount}</span>
                        </button>
                      </div>

                      {/* Desc */}
                      <p className="text-sm text-slate-400 leading-relaxed">{idea.description}</p>

                      {/* CoFounder Alignment */}
                      {idea.coFoundersNeeded && (
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs text-indigo-400">
                            <Users className="w-4 h-4" />
                            <span>Team co-founders needed! Requires: {idea.creatorSkills.join(', ')}</span>
                          </div>
                          {!isCreator && !idea.coFoundersJoined.includes(currentStudent?.id || '') ? (
                            <button 
                              onClick={() => handleJoinTeam(idea.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                            >
                              Join Team
                            </button>
                          ) : (
                            <span className="text-xs font-mono text-slate-500 italic">
                              {isCreator ? 'You are the founder' : 'Joined Team'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action buttons: comments & Community Upvote button */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <button 
                            onClick={() => setActiveIdeaId(activeIdeaId === idea.id ? null : idea.id)}
                            className="text-slate-400 hover:text-white flex items-center gap-2 transition cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-cyan-400/80" />
                            <span>Comments ({idea.comments.length})</span>
                          </button>

                          <button 
                            onClick={() => handleVote(idea.id)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition cursor-pointer font-semibold ${
                              hasVoted 
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 hover:border-white/20'
                            }`}
                            id={`community-upvote-${idea.id}`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current text-cyan-400' : ''}`} />
                            <span>Community Upvote</span>
                            <span className="bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded font-mono text-[10px]">
                              {idea.votesCount || 0}
                            </span>
                          </button>
                        </div>
                        <span className="text-slate-600 font-mono text-[10px] hidden sm:inline">Published {idea.createdAt}</span>
                      </div>

                      {/* Comment panel expansion */}
                      {activeIdeaId === idea.id && (
                        <div className="space-y-4 border-t border-white/5 pt-4 animate-in fade-in duration-200">
                          {/* Comments list */}
                          <div className="space-y-3">
                            {idea.comments.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to analyze this pitch!</p>
                            ) : (
                              idea.comments.map(c => (
                                <div key={c.id} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <img src={c.authorAvatar} alt={c.authorName} className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                                    <span className="font-bold text-xs text-slate-300">{c.authorName}</span>
                                    <span className="text-[10px] text-slate-600 font-mono">{c.createdAt}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{c.text}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Post comment input */}
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Offer feedback, recommendations, or co-founding ideas..."
                              value={commentText}
                              onChange={e => setCommentText(e.target.value)}
                              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                            />
                            <button 
                              onClick={() => handlePostComment(idea.id)}
                              className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl transition cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TEAM FINDER SUBSECTION */}
        {activeTab === 'finder' && (
          <div className="space-y-8 mt-8">
            {/* Finder Introduction */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  Synergy Auto-Teammate Recommender
                </h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  Select key development or design skills to instantly filter high-reputation student profiles ready to collaborate.
                </p>
              </div>
            </div>

            {/* Filter skills select area */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Select Skill Alignment</h4>
              <div className="flex flex-wrap gap-2">
                {availableFinderSkills.map(skill => {
                  const selected = finderSkills.includes(skill);
                  return (
                    <button 
                      key={skill}
                      onClick={() => toggleFinderSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${selected ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedStudents.map(student => (
                <div 
                  key={student.id}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-white/20 transition duration-300"
                >
                  <div className="flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-slate-200 hover:text-cyan-300 transition cursor-pointer" onClick={() => onNavigateToStudent(student.id)}>
                        {student.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{student.school}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono py-2.5 border-y border-white/5">
                    <div>
                      <span className="text-slate-500 block">Reputation</span>
                      <span className="font-bold text-slate-300">{student.reputation} pts</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Experience</span>
                      <span className="font-bold text-slate-300">{student.completedProjectsCount} projects</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map(s => (
                        <span key={s} className="bg-black/40 text-slate-400 px-2 py-0.5 rounded text-[10px] border border-white/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigateToStudent(student.id)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-xs font-medium text-slate-300 transition cursor-pointer"
                  >
                    View SkillPass Credentials
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Concept pitch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 w-full max-w-lg p-6 rounded-3xl space-y-6 relative animate-in zoom-in-95 duration-200 text-slate-300">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 text-slate-300">
              <h3 className="text-xl font-bold text-white">Pitch Startup/Hackathon Concept</h3>
              <p className="text-xs text-slate-400">Your pitch receives community voting weight mapped to your SkillPass score.</p>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Idea Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Decentralized Proof-of-Skill protocol"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Division Category</label>
                <select 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as InnovationIdea['category'])}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Concept summary & technology stack</label>
                <textarea 
                  required
                  placeholder="Explain the problem statement and technical architecture in detail..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="cofound"
                  checked={coFoundersNeeded}
                  onChange={e => setCoFoundersNeeded(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
                <label htmlFor="cofound" className="text-xs text-slate-300 cursor-pointer select-none">
                  Actively recruiting co-founders (Web3 Team Finder integration)
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Publish Pitch
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating feedback notification toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a0a0f]/90 border border-rose-500/30 text-rose-300 px-5 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.15)] flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
          <span className="text-sm font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white ml-2 text-xs">✕</button>
        </div>
      )}

    </div>
  );
};
