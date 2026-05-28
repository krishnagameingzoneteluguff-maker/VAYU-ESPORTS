import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Award, ShieldAlert, Swords, Trophy, BarChart3, Star, Edit, ShieldCheck } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, tournaments, scrims, updateProfile } = useEsports();
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(user?.username || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  if (!user) {
    return (
      <div className="py-20 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
        <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">SECURE LINK DISRUPTED</p>
        <p className="text-[10px] text-slate-600 mt-1">Please log in to load your personal player stats dashboard.</p>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser.trim()) {
      updateProfile(editUser, editAvatar);
      setIsEditing(false);
    }
  };

  // Find actual tournament objects user has joined
  const joinedTournamentsList = tournaments.filter(t => user.joinedTournaments.includes(t.id));
  const joinedScrimsList = scrims.filter(s => user.joinedScrims.includes(s.id));

  return (
    <div id="vayu-profile-view" className="space-y-6 pb-12">
      
      {/* Header and profile panel */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/10 bg-[#070715]/90 p-6 md:p-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
        
        {/* Render Editable Profile or Static Player Profile */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-sm">
            <h3 className="font-cyber font-black tracking-wider text-xs text-cyan-400 uppercase">EDIT GLADIATOR IDENTIFIERS</h3>
            
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-500 uppercase">Username / Tag</label>
              <input
                type="text"
                className="bg-black/40 border border-cyan-800/40 rounded py-2 px-3 text-xs text-white outline-none focus:border-cyan-400 transition-all"
                value={editUser}
                onChange={(e) => setEditUser(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-500 uppercase">Avatar Image URL</label>
              <input
                type="text"
                className="bg-black/40 border border-cyan-800/40 rounded py-2 px-3 text-xs text-white outline-none focus:border-cyan-400 transition-all font-mono text-[10px]"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-black font-cyber font-bold text-[10px] tracking-wider rounded uppercase cursor-pointer"
              >
                SAVE LOGS
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-transparent text-slate-500 hover:text-white font-cyber font-bold text-[10px] tracking-wider rounded uppercase cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-cyan-500/30 flex-shrink-0 bg-[#0f172a]">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-cyan-900/80 text-[8px] font-cyber tracking-widest text-white text-center py-0.5">
                LVL {user.level}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h3 className="text-xl md:text-2xl font-cyber font-black tracking-widest text-white uppercase">
                  {user.username}
                </h3>
                <button
                  onClick={() => {
                    setEditUser(user.username);
                    setEditAvatar(user.avatar);
                    setIsEditing(true);
                  }}
                  className="p-1 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded cursor-pointer"
                  title="Modify Profile Logs"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  AUTH VERIFIED: YES
                </span>
                <span>•</span>
                <span>UUID: {user.uid}</span>
              </div>
            </div>

            {/* Quick status counters */}
            <div className="flex gap-4 border border-cyan-500/10 rounded-lg p-3 bg-cyan-950/5">
              <div className="text-center px-2">
                <span className="block text-[8px] font-medium tracking-widest text-slate-550 font-cyber uppercase">WINS ROW</span>
                <span className="text-lg font-cyber font-black text-emerald-400 uppercase">{user.wins}</span>
              </div>
              <div className="w-px h-8 bg-cyan-500/10" />
              <div className="text-center px-2">
                <span className="block text-[8px] font-medium tracking-widest text-slate-550 font-cyber uppercase">K/D RATIO</span>
                <span className="text-lg font-cyber font-black text-rose-400 uppercase">{user.kd.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Joined Matches */}
        <div className="space-y-4">
          <h3 className="font-cyber font-bold text-xs text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Trophy className="w-4 h-4 text-cyan-400" />
            SCHEDULED TOURNAMENTS ({joinedTournamentsList.length})
          </h3>

          <div className="space-y-3">
            {joinedTournamentsList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 font-sans">No enrolled tournament applications.</p>
            ) : (
              joinedTournamentsList.map(t => (
                <div key={t.id} className="p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">{t.title}</h4>
                    <span className="text-[9px] font-mono text-cyan-400 block mt-0.5">{t.date} | {t.time}</span>
                  </div>
                  <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-cyber text-[8px] tracking-widest uppercase rounded">
                    ENROLLED
                  </span>
                </div>
              ))
            )}
          </div>

          <h3 className="font-cyber font-bold text-xs text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2 pt-2">
            <Swords className="w-4 h-4 text-purple-400" />
            ENROLLED DAILY SCRIMS ({joinedScrimsList.length})
          </h3>

          <div className="space-y-3">
            {joinedScrimsList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 font-sans">No scheduled active scrim rooms.</p>
            ) : (
              joinedScrimsList.map(s => (
                <div key={s.id} className="p-3 bg-purple-950/10 border border-purple-500/10 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">{s.title}</h4>
                    <span className="text-[9px] font-mono text-purple-400 block mt-0.5">{s.squadType} • {s.time}</span>
                  </div>
                  <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-cyber text-[8px] tracking-widest uppercase rounded">
                    SLOT RESERVED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Commendations / Achievements */}
        <div className="space-y-4">
          <h3 className="font-cyber font-bold text-xs text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Award className="w-4 h-4 text-amber-500" />
            COMMENDATIONS & BADGES ({user.achievements.length})
          </h3>

          <div className="space-y-3">
            {user.achievements.map((ach, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-950/5 border border-amber-500/10 hover:border-amber-500/25 transition-all rounded-lg flex items-start gap-3.5"
              >
                <div className="p-2 bg-amber-950/20 rounded border border-amber-500/20 text-center text-amber-500">
                  <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wide">{ach.title}</h4>
                    <span className="text-slate-500">{ach.unlockedAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
