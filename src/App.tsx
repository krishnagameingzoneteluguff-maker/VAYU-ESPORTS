/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EsportsProvider, useEsports } from './context/EsportsContext';
import { CyberCanvas } from './components/CyberCanvas';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { DashboardHome } from './components/DashboardHome';
import { TournamentsView } from './components/TournamentsView';
import { ScrimsView } from './components/ScrimsView';
import { StreamsView } from './components/StreamsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { WinnersView } from './components/WinnersView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminPanel } from './components/AdminPanel';

import {
  Home,
  Trophy,
  Swords,
  Radio,
  Megaphone,
  BarChart3,
  User,
  Settings,
  ShieldAlert,
  Bell,
  CheckCircle,
  Menu,
  X,
  Laptop,
  Award
} from 'lucide-react';

function DashboardLayout() {
  const { user, isAdminMode, setAdminMode, logout } = useEsports();
  const [currentView, setCurrentView] = useState<
    'home' | 'tournaments' | 'scrims' | 'streams' | 'announcements' | 'leaderboard' | 'profile' | 'settings' | 'admin'
  >('home');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'Welcome back! Your daily scrim block starts in 2 hours.',
    'ALERT: VAYU Championship registrations close in 3 days.'
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) {
    return <LoginPage />;
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-4 h-4" /> },
    { id: 'scrims', label: 'Scrims', icon: <Swords className="w-4 h-4" /> },
    { id: 'streams', label: 'Live Streams', icon: <Radio className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Winners', icon: <Award className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div id="vayu-dashboard-layout" className="min-h-screen text-slate-100 relative bg-[#020205] font-sans flex flex-col">
      {/* 1. Interactive background particles */}
      <CyberCanvas />

      {/* Sleek Interface Grid & Scanline background overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-10 sleek-dot-grid z-0" />
      <div className="absolute inset-0 pointer-events-none opacity-5 sleek-scanlines z-0" />

      {/* 2. Top-most glowing navbar banner */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(34,211,238,0.15)] px-4 py-3 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* VAYU logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <svg className="w-7 h-7 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]" viewBox="0 0 100 100" fill="none">
              <path d="M10 20L45 85C47 89 53 89 55 85L90 20H75L50 68L25 20H10Z" fill="url(#app-vayu-grad)" />
              <path d="M32 20L50 55L68 20H58L50 36L42 20H32Z" fill="#9d4ede" />
              <defs>
                <linearGradient id="app-vayu-grad" x1="10" y1="20" x2="90" y2="85">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#9d4ede" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-cyber font-black tracking-widest text-sm uppercase hidden sm:inline-block">
              VAYU <span className="text-cyan-400 text-xs font-medium tracking-[0.2em] font-cyber ml-0.5">E-SPORTS</span>
            </span>
          </div>
        </div>

        {/* Desktop Quick Nav Header selector matches mockup */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`px-3 py-1.5 text-[10px] font-cyber tracking-widest uppercase font-semibold border-b-2 transition-all cursor-pointer ${
                currentView === item.id
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right dashboard indicators */}
        <div className="flex items-center gap-4 relative">
          
          {/* Admin toggle lever */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-purple-950/30 border border-purple-500/20 max-sm:hidden">
            <span className="text-[9px] font-cyber tracking-wider text-purple-300 font-bold uppercase select-none">
              Admin Deck
            </span>
            <input
              type="checkbox"
              checked={isAdminMode}
              onChange={() => {
                setAdminMode(!isAdminMode);
                if (!isAdminMode) setCurrentView('admin');
                else if (currentView === 'admin') setCurrentView('home');
              }}
              className="w-4 h-4 cursor-pointer accent-purple-500 rounded"
              title="Toggle Administrator Tools"
            />
          </div>

          {/* Core Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer relative"
              title="Notifications board"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            {/* Notification Dropdown and Alerts */}
            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-64 bg-[#0a0a19] border border-cyan-500/20 p-3 rounded-lg shadow-2xl z-40 space-y-2 text-xs">
                <span className="block font-cyber text-[9px] text-cyan-400 tracking-wider font-bold border-b border-white/5 pb-1 uppercase">
                  MATCHING DESK SYSTEMS
                </span>
                {notifications.length === 0 ? (
                  <p className="text-slate-500 text-[10px]">All rosters aligned. Clear skies.</p>
                ) : (
                  notifications.map((not, idx) => (
                    <div key={idx} className="p-2 rounded bg-cyan-950/10 border-l border-cyan-400 text-[11px] text-slate-300">
                      {not}
                    </div>
                  ))
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="w-full text-center text-[9px] text-slate-500 hover:text-white font-cyber tracking-wider block pt-1.5 uppercase cursor-pointer"
                  >
                    Clear All Alerts
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-700/50" />

          {/* User profile capsule matches our dashboard mockup in visual */}
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 select-none"
            onClick={() => setCurrentView('profile')}
          >
            <div className="w-7 h-7 rounded bg-[#101026] border border-cyan-500/30 overflow-hidden">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="block font-cyber font-black tracking-wide text-[10px] text-white">
                {user.username}
              </span>
              <span className="text-[8px] font-mono text-purple-400 font-medium uppercase mt-0.5 block">
                {isAdminMode ? 'ADMINISTRATOR' : `LVL ${user.level}`}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* 3. Main Page Layout Grid (Left Sidebar + Center Component Area) */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 gap-6">
        
        {/* Left hand Navigation Sidebar (Desktop) */}
        <aside className="hidden md:block w-56 flex-shrink-0 space-y-4">
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-black/40 backdrop-blur-md space-y-1">
            <span className="block text-[8px] font-cyber font-bold tracking-[0.3em] text-cyan-400 px-3 pb-2 uppercase">
              MAIN NAVIGATION
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded text-xs transition-colors font-cyber tracking-wider font-semibold cursor-pointer ${
                  currentView === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            {/* Admin toggle selection listed on bottom */}
            {isAdminMode && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded text-xs transition-colors font-cyber tracking-wider font-semibold cursor-pointer border border-dashed text-purple-400 border-purple-500/20 mt-3 ${
                  currentView === 'admin'
                    ? 'bg-purple-950/20 text-purple-300 border-purple-500/40'
                    : 'hover:bg-purple-950/10'
                }`}
              >
                <Laptop className="w-4 h-4" />
                ADMIN SYSTEM
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/25 bg-[#03030c]/60 text-center space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-cyber tracking-widest">
              Vayu Console Active
            </span>
            <span className="text-[8px] font-mono text-cyan-400/40 block">v3.54-enterprise</span>
          </div>
        </aside>

        {/* Center render stage */}
        <main className="flex-1 min-w-0 bg-[#06060e]/30 p-1 rounded-xl">
          {currentView === 'home' && <DashboardHome onNavigate={(view) => setCurrentView(view)} />}
          {currentView === 'tournaments' && <TournamentsView />}
          {currentView === 'scrims' && <ScrimsView />}
          {currentView === 'streams' && <StreamsView />}
          {currentView === 'announcements' && <AnnouncementsView />}
          {currentView === 'leaderboard' && <WinnersView />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'admin' && <AdminPanel />}
        </main>

      </div>

      {/* 4. Sliding Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay mask */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer glass sheet */}
          <div className="relative w-72 max-w-[80vw] bg-[#050510] border-r border-cyan-500/20 p-5 flex flex-col justify-between shadow-[0_0_30px_black]">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="font-cyber font-black tracking-wider text-sm">
                  VAYU SYSTEMS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-white/5 rounded cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded text-xs transition-colors font-cyber tracking-wider font-semibold cursor-pointer ${
                      currentView === item.id
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                {isAdminMode && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded text-xs transition-colors font-cyber tracking-wider font-semibold cursor-pointer text-purple-300 border border-purple-500/20 ${
                      currentView === 'admin' ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    ADMIN CONTROL
                  </button>
                )}
              </div>
            </div>

            {/* Logout capsule mobile */}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-center py-2 bg-red-950/20 text-rose-451 font-cyber font-bold tracking-widest text-[10px] rounded border border-rose-500/10 uppercase cursor-pointer block"
            >
              DISCONNECT MATRIX
            </button>
          </div>
        </div>
      )}

      {/* 5. Minimal unified footer element conforming to "no tech-larping" rules */}
      <footer className="py-6 border-t border-white/5 text-center text-[10px] text-slate-600 font-mono select-none">
        © 2026 VAYU E-SPORTS. MANUALLY CONTROLLED ARENA REGULATOR.
      </footer>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <EsportsProvider>
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <DashboardLayout />
      )}
    </EsportsProvider>
  );
}
