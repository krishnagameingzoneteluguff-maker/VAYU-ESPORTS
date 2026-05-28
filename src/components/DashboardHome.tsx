import React from 'react';
import { motion } from 'motion/react';
import { useEsports } from '../context/EsportsContext';
import { Trophy, Flame, Swords, Radio, Megaphone, Plus, ExternalLink, Users, Calendar, Watch } from 'lucide-react';
import { Tournament, Scrim, Stream, Announcement } from '../types';

interface DashboardHomeProps {
  onNavigate: (view: 'home' | 'tournaments' | 'scrims' | 'streams' | 'announcements' | 'leaderboard' | 'profile' | 'settings' | 'admin') => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const {
    tournaments,
    scrims,
    streams,
    announcements,
    isAdminMode,
    joinTournament,
    joinScrim
  } = useEsports();

  // Filter tournaments & scrims for preview columns
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);
  const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing').slice(0, 3);
  const liveScrims = scrims.filter(s => s.isLive).slice(0, 3);
  const typicalScrims = scrims.slice(0, 4);
  const liveStreams = streams.filter(s => s.isLive).slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 4);

  return (
    <div id="vayu-dashboard-home" className="space-y-8 pb-10">
      
      {/* 1. Sleek Interface Hero Area */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-black min-h-[440px] flex flex-col justify-between p-6 md:p-10 shadow-[0_0_35px_rgba(34,211,238,0.12)] group">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/15 to-transparent pointer-events-none" />
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400 opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500 opacity-40 pointer-events-none"></div>

        {/* Decorative Grid Panel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Center Branding & Spinning Ring */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
          <div className="text-6xl md:text-8xl font-cyber font-black italic tracking-tighter text-cyan-400/5 select-none absolute pointer-events-none">VAYU TECH</div>
          
          <div className="w-36 h-36 md:w-44 md:h-44 border border-cyan-500/35 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
            <div className="w-24 h-24 md:w-30 md:h-30 bg-cyan-400/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              <span className="text-3xl md:text-4xl font-cyber font-black italic text-cyan-400">V</span>
            </div>
          </div>
          
          <h2 className="mt-8 text-xl md:text-3xl font-cyber font-black tracking-widest text-white text-center">
            INITIALIZING ARENA
          </h2>
          <p className="mt-2 text-cyan-400/60 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-center">
            System Status: Optimal // Connectivity: 100%
          </p>
        </div>

        {/* Action Buttons Overlay skews */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={() => onNavigate('tournaments')}
            className="w-full sm:w-auto px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
            style={{ transform: 'skewX(-10deg)' }}
          >
            <div style={{ transform: 'skewX(10deg)' }}>Join Tournament</div>
          </button>
          <button
            onClick={() => onNavigate('streams')}
            className="w-full sm:w-auto px-8 py-3 border border-white/20 hover:border-cyan-400/50 hover:bg-white/5 text-white font-cyber font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{ transform: 'skewX(-10deg)' }}
          >
            <div style={{ transform: 'skewX(10deg)' }}>Watch Stream</div>
          </button>
        </div>
      </div>

      {/* Announcements Banner / System Log */}
      <div className="h-12 bg-white/5 border border-white/10 rounded-lg flex items-center px-4 overflow-hidden relative">
        <div className="w-24 h-full bg-cyan-400/10 absolute left-0 flex items-center justify-center font-cyber font-bold text-[9px] tracking-tighter border-r border-white/5">
          SYSTEM LOG
        </div>
        <div 
          className="ml-28 flex items-center gap-8 whitespace-nowrap text-[10px] font-mono text-slate-300 pointer-events-none"
          style={{
            animation: 'marquee 25s linear infinite'
          }}
        >
          <span>[18:42] // NEW TOURNAMENT ADDED: VALORANT GLOBAL MASTERS 2024</span>
          <span className="text-cyan-400">//</span>
          <span>[17:15] // USER LEVEL PROFILE SYNC COMPLETED WITH MASTER_PHALANX</span>
          <span className="text-cyan-400">//</span>
          <span>[16:00] // SCRIM CORES ACTIVE AND STAGED SECURELY</span>
          <span className="text-cyan-400">//</span>
          <span>[Tokyo_01] // CONSOLE LINK SECURED VIA AES-256 ENCRYPTION Protocol</span>
        </div>
      </div>

      {/* 2. Dual Tournaments Widget: Upcoming and Ongoing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Tournaments Grid (GOLD style) */}
        <div className="border border-cyan-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(34,211,238,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-400 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-amber-400">
              <Trophy className="w-5 h-5 text-amber-500" />
              UPCOMING TOURNAMENTS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="space-y-3">
            {upcomingTournaments.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">No manually loaded upcoming events.</p>
            ) : (
              upcomingTournaments.map((t) => (
                <div
                  key={t.id}
                  className="group relative flex items-center justify-between p-3 rounded-lg border border-yellow-500/10 hover:border-yellow-500/25 bg-amber-950/5 hover:bg-amber-950/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-xl bg-amber-950/30 rounded border border-amber-500/20 text-amber-400">
                      {t.banner}
                    </div>
                    <div>
                      <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 mt-1 uppercase">
                        <span className="text-cyan-400">{t.entryType}</span>
                        <span>•</span>
                        <span>{t.slotsJoined}/{t.slotsMax} SLOTS</span>
                        <span>•</span>
                        <span>{t.date}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('tournaments')}
                    className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-cyber font-semibold text-[9px] tracking-wider uppercase rounded border border-amber-400/30 transition-all cursor-pointer"
                  >
                    JOIN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ongoing Tournaments Grid (PURPLE style) */}
        <div className="border border-purple-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(157,78,221,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-purple-500 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-purple-400">
              <Flame className="w-5 h-5 text-purple-500" />
              ONGOING TOURNAMENTS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="space-y-3">
            {ongoingTournaments.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">No ongoing tournament operations in database.</p>
            ) : (
              ongoingTournaments.map((t) => (
                <div
                  key={t.id}
                  className="group relative flex items-center justify-between p-3 rounded-lg border border-purple-500/10 hover:border-purple-500/25 bg-purple-950/5 hover:bg-purple-950/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-xl bg-purple-950/30 rounded border border-purple-500/20 text-purple-400">
                      {t.banner}
                    </div>
                    <div>
                      <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 mt-1 uppercase">
                        <span className="text-red-400 flex items-center gap-1 font-bold animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                          LIVE NOW
                        </span>
                        <span>•</span>
                        <span>{t.slotsJoined}/{t.slotsMax} SLOTS</span>
                        <span>•</span>
                        <span>{t.date} | {t.time}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('streams')}
                    className="px-2.5 py-1.5 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white font-cyber font-semibold text-[9px] tracking-wider uppercase rounded border border-purple-400/30 transition-all cursor-pointer"
                  >
                    WATCH
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. Scrims Hub: Lists and Active Real-time Joins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* All Typical Scrims Section (Left 5 column widths) */}
        <div className="lg:col-span-5 border border-cyan-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(34,211,238,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-cyan-400">
              <Swords className="w-5 h-5 text-cyan-400" />
              ALL SCRIMS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {typicalScrims.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No scrim setups.</p>
            ) : (
              typicalScrims.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded bg-cyan-950/10 border border-cyan-500/5 hover:border-cyan-500/20 hover:bg-cyan-950/20 transition-all"
                >
                  <div>
                    <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">
                      {s.title}
                    </h4>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase mt-0.5">
                      {s.squadType} | {s.type === 'night' ? 'Night block' : `${s.type} block`}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                      🕒 EVERYDAY | {s.time}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('scrims')}
                    className="px-2.5 py-1.5 bg-[#0e172e] hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 font-cyber font-semibold text-[9px] tracking-wider uppercase rounded border border-cyan-800/30 transition-all cursor-pointer"
                  >
                    JOIN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Scrims Section (Right 7 column widths) */}
        <div className="lg:col-span-7 border border-rose-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(255,42,81,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-rose-500 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-rose-500">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE SCRIMS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {liveScrims.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">No live practice rooms running.</p>
            ) : (
              liveScrims.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-600 text-white font-cyber text-[8px] font-black tracking-widest rounded uppercase">
                        LIVE
                      </span>
                      <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">
                        {s.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2.5 text-[9px] font-mono text-slate-400 uppercase">
                      <span className="text-slate-300 font-semibold">{s.squadType} TPP</span>
                      <span>•</span>
                      <span>ACTIVE PLAYERS: {s.slotsJoined}/{s.slotsMax}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('scrims')}
                    className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-cyber font-semibold text-[10px] tracking-wider uppercase rounded border border-rose-500/40 transition-all cursor-pointer self-start sm:self-center"
                  >
                    JOIN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. Live Streams and Announcements split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* YouTube live stream deck */}
        <div className="border border-cyan-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(34,211,238,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-red-500">
              <Radio className="w-5 h-5 text-red-500" />
              LIVE STREAMS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {liveStreams.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">No streams. Admin can load streams in dashboard.</p>
            ) : (
              liveStreams.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-3.5 p-2 bg-[#090918] rounded-xl border border-white/5"
                >
                  <div className="relative w-28 h-16 rounded overflow-hidden flex-shrink-0 bg-black">
                    <img
                      referrerPolicy="no-referrer"
                      src={st.thumbnail}
                      alt={st.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-600 text-white font-cyber text-[7px] font-black rounded uppercase flex items-center gap-0.5">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                      LIVE
                    </div>
                    <div className="absolute bottom-1 right-1 px-1 bg-black/80 text-[7px] font-mono text-cyan-400 rounded">
                      {(st.viewersCount / 1000).toFixed(1)}k WATCHING
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cyber font-bold text-xs text-white truncate uppercase tracking-wide">
                      {st.title}
                    </h4>
                    <p className="text-[9px] font-mono text-cyan-400 mt-1 uppercase">
                      📺 2026 OFFICIAL EVENT DECK
                    </p>
                    <button
                      onClick={() => onNavigate('streams')}
                      className="flex items-center gap-1 text-[9px] font-cyber font-bold tracking-widest text-cyan-400 hover:text-cyan-300 uppercase mt-2 group"
                    >
                      WATCH BROADCAST
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements section */}
        <div className="border border-cyan-500/25 rounded-xl bg-[#000000]/60 backdrop-blur-md p-5 space-y-4 shadow-[0_4px_25px_rgba(34,211,238,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400 opacity-20 pointer-events-none" />
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <h3 className="flex items-center gap-2 font-cyber font-bold text-sm tracking-wider text-pink-500">
              <Megaphone className="w-5 h-5 text-pink-500" />
              ANNOUNCEMENTS
            </h3>
            {isAdminMode && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-cyber tracking-wider font-semibold border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" /> ADMIN
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-sans">No administrative announcements posted.</p>
            ) : (
              recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 bg-[#0a0a16] border-l-2 border-cyan-400/80 hover:border-purple-500 hover:bg-[#0e0e22] transition-colors rounded-r-md"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-tight line-clamp-1">
                      {ann.title}
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 flex-shrink-0">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1.5 font-sans leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
