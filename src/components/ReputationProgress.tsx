import React from 'react';
import { Award, Zap, TrendingUp } from 'lucide-react';

interface ReputationProgressProps {
  reputation: number;
  variant?: 'compact' | 'full';
}

export interface RankInfo {
  currentRankName: string;
  nextRankName: string;
  minRep: number;
  maxRep: number;
  progressPercent: number;
  pointsNeeded: number;
  badgeColor: string;
}

export const getRankInfo = (reputation: number): RankInfo => {
  const levels = [
    { name: 'Novice Builder', min: 0, max: 100, badgeColor: 'from-slate-550 to-slate-400' },
    { name: 'Rising Talent', min: 100, max: 250, badgeColor: 'from-emerald-400 to-teal-500' },
    { name: 'Top Contributor', min: 250, max: 450, badgeColor: 'from-cyan-400 to-blue-500' },
    { name: 'Web3 Master', min: 450, max: 700, badgeColor: 'from-indigo-400 to-purple-500' },
    { name: 'Ecosystem Legend', min: 700, max: 1000, badgeColor: 'from-amber-400 to-orange-500' },
  ];

  let currentLevelIdx = levels.length - 1;
  for (let i = 0; i < levels.length; i++) {
    if (reputation < levels[i].max) {
      currentLevelIdx = i;
      break;
    }
  }

  const currentLevel = levels[currentLevelIdx];
  const isMaxLevel = currentLevelIdx === levels.length - 1;

  if (isMaxLevel) {
    return {
      currentRankName: currentLevel.name,
      nextRankName: 'Ultimate Architect',
      minRep: currentLevel.min,
      maxRep: currentLevel.max,
      progressPercent: 100,
      pointsNeeded: 0,
      badgeColor: currentLevel.badgeColor,
    };
  }

  const nextLevel = levels[currentLevelIdx + 1];
  const range = currentLevel.max - currentLevel.min;
  const currentProgress = reputation - currentLevel.min;
  const progressPercent = Math.min(Math.max((currentProgress / range) * 100, 0), 100);
  const pointsNeeded = currentLevel.max - reputation;

  return {
    currentRankName: currentLevel.name,
    nextRankName: nextLevel.name,
    minRep: currentLevel.min,
    maxRep: currentLevel.max,
    progressPercent,
    pointsNeeded,
    badgeColor: currentLevel.badgeColor,
  };
};

export const ReputationProgress: React.FC<ReputationProgressProps> = ({ reputation, variant = 'full' }) => {
  const {
    currentRankName,
    nextRankName,
    maxRep,
    progressPercent,
    pointsNeeded,
    badgeColor
  } = getRankInfo(reputation);

  if (variant === 'compact') {
    return (
      <div className="space-y-3.5 bg-black/40 border border-white/5 p-4 rounded-2xl" id="reputation-progress-compact">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-400">RANK LEVEL</span>
          <span className={`bg-gradient-to-r ${badgeColor} bg-clip-text text-transparent font-bold font-sans uppercase tracking-wider`}>
            {currentRankName}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="relative">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>{reputation} / {maxRep} PTS</span>
          {pointsNeeded > 0 ? (
            <span>{pointsNeeded} PTS TO {nextRankName.toUpperCase()}</span>
          ) : (
            <span>MAX RANK</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm" id="reputation-progress-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
              <Award className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Reputation Progression</span>
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Rank: {currentRankName}
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-500/10">
                  {reputation} PTS
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlocking trust on the Polygon blockchain. Your reputation score reflects verified on-chain completions, peer feedback, and active submissions.
          </p>
        </div>

        <div className="flex-1 w-full md:max-w-md space-y-3 bg-black/30 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-end text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">Current Rank Progress</span>
              <span className="text-white font-bold">{Math.round(progressPercent)}% completed</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">Target: {nextRankName}</span>
              <span className="text-indigo-400 font-mono font-semibold">{maxRep} PTS</span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative">
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Ambient track glow */}
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-sm -z-10 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>
              {pointsNeeded > 0 ? (
                <>
                  Earn <strong className="text-cyan-400">{pointsNeeded} more points</strong> to level up to <strong className="text-indigo-400">{nextRankName}</strong>.
                </>
              ) : (
                <>You have achieved the ultimate elite ecosystem rank!</>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
