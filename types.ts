
export type Role = 'ADMIN' | 'RESEARCHER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  dueDate: string;
  completed: boolean;
  progress: number; // 0 to 100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  leadResearcher: string;
  researchers: string[];
  progress: number;
  milestones: Milestone[];
  createdAt: string;
  impactScore: number;
  status: 'Active' | 'At Risk' | 'Completed';
}

export interface ResearchMaterial {
  id: string;
  projectId: string;
  name: string;
  uploadDate: string;
  uploadedBy: string;
  size: string;
  type: string;
  version: string;
  tag: 'Dataset' | 'Paper' | 'Report' | 'Other';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface DiscussionThread {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  participants: string[];
  messages: Message[];
  lastActivity: string;
  unreadCount: number;
  status: 'Active' | 'Resolved';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'system' | 'project' | 'discussion' | 'deadline';
}

export interface SiteSettings {
  platformName: string;
  tagline: string;
  primaryColor: string;
  theme: 'light' | 'dark' | 'institutional';
  registrationMode: 'OPEN' | 'INVITE_ONLY' | 'REVIEW_REQUIRED';
  defaultUserRole: Role;
  maintenanceMode: boolean;
  sessionTimeout: number; // in minutes
  strictPasswordPolicy: boolean;
}

export interface AppState {
  userRole: Role;
  projects: Project[];
  announcements: Announcement[];
  materials: ResearchMaterial[];
  notifications: Notification[];
  discussions: DiscussionThread[];
  settings: SiteSettings;
}
