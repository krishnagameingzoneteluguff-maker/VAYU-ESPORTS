import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Scrim } from '../types';
import { Swords, Check, Clock, ShieldCheck, HelpCircle, BadgeCheck, Users, X, Sparkles } from 'lucide-react';

export const ScrimsView: React.FC = () => {
  const { scrims, user, joinScrim, addScrim, deleteScrim, isAdminMode } = useEsports();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedScrim, setSelectedScrim] = useState<Scrim | null>(null);
  
  // Scrim register inputs
  const [teamName, setTeamName] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Admin fast create states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formSquad, setFormSquad] = useState<'Solo' | 'Duo' | 'Squad'>('Squad');
  const [formTime, setFormTime] = useState('9:30 PM');
  const [formSlots, setFormSlots] = useState(32);
  const [formType, setFormType] = useState<'daily' | 'weekend' | 'practice' | 'night'>('daily');

  const handleAddNewScrim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTime.trim()) return;

    addScrim({
      title: formTitle,
      squadType: formSquad,
      time: formTime,
      slotsMax: Number(formSlots),
      type: formType,
      isLive: false
    });

    setFormTitle('');
    setShowAddForm(false);
  };

  const displayedScrims = activeTab === 'all'
    ? scrims
    : scrims.filter(s => user?.joinedScrims.includes(s.id));

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Sign in to register for daily practice rooms.');
      return;
    }
    if (!teamName.trim()) {
      setErrorMsg('Please specify your squad / team name.');
      return;
    }

    if (selectedScrim) {
      const ok = joinScrim(selectedScrim.id, teamName);
      if (ok) {
        setSuccess(true);
        setTeamName('');
        setTimeout(() => {
          setSelectedScrim(null);
          setSuccess(false);
        }, 1500);
      } else {
        setErrorMsg('Unable to enlist. Either you are already registered or rosters are at max capacity.');
      }
    }
  };

  return (
    <div id="vayu-scrims-view" className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <span className="text-[10px] font-cyber tracking-widest text-cyan-400 block mb-1">PRACTICE ARENA</span>
          <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">DAILY SCRIMS</h2>
        </div>

        {isAdminMode && user?.isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-cyber font-bold text-[10px] tracking-wider uppercase rounded cursor-pointer transition-all flex items-center gap-1.5 self-end md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showAddForm ? 'Close Creator' : 'Add Scrim Room'}
          </button>
        )}
      </div>

      {/* Admin record post form inline */}
      {showAddForm && isAdminMode && user?.isAdmin && (
        <form onSubmit={handleAddNewScrim} className="p-5 border border-amber-500/30 rounded-xl bg-black/60 backdrop-blur-md space-y-4">
          <div className="border-b border-amber-500/10 pb-2">
            <h3 className="font-cyber font-bold text-xs text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-amber-500" /> CREATING DIRECT PRACTICE SCRIM ROOM
            </h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Your additions here publish immediately to the live public catalog.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Scrim Block Title</label>
              <input
                type="text"
                required
                placeholder="E.g. TACTICAL NO-RECOIL TDM"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Room Time Session</label>
              <input
                type="text"
                required
                placeholder="E.g. 10:00 PM"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Squad Category</label>
              <select
                className="bg-[#03030b] border border-cyan-500/25 text-xs text-slate-300 py-2 px-2.5 rounded outline-none"
                value={formSquad}
                onChange={(e) => setFormSquad(e.target.value as any)}
              >
                <option value="Squad">Squad (4v4)</option>
                <option value="Duo">Duo (2v2)</option>
                <option value="Solo">Solo (1v1)</option>
              </select>
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Block Type</label>
              <select
                className="bg-[#03030b] border border-cyan-500/25 text-xs text-slate-300 py-2 px-2.5 rounded outline-none"
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
              >
                <option value="daily">Daily Practice</option>
                <option value="weekend">Weekend Cup</option>
                <option value="practice">Recruit/Elite Practice</option>
                <option value="night">Night Room Sessions</option>
              </select>
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Max Slots Cap</label>
              <input
                type="number"
                required
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formSlots}
                onChange={(e) => setFormSlots(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-cyber font-bold tracking-widest text-[11px] uppercase rounded border border-amber-300/20 transition-all cursor-pointer"
          >
            ENGRAVE SCRIM BLOCK RECORD
          </button>
        </form>
      )}

      {/* Grid Tabs: ALL SCRIMS vs MY SCRIMS */}
      <div className="flex border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'border-cyan-451 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          ALL SCRIMS
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-5 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'my'
              ? 'border-cyan-451 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          MY SCRIMS ({user?.joinedScrims.length || 0})
        </button>
      </div>

      {/* Scrims list */}
      {displayedScrims.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">
            {activeTab === 'my' ? 'No scheduled scrim block matches found' : 'No available rooms'}
          </p>
          <p className="text-[10px] text-slate-600 mt-1 font-sans">
            {activeTab === 'my' ? 'Enter the ALL SCRIMS catalog and enroll in one of the daily blocks.' : 'Please add slots.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedScrims.map((s) => {
            const hasJoined = user?.joinedScrims.includes(s.id);
            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border bg-[#080816]/90 backdrop-blur transition-all duration-300 ${
                  s.isLive
                    ? 'border-rose-500/10 hover:border-rose-500/30 shadow-[0_0_15px_rgba(239,68,68,0.03)]'
                    : 'border-cyan-500/10 hover:border-cyan-500/25'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cyber font-black tracking-wide text-xs text-white uppercase sm:text-sm">
                        {s.title}
                      </h3>
                      {s.isLive && (
                        <span className="px-1.5 py-0.5 bg-red-600 text-white font-cyber text-[8px] tracking-wider rounded uppercase animate-pulse">
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mt-0.5">
                      {s.squadType} | {s.type === 'night' ? 'Night clock' : `${s.type} block`}
                    </span>
                  </div>

                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {s.time}
                    </div>
                  </div>
                </div>

                {/* Sub details */}
                <div className="mt-4 p-2.5 rounded bg-cyan-950/10 border border-cyan-500/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 uppercase">Registered Teams:</span>
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    {s.slotsJoined}/{s.slotsMax}
                  </span>
                </div>

                {s.registeredTeams && s.registeredTeams.length > 0 && (
                  <div className="mt-2 text-[9px] font-mono text-slate-600 truncate uppercase">
                    Clans: {s.registeredTeams.join(', ')}
                  </div>
                )}

                {/* Action trigger */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    {/* Admin Direct Remove Button */}
                    {isAdminMode && user?.isAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Purge scrim session "${s.title}" forever?`)) {
                            deleteScrim(s.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-950/25 border border-red-500/35 rounded text-rose-451 hover:bg-rose-600 hover:text-white transition-all cursor-pointer text-[9px] font-cyber font-bold uppercase whitespace-nowrap"
                        title="Delete scrim slot"
                      >
                        REMOVE
                      </button>
                    )}
                  </div>

                  {hasJoined ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-cyber font-bold text-[9px] tracking-wider uppercase rounded flex items-center gap-1 ml-auto"
                    >
                      <Check className="w-3 h-3" /> REGISTERED
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setErrorMsg('');
                        setSelectedScrim(s);
                      }}
                      className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 font-cyber font-bold text-[9px] tracking-wider uppercase rounded border border-cyan-400/20 transition-all cursor-pointer ml-auto"
                    >
                      JOIN SCRIM
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Scrim Dialog Modal */}
      {selectedScrim && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#0a0a19] border border-cyan-400/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,254,0.2)]">
            <button
              onClick={() => setSelectedScrim(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[9px] font-cyber tracking-widest text-cyan-400 uppercase">TACTICAL ENROLLMENT</span>
              <h3 className="font-cyber font-black text-xs text-white uppercase tracking-wide mt-1">
                Enter {selectedScrim.title} ({selectedScrim.time})
              </h3>
            </div>

            {success ? (
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 flex flex-col items-center gap-2 py-6">
                <BadgeCheck className="w-8 h-8 text-emerald-400" />
                <p className="font-cyber font-bold tracking-wider">Slot successfully secured!</p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                {errorMsg && (
                  <div className="p-2 bg-red-950/20 border border-red-500/20 rounded text-[11px] text-red-400">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">
                    Clan / Team Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Team Vayu"
                    className="bg-black/50 border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none focus:border-cyan-400 transition-all text-transform"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                <div className="p-2.5 border border-purple-500/25 bg-purple-950/10 rounded flex gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <p className="text-[9px] text-purple-300 leading-relaxed font-sans">
                    Room credentials (ID/Password) will be loaded straight to your personal notification board exactly 15 minutes before slot match schedules.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-cyber font-bold tracking-widest text-[10px] uppercase rounded border border-cyan-400/30 transition-all cursor-pointer"
                >
                  SECURE ROOM SLOT
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
