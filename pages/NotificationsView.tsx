import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  Trash2, 
  Filter,
  ChevronRight,
  BookOpen,
  Settings,
  MoreVertical
} from 'lucide-react';

const NotificationsView: React.FC = () => {
  const { state, markNotificationAsRead } = useApp();
  const [filter, setFilter] = useState<'All' | 'project' | 'deadline' | 'discussion'>('All');

  const filteredNotifications = state.notifications.filter(n => 
    filter === 'All' || n.type === filter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'project': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'deadline': return <Clock className="w-5 h-5 text-red-600" />;
      case 'discussion': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated on project milestones, discussions, and system alerts.</p>
        </div>
        <div className="flex gap-3">
          <button className="text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-[#0A2A66] transition-colors">
            Mark all as read
          </button>
          <button className="text-xs text-red-600 font-bold uppercase tracking-widest hover:text-red-700 transition-colors">
            Clear all
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        {(['All', 'project', 'deadline', 'discussion'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              filter === t ? 'text-[#0A2A66]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t}
            {filter === t && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A2A66]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notif, idx) => (
            <motion.div
              layout
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex gap-5 ${
                notif.read 
                  ? 'bg-white border-slate-100 opacity-60' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${
                notif.type === 'project' ? 'bg-blue-50' : 
                notif.type === 'deadline' ? 'bg-red-50' : 'bg-emerald-50'
              }`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>

              <button className="p-2 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                <MoreVertical className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
