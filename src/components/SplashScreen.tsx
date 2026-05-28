import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Database, Network } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING VAYU TECH');

  // Synthesis cyber chime sound using browser's AudioContext
  const playCyberChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Osc 1 - low frequency sweep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.8);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      // Osc 2 - high frequency chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.4);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.2);
      gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.0);
      osc2.stop(ctx.currentTime + 1.0);
    } catch (e) {
      // Autoplay rules may block, fail silently
    }
  };

  useEffect(() => {
    // Progress status tracker simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + step, 100);

        // Update technical status labels dynamically
        if (next < 25) setStatusText('ESTABLISHING SECURE MEMORY RAILS...');
        else if (next < 50) setStatusText('BOOTSTRAPPING FIRESTORE INSTANCES...');
        else if (next < 75) setStatusText('SYNCHRONIZING VAYU CORE TERMINALS...');
        else if (next < 95) setStatusText('CONJURING ESPORTS STAGE GRAPHICS...');
        else setStatusText('VAYU COMMENCE SEQUENCE - ACTIVE');

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      playCyberChime();
      const timeout = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div id="vayu-splash-screen" className="fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center overflow-hidden">
      {/* 3D background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,18,48,0.6)_0%,rgba(2,2,5,1)_80%)]" />
      
      {/* Futuristic Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,254,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,254,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
        {/* Animated 3D VAYU LOGO Ring */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          {/* Outer Rotating Halo */}
          <motion.div
            className="absolute inset-0 border-4 border-dashed border-cyan-400 rounded-full opacity-30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          />

          {/* Inner Glowing Ring */}
          <motion.div
            className="absolute w-36 h-36 border border-purple-500 rounded-full shadow-[0_0_20px_rgba(157,78,221,0.5)]"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          />

          {/* Core SVG Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center cursor-pointer"
            onClick={playCyberChime}
          >
            {/* Elegant Vector V Symbol */}
            <svg
              className="w-20 h-20 text-cyan-400 filter drop-shadow-[0_0_12px_rgba(0,242,254,0.8)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 20L45 85C47 89 53 89 55 85L90 20H75L50 68L25 20H10Z"
                fill="url(#vayu-logo-grad)"
              />
              <path
                d="M32 20L50 55L68 20H58L50 36L42 20H32Z"
                fill="#9d4ede"
              />
              <defs>
                <linearGradient id="vayu-logo-grad" x1="10" y1="20" x2="90" y2="85">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#9d4ede" />
                </linearGradient>
              </defs>
            </svg>
            
            <span className="font-cyber font-black tracking-[0.4em] text-2xl text-white mt-1 filter drop-shadow-[0_2px_4px_black]">
              VAYU
            </span>
            <span className="text-[9px] font-cyber font-medium tracking-[0.6em] text-cyan-400 opacity-80">
              E-SPORTS
            </span>
          </motion.div>
        </div>

        {/* Loading status strings */}
        <div className="w-full text-center space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5 font-cyber">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              {statusText}
            </span>
            <span className="font-cyber text-sm font-semibold">{progress}%</span>
          </div>

          {/* Loading tracker */}
          <div className="h-1.5 w-full bg-[#111122] rounded-full border border-cyan-920 overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_8px_#00f2fe]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase">
            <span>Server Cwd /dev/0</span>
            <span>Est. latency: 0.2ms</span>
          </div>
        </div>

        {/* Dynamic decorative hud overlays */}
        <div className="absolute top-6 left-6 text-left font-mono text-[9px] text-cyan-400/20 max-md:hidden space-y-1">
          <div>$ SYSTEM_VAYU_DAEMON --INIT</div>
          <div>CORE_SPEED_VAYU_CPU: 5.8GHZ</div>
          <div>MEM_BLOCK: SYNCED_TRUE</div>
        </div>

        <div className="absolute top-6 right-6 text-right font-mono text-[9px] text-cyan-400/20 max-md:hidden space-y-1">
          <div>LOC_STAMP: 2026-05-28</div>
          <div>VAYU_AUTH_ENG: CONNECTED</div>
          <div>NET_VER: WIRELESS_NODE_3K</div>
        </div>
      </div>
    </div>
  );
};
