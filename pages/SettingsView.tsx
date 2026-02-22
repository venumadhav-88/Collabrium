import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Camera,
  CheckCircle2,
  Save
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const { state, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance'>('profile');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSave = () => {
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Profile & Settings</h1>
        <p className="text-slate-500 mt-1">Manage your institutional identity and application preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-1">
          {[
            { id: 'profile', label: 'Research Profile', icon: User },
            { id: 'account', label: 'Account Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Site Appearance', icon: Palette },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-[#0A2A66] text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {activeTab === 'profile' && (
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-serif text-[#0A2A66] italic">
                      {user?.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-[#0A2A66] text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                    <p className="text-sm text-slate-500">{user?.role} • Institutional ID: #RES-2024-08</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution</label>
                    <input type="text" defaultValue="Global Research University" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Research Bio</label>
                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Describe your research focus..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Update Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="password" placeholder="New Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      <input type="password" placeholder="Confirm New Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 space-y-8">
                <div className="space-y-6">
                  {[
                    { title: 'Email Notifications', desc: 'Receive project updates and milestone alerts via email.' },
                    { title: 'Push Notifications', desc: 'Get real-time browser alerts for discussion replies.' },
                    { title: 'Weekly Summary', desc: 'A curated digest of your research impact and upcoming deadlines.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode', color: 'bg-white border-slate-200' },
                    { id: 'dark', label: 'Dark Mode', color: 'bg-slate-900 border-slate-800' },
                    { id: 'institutional', label: 'Institutional', color: 'bg-[#0A2A66] border-blue-900' },
                  ].map((theme) => (
                    <button 
                      key={theme.id}
                      className={`p-4 rounded-2xl border-2 transition-all text-center space-y-3 ${
                        state.settings.theme === theme.id ? 'border-blue-500' : 'border-slate-100'
                      }`}
                      onClick={() => updateSettings({ theme: theme.id as any })}
                    >
                      <div className={`w-full aspect-video rounded-lg ${theme.color}`} />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Changes Saved
                  </motion.div>
                )}
              </div>
              <button 
                onClick={handleSave}
                className="bg-[#0A2A66] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
