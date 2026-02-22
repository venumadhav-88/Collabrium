
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Pin, Clock, User, AlertCircle, Plus, Send, X } from 'lucide-react';

const AnnouncementsView: React.FC = () => {
  const { state, addAnnouncement } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'low' as 'low' | 'medium' | 'high' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...newAnn,
      author: state.userRole === 'ADMIN' ? 'Admin Office' : 'Researcher Wilson'
    });
    setNewAnn({ title: '', content: '', priority: 'low' });
    setShowForm(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-blue-950 italic">Institutional Bulletin</h2>
          <p className="text-slate-500 mt-1">Official communications and lab updates</p>
        </div>
        {state.userRole === 'ADMIN' && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-950 text-white rounded-lg font-bold shadow-lg shadow-blue-900/10 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Announcement
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence initial={false}>
            {state.announcements.map((ann, idx) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden"
              >
                {ann.priority === 'high' && (
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                      <AlertCircle className="w-3 h-3" /> High Priority
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-6">
                  <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${ann.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-slate-900 group-hover:text-blue-900 transition-colors">
                      {ann.title}
                    </h3>
                    <div className="flex items-center gap-6 my-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" /> {ann.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {ann.date}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {ann.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 bg-blue-950 text-white flex justify-between items-center">
                  <h3 className="text-xl font-serif italic">Broadcast Update</h3>
                  <button onClick={() => setShowForm(false)} className="text-blue-200 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                    <input 
                      required
                      type="text" 
                      value={newAnn.title}
                      onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority Level</label>
                    <div className="flex gap-4">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewAnn({...newAnn, priority: p as any})}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                            newAnn.priority === p 
                            ? (p === 'high' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-blue-50 border-blue-500 text-blue-600')
                            : 'bg-white border-slate-100 text-slate-400'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message Content</label>
                    <textarea 
                      required
                      rows={4}
                      value={newAnn.content}
                      onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10">
                    <Send className="w-4 h-4" />
                    Publish Announcement
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-serif text-blue-950 mb-4">Laboratory Etiquette</h4>
            <div className="space-y-4">
              {[
                "Always verify chemical serial numbers.",
                "Log all vacuum calibrations daily.",
                "Request peer review before major pushes."
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-600">
                  <Pin className="w-4 h-4 text-blue-400 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-950 text-white p-8 rounded-2xl shadow-xl">
            <h4 className="text-lg font-serif italic mb-4">Upcoming Symposium</h4>
            <p className="text-indigo-200 text-sm leading-relaxed mb-6">
              Our unit has been selected to present at the Global Innovation Council. 
              Ensure all milestones for Project 'Neural Mapping' are at 80%+.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/32/32`} className="w-8 h-8 rounded-full border-2 border-indigo-900" alt="User" />
                ))}
              </div>
              <span className="text-xs font-bold text-indigo-300">42 Members attending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsView;
