import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useUserAuth } from '../../store/UserAuthContext';
import { Cpu, LayoutDashboard, Code, Settings, Home, User, LogOut } from 'lucide-react';

export default function UserLayout() {
  const { currentClient, clients, setCurrentClient } = useApp();
  const { currentUser, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
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
              <p className="text-xs text-gray-500">بوابة المستخدم</p>
            </div>
          </div>
          {currentUser && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-xs text-gray-400">مرحباً،</p>
              <p className="text-sm font-medium text-white">{currentUser.username}</p>
            </div>
          )}
        </div>

        {/* Client Selector */}
        <div className="p-4 border-b border-gray-800">
          <label className="text-xs text-gray-500 mb-2 block">اختر العميل (عرض تجريبي)</label>
          <select
            value={currentClient?.id || ''}
            onChange={(e) => {
              const client = clients.find(c => c.id === e.target.value);
              setCurrentClient(client || null);
            }}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-[#2196F3] focus:outline-none"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {currentClient && (
            <div className="mt-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${currentClient.status === 'online' ? 'bg-[#4CAF50]' : 'bg-gray-500'}`}></div>
              <span className="text-xs text-gray-400">
                {currentClient.status === 'online' ? 'متصل' : 'غير متصل'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/portal"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2196F3] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </NavLink>
          
          <NavLink
            to="/portal/blocks"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2196F3] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`
            }
          >
            <Code className="w-5 h-5" />
            <span>البرمجة بالبلوكات</span>
          </NavLink>
          
          <NavLink
            to="/portal/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#2196F3] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
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
          {currentUser && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#f44336] hover:bg-[#f44336]/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentClient ? (
          <Outlet />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">يرجى اختيار عميل من القائمة الجانبية</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
