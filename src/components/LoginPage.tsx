import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useEsports } from '../context/EsportsContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useEsports();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      setErrorMessage('Please enter email or username.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      // Simulate login via EsportsProvider
      await login(emailOrUser, password);
    } catch (err) {
      setErrorMessage('Authentication failed. Check setup connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleThirdParty = async (provider: string) => {
    setLoading(true);
    try {
      await login(`${provider}_user`, 'oauth-token-verified');
    } catch (err) {
      setErrorMessage(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vayu-login-page" className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#03030b]">
      {/* Immersive Background Gradients */}
      <div className="absolute right-[10%] top-[10%] w-[35rem] h-[35rem] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-[10%] bottom-[10%] w-[35rem] h-[35rem] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,254,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,254,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="flex flex-col lg:flex-row max-w-4xl w-full bg-[#080813]/70 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.15)] z-10">
        
        {/* Left Interactive Vayu Logo Banner */}
        <div className="flex-1 bg-[#06060c] p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-cyan-500/10 min-h-[300px]">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Spinning decorative circles */}
            <div className="absolute inset-0 border border-cyan-500/30 border-dashed rounded-full animate-spin [animation-duration:15s]" />
            <div className="absolute inset-2 border-2 border-purple-500/20 border-dotted rounded-full animate-spin [animation-duration:30s]" />
            
            {/* Outer Hexagon frame */}
            <div className="absolute w-32 h-32 bg-cyan-400/5 rounded-3xl rotate-45 border border-cyan-500/10" />

            <div className="relative z-10 flex flex-col items-center select-none">
              <svg className="w-16 h-16 text-cyan-400 filter drop-shadow-[0_0_15px_rgba(0,242,254,0.8)]" viewBox="0 0 100 100" fill="none">
                <path d="M10 20L45 85C47 89 53 89 55 85L90 20H75L50 68L25 20H10Z" fill="url(#login-vayu-grad)" />
                <path d="M32 20L50 55L68 20H58L50 36L42 20H32Z" fill="#9d4ede" />
                <defs>
                  <linearGradient id="login-vayu-grad" x1="10" y1="20" x2="90" y2="85">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#9d4ede" />
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="font-cyber font-black tracking-[0.4em] text-2xl text-white mt-1 filter drop-shadow-[0_2px_4px_black]">
                VAYU
              </h1>
              <p className="text-[10px] font-cyber tracking-[0.4em] text-cyan-400 opacity-80 uppercase">
                e-sports
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-sm font-cyber tracking-wider text-slate-400 uppercase">Futuristic Arena Interface</h2>
            <p className="text-xs text-slate-500 max-w-xs mt-2 font-sans">
              Enter the competitive ecosystem of live scrims, dynamic tournament brackets, and unified player hubs.
            </p>
          </div>

          <div className="mt-6 p-2.5 rounded border border-cyan-500/20 bg-cyan-950/20 text-center max-w-xs">
            <p className="text-[10px] font-mono text-cyan-300">
              💡 <span className="font-semibold text-white">Review Tip:</span> Enter <code className="text-purple-300 font-bold px-1 bg-black/40 rounded">admin</code> with any password to unlock the full Administrator Dashboard.
            </p>
          </div>
        </div>

        {/* Right Form panel */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-[10px] font-cyber tracking-[0.3em] text-cyan-400 uppercase block mb-1">
              Welcome back
            </span>
            <h2 className="text-2xl font-cyber font-semibold text-white tracking-tight uppercase">
              To Vayu E-Sports
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-400 to-purple-500 mt-2" />
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400 font-sans">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email */}
            <div className="space-y-1.5ClassName">
              <label className="text-[10px] font-cyber tracking-wider text-slate-400 uppercase">
                Email or Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Enter credential ID (or type 'admin')"
                  className="w-full bg-[#101022]/60 border border-cyan-500/10 focus:border-cyan-400/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 shadow-[inset_0_1px_3px_black]"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-cyber tracking-wider text-slate-400 uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#101022]/60 border border-cyan-500/10 focus:border-cyan-400/50 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 shadow-[inset_0_1px_3px_black]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot triggers */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 accent-cyan-500 bg-black/40 border border-cyan-500/30 rounded focus:ring-0"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('Credential recovery service offline. Connect database first.')}
                className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative mt-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-cyber font-semibold tracking-widest text-xs uppercase py-3.5 rounded-lg border border-cyan-400/30 shadow-[0_0_15px_rgba(0,186,198,0.3)] hover:shadow-[0_0_20px_rgba(0,186,198,0.5)] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 font-medium"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  LOGIN
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7 text-center">
            <hr className="border-cyan-500/10" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-[#080813] text-[9px] font-cyber tracking-widest text-slate-500 uppercase">
              Or Continue With
            </span>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThirdParty('google')}
              disabled={loading}
              className="flex justify-center items-center py-2.5 border border-cyan-500/10 hover:border-cyan-400/40 bg-[#0f0f20]/40 rounded-lg hover:bg-cyan-950/10 transition-all cursor-pointer group"
              title="Google Authorization"
            >
              <img
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=60&auto=format&fit=crop"
                alt="Google"
                className="w-4 h-4 rounded-full filter grayscale group-hover:grayscale-0 transition-all"
              />
            </button>
            <button
              onClick={() => handleThirdParty('discord')}
              disabled={loading}
              className="flex justify-center items-center py-2.5 border border-cyan-500/10 hover:border-cyan-400/40 bg-[#0f0f20]/40 rounded-lg hover:bg-purple-950/10 transition-all cursor-pointer group"
              title="Discord Authorization"
            >
              <svg className="w-4 h-4 fill-slate-500 group-hover:fill-indigo-400 transition-colors" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            </button>
            <button
              onClick={() => handleThirdParty('github')}
              disabled={loading}
              className="flex justify-center items-center py-2.5 border border-cyan-500/10 hover:border-cyan-400/40 bg-[#0f0f20]/40 rounded-lg hover:bg-slate-950/10 transition-all cursor-pointer group"
              title="GitHub Authorization"
            >
              <svg className="w-4 h-4 fill-slate-500 group-hover:fill-slate-200 transition-colors" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.007-.069-.607.037.1 1.002.43 1.524 1.402.827 1.417 2.17 1.007 2.697.77.085-.6.324-1.006.589-1.238-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </button>
          </div>

          <div className="mt-8 text-center">
            <span className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setEmailOrUser('admin')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider text-[11px] font-cyber ml-1 cursor-pointer"
              >
                Sign Up Now
              </button>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
