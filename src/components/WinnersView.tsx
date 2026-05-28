import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { WinnerRecord } from '../types';
import { Trophy, Award, Search, Calendar, Users, Medal, Sparkles, Filter, ShieldCheck, Heart } from 'lucide-react';

export const WinnersView: React.FC = () => {
  const { user, isAdminMode, winners, addWinner, deleteWinner } = useEsports();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // States for Admin to post a new Winner directly
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTournament, setFormTournament] = useState('');
  const [formCategory, setFormCategory] = useState<'championship' | 'pro' | 'elite' | 'cup'>('championship');
  const [formPrize, setFormPrize] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formChampion, setFormChampion] = useState('');
  const [formRunnerUp, setFormRunnerUp] = useState('');
  const [formRoster, setFormRoster] = useState('');
  const [formMvp, setFormMvp] = useState('');
  const [formMvpKills, setFormMvpKills] = useState(15);
  const [formLogo, setFormLogo] = useState('🏆');

  const handleAddWinner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTournament.trim() || !formChampion.trim() || !formPrize.trim()) return;

    addWinner({
      tournamentName: formTournament.toUpperCase(),
      category: formCategory,
      prizeWon: formPrize,
      completionDate: formDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      championTeam: formChampion.toUpperCase(),
      runnerUpTeam: formRunnerUp.toUpperCase() || 'TBD SQUAD',
      teamLogoEmoji: formLogo,
      championRoster: formRoster ? formRoster.split(',').map(s => s.trim()) : ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
      mvpPlayer: formMvp || 'MVP Player',
      mvpKills: Number(formMvpKills) || 12
    });

    setShowAddForm(false);
    
    // reset form fields
    setFormTournament('');
    setFormPrize('');
    setFormDate('');
    setFormChampion('');
    setFormRunnerUp('');
    setFormRoster('');
    setFormMvp('');
  };

  const handleDeleteWinner = (id: string) => {
    deleteWinner(id);
  };

  const filteredWinners = winners.filter(item => {
    const matchesSearch = item.tournamentName.toLowerCase().includes(search.toLowerCase()) || 
                          item.championTeam.toLowerCase().includes(search.toLowerCase()) ||
                          item.mvpPlayer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Highlighted Top Winner
  const grandChampion = winners[0];

  return (
    <div id="vayu-winners-view" className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <span className="text-[10px] font-cyber tracking-widest text-amber-400 block mb-1">HALL OF GLORY</span>
          <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">TOURNAMENT WINNERS</h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Admin Fast Post Trigger */}
          {isAdminMode && user?.isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-cyber font-bold text-[10px] tracking-wider uppercase rounded cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showAddForm ? 'Close Roster Board' : 'Record New Winner'}
            </button>
          )}

          {/* Search bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Champion / Event..."
              className="w-full bg-[#101026]/70 border border-cyan-500/10 focus:border-cyan-405/50 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Admin record post form overlay */}
      {showAddForm && isAdminMode && user?.isAdmin && (
        <form onSubmit={handleAddWinner} className="p-5 border border-amber-500/30 rounded-xl bg-black/60 backdrop-blur-md space-y-4">
          <div className="border-b border-amber-500/10 pb-2">
            <h3 className="font-cyber font-bold text-xs text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> BROADCAST CHAMPION ROSTER TO HALL
            </h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Publish past completed tournament accomplishments dynamically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Tournament Designation</label>
              <input
                type="text"
                required
                placeholder="E.g. VAYU PRO SHOWDOWN"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formTournament}
                onChange={(e) => setFormTournament(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Prize Pocket Standard</label>
              <input
                type="text"
                required
                placeholder="E.g. ₹2,00,000"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formPrize}
                onChange={(e) => setFormPrize(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Completion Calendar Date</label>
              <input
                type="text"
                placeholder="E.g. 28 May, 2026"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Champion Team / Clan</label>
              <input
                type="text"
                required
                placeholder="E.g. OLYMPUS ESPORTS"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formChampion}
                onChange={(e) => setFormChampion(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Runner Up Team / Clan</label>
              <input
                type="text"
                placeholder="E.g. MATRIX GAMING"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formRunnerUp}
                onChange={(e) => setFormRunnerUp(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1 flex flex-col gap-1 md:col-span-2">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Champion Squad Roster (Comma separated)</label>
              <input
                type="text"
                placeholder="E.g. Zeal, Apex, Sniper, Ghost"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none font-mono"
                value={formRoster}
                onChange={(e) => setFormRoster(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col gap-1">
              <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Vanguard MVP Player</label>
              <input
                type="text"
                placeholder="E.g. Zeal"
                className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                value={formMvp}
                onChange={(e) => setFormMvp(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">MVP Kills</label>
                <input
                  type="number"
                  className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-3 text-xs text-white outline-none"
                  value={formMvpKills}
                  onChange={(e) => setFormMvpKills(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Category</label>
                <select
                  className="bg-[#03030b] border border-cyan-500/20 rounded py-2 px-2 text-xs text-slate-300 outline-none"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                >
                  <option value="championship">Championship</option>
                  <option value="pro">Pro Series</option>
                  <option value="elite">Elite Cup</option>
                  <option value="cup">Cup Event</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-cyber font-bold tracking-widest text-[11px] uppercase rounded border border-amber-300/25 transition-all cursor-pointer"
          >
            ENGRAVE WINNER ACCOMPLISHMENT Record
          </button>
        </form>
      )}

      {/* Hero Featured Champion Card */}
      {grandChampion && selectedCategory === 'all' && !search && (
        <div className="relative border border-amber-500/30 rounded-xl bg-gradient-to-br from-[#1c1204]/90 via-[#0a0602]/90 to-black p-6 space-y-4 shadow-[0_10px_40px_rgba(245,158,11,0.08)] overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400 opacity-20 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/10 pb-3">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-cyber font-bold text-[9px] tracking-widest uppercase rounded flex items-center gap-1.5">
              <Medal className="w-3.5 h-3.5" /> RECENT GRAND CHAMPION
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> completed: {grandChampion.completionDate}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
                {grandChampion.teamLogoEmoji}
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider">{grandChampion.tournamentName}</span>
                <h3 className="font-cyber font-black tracking-wider text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-250 uppercase">
                  {grandChampion.championTeam}
                </h3>
                <p className="text-xs text-slate-350 font-sans mt-0.5">
                  Roster: <strong className="font-mono text-emerald-400">{grandChampion.championRoster.join(' • ')}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center p-3.5 rounded-lg border border-amber-500/10 bg-black/40 min-w-[200px]">
              <div className="text-left md:text-right">
                <span className="text-[9px] font-cyber text-slate-500 uppercase tracking-widest block">GRAND REWARD DECK</span>
                <span className="text-lg font-cyber font-bold tracking-wide text-amber-400">{grandChampion.prizeWon}</span>
              </div>
              <div className="mt-0 md:mt-2 text-left md:text-right">
                <span className="text-[8px] font-mono text-slate-500 block uppercase">VANGUARD MVP</span>
                <span className="text-[10px] font-cyber text-white uppercase font-bold tracking-wider">
                  🎯 {grandChampion.mvpPlayer} ({grandChampion.mvpKills} kills)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
          {[
            { id: 'all', label: 'All Arenas' },
            { id: 'championship', label: 'Championships' },
            { id: 'pro', label: 'Pro Series' },
            { id: 'elite', label: 'Elite Cups' },
            { id: 'cup', label: 'Cup Events' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-[10px] font-cyber tracking-wider font-semibold uppercase rounded transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-[9px] font-mono text-slate-500 uppercase">
          {filteredWinners.length} ARCHIVED RESULTS FOUND
        </span>
      </div>

      {/* Grid of Past Winners */}
      {filteredWinners.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
          <Award className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">Empty sector: no winners database posted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWinners.map((record) => (
            <div
              key={record.id}
              className="relative p-5 rounded-xl border border-cyan-500/10 hover:border-amber-500/20 bg-[#06060f]/80 backdrop-blur transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/10 group-hover:border-amber-400/20 pointer-events-none transition-colors" />
              
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start text-[10px] font-mono border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="font-cyber font-bold text-white uppercase text-[10px] tracking-wide line-clamp-1">{record.tournamentName}</span>
                  </div>
                  <span className="text-slate-500 whitespace-nowrap pl-2">{record.completionDate}</span>
                </div>

                {/* Champion details */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/20 border border-cyan-500/10 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(0,242,254,0.05)]">
                    {record.teamLogoEmoji}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-amber-500 block uppercase tracking-widest font-bold">🥇 CHAMPION UNIT</span>
                    <h4 className="font-cyber font-black tracking-wide text-xs text-white uppercase mt-0.5 sm:text-sm">
                      {record.championTeam}
                    </h4>
                  </div>
                </div>

                {/* Roster details */}
                <div className="bg-black/30 p-2 rounded border border-white/5 space-y-1.5">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">SQUAD SATELLITE ROSTER:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {record.championRoster.map((player, idx) => (
                      <span key={idx} className="text-[9px] font-mono text-slate-350 bg-cyan-950/20 border border-cyan-500/5 px-1.5 py-0.5 rounded leading-none">
                        👤 {player}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roon Stats & MVP */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="p-2 rounded bg-cyan-950/5 border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">RUNNER-UP:</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">🥈 {record.runnerUpTeam}</span>
                  </div>
                  <div className="p-2 rounded bg-cyan-950/5 border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">SECURED MVP:</span>
                    <span className="text-[9px] text-amber-400 font-cyber font-bold block truncate">🎯 {record.mvpPlayer} ({record.mvpKills}K)</span>
                  </div>
                </div>
              </div>

              {/* Reward Ribbon & Option block */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-510 uppercase block">REWARD SUMMIT:</span>
                  <span className="text-xs font-cyber font-black text-amber-400">{record.prizeWon}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-cyber text-slate-500 uppercase tracking-widest">
                    VERIFIED ROSTER
                  </span>
                  
                  {/* Delete record option for Admin */}
                  {isAdminMode && user?.isAdmin && (
                    <button
                      onClick={() => handleDeleteWinner(record.id)}
                      className="p-1.5 border border-red-500/20 hover:border-red-500 hover:bg-red-500/15 text-rose-500 hover:text-white rounded cursor-pointer transition-all ml-1"
                      title="Purge winner listing"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
