import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Trophy, Swords, Radio, Megaphone, Trash2, Plus, Check, ShieldAlert } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    tournaments,
    scrims,
    streams,
    announcements,
    addTournament,
    deleteTournament,
    addScrim,
    deleteScrim,
    addStream,
    deleteStream,
    addAnnouncement,
    deleteAnnouncement
  } = useEsports();

  const [activeTab, setActiveTab] = useState<'tournaments' | 'scrims' | 'streams' | 'announcements'>('tournaments');
  const [success, setSuccess] = useState('');

  // 1. Tournaments form states
  const [tTitle, setTTitle] = useState('');
  const [tStatus, setTStatus] = useState<'upcoming' | 'ongoing'>('upcoming');
  const [tBanner, setTBanner] = useState('🏆');
  const [tDate, setTDate] = useState('');
  const [tTime, setTTime] = useState('');
  const [tMaxSlots, setTMaxSlots] = useState(64);
  const [tEntry, setTEntry] = useState('FREE ENTRY');
  const [tPrize, setTPrize] = useState('₹5,00,000');

  // 2. Scrims form states
  const [sTitle, setSTitle] = useState('');
  const [sSquad, setSSquad] = useState<'Solo' | 'Duo' | 'Squad'>('Squad');
  const [sTime, setSTime] = useState('');
  const [sMaxSlots, setSMaxSlots] = useState(64);
  const [sType, setSType] = useState<'daily' | 'weekend' | 'practice' | 'night'>('daily');
  const [sLive, setSLive] = useState(false);

  // 3. Streams form states
  const [stTitle, setStTitle] = useState('');
  const [stYtId, setStYtId] = useState('dQw4w9WgXcQ');
  const [stViewers, setStViewers] = useState(1500);

  // 4. Announcements form states
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'notice' | 'update' | 'rule' | 'result'>('notice');
  const [annContent, setAnnContent] = useState('');

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2200);
  };

  // Submit operations
  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim() || !tDate.trim() || !tTime.trim()) return;

    addTournament({
      title: tTitle,
      status: tStatus,
      banner: tBannerHex(tBanner),
      date: tDate,
      time: tTime,
      slotsMax: Number(tMaxSlots),
      entryType: tEntry,
      prizePool: tPrize
    });

    setTTitle('');
    setTDate('');
    setTTime('');
    triggerSuccess('Tournament added directly to the official active lists.');
  };

  const handleAddScrim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim() || !sTime.trim()) return;

    addScrim({
      title: sTitle,
      squadType: sSquad,
      time: sTime,
      slotsMax: Number(sMaxSlots),
      type: sType,
      isLive: sLive
    });

    setSTitle('');
    setSTime('');
    triggerSuccess('New scrim room successfully loaded into database pools.');
  };

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stTitle.trim() || !stYtId.trim()) return;

    // Use a cool high quality gaming screen thumbnail fallback
    addStream({
      title: stTitle,
      youtubeId: stYtId,
      viewersCount: Number(stViewers),
      isLive: true,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
    });

    setStTitle('');
    setStYtId('');
    triggerSuccess('Live stream transmission key linked and mounted successfully.');
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: annContent,
      category: annCategory
    });

    setAnnTitle('');
    setAnnContent('');
    triggerSuccess('Announcement bulletin broadcasted.');
  };

  const tBannerHex = (emoji: string) => {
    if (emoji) return emoji;
    return '🏆';
  };

  return (
    <div id="vayu-admin-panel" className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-cyan-500/10 pb-4">
        <span className="text-[10px] font-cyber tracking-widest text-cyan-400 block mb-1">COMMAND CORE DECK</span>
        <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">ADMIN DASHBOARD</h2>
      </div>

      {/* Warning Alert reminding user "ONLY ADMIN ADDED CONTENT IS ALLOWED" */}
      <div className="p-3.5 bg-yellow-950/20 border border-yellow-500/20 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-400 font-sans leading-relaxed">
          <p className="font-semibold uppercase font-cyber tracking-wider">ADMINISTRATOR GUIDELINES ACTIVE</p>
          <p className="opacity-90">In complete compliance with project RULES 1-6, all content appearing in this application is strictly manually managed. No blogs, no ads, and no external scraping engines are allowed. Your edits here commit immediately.</p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/5 pb-2 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('tournaments'); }}
          className={`px-4 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'tournaments' ? 'border-cyan-451 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          Tournaments
        </button>
        <button
          onClick={() => { setActiveTab('scrims'); }}
          className={`px-4 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'scrims' ? 'border-cyan-451 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          Scrims
        </button>
        <button
          onClick={() => { setActiveTab('streams'); }}
          className={`px-4 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'streams' ? 'border-cyan-451 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          Live Streams
        </button>
        <button
          onClick={() => { setActiveTab('announcements'); }}
          className={`px-4 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'announcements' ? 'border-cyan-451 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          Announcements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Creator forms (Left 5 column widths) */}
        <div className="lg:col-span-5 p-5 border border-cyan-500/10 rounded-xl bg-[#070712]/90 space-y-4">
          
          {activeTab === 'tournaments' && (
            <form onSubmit={handleAddTournament} className="space-y-4">
              <h3 className="font-cyber font-bold text-xs text-yellow-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> CREATE TOURNAMENT
              </h3>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. VAYU INV-CHAMP"
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Banner Theme</label>
                  <select
                    className="bg-black border border-cyan-500/10 text-xs text-slate-350 py-2 px-2.5 rounded outline-none"
                    value={tBanner}
                    onChange={(e) => setTBanner(e.target.value)}
                  >
                    <option value="🏆">🏆 Trophy (Gold)</option>
                    <option value="⚔️">⚔️ Combat Swords</option>
                    <option value="👑">👑 Elite Crowns</option>
                    <option value="🎯">🎯 Accuracy Target</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Priority Status</label>
                  <select
                    className="bg-black border border-cyan-500/10 text-xs text-slate-350 py-2 px-2.5 rounded outline-none"
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value as 'upcoming' | 'ongoing')}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing (LIVE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Match Date</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 15 June, 2026"
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={tDate}
                    onChange={(e) => setTDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Launch Time</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 7:00 PM"
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={tTime}
                    onChange={(e) => setTTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Max Slots Count</label>
                  <input
                    type="number"
                    required
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={tMaxSlots}
                    onChange={(e) => setTMaxSlots(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Prize Pool Size</label>
                  <input
                    type="text"
                    required
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={tPrize}
                    onChange={(e) => setTPrize(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-cyber font-semibold tracking-wider text-[11px] uppercase rounded transition-all cursor-pointer"
              >
                COMMIT TOURNAMENT ENTRY
              </button>
            </form>
          )}

          {activeTab === 'scrims' && (
            <form onSubmit={handleAddScrim} className="space-y-4">
              <h3 className="font-cyber font-bold text-xs text-cyan-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Swords className="w-4 h-4 text-cyan-400" /> CREATE SCRIM BLOCK
              </h3>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Scrim Desk Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. EVENING EXPERT SESSIONS"
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                  value={sTitle}
                  onChange={(e) => setSTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Squad Category</label>
                  <select
                    className="bg-black border border-cyan-500/10 text-xs text-slate-350 py-2 px-2.5 rounded outline-none"
                    value={sSquad}
                    onChange={(e) => setSSquad(e.target.value as 'Solo' | 'Duo' | 'Squad')}
                  >
                    <option value="Squad">Squad (4v4)</option>
                    <option value="Duo">Duo (2v2)</option>
                    <option value="Solo">Solo (1v1)</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Clock Block Type</label>
                  <select
                    className="bg-black border border-cyan-500/10 text-xs text-slate-350 py-2 px-2.5 rounded outline-none"
                    value={sType}
                    onChange={(e) => setSType(e.target.value as 'daily' | 'weekend' | 'practice' | 'night')}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekend">Weekend</option>
                    <option value="practice">Practice</option>
                    <option value="night">Night Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Room Time</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 9:30 PM"
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={sTime}
                    onChange={(e) => setSTime(e.target.value)}
                  />
                </div>

                <div className="space-y-1 flex flex-col gap-1">
                  <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Cap Slots</label>
                  <input
                    type="number"
                    required
                    className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                    value={sMaxSlots}
                    onChange={(e) => setSMaxSlots(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-1 bg-black/30 px-3 rounded border border-cyan-500/5">
                <span className="text-[10px] font-cyber text-slate-400 uppercase">Publish straight as LIVE?</span>
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 accent-cyan-400 rounded"
                  checked={sLive}
                  onChange={() => setSLive(!sLive)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-cyber font-semibold tracking-wider text-[11px] uppercase rounded transition-all cursor-pointer"
              >
                COMMIT SCRIM SLOT
              </button>
            </form>
          )}

          {activeTab === 'streams' && (
            <form onSubmit={handleAddStream} className="space-y-4">
              <h3 className="font-cyber font-bold text-xs text-rose-500 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Radio className="w-4 h-4 text-rose-500" /> MOUNT BROADCAST KEY
              </h3>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Stream Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. GRAND HIGHLIGHTS COVERAGE"
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                  value={stTitle}
                  onChange={(e) => setStTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">YouTube Link ID</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. dQw4w9WgXcQ"
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none font-mono"
                  value={stYtId}
                  onChange={(e) => setStYtId(e.target.value)}
                />
              </div>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Watcher Multipliers</label>
                <input
                  type="number"
                  required
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                  value={stViewers}
                  onChange={(e) => setStViewers(Number(e.target.value))}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cyber font-semibold tracking-wider text-[11px] uppercase rounded transition-all cursor-pointer"
              >
                CONNECT LIVE STREAM
              </button>
            </form>
          )}

          {activeTab === 'announcements' && (
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <h3 className="font-cyber font-bold text-xs text-pink-500 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Megaphone className="w-4 h-4 text-pink-500" /> ENGRAVE BULLETIN
              </h3>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Bulletin Title / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. REGISTRATION CLOSED NOTICE"
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Broadcasting category</label>
                <select
                  className="bg-black border border-cyan-500/10 text-xs text-slate-350 py-2 px-2.5 rounded outline-none"
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                >
                  <option value="notice">Notice Warning</option>
                  <option value="update">Updates & Schedules</option>
                  <option value="rule">Tactical Rules</option>
                  <option value="result">Champion Results</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[9px] font-cyber tracking-wider text-slate-400 uppercase">Content details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear, humble, precise sentences outlining regulations..."
                  className="bg-black border border-cyan-500/10 focus:border-cyan-400 rounded py-2 px-3 text-xs text-white outline-none font-sans"
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-cyber font-semibold tracking-wider text-[11px] uppercase rounded transition-all cursor-pointer"
              >
                BROADCAST GLOBAL ANNOUNCEMENT
              </button>
            </form>
          )}

        </div>

        {/* Database records viewer/deletor (Right 7 column widths) */}
        <div className="lg:col-span-7 p-5 border border-cyan-500/10 rounded-xl bg-[#070712]/90 space-y-4 min-h-[430px]">
          <h3 className="font-cyber font-bold text-xs text-slate-350 tracking-wider uppercase border-b border-white/5 pb-2">
            DATABASE REGISTRATION ROSTER ({
              activeTab === 'tournaments' ? tournaments.length :
              activeTab === 'scrims' ? scrims.length :
              activeTab === 'streams' ? streams.length :
              announcements.length
            } active)
          </h3>

          <div className="space-y-2 max-h-[450px] overflow-y-auto">
            {activeTab === 'tournaments' && tournaments.map((t) => (
              <div key={t.id} className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-cyber font-black tracking-wide text-white uppercase text-[11px]">{t.title}</h4>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">{t.status} • {t.date}</span>
                </div>
                <button
                  onClick={() => {
                    deleteTournament(t.id);
                    triggerSuccess('Tournament wiped from registration logs.');
                  }}
                  className="p-1 px-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/15 text-rose-451 hover:text-white rounded cursor-pointer transition-colors"
                  title="Purge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {activeTab === 'scrims' && scrims.map((s) => (
              <div key={s.id} className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-cyber font-black tracking-wide text-white uppercase text-[11px]">{s.title}</h4>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">{s.squadType} • {s.time} • {s.type}</span>
                </div>
                <button
                  onClick={() => {
                    deleteScrim(s.id);
                    triggerSuccess('Scrim session permanently wiped.');
                  }}
                  className="p-1 px-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/15 text-rose-451 hover:text-white rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {activeTab === 'streams' && streams.map((st) => (
              <div key={st.id} className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-cyber font-black tracking-wide text-white uppercase text-[11px]">{st.title}</h4>
                  <span className="text-[9px] font-mono text-cyan-400 block uppercase">YOUTUBE KEY: {st.youtubeId}</span>
                </div>
                <button
                  onClick={() => {
                    deleteStream(st.id);
                    triggerSuccess('Live stream transmission feed unhooked.');
                  }}
                  className="p-1 px-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/15 text-rose-451 hover:text-white rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {activeTab === 'announcements' && announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-start text-xs">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-cyber font-black tracking-wide text-white uppercase text-[11px] truncate">{ann.title}</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-1 line-clamp-1">{ann.content}</p>
                </div>
                <button
                  onClick={() => {
                    deleteAnnouncement(ann.id);
                    triggerSuccess('Bulletin pulled from network feed.');
                  }}
                  className="p-1 px-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/15 text-rose-451 hover:text-white rounded cursor-pointer transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
