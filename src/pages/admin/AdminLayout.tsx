import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Cpu, Users, LayoutDashboard, Home, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, adminUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-l border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2196F3] rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MekaMind</h1>
              <p className="text-xs text-gray-500">لوحة الإدارة</p>
            </div>
          </div>
          {adminUser && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-xs text-gray-400">مرحباً،</p>
              <p className="text-sm font-medium text-white">{adminUser.username}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/boards"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2196F3] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`
            }
          >
            <Cpu className="w-5 h-5" />
            <span>إدارة الشرائح</span>
          </NavLink>
          
          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2196F3] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span>إدارة العملاء</span>
          </NavLink>
        </nav>

        {/* Bottom links */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span>الصفحة الرئيسية</span>
          </Link>
          <Link
            to="/portal"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>بوابة المستخدم</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#f44336] hover:bg-[#f44336]/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
