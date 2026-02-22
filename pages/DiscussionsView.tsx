import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  Send,
  User,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';

const DiscussionsView: React.FC = () => {
  const { state, addDiscussion, addMessage } = useApp();
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredThreads = state.discussions.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThread = state.discussions.find(t => t.id === selectedThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThreadId) return;
    
    addMessage(selectedThreadId, {
      senderId: user?.id || 'anon',
      senderName: user?.name || 'Anonymous',
      content: newMessage,
      timestamp: new Date().toISOString()
    });
    setNewMessage('');
  };

  if (view === 'detail' && selectedThread) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        <button 
          onClick={() => setView('list')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0A2A66] transition-colors font-bold text-xs uppercase tracking-widest mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discussions
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Thread Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">{selectedThread.projectName}</p>
                <h1 className="font-serif text-2xl text-[#0A2A66] font-medium italic">{selectedThread.title}</h1>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                selectedThread.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {selectedThread.status}
              </span>
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {selectedThread.messages.map((msg, idx) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${
                    isMe ? 'bg-[#0A2A66] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {msg.senderName.charAt(0)}
                  </div>
                  <div className={`max-w-[70%] space-y-1 ${isMe ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 justify-end flex-row-reverse">
                      <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isMe ? 'bg-blue-50 text-slate-800 rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Input */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#0A2A66] text-white p-3 rounded-xl hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Research Forum</h1>
          <p className="text-slate-500 mt-1">Collaborative discussions and peer review threads.</p>
        </div>
        <button className="bg-[#0A2A66] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Start Discussion
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[180px]">
            <option>All Projects</option>
            {state.projects.map(p => <option key={p.id}>{p.title}</option>)}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredThreads.map((thread, idx) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => { setSelectedThreadId(thread.id); setView('detail'); }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-[#0A2A66] group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{thread.projectName}</p>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0A2A66] transition-colors">{thread.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    <span>Last reply by <span className="font-semibold text-slate-700">{thread.messages[thread.messages.length - 1].senderName}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(thread.messages[thread.messages.length - 1].timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center px-6 border-x border-slate-100 hidden md:block">
                <p className="text-xl font-bold text-[#0A2A66]">{thread.messages.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Replies</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                  thread.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {thread.status}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0A2A66] transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}

        {filteredThreads.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No discussion threads found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionsView;
