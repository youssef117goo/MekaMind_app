import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { AuthProvider } from './store/AuthContext';
import { UserAuthProvider } from './store/UserAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import GuidePage from './pages/GuidePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import FounderDashboard from './pages/admin/FounderDashboard';
import BoardsManagement from './pages/admin/BoardsManagement';
import ClientsManagement from './pages/admin/ClientsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ActivityLogPage from './pages/admin/ActivityLogPage';
import SiteSettings from './pages/admin/SiteSettings';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import BlocklyWorkspace from './pages/user/BlocklyWorkspace';
import UserSettings from './pages/user/UserSettings';

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <AppProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/guide" element={<GuidePage />} />
            
            {/* Admin Login - Public */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<FounderDashboard />} />
              <Route path="dashboard" element={<FounderDashboard />} />
              <Route path="boards" element={<BoardsManagement />} />
              <Route path="clients" element={<ClientsManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="activity" element={<ActivityLogPage />} />
              <Route path="settings" element={<SiteSettings />} />
            </Route>

            {/* User Routes */}
            <Route path="/portal" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="blocks" element={<BlocklyWorkspace />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </BrowserRouter>
        </AppProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
