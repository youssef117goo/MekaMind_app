import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Landing from './pages/Landing';
import AdminLayout from './pages/admin/AdminLayout';
import BoardsManagement from './pages/admin/BoardsManagement';
import ClientsManagement from './pages/admin/ClientsManagement';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import BlocklyWorkspace from './pages/user/BlocklyWorkspace';
import UserSettings from './pages/user/UserSettings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
