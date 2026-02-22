
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Project, Announcement, ResearchMaterial, Role, Notification, SiteSettings, DiscussionThread, Message } from '../types';

interface AppContextType {
  state: AppState;
  setRole: (role: Role) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'impactScore' | 'status'>) => void;
  updateMilestone: (projectId: string, milestoneId: string, completed: boolean, progress?: number) => void;
  deleteProject: (projectId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  uploadMaterial: (material: Omit<ResearchMaterial, 'id' | 'uploadDate'>) => void;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addMessage: (threadId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const defaultSettings: SiteSettings = {
  platformName: 'AcademiaCollab',
  tagline: 'Research Excellence Unified',
  primaryColor: '#0A2A66',
  theme: 'institutional',
  registrationMode: 'REVIEW_REQUIRED',
  defaultUserRole: 'RESEARCHER',
  maintenanceMode: false,
  sessionTimeout: 60,
  strictPasswordPolicy: true,
};

const initialState: AppState = {
  userRole: 'RESEARCHER',
  projects: [
    {
      id: 'p1',
      title: 'Neural Mapping of Cognitive Dissonance',
      description: 'A study into the neurological pathways activated during internal conflict resolution.',
      category: 'Neuroscience',
      leadResearcher: 'Dr. Sarah Chen',
      researchers: ['Dr. Sarah Chen', 'James Wilson', 'Elena Rossi'],
      progress: 65,
      impactScore: 8.4,
      status: 'Active',
      createdAt: '2023-11-15',
      milestones: [
        { id: 'm1', projectId: 'p1', title: 'Ethics Board Approval', dueDate: '2023-12-01', completed: true, progress: 100 },
        { id: 'm2', projectId: 'p1', title: 'Data Collection Phase 1', dueDate: '2024-02-15', completed: true, progress: 100 },
        { id: 'm3', projectId: 'p1', title: 'Peer Review Draft', dueDate: '2024-06-30', completed: false, progress: 45 }
      ]
    },
    {
      id: 'p2',
      title: 'Quantum Entanglement in Micro-Vacuum',
      description: 'Investigating long-distance entanglement stability in controlled environments.',
      category: 'Quantum Physics',
      leadResearcher: 'Prof. Marcus Thorne',
      researchers: ['Prof. Marcus Thorne', 'Elena Rossi'],
      progress: 30,
      impactScore: 9.2,
      status: 'At Risk',
      createdAt: '2024-01-10',
      milestones: [
        { id: 'm4', projectId: 'p2', title: 'Apparatus Calibrated', dueDate: '2024-01-20', completed: true, progress: 100 },
        { id: 'm5', projectId: 'p2', title: 'Stability Testing', dueDate: '2024-03-10', completed: false, progress: 15 }
      ]
    },
    {
      id: 'p3',
      title: 'Sustainable Urban Infrastructure',
      description: 'Analyzing the impact of green roofs on urban heat islands in tropical climates.',
      category: 'Environmental Science',
      leadResearcher: 'Dr. Elena Rossi',
      researchers: ['Dr. Elena Rossi', 'James Wilson'],
      progress: 90,
      impactScore: 7.8,
      status: 'Active',
      createdAt: '2023-08-05',
      milestones: [
        { id: 'm6', projectId: 'p3', title: 'Site Selection', dueDate: '2023-09-01', completed: true, progress: 100 },
        { id: 'm7', projectId: 'p3', title: 'Sensor Deployment', dueDate: '2023-11-15', completed: true, progress: 100 },
        { id: 'm8', projectId: 'p3', title: 'Final Report', dueDate: '2024-04-20', completed: false, progress: 80 }
      ]
    }
  ],
  announcements: [
    {
      id: 'a1',
      title: 'Annual Research Symposium 2024',
      content: 'Call for papers is now open for the upcoming symposium in Geneva.',
      author: 'Administrative Office',
      date: '2024-02-20',
      priority: 'high'
    }
  ],
  materials: [
    {
      id: 'f1',
      projectId: 'p1',
      name: 'EEG_Mapping_Results_V1.pdf',
      uploadDate: '2024-02-18',
      uploadedBy: 'Dr. Sarah Chen',
      size: '4.2 MB',
      type: 'pdf',
      version: '1.0.2',
      tag: 'Paper'
    },
    {
      id: 'f2',
      projectId: 'p2',
      name: 'Quantum_Stability_Data.csv',
      uploadDate: '2024-02-21',
      uploadedBy: 'Prof. Marcus Thorne',
      size: '12.8 MB',
      type: 'csv',
      version: '2.1.0',
      tag: 'Dataset'
    }
  ],
  notifications: [
    { id: 'n1', title: 'New Project Assigned', message: 'You have been added to Project Neural Mapping.', time: '2024-02-22T08:00:00Z', read: false, type: 'project' },
    { id: 'n2', title: 'Milestone Approaching', message: 'Peer Review Draft due in 5 days.', time: '2024-02-21T14:30:00Z', read: false, type: 'deadline' },
    { id: 'n3', title: 'New Comment', message: 'James Wilson commented on your paper.', time: '2024-02-22T09:15:00Z', read: true, type: 'discussion' }
  ],
  discussions: [
    {
      id: 'd1',
      projectId: 'p1',
      projectName: 'Neural Mapping of Cognitive Dissonance',
      title: 'Methodology Review',
      participants: ['Dr. Sarah Chen', 'James Wilson'],
      lastActivity: '2024-02-22T10:00:00Z',
      unreadCount: 2,
      status: 'Active',
      messages: [
        { id: 'msg1', senderId: 'u1', senderName: 'Dr. Sarah Chen', content: 'Should we adjust the EEG sampling rate?', timestamp: '2024-02-22T09:45:00Z' },
        { id: 'msg2', senderId: 'u2', senderName: 'James Wilson', content: 'I think 512Hz is sufficient for our current scope.', timestamp: '2024-02-22T10:00:00Z' }
      ]
    },
    {
      id: 'd2',
      projectId: 'p2',
      projectName: 'Quantum Entanglement in Micro-Vacuum',
      title: 'Apparatus Calibration Issues',
      participants: ['Prof. Marcus Thorne', 'Elena Rossi'],
      lastActivity: '2024-02-23T11:30:00Z',
      unreadCount: 0,
      status: 'Active',
      messages: [
        { id: 'msg3', senderId: 'u3', senderName: 'Prof. Marcus Thorne', content: 'The laser alignment seems off by 0.5 microns.', timestamp: '2024-02-23T11:30:00Z' }
      ]
    }
  ],
  settings: defaultSettings,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_MILESTONE'; payload: { projectId: string; milestoneId: string; completed: boolean; progress?: number } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'UPLOAD_MATERIAL'; payload: ResearchMaterial }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { threadId: string; message: Message } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SiteSettings> }
  | { type: 'HYDRATE'; payload: AppState };

function appReducer(state: AppState, action: Action): AppState {
  let newState: AppState;
  switch (action.type) {
    case 'SET_ROLE':
      newState = { ...state, userRole: action.payload };
      break;
    case 'ADD_PROJECT':
      newState = { ...state, projects: [action.payload, ...state.projects] };
      break;
    case 'DELETE_PROJECT':
      newState = { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
      break;
    case 'UPDATE_MILESTONE':
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          const updatedMilestones = p.milestones.map(m =>
            m.id === action.payload.milestoneId ? { 
              ...m, 
              completed: action.payload.completed,
              progress: action.payload.progress !== undefined ? action.payload.progress : (action.payload.completed ? 100 : m.progress)
            } : m
          );
          const totalProgress = updatedMilestones.reduce((acc, m) => acc + m.progress, 0);
          const progress = Math.round(totalProgress / updatedMilestones.length);
          return { ...p, milestones: updatedMilestones, progress };
        }
        return p;
      });
      newState = { ...state, projects: updatedProjects };
      break;
    case 'ADD_ANNOUNCEMENT':
      newState = { ...state, announcements: [action.payload, ...state.announcements] };
      break;
    case 'UPLOAD_MATERIAL':
      newState = { ...state, materials: [action.payload, ...state.materials] };
      break;
    case 'DISMISS_NOTIFICATION':
      newState = { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
      break;
    case 'MARK_NOTIFICATION_READ':
      newState = { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
      break;
    case 'ADD_MESSAGE':
      newState = {
        ...state,
        discussions: state.discussions.map(d => 
          d.id === action.payload.threadId 
            ? { ...d, messages: [...d.messages, action.payload.message], lastActivity: action.payload.message.timestamp }
            : d
        )
      };
      break;
    case 'UPDATE_SETTINGS':
      newState = { ...state, settings: { ...state.settings, ...action.payload } };
      break;
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
  
  localStorage.setItem('ac_app_state', JSON.stringify(newState));
  return newState;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('ac_app_state');
    if (saved) {
      dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    }
  }, []);

  const setRole = (role: Role) => dispatch({ type: 'SET_ROLE', payload: role });

  const addProject = (p: Omit<Project, 'id' | 'createdAt' | 'impactScore' | 'status'>) => {
    const newProject: Project = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      impactScore: 5.0 + Math.random() * 4,
      status: 'Active'
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateMilestone = (projectId: string, milestoneId: string, completed: boolean, progress?: number) =>
    dispatch({ type: 'UPDATE_MILESTONE', payload: { projectId, milestoneId, completed, progress } });

  const deleteProject = (id: string) => dispatch({ type: 'DELETE_PROJECT', payload: id });

  const addAnnouncement = (a: Omit<Announcement, 'id' | 'date'>) => {
    const newA: Announcement = { ...a, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    dispatch({ type: 'ADD_ANNOUNCEMENT', payload: newA });
  };

  const uploadMaterial = (m: Omit<ResearchMaterial, 'id' | 'uploadDate'>) => {
    const newM: ResearchMaterial = { ...m, id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0] };
    dispatch({ type: 'UPLOAD_MATERIAL', payload: newM });
  };

  const dismissNotification = (id: string) => dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
  const markNotificationRead = (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });

  const addMessage = (threadId: string, msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { threadId, message: newMessage } });
  };

  const updateSettings = (settings: Partial<SiteSettings>) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings });

  return (
    <AppContext.Provider value={{
      state, setRole, addProject, updateMilestone, deleteProject,
      addAnnouncement, uploadMaterial, dismissNotification, markNotificationRead,
      addMessage, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
