import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  BookOpen,
  Calendar,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { state } = useApp();
  const { user } = useAuth();

  const activeProjects = state.projects.filter(p => p.status !== 'Completed');
  const urgentMilestones = state.projects
    .flatMap(p => p.milestones.map(m => ({ ...m, projectName: p.title })))
    .filter(m => !m.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const chartData = [
    { name: 'Sep', completed: 2 },
    { name: 'Oct', completed: 5 },
    { name: 'Nov', completed: 3 },
    { name: 'Dec', completed: 8 },
    { name: 'Jan', completed: 6 },
    { name: 'Feb', completed: 12 },
  ];

  const statusData = [
    { name: 'Active', value: state.projects.filter(p => p.status === 'Active').length, color: '#0A2A66' },
    { name: 'At Risk', value: state.projects.filter(p => p.status === 'At Risk').length, color: '#EF4444' },
    { name: 'Completed', value: state.projects.filter(p => p.status === 'Completed').length, color: '#10B981' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Block */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="font-serif text-3xl text-[#0A2A66] mb-2 font-medium italic">Welcome back, {user?.name}</h1>
          <p className="text-slate-500 max-w-2xl font-sans">
            You are currently leading <span className="font-semibold text-[#0A2A66]">{activeProjects.length} active research projects</span>. 
            There are {urgentMilestones.length} high-priority milestones requiring your attention this week.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Impact Score</p>
                <p className="text-lg font-bold text-slate-900">8.4 Average</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Completed</p>
                <p className="text-lg font-bold text-slate-900">24 Milestones</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Milestones & Projects */}
        <div className="lg:col-span-2 space-y-8">
          {/* Urgent Milestones Panel */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-[#0A2A66] font-medium italic">Urgent Milestones</h2>
              <button className="text-xs text-blue-600 font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4">
              {urgentMilestones.map((m, idx) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {idx === 0 ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{m.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{m.projectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due Date</p>
                      <p className="text-sm font-medium text-slate-700">{new Date(m.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${m.progress}%` }} />
                    </div>
                    <button className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#0A2A66] group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Active Projects Snapshot */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-[#0A2A66] font-medium italic">Active Projects</h2>
              <button className="text-xs text-blue-600 font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.projects.slice(0, 2).map((p, idx) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${p.status === 'At Risk' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {p.status}
                    </span>
                    <div className="flex -space-x-2">
                      {p.researchers.slice(0, 3).map((r, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {r.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-[#0A2A66] transition-colors">{p.title}</h3>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                    <div className="bg-[#0A2A66] h-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.milestones.filter(m => m.completed).length}/{p.milestones.length} Milestones
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {p.createdAt}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Activity & Analytics */}
        <div className="space-y-8">
          {/* Activity Timeline */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-serif text-xl text-[#0A2A66] mb-6 font-medium italic">Activity Timeline</h2>
            <div className="space-y-6">
              {state.notifications.slice(0, 4).map((notif, idx) => (
                <div key={notif.id} className="flex gap-4 relative">
                  {idx !== 3 && <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-100" />}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10 ${
                    notif.type === 'project' ? 'bg-blue-50 text-blue-600' : 
                    notif.type === 'deadline' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {notif.type === 'project' ? <BookOpen className="w-4 h-4" /> : 
                     notif.type === 'deadline' ? <Clock className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{notif.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                      {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mini Analytics Section */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-serif text-xl text-[#0A2A66] mb-6 font-medium italic">Research Productivity</h2>
            <div className="space-y-8">
              <div className="h-48">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Milestones Completed</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0A2A66' }}
                    />
                    <Line type="monotone" dataKey="completed" stroke="#0A2A66" strokeWidth={3} dot={{ r: 4, fill: '#0A2A66' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-48">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Project Status</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
