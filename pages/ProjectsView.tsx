import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Activity,
  ChevronRight,
  FileText,
  X,
  Clock,
  BookOpen,
  Users,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProjectsView: React.FC = () => {
  const { state, addProject, deleteProject, updateMilestone } = useApp();
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Neuroscience',
    leadResearcher: user?.name || '',
    researchers: [user?.name || ''] as string[],
    progress: 0,
    milestones: [] as any[]
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      ...newProject,
      milestones: [
        { id: 'm-init-' + Date.now(), projectId: '', title: 'Initial Planning', dueDate: new Date().toISOString().split('T')[0], completed: false, progress: 0 }
      ]
    });
    setShowAddModal(false);
    setNewProject({
      title: '', description: '', category: 'Neuroscience', leadResearcher: user?.name || '', researchers: [user?.name || ''], progress: 0, milestones: []
    });
  };

  const selectedProject = state.projects.find(p => p.id === selectedProjectId);

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(id);
    setView('detail');
  };

  if (view === 'detail' && selectedProject) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => setView('list')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0A2A66] transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest bg-blue-50 text-blue-600">
                    {selectedProject.category}
                  </span>
                  <h1 className="font-serif text-3xl text-[#0A2A66] mt-3 font-medium italic">{selectedProject.title}</h1>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                  selectedProject.status === 'At Risk' ? 'bg-red-50 text-red-600' : 
                  selectedProject.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {selectedProject.status}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedProject.description}</p>
              
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Lead Investigator</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProject.leadResearcher}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Initiated</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProject.createdAt}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Impact Score</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProject.impactScore.toFixed(1)}/10.0</p>
                </div>
              </div>
            </motion.div>

            {/* Milestone Tracker */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="font-serif text-xl text-[#0A2A66] mb-6 font-medium italic">Milestone Progress</h2>
              <div className="space-y-6">
                {selectedProject.milestones.map((m) => (
                  <div key={m.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateMilestone(selectedProject.id, m.id, !m.completed)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            m.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <span className={`text-sm font-medium ${m.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due {m.dueDate}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.progress}%` }}
                        className={`h-full ${m.completed ? 'bg-emerald-500' : 'bg-[#0A2A66]'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Discussion Thread Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-[#0A2A66] font-medium italic">Project Discussions</h2>
                <button className="text-xs text-blue-600 font-bold uppercase tracking-widest hover:underline">Open Forum</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">SC</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dr. Sarah Chen</p>
                      <p className="text-[10px] text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">The preliminary data from the second cohort looks promising. Should we proceed with the peer review draft?</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Contribute to discussion..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button className="bg-[#0A2A66] text-white px-4 py-2 rounded-lg text-sm font-bold">Send</button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Team Members */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="font-serif text-lg text-[#0A2A66] mb-4 font-medium italic">Research Team</h2>
              <div className="space-y-4">
                {selectedProject.researchers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {r.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{r}</span>
                    </div>
                    {i === 0 && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest">PI</span>}
                  </div>
                ))}
                <button className="w-full mt-2 py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all">
                  Invite Collaborator
                </button>
              </div>
            </section>

            {/* Documents Preview */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-[#0A2A66] font-medium italic">Documents</h2>
                <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {state.materials.filter(m => m.projectId === selectedProject.id).map(mat => (
                  <div key={mat.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-blue-200 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{mat.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{mat.size} • v{mat.version}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all">
                  Upload New Asset
                </button>
              </div>
            </section>

            {/* Project Timeline */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="font-serif text-lg text-[#0A2A66] mb-4 font-medium italic">Project Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-3 relative">
                  <div className="absolute left-1.5 top-4 bottom-0 w-px bg-slate-100" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 z-10" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Project Initiated</p>
                    <p className="text-[10px] text-slate-400">{selectedProject.createdAt}</p>
                  </div>
                </div>
                <div className="flex gap-3 relative">
                  <div className="absolute left-1.5 top-4 bottom-0 w-px bg-slate-100" />
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 z-10" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Data Collection Phase</p>
                    <p className="text-[10px] text-slate-400">Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200 mt-1 z-10" />
                  <div>
                    <p className="text-xs font-bold text-slate-400">Final Review</p>
                    <p className="text-[10px] text-slate-400 italic">Upcoming</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Research Initiatives</h1>
          <p className="text-slate-500 mt-1">Manage and track your institutional project portfolio.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0A2A66] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleProjectClick(project.id)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                  project.status === 'At Risk' ? 'bg-red-50 text-red-600' : 
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {project.status}
                </span>
                <div className="flex -space-x-2">
                  {project.researchers.slice(0, 3).map((r, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {r.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#0A2A66] transition-colors line-clamp-1">{project.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed">{project.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0A2A66] h-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {project.milestones.filter(m => m.completed).length}/{project.milestones.length} Milestones
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {project.researchers.length} Members
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last updated 2d ago</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0A2A66] transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#0A2A66]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-serif text-[#0A2A66] italic font-medium">Initiate Research Unit</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddProject} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Title</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all"
                    >
                      <option>Neuroscience</option>
                      <option>Quantum Physics</option>
                      <option>Biochemistry</option>
                      <option>Environmental Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lead Researcher</label>
                    <input 
                      required
                      type="text" 
                      value={newProject.leadResearcher}
                      onChange={(e) => setNewProject({...newProject, leadResearcher: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Abstract</label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[#0A2A66] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all">
                  Register Research Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsView;
