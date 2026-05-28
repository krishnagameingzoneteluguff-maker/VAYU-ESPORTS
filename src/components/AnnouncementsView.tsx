import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Megaphone, Calendar, HelpCircle, Shield, Award, PlayCircle } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { announcements } = useEsports();
  const [activeFilter, setActiveFilter] = useState<'all' | 'notice' | 'update' | 'rule' | 'result'>('all');

  const filteredAnnouncements = activeFilter === 'all'
    ? announcements
    : announcements.filter(ann => ann.category === activeFilter);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'notice':
        return 'text-rose-451 border-rose-500 bg-rose-950/10';
      case 'update':
        return 'text-cyan-451 border-cyan-400 bg-cyan-950/10';
      case 'rule':
        return 'text-amber-451 border-amber-500 bg-amber-950/10';
      case 'result':
        return 'text-emerald-451 border-emerald-500 bg-emerald-950/10';
      default:
        return 'text-slate-400 border-slate-500 bg-slate-950/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'notice':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'update':
        return <PlayCircle className="w-4 h-4 text-cyan-400" />;
      case 'rule':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'result':
        return <Award className="w-4 h-4 text-emerald-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="vayu-announcements-view" className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-cyan-500/10 pb-4">
        <span className="text-[10px] font-cyber tracking-widest text-cyan-400 block mb-1">TRANSMISSIONS LOG</span>
        <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">ANNOUNCEMENTS</h2>
      </div>

      {/* Categories filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2">
        {(['all', 'notice', 'update', 'rule', 'result'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 text-[10px] sm:text-xs font-cyber tracking-wider font-semibold uppercase rounded border transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.08)]'
                : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat === 'all' ? 'show all' : cat}
          </button>
        ))}
      </div>

      {/* Announcements board layout */}
      {filteredAnnouncements.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
          <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">No announcements inside specified sector</p>
          <p className="text-[10px] text-slate-600 mt-1">Please use the admin console log to seed new announcements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-xl border border-cyan-500/10 bg-[#080816]/90 backdrop-blur hover:bg-[#0c0c22] transition-colors flex flex-col md:flex-row md:items-start gap-4"
            >
              <div className={`p-2.5 h-10 w-10 flex items-center justify-center rounded border flex-shrink-0 ${getCategoryTheme(ann.category)}`}>
                {getCategoryIcon(ann.category)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-cyber font-black tracking-wide text-xs text-white uppercase sm:text-sm">
                    {ann.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    {ann.date}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                  {ann.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
