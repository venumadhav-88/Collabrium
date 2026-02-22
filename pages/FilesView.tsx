import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Clock, 
  Tag,
  ChevronDown,
  X,
  FileUp,
  Database,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';

const FilesView: React.FC = () => {
  const { state, uploadMaterial } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<'All' | 'Dataset' | 'Paper' | 'Report'>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredFiles = state.materials.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === 'All' || f.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'csv':
      case 'xlsx': return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'json': return <FileCode className="w-6 h-6 text-amber-500" />;
      default: return <Database className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl text-[#0A2A66] font-medium italic">Research Repository</h1>
          <p className="text-slate-500 mt-1">Centralized institutional storage for datasets, papers, and reports.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-[#0A2A66] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Upload Document
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search repository..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[140px]"
            >
              <option value="All">All Types</option>
              <option value="Dataset">Datasets</option>
              <option value="Paper">Papers</option>
              <option value="Report">Reports</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Recently Accessed */}
      <section>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Recently Accessed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFiles.slice(0, 4).map((file) => (
            <motion.div 
              key={file.id}
              whileHover={{ y: -4 }}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  {getFileIcon(file.type)}
                </div>
                <button className="text-slate-300 hover:text-slate-500">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate mb-1">{file.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.size} • v{file.version}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Repository List */}
      <section>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Institutional Files</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-bold text-slate-900">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Uploaded by {file.uploadedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                        file.tag === 'Dataset' ? 'bg-blue-50 text-blue-600' : 
                        file.tag === 'Paper' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {file.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">v{file.version}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{file.uploadDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFiles.length === 0 && (
            <div className="py-20 text-center">
              <FileText className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No documents found in the repository.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal (UI Only) */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-[#0A2A66]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-serif text-[#0A2A66] italic font-medium">Upload Research Asset</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileUp className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Drag and drop files here</p>
                  <p className="text-xs text-slate-400">Support for PDF, CSV, XLSX, and JSON up to 50MB</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Document Tag</label>
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all text-sm">
                      <option>Dataset</option>
                      <option>Paper</option>
                      <option>Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Association</label>
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-[#0A2A66] outline-none transition-all text-sm">
                      {state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-4 bg-[#0A2A66] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all"
                >
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilesView;
