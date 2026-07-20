import React, { useEffect, useState } from 'react';
import { Terminal, ShieldCheck, Cpu, Database, Server, Radio, ArrowUpRight, CheckCircle } from 'lucide-react';

interface LedgerEvent {
  id: string;
  timestamp: string;
  block: number;
  node: string;
  type: 'credential' | 'escrow' | 'consensus' | 'reputation';
  hash: string;
  message: string;
  gas: number;
}

const indianCities = ['Bengaluru', 'Mumbai', 'Pune', 'Noida', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

export const SovereignLedgerTicker: React.FC = () => {
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'credentials' | 'escrows'>('all');
  const [blockNumber, setBlockNumber] = useState(14892410);
  const [activeNodes, setActiveNodes] = useState(512);

  // Helper to generate a random mock transaction hash
  const genHash = () => {
    const chars = '0123456789abcdef';
    let res = '0x';
    for (let i = 0; i < 8; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res + '...' + res.substring(2, 6);
  };

  // Helper to construct a plausible event
  const createRandomEvent = (blockNum: number): LedgerEvent => {
    const types: LedgerEvent['type'][] = ['credential', 'escrow', 'consensus', 'reputation'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const nodeCity = indianCities[Math.floor(Math.random() * indianCities.length)];
    const nodeNum = Math.floor(Math.random() * 24) + 1;
    
    let message = '';
    switch (chosenType) {
      case 'consensus':
        message = `Consensus achieved in 1.4s by validator node #${nodeNum} (${nodeCity})`;
        break;
      case 'credential':
        const skills = ['React Dev', 'Solidity Smart Contracts', 'Gemini Multi-Agent API', 'Rust WASM', 'PostgreSQL Sync'];
        message = `Skill Pass hash updated for verified credential: "${skills[Math.floor(Math.random() * skills.length)]}"`;
        break;
      case 'escrow':
        const amounts = [120, 250, 400, 750, 1500];
        message = `$${amounts[Math.floor(Math.random() * amounts.length)]} escrow released to builder student-${Math.floor(Math.random() * 8) + 1}`;
        break;
      case 'reputation':
        message = `Reputation boosted +${Math.floor(Math.random() * 15) + 5} points for decentralized portfolio audit`;
        break;
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      block: blockNum,
      node: `${nodeCity}-Validator-${String(nodeNum).padStart(2, '0')}`,
      type: chosenType,
      hash: genHash(),
      message,
      gas: Math.floor(Math.random() * 12) + 22, // 22-34 gwei
    };
  };

  // Seed initial events
  useEffect(() => {
    let currBlock = blockNumber;
    const initial: LedgerEvent[] = [];
    for (let i = 0; i < 5; i++) {
      initial.unshift(createRandomEvent(currBlock - i));
    }
    setEvents(initial);
  }, []);

  // Poll for new live ledger actions
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(prev => {
        const nextBlock = prev + 1;
        // Chance to change node counts slightly
        setActiveNodes(nodes => nodes + (Math.random() > 0.5 ? 1 : -1));

        setEvents(currentEvents => {
          const newEv = createRandomEvent(nextBlock);
          // Keep max 15 events in cache
          return [newEv, ...currentEvents.slice(0, 14)];
        });

        return nextBlock;
      });
    }, 4500 + Math.random() * 4000); // realistic ticking interval

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(ev => {
    if (activeTab === 'all') return true;
    if (activeTab === 'credentials') return ev.type === 'credential' || ev.type === 'reputation';
    if (activeTab === 'escrows') return ev.type === 'escrow';
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-[#110c06] to-[#080603] border border-[#e6ca65]/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Glow lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 bottom-0 w-44 h-44 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header and Live Status Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif-lux font-bold text-amber-200 tracking-wider text-sm flex items-center gap-2">
              Sovereign Ledger Consensus Engine
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h4>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE TAMPER-PROOF STATE LOGGER</p>
          </div>
        </div>

        {/* Live Network Telemetry */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-400 bg-black/50 border border-white/5 px-3.5 py-1.5 rounded-2xl">
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-3.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Block:</span>
            <span className="text-white font-bold">{blockNumber}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sovereign Nodes:</span>
            <span className="text-white font-bold">{activeNodes} (🇮🇳 Active)</span>
          </div>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {(['all', 'credentials', 'escrows'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1 px-2.5 rounded-lg text-[10px] font-mono tracking-widest uppercase border transition cursor-pointer ${
                activeTab === tab 
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold' 
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>REAL-TIME SECURE POLLED</span>
        </div>
      </div>

      {/* Simulated Live Ledger Rows */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 select-none">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">No matching ledger receipts available.</div>
        ) : (
          filteredEvents.map((ev, idx) => (
            <div 
              key={ev.id} 
              className={`bg-black/35 hover:bg-black/55 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-4 transition duration-200 animate-in fade-in slide-in-from-top-4 ${idx === 0 ? 'border-amber-400/25 ring-1 ring-amber-400/5' : ''}`}
            >
              {/* Event Type badge */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                  ev.type === 'consensus' ? 'bg-cyan-500/5 text-cyan-400 border-cyan-500/15' :
                  ev.type === 'credential' ? 'bg-amber-500/5 text-amber-400 border-amber-500/15' :
                  ev.type === 'reputation' ? 'bg-purple-500/5 text-purple-400 border-purple-500/15' :
                  'bg-emerald-500/5 text-emerald-400 border-emerald-500/15'
                }`}>
                  {ev.type === 'consensus' && <Server className="w-4 h-4" />}
                  {ev.type === 'credential' && <ShieldCheck className="w-4 h-4" />}
                  {ev.type === 'reputation' && <CheckCircle className="w-4 h-4" />}
                  {ev.type === 'escrow' && <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <p className="text-xs text-slate-200 font-mono font-medium tracking-wide truncate">{ev.message}</p>
                  <div className="flex items-center gap-3 font-mono text-[9px] text-slate-500">
                    <span className="text-amber-400/70">{ev.hash}</span>
                    <span>•</span>
                    <span className="truncate">{ev.node}</span>
                    <span>•</span>
                    <span>Block {ev.block}</span>
                  </div>
                </div>
              </div>

              {/* Gas / Time badge */}
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-amber-200 block">{ev.gas} Gwei</span>
                <span className="text-[9px] font-mono text-slate-500 block">{ev.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decorative Blockchain Status Line */}
      <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Server className="w-3.5 h-3.5 text-amber-500/60" />
          Indian Sovereign Ledger V1.1
        </span>
        <span className="bg-[#120e07] text-[#fbf5b7] border border-[#e6ca65]/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold">
          CONVERGENCE: SECURE
        </span>
      </div>
    </div>
  );
};
