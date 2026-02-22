import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsView: React.FC = () => {
  const { state } = useApp();

  const impactData = [
    { month: 'Sep', score: 6.2, citations: 45 },
    { month: 'Oct', score: 6.8, citations: 52 },
    { month: 'Nov', score: 7.1, citations: 48 },
    { month: 'Dec', score: 7.5, citations: 61 },
    { month: 'Jan', score: 8.2, citations: 75 },
    { month: 'Feb', score: 8.4, citations: 82 },
  ];

  const statusData = [
    { name: 'Active', value: state.projects.filter(p => p.status === 'Active').length, color: '#0A2A66' },
    { name: 'At Risk', value: state.projects.filter(p => p.status === 'At Risk').length, color: '#EF4444' },
    { name: 'Completed', value: state.projects.filter(p => p.status === 'Completed').length, color: '#10B981' },
  ];

  const resourceData = state.projects.map(p => ({
    name: p.title.substring(0, 15) + '...',
    researchers: p.researchers.length,
    budget: Math.floor(Math.random() * 50000) + 10000
  }));

  const kpis = [
    { label: 'Total Research Output', value: '142', trend: '+12%', up: true, icon: FileText, color: 'blue' },
    { label: 'Active Researchers', value: '28', trend: '+4%', up: true, icon: Users, color: 'emerald' },
    { label: 'Avg. Completion Time', value: '4.2mo', trend: '-8%', up: false, icon: Clock, color: 'amber' },
    { label: 'Institutional Impact', value: '8.4', trend: '+1.2', up: true, icon: TrendingUp, color: 'indigo' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Institutional Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive performance metrics and research impact tracking.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                {kpi.trend}
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Research Impact Score */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-xl text-[#0A2A66] font-medium italic">Research Impact Score</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-[#0A2A66]" /> Impact
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-blue-200" /> Citations
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2A66" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A2A66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#0A2A66" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                <Line type="monotone" dataKey="citations" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Project Status Distribution */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-serif text-xl text-[#0A2A66] mb-8 font-medium italic">Portfolio Distribution</h2>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Resource Allocation */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h2 className="font-serif text-xl text-[#0A2A66] mb-8 font-medium italic">Resource Allocation by Project</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="researchers" fill="#0A2A66" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsView;
