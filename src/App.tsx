import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import BoardsManagement from './pages/admin/BoardsManagement';
import ClientsManagement from './pages/admin/ClientsManagement';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import BlocklyWorkspace from './pages/user/BlocklyWorkspace';
import UserSettings from './pages/user/UserSettings';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Admin Login - Public */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="boards" replace />} />
              <Route path="boards" element={<BoardsManagement />} />
              <Route path="clients" element={<ClientsManagement />} />
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
    </AuthProvider>
  );
}

export default App;
