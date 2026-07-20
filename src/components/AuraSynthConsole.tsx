import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Music, Sliders, Sun, Sunset, Moon, Activity } from 'lucide-react';

type PresetType = 'sunrise' | 'noon' | 'twilight' | 'cyber';

export const AuraSynthConsole: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState<PresetType>('sunrise');
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [tempo, setTempo] = useState(40); // speed of random bells
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);

  // Web Audio Context & Oscillator Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscsRef = useRef<OscillatorNode[]>([]);
  const droneGainsRef = useRef<GainNode[]>([]);
  const randomBellsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Visualizer Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualizerAnimRef = useRef<number | null>(null);

  // Initialize Web Audio API
  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Create custom audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Volume Control
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;
  };

  // Harmonious Frequency Scales (Indian Ragas & Pentatonic Scales in Hz)
  const scales = {
    sunrise: [110, 137.5, 165, 183.3, 220, 275, 330, 366.6, 440], // Bhupali Raga (Warm Major Pentatonic)
    noon: [110, 123.47, 146.83, 164.81, 196.0, 220, 246.94, 293.66], // Raag Sarang (Bold & Solar)
    twilight: [110, 116.54, 138.59, 164.81, 174.61, 220, 233.08, 277.18], // Bhairavi Raga (Deep meditative / mystical)
    cyber: [98.0, 116.54, 130.81, 146.83, 155.56, 196.0, 233.08, 261.63], // Cyberpunk Ethereal Minor
  };

  const getPresetInfo = () => {
    switch (preset) {
      case 'sunrise': return { name: 'Varanasi Sunrise', desc: 'Bhupali Sitar & Flute Drone', icon: <Sun className="w-4 h-4 text-amber-400" /> };
      case 'noon': return { name: 'Thar Solar Flight', desc: 'Sarang Active Sandscapes', icon: <Sunset className="w-4 h-4 text-orange-400" /> };
      case 'twilight': return { name: 'Himalayan Sanctuary', desc: 'Bhairavi Mystic Evening', icon: <Moon className="w-4 h-4 text-indigo-400" /> };
      case 'cyber': return { name: 'Mumbai Cyber-Sitar', desc: 'Resonant Neon Synth Loops', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> };
    }
  };

  // Start Drone Oscillators
  const startDrone = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    // Clear previous
    stopDrone();

    const currentScale = scales[preset];
    const baseFreq = currentScale[0]; // Primary Indian Sa tone

    // Harmonic multi-voice synth setup
    const frequencies = [
      baseFreq,                // Fundamental Sa
      baseFreq * 1.5,          // Perfect Fifth Pa
      baseFreq * 2.0,          // Octave Sa
      baseFreq * 2.5,          // Major Third Ga or customized interval
    ];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Soft triangle/sine blend for warm classical acoustic aura
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Organic natural filter sweep via LFO-like gain modulation
      const targetGain = 0.08 / frequencies.length;
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 3);

      osc.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      osc.start();

      droneOscsRef.current.push(osc);
      droneGainsRef.current.push(gainNode);

      // Slowly modulate volume to sound like continuous acoustic breathing
      const modulate = () => {
        if (!isPlaying || !gainNode) return;
        const now = ctx.currentTime;
        const nextVolume = (0.04 + Math.random() * 0.05) / frequencies.length;
        gainNode.gain.linearRampToValueAtTime(nextVolume, now + 4 + Math.random() * 3);
        setTimeout(modulate, 6000 + Math.random() * 4000);
      };
      setTimeout(modulate, 3000);
    });
  };

  const stopDrone = () => {
    droneOscsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
      osc.disconnect();
    });
    droneGainsRef.current.forEach(gain => gain.disconnect());
    droneOscsRef.current = [];
    droneGainsRef.current = [];
  };

  // Trigger crystalline Bell/Chime randomly
  const triggerChime = () => {
    if (!audioCtxRef.current || !masterGainRef.current || !isPlaying) return;
    const ctx = audioCtxRef.current;

    const currentScale = scales[preset];
    // Pick random note from scale, prefer higher notes for bells
    const noteIndex = Math.floor(Math.random() * (currentScale.length - 2)) + 2;
    const freq = currentScale[noteIndex] * 2.0; // transpose up for crystal chimes

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Dynamic high-end glass chime envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    // Exponential decay to feel luxurious and organic
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

    osc.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    osc.start();

    // Cleanup after decay
    setTimeout(() => {
      try {
        osc.stop();
        osc.disconnect();
        gainNode.disconnect();
      } catch (e) {}
    }, 3000);
  };

  // Schedule Random Chimes Loop
  useEffect(() => {
    if (randomBellsTimerRef.current) clearInterval(randomBellsTimerRef.current);

    if (isPlaying && !isMuted) {
      const intervalMs = Math.max(1000, (100 - tempo) * 120);
      randomBellsTimerRef.current = setInterval(() => {
        triggerChime();
      }, intervalMs);
    }

    return () => {
      if (randomBellsTimerRef.current) clearInterval(randomBellsTimerRef.current);
    };
  }, [isPlaying, isMuted, preset, tempo]);

  // Master Volume Updater
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetVol = isMuted ? 0 : volume;
      masterGainRef.current.gain.linearRampToValueAtTime(targetVol, audioCtxRef.current.currentTime + 0.5);
    }
  }, [volume, isMuted]);

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    initAudio();
    
    // Resume audio context if suspended (browser security constraint)
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!isPlaying) {
      setIsPlaying(true);
      setTimeout(() => startDrone(), 50);
    } else {
      setIsPlaying(false);
      stopDrone();
    }
  };

  // Trigger Drone restart on preset change
  useEffect(() => {
    if (isPlaying) {
      startDrone();
    }
  }, [preset]);

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    let height = (canvas.height = 48);
    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        // Draw 3 layers of glowing golden sine waves mimicking raga frequencies
        ctx.lineWidth = 1.5;
        phase += 0.03;

        // Wave 1 - Deep Gold
        ctx.strokeStyle = 'rgba(191, 149, 63, 0.4)';
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.02 + phase) * 12 * Math.sin(i * 0.005);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Wave 2 - Lighter Gold Shimmer
        ctx.strokeStyle = 'rgba(252, 246, 186, 0.65)';
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.035 - phase * 1.5) * 8 * Math.sin(i * 0.008);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Wave 3 - Ambient Glow background wave
        ctx.strokeStyle = 'rgba(170, 119, 28, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.015 + phase * 0.5) * 14;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      } else {
        // Flat gold horizon line
        ctx.strokeStyle = 'rgba(230, 202, 101, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      visualizerAnimRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 280;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (visualizerAnimRef.current) cancelAnimationFrame(visualizerAnimRef.current);
    };
  }, [isPlaying]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopDrone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const currentInfo = getPresetInfo();

  return (
    <div className="relative z-30 max-w-sm w-full mx-auto md:mx-0">
      {/* Mini Toggle bar */}
      <div 
        onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
        className="glass-premium hover:border-amber-400/40 p-3 rounded-2xl flex items-center justify-between cursor-pointer shadow-xl select-none transition-all duration-300"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isPlaying ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(230,202,101,0.5)] animate-pulse' : 'bg-white/5 text-amber-100/60'}`}>
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-[11px] font-mono font-bold text-amber-300/80 uppercase tracking-widest">Raga Aura Focus</h5>
            <p className="text-[10px] text-slate-400 font-medium">
              {isPlaying ? `${currentInfo?.name}` : 'Deep-focus generative soundscape'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={togglePlay}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isPlaying ? 'bg-amber-400/15 text-amber-300 hover:bg-amber-400/25' : 'bg-white/10 text-white hover:bg-white/15'}`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button 
            onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
            className="p-1 text-slate-500 hover:text-amber-400 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Console drawer */}
      {isConsoleExpanded && (
        <div className="absolute top-14 left-0 right-0 glass-premium p-4 rounded-2xl space-y-4 border border-amber-400/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-400/80 uppercase tracking-wider">Acoustic Resonance Visualizer</span>
          </div>

          {/* Golden waves visualizer canvas */}
          <div className="bg-black/50 rounded-xl p-2 border border-white/5 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-12" />
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">
            "{currentInfo?.desc}"
          </p>

          {/* Sound Presets */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Sound Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {(['sunrise', 'noon', 'twilight', 'cyber'] as PresetType[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`py-1.5 px-2.5 rounded-xl border text-[10px] font-medium transition flex items-center gap-1.5 cursor-pointer capitalize ${
                    preset === p 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 font-bold' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {p === 'sunrise' && <Sun className="w-3 h-3 text-amber-400" />}
                  {p === 'noon' && <Sunset className="w-3 h-3 text-orange-400" />}
                  {p === 'twilight' && <Moon className="w-3 h-3 text-indigo-400" />}
                  {p === 'cyber' && <Sparkles className="w-3 h-3 text-cyan-400" />}
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Volume, Tempo */}
          <div className="space-y-2.5 pt-1">
            {/* Volume control */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-slate-400 hover:text-amber-400 transition cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                className="flex-1 accent-amber-400 h-1 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-400 w-6 text-right">
                {isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Tempo (Bell frequency) control */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Bell Tempo</span>
              <input 
                type="range" 
                min="10" 
                max="90" 
                step="5"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
                className="flex-1 accent-amber-400 h-1 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-400 w-6 text-right">
                {tempo}bpm
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
