import React, { useState } from 'react';
import { Lock, Shield, Key, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

interface DashboardLockScreenProps {
  onUnlock: (password: string) => Promise<boolean>;
}

export const DashboardLockScreen: React.FC<DashboardLockScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the security password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Give a brief delay for a satisfying "decrypting" animation feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await onUnlock(password);
    setLoading(false);
    if (!success) {
      setError('Incorrect security credential. Access Denied.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 bg-[#0c0905] border border-[#e6ca65]/20 rounded-3xl shadow-[0_0_50px_rgba(230,202,101,0.05)] relative overflow-hidden backdrop-blur-md">
      {/* Golden accent lines */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e6ca65] to-transparent"></div>
      
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Glow Lock Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#e6ca65]/10 rounded-full blur-xl scale-125 animate-pulse"></div>
          <div className="w-16 h-16 bg-[#16120b] border border-[#e6ca65]/30 rounded-2xl flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(230,202,101,0.15)]">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-serif-lux text-[#fbf5b7] tracking-wider uppercase">
            Dashboard Security Gate
          </h2>
          <p className="text-xs text-amber-100/60 leading-relaxed max-w-sm">
            Access to builder dashboards, company client portals, and administrative configurations is encrypted. Enter the system password to authorize access.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest font-semibold ml-1">
              Security Key
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/50">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••••••"
                className="w-full pl-10 pr-12 py-3 bg-[#080603] border border-[#e6ca65]/20 focus:border-[#e6ca65]/60 rounded-xl text-sm font-mono text-[#f5f1e6] placeholder-slate-600 focus:outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(230,202,101,0.05)]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-amber-400 text-amber-500/40 transition cursor-pointer"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/20 border border-red-500/25 p-3 rounded-xl text-xs text-red-200/90 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full premium-button-gold py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(230,202,101,0.2)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Decrypting Portal...
              </span>
            ) : (
              <>
                Authorize Portal Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-500/40">
          <Shield className="w-3.5 h-3.5" />
          <span>AES-256 On-Chain Credential Storage</span>
        </div>

      </div>
    </div>
  );
};
