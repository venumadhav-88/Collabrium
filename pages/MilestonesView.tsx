import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowUpDown,
  AlertCircle,
  Search,
  ChevronDown
} from 'lucide-react';

const MilestonesView: React.FC = () => {
  const { state, updateMilestone } = useApp();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Ongoing' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allMilestones = state.projects.flatMap(p => 
    p.milestones.map(m => ({ ...m, projectName: p.title, projectStatus: p.status }))
  );

  const filteredMilestones = allMilestones.filter(m => {
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Completed' && m.completed) || 
      (statusFilter === 'Pending' && !m.completed && m.progress === 0) ||
      (statusFilter === 'Ongoing' && !m.completed && m.progress > 0);
    
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const isOverdue = (date: string) => new Date(date) < new Date() && !allMilestones.find(m => m.dueDate === date)?.completed;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Research Milestones</h1>
          <p className="text-slate-500 mt-1">Track and manage critical project checkpoints and deadlines.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search milestones..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredMilestones.map((m, idx) => {
            const overdue = isOverdue(m.dueDate);
            return (
              <motion.div
                layout
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    m.completed ? 'bg-emerald-50 text-emerald-600' : 
                    overdue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {m.completed ? <CheckCircle2 className="w-6 h-6" /> : 
                     overdue ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`font-bold text-slate-900 text-sm truncate ${m.completed ? 'text-slate-400 line-through' : ''}`}>
                      {m.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                      {m.projectName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-12">
                  <div className="w-32 space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{m.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${m.completed ? 'bg-emerald-500' : 'bg-[#0A2A66]'}`} style={{ width: `${m.progress}%` }} />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due Date</p>
                    <p className={`text-sm font-semibold ${overdue ? 'text-red-600' : 'text-slate-700'}`}>
                      {new Date(m.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {overdue && !m.completed && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded uppercase tracking-widest">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                    <button 
                      onClick={() => updateMilestone(m.projectId, m.id, !m.completed)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                        m.completed 
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                          : 'bg-[#0A2A66] text-white hover:bg-blue-900 shadow-lg shadow-blue-900/10'
                      }`}
                    >
                      {m.completed ? 'Reopen' : 'Complete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredMilestones.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No milestones found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesView;
