
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X,
  FileText,
  MessageSquare,
  ShieldCheck,
  UserCircle,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LogoMark: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="logoSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5Z" fill="url(#logoSidebarGrad)" />
      <path d="M35 45 L50 30 L65 45 V75 H35 V45Z" fill="white" fillOpacity="0.3" />
      <path d="M50 30 V75 M35 55 H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

const DashboardLayout: React.FC = () => {
  const { state, dismissNotification, markNotificationRead } = useApp();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/overview' },
    { name: 'My Projects', icon: BookOpen, path: '/dashboard/projects' },
    { name: 'Milestones', icon: CheckCircle2, path: '/dashboard/milestones' },
    { name: 'Documents', icon: FileText, path: '/dashboard/files' },
    { name: 'Discussions', icon: MessageSquare, path: '/dashboard/discussions' },
    { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  ];

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-[#0A2A66] text-white z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <LogoMark />
            <span className="font-serif text-xl tracking-wide">AcademiaCollab</span>
          </div>

          <div className="px-6 py-4 flex items-center gap-3 bg-white/5 border-b border-white/5">
            <div className={`p-1.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">{user?.role} PORTAL</p>
              <p className="text-sm font-medium text-white/90">Institutional Unit</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group
                  ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-blue-100/70 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-opacity ${item.name === 'Notifications' && unreadNotifications > 0 ? 'text-blue-400' : 'opacity-70 group-hover:opacity-100'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {item.name === 'Notifications' && unreadNotifications > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <NavLink 
              to="/dashboard/settings"
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive ? 'bg-white/10 text-white' : 'text-blue-200 hover:text-white hover:bg-white/5'}
              `}
            >
              <Settings className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium">Profile & Settings</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-950/30 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects, documents, or researchers..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h4 className="font-semibold text-sm text-slate-900">Recent Activity</h4>
                        <NavLink to="/dashboard/notifications" className="text-xs text-blue-600 hover:underline" onClick={() => setNotificationsOpen(false)}>View all</NavLink>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {state.notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                          </div>
                        ) : (
                          state.notifications.slice(0, 5).map(notif => (
                            <div 
                              key={notif.id} 
                              className={`p-4 border-b border-slate-50 hover:bg-slate-50 group transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                setNotificationsOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h5 className={`text-sm font-medium ${!notif.read ? 'text-blue-900' : 'text-slate-700'}`}>{notif.title}</h5>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notif.id);
                                  }}
                                  className="text-slate-300 hover:text-slate-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-slate-500 mb-2 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(notif.time).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  {user?.name || 'Researcher'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                  {user?.role}
                </p>
              </div>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-100 shadow-sm">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
