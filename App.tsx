
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import ProjectsView from './pages/ProjectsView';
import AnnouncementsView from './pages/AnnouncementsView';
import FilesView from './pages/FilesView';
import DiscussionsView from './pages/DiscussionsView';
import SettingsView from './pages/SettingsView';
import MilestonesView from './pages/MilestonesView';
import AnalyticsView from './pages/AnalyticsView';
import NotificationsView from './pages/NotificationsView';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<AdminDashboard />} />
              <Route path="projects" element={<ProjectsView />} />
              <Route path="milestones" element={<MilestonesView />} />
              <Route path="announcements" element={<AnnouncementsView />} />
              <Route path="files" element={<FilesView />} />
              <Route path="discussions" element={<DiscussionsView />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="notifications" element={<NotificationsView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
