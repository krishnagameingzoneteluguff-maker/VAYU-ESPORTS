import React, { useState } from 'react';
import { useEsports } from '../context/EsportsContext';
import { User, Bell, Globe, CheckCircle2, ShieldAlert, LogOut, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, logout } = useEsports();
  const [notify, setNotify] = useState(true);
  const [discordLinked, setDiscordLinked] = useState(true);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [lang, setLang] = useState('English');
  const [statusMsg, setStatusMsg] = useState('');

  if (!user) return null;

  const handleSave = () => {
    setStatusMsg('Your settings have been saved successfully!');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  return (
    <div id="vayu-classic-settings-view" className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      
      {/* Title Header */}
      <div className="border-b border-slate-200/10 pb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Account Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure your personal preferences, notifications, and localization settings.</p>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Profile and Integrations */}
        <div className="space-y-6">
          
          {/* Account Profile Card */}
          <div className="p-5 rounded-lg border border-slate-200/10 bg-[#080816] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
              <User className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wide text-white">Profile Details</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-450">Email Address</span>
                <span className="font-mono text-white select-all">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-450">Account Level</span>
                <span className="font-medium text-white">Level {user.level}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-455">System Role</span>
                <span className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                  user.isAdmin ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  {user.isAdmin ? 'ADMINISTRATOR' : 'STANDARD USER'}
                </span>
              </div>
            </div>
          </div>

          {/* Social Sign-In Connections */}
          <div className="p-5 rounded-lg border border-slate-200/10 bg-[#080816] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
              <User className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="font-bold text-xs uppercase tracking-wide text-purple-400">Linked Accounts</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Connect Discord</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Link account to get match updates inside Discord channel.</p>
                </div>
                <input
                  type="checkbox"
                  checked={discordLinked}
                  onChange={(e) => setDiscordLinked(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Google Account Sync</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Log in instantly using your Google registration credentials.</p>
                </div>
                <input
                  type="checkbox"
                  checked={googleLinked}
                  onChange={(e) => setGoogleLinked(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Communication and Preferences */}
        <div className="space-y-6">

          {/* Notification Preferences */}
          <div className="p-5 rounded-lg border border-slate-200/10 bg-[#080816] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
              <Bell className="w-4.5 h-4.5 text-pink-400" />
              <h3 className="font-bold text-xs uppercase tracking-wide text-pink-400">Notification Settings</h3>
            </div>

            <div className="flex items-start justify-between">
              <div className="pr-4">
                <span className="text-xs font-semibold text-slate-200 block">Push Notifications</span>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">Receive browser push and email reminders exactly when Tournament custom room slots go live.</p>
              </div>
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="w-4 h-4 mt-1 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Localization Card */}
          <div className="p-5 rounded-lg border border-slate-200/10 bg-[#080816] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
              <Globe className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wide text-cyan-400">Language & Localization</h3>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Preferred Language</span>
                <p className="text-[10px] text-slate-400">Select language for interface text strings and announcements.</p>
              </div>
              <select
                className="bg-black border border-white/10 hover:border-cyan-400/30 text-xs text-white py-1.5 px-3 rounded-md outline-none transition-all"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="English">English (United States)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Spanish">Español (Spanish)</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Button controls footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-md transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" /> Save Settings
          </button>
          
          <button
            onClick={() => {
              setStatusMsg('Terminal reload initialized.');
              setTimeout(() => window.location.reload(), 1000);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-transparent text-slate-400 hover:text-white hover:bg-white/5 text-xs rounded-md border border-slate-700 transition-all cursor-pointer"
          >
            Reload UI Cache
          </button>
        </div>

        <button
          onClick={logout}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-950/20 hover:bg-red-650 hover:text-white text-rose-451 hover:border-red-500 text-xs font-semibold rounded-md border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Disconnect Terminal Account
        </button>
      </div>

    </div>
  );
};
