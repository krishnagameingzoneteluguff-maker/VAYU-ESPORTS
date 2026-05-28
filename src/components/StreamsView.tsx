import React, { useState, useEffect } from 'react';
import { useEsports } from '../context/EsportsContext';
import { Stream } from '../types';
import { Radio, Users, Play, HelpCircle, Send, CheckCircle } from 'lucide-react';

const CHAT_PHRASES = [
  { user: 'RageOP', text: 'OMG WHAT A SPRAY! 🔥' },
  { user: 'GladiatorAim', text: 'VAYU esports is playing on a completely different core system!' },
  { user: 'HydraPro', text: 'Nice clutches!' },
  { user: 'VayuFan_7', text: 'LEZZGO Team VAYU!!!' },
  { user: 'Omega_001', text: 'Is this the grand finals deck?' },
  { user: 'AlphaRider', text: 'That double kill with the grenade was INSANE!' },
  { user: 'BumbleBee', text: 'K/D ratio on VAYUxGOD is literally 6.8 wtf' },
  { user: 'S8UL_Fanatic', text: 'Can we get room IDs for the next slot?' },
  { user: 'GodLikeAim', text: 'Beautiful layout guys, the interface is extremely smooth.' },
  { user: 'VAYU_Admin', text: 'Please maintain server discipline. No hack overlays.' }
];

export const StreamsView: React.FC = () => {
  const { streams } = useEsports();
  const [activeTab, setActiveTab] = useState<'all' | 'youtube'>('all');
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  
  // Realtime cinematic rolling Chat states
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; text: string }>>([
    { id: '1', user: 'System', text: 'Welcome to VAYU Live Stream Broadcast Deck.' },
    { id: '2', user: 'VAYU_Host', text: 'Chat active. Maintain sportsman behavior.' }
  ]);
  const [userInputMessage, setUserInputMessage] = useState('');

  // Start scrolling chat simulation when a stream is pinned
  useEffect(() => {
    if (!activeStream) return;

    const chatInterval = setInterval(() => {
      const phrase = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)];
      setChatMessages((prev) => [
        ...prev.slice(-30), // Maintain only last 30 for RAM optimization
        { id: Math.random().toString(), user: phrase.user, text: phrase.text }
      ]);
    }, 2800);

    return () => clearInterval(chatInterval);
  }, [activeStream]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInputMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), user: 'You', text: userInputMessage }
    ]);
    setUserInputMessage('');
  };

  // Set default stream on load or render first item
  useEffect(() => {
    if (streams.length > 0 && !activeStream) {
      setActiveStream(streams[0]);
    }
  }, [streams, activeStream]);

  return (
    <div id="vayu-streams-view" className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-cyan-500/10 pb-4">
        <span className="text-[10px] font-cyber tracking-widest text-cyan-400 block mb-1">CONSTELLATION BROADCASTS</span>
        <h2 className="text-xl md:text-2xl font-cyber font-semibold text-white tracking-wide uppercase">LIVE STREAMS</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'border-cyan-451 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          ALL STREAMS
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-5 py-2.5 text-xs font-cyber tracking-wider font-semibold uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'youtube'
              ? 'border-cyan-451 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-white'
          }`}
        >
          YOUTUBE LIVE
        </button>
      </div>

      {/* Cinematic layout if a stream is selected */}
      {activeStream ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main cinematic video grid (Left 2 widths) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Real embedded YouTube player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeStream.youtubeId}?autoplay=1&mute=1&playlist=${activeStream.youtubeId}&loop=1`}
                title={activeStream.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video metadata */}
            <div className="p-4 rounded-xl border border-white/5 bg-[#080814]/80 backdrop-blur space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white font-cyber text-[9px] font-black tracking-widest rounded uppercase animate-pulse">
                  LIVE
                </span>
                <h3 className="font-cyber font-black tracking-wide text-xs text-white uppercase sm:text-base">
                  {activeStream.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <Users className="w-4 h-4 text-cyan-500" />
                  {(activeStream.viewersCount).toLocaleString()} CONCURRENT WATCHERS
                </span>
                <span>•</span>
                <span>VAYU OFFICIAL CHANNEL</span>
              </div>
            </div>
          </div>

          {/* Scrolling Twitch/YouTube Chat (Right 1 width) */}
          <div className="flex flex-col h-[400px] lg:h-full border border-cyan-500/10 rounded-xl bg-[#070712] overflow-hidden">
            {/* Channel header */}
            <div className="p-3 bg-cyan-950/20 border-b border-cyan-500/10 flex justify-between items-center">
              <span className="text-[10px] font-cyber tracking-wider text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                COMMUNITY DECK CHAT
              </span>
              <span className="text-[9px] font-mono text-slate-500 animate-pulse uppercase">LIVE</span>
            </div>

            {/* Rolling Chat panel container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none flex flex-col justify-end">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs font-sans leading-relaxed">
                  <span className={`font-cyber text-[10px] font-black mr-2 uppercase tracking-wide ${
                    msg.user === 'You'
                      ? 'text-yellow-400'
                      : msg.user.includes('Admin') || msg.user.includes('Host')
                      ? 'text-rose-400'
                      : 'text-cyan-400'
                  }`}>
                    {msg.user}:
                  </span>
                  <span className="text-slate-300 font-medium break-words">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Chat submit footer */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Send a secure message..."
                className="flex-1 bg-[#101026]/70 border border-cyan-500/10 focus:border-cyan-405/50 rounded py-1.5 px-3 text-xs text-white outline-none transition-all placeholder-slate-600"
                value={userInputMessage}
                onChange={(e) => setUserInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="p-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-cyber font-bold rounded flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-cyan-500/10 rounded-xl bg-cyan-950/2">
          <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-cyber uppercase tracking-wider">No stream feeds mounted</p>
          <p className="text-[10px] text-slate-600 mt-1">Please use the admin control deck to add live feeds.</p>
        </div>
      )}

      {/* Other options/archives in grid */}
      {streams.length > 1 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-cyber font-bold text-xs text-slate-400 tracking-wider uppercase">SELECT TRANSMISSION CHANNELS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {streams.map((st) => (
              <div
                key={st.id}
                onClick={() => {
                  setActiveStream(st);
                  setChatMessages([
                    { id: '1', user: 'System', text: 'Switched transmission feed successfully. Core established.' }
                  ]);
                }}
                className={`group p-2 rounded-lg border bg-[#06060f]/90 hover:bg-[#0c0c1e] transition-all duration-300 cursor-pointer flex flex-col justify-between h-36 ${
                  activeStream?.id === st.id ? 'border-cyan-400 shadow-[0_0_10px_rgba(0,186,198,0.1)]' : 'border-white/5 hover:border-cyan-500/30'
                }`}
              >
                <div className="aspect-video w-full rounded overflow-hidden relative bg-black">
                  <img
                    referrerPolicy="no-referrer"
                    src={st.thumbnail}
                    alt={st.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 left-1 px-1 py-0.5 bg-red-600 text-white font-cyber text-[6px] font-black rounded uppercase">
                    LIVE
                  </div>
                </div>
                <h4 className="font-cyber font-bold text-[10px] text-slate-300 group-hover:text-white uppercase truncate mt-2">
                  {st.title}
                </h4>
                <div className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">
                  {(st.viewersCount).toLocaleString()} Watching
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
