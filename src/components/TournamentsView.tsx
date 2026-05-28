import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Tournament } from '../types';
import { Trophy, Calendar, Users, BadgeAlert, ShieldAlert, CheckCircle, Search, Sparkles, X } from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { tournaments, user, joinTournament, addTournament, deleteTournament, isAdminMode } = useEsports();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  // Registration Form states
  const [teamName, setTeamName] = useState('');
  const [roster, setRoster] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin fast-create form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('7:00 PM');
  const [formPrize, setFormPrize] = useState('₹5,00,000');
  const [formSlots, setFormSlots] = useState(32);

  const handleAddNewTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate.trim() || !formTime.trim()) return;

    addTournament({
      title: formTitle,
      status: 'upcoming',
      banner: '🏆',
      date: formDate,
      time: formTime,
      slotsMax: Number(formSlots),
      entryType: 'FREE ENTRY',
      prizePool: formPrize
    });

    setFormTitle('');
    setFormDate('');
    setShowAddForm(false);
  };

  const filteredTournaments = tournaments
    .filter(t => t.status === activeTab)
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be signed in to submit tournament applications.');
      return;
    }
    if (!teamName.trim()) {
      setErrorMsg('Please specify Clan / Team designation name.');
      return;
    }
    if (!roster.trim()) {
      setErrorMsg('Enter at least 1 roster member block.');
      return;
    }

    if (selectedTournament) {
      const result = joinTournament(selectedTournament.id, teamName);
      if (result) {
        setSuccessMsg(`Squad "${teamName}" successfully provisioned to roster for ${selectedTournament.title}!`);
        setTeamName('');
        setRoster('');
        setTimeout(() => {
          setSelectedTournament(null);
          setSuccessMsg('');
        }, 2200);
      } else {
        setErrorMsg('Unable to register. Roster slot either complete or you are already enlisted.');
      }
    }
  };

  return (
    <div id="vayu-tournaments-view" className="space-y-6 pb-12">
      
      {/* Header with quick search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <span className="text-[10px] font-cyber tracking-widest text-cyan-400 block mb-1">CHAMPIONSHIP HUB</span>
          <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">TOURNAMENTS DESK</h2>
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Admin Fast Button direct on core hub page */}
          {isAdminMode && user?.isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-cyber font-bold text-[10px] tracking-wider uppercase rounded cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showAddForm ? 'Close Creator' : 'Add Tournament'}
            </button>
          )}

          {/* Futuristic Search bar */}
          <div className="relative flex-1 md:w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Arena..."
              className="w-full bg-[#101026]/70 border border-cyan-500/10 focus:border-cyan-405/50 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Admin record post form inline */}
      {showAddForm && isAdminMode && user?.isAdmin && (
        <form onSubmit={handleAddNewTournament} className="p-5 border border-amber-500/30 rounded-xl bg-black/60 backdrop-blur-md space-y-4">
          <div className="border-b border-amber-500/10 pb-2">
            <h3 className="font-cyber font-bold text-xs text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> DIRECT ADD CHAMPIONSHIP TOURNAMENT
            </h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Your additions here publish immediately to the live public hubs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Tournament Title</label>
              <input
                type="text"
                required
                placeholder="E.g. VAYU GOLDEN CLASH"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Prize Pool Size</label>
              <input
                type="text"
                required
                placeholder="E.g. ₹5,00,000"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formPrize}
                onChange={(e) => setFormPrize(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Launch Date Label</label>
              <input
                type="text"
                required
                placeholder="E.g. 15 June, 2026"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Time Block</label>
              <input
                type="text"
                required
                placeholder="E.g. 8:00 PM"
                className="bg-[#03030b] border border-cyan-500/25 rounded py-2 px-3 text-xs text-white outline-none"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Max Enlisted Teams</label>
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
            ENGRAVE TOURNAMENT RECORD
          </button>
        </form>
      )}

      {/* Tabs list matching Prd styling */}
      <div className="flex items-center gap-2 border-b border-cyan-500/5 pb-2 overflow-x-auto">
        {(['upcoming', 'ongoing', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
            className={`px-4 py-2 text-[10px] sm:text-xs font-cyber tracking-wider font-semibold uppercase rounded transition-all cursor-pointer border ${
              activeTab === tab
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of tournament cards */}
      {filteredTournaments.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
          <BadgeAlert className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-bounce" />
          <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">No matches inside specified sector</p>
          <p className="text-[10px] text-slate-600 mt-1 font-sans">Check other segment tabs or use Admin Panel to seed entries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTournaments.map((t) => {
            const hasJoined = user?.joinedTournaments.includes(t.id);
            return (
              <div
                key={t.id}
                className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 bg-[#070714]/80 backdrop-blur ${
                  t.status === 'upcoming'
                    ? 'border-yellow-500/10 hover:border-yellow-500/30'
                    : t.status === 'ongoing'
                    ? 'border-purple-500/10 hover:border-purple-500/30'
                    : 'border-slate-500/10 hover:border-slate-500/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Status header badge */}
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className={`px-2.5 py-0.5 rounded uppercase font-cyber font-bold tracking-widest ${
                      t.status === 'upcoming'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : t.status === 'ongoing'
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {t.status === 'upcoming' ? 'Upcoming' : t.status === 'ongoing' ? 'LIVE STATS' : 'Archived'}
                    </span>
                    <span className="text-pink-400 font-bold tracking-widest uppercase">{t.entryType}</span>
                  </div>

                  {/* Title and stats layout */}
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-3xl font-cyber ${
                      t.status === 'upcoming' ? 'bg-amber-950/20 text-yellow-400 border border-amber-500/20' : 'bg-purple-950/20 text-purple-400 border border-purple-500/20'
                    }`}>
                      {t.banner}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-cyber font-black tracking-wide text-sm text-white uppercase sm:text-base">
                        {t.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-mono text-slate-400 uppercase">
                        <span className="text-cyan-400 flex items-center gap-0.5">
                          <Users className="w-3 h-3" />
                          {t.slotsJoined}/{t.slotsMax} ENROLLED
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" />
                          {t.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prize pool overlay */}
                  <div className="p-2.5 rounded bg-cyan-950/5 border border-cyan-500/5 text-xs flex justify-between font-mono">
                    <span className="text-slate-500">PRIZE DECK:</span>
                    <span className="text-cyan-300 font-bold">{t.prizePool}</span>
                  </div>
                </div>

                {/* Submitting button trigger */}
                <div className="mt-5 pt-3.5 border-t border-white/5 flex gap-3.5 items-center justify-between">
                  {t.teamsJoined.length > 0 && (
                    <div className="text-[10px] font-mono text-slate-500 max-w-[50%] truncate">
                      Last enlist: {t.teamsJoined[t.teamsJoined.length - 1]}
                    </div>
                  )}
                  {t.status === 'completed' ? (
                    <span className="text-[10px] font-cyber text-slate-500 uppercase tracking-widest ml-auto">
                      🏆 CHAMPION: {t.teamsJoined[0] || 'TBD'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 ml-auto">
                      {/* Admin Direct Remove Button */}
                      {isAdminMode && user?.isAdmin && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Purge tournament "${t.title}" forever?`)) {
                              deleteTournament(t.id);
                            }
                          }}
                          className="px-3 py-2 bg-red-950/25 border border-red-500/35 rounded text-rose-451 hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-cyber font-bold whitespace-nowrap"
                          title="Delete tournament"
                        >
                          REMOVE
                        </button>
                      )}

                      {hasJoined ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-cyber font-bold text-[10px] tracking-wider uppercase rounded flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          ENLISTED
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setErrorMsg('');
                            setSelectedTournament(t);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-cyber font-bold text-[10px] tracking-wider uppercase rounded border border-cyan-400/30 transition-all cursor-pointer"
                        >
                          JOIN TOURNAMENT
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roster Application Dialog (Glassmorphism Overlay) */}
      {selectedTournament && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0a0a19] border border-cyan-400/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,254,0.2)]">
            <button
              onClick={() => setSelectedTournament(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[9px] font-cyber tracking-widest text-cyan-400 uppercase">GLADIATOR VERIFICATION</span>
              <h3 className="font-cyber font-black text-sm text-white uppercase tracking-wide mt-1 line-clamp-1">
                Register for {selectedTournament.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Free and instant registration for validated clans.</p>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 flex flex-col items-center gap-2 py-6">
                <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                <p className="font-cyber font-bold tracking-wider">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-2 bg-red-950/20 border border-red-500/20 rounded text-[11px] text-red-400">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1Class flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">
                    Clan / Team Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Squad Hydra"
                    className="bg-black/50 border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none focus:border-cyan-400 transition-all"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">
                    Gladiator Rosters (Comma separated, min 4)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. HydraLeader, HydraAim, HydraFrag, HydraCover"
                    className="bg-black/50 border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none focus:border-cyan-400 transition-all font-mono"
                    value={roster}
                    onChange={(e) => setRoster(e.target.value)}
                  />
                </div>

                <div className="p-2.5 border border-amber-500/20 bg-amber-950/10 rounded flex gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-[9px] text-amber-400 leading-relaxed font-sans">
                    By submitting this enlistment, you confirm that your squad rosters are clean and conform to our regulatory safety criteria. Overlay systems are strictly banned.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-cyber font-bold tracking-widest text-[10px] uppercase rounded border border-cyan-400/30 transition-all cursor-pointer"
                >
                  TRANSMIT APPLICATIONS
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
