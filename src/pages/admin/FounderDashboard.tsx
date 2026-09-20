import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useUserAuth } from '../../store/UserAuthContext';
import {
  Users, Cpu, Activity, TrendingUp, Eye, UserPlus,
  Package, AlertCircle, CheckCircle, Clock, ArrowUp,
  ArrowDown, MoreVertical, BarChart3, Zap
} from 'lucide-react';

export default function FounderDashboard() {
  const { boards, clients } = useApp();
  const { users } = useUserAuth();

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalBoards: boards.length,
    totalClients: clients.length,
    onlineClients: clients.filter(c => c.status === 'online').length,
    totalInputs: boards.reduce((sum, b) => sum + Object.keys(b.pinMapping.inputs).length, 0),
    totalOutputs: boards.reduce((sum, b) => sum + Object.keys(b.pinMapping.outputs).length, 0),
  };

  // Recent activities (simulated)
  const recentActivities = [
    { id: 1, type: 'user_register', user: 'محمد أحمد', action: 'سجل حساب جديد', time: 'منذ 5 دقائق', icon: UserPlus, color: '#4CAF50' },
    { id: 2, type: 'board_created', user: 'أنت', action: 'أنشأت شريحة جديدة', time: 'منذ 15 دقيقة', icon: Cpu, color: '#2196F3' },
    { id: 3, type: 'client_online', user: 'سارة علي', action: 'اتصلت بالشريحة', time: 'منذ 30 دقيقة', icon: Activity, color: '#4CAF50' },
    { id: 4, type: 'program_deployed', user: 'أحمد محمد', action: 'نشر برنامج جديد', time: 'منذ ساعة', icon: Zap, color: '#FF9800' },
    { id: 5, type: 'settings_updated', user: 'أنت', action: 'حدّثت إعدادات الموقع', time: 'منذ ساعتين', icon: CheckCircle, color: '#2196F3' },
  ];

  // Top users (simulated)
  const topUsers = [
    { name: 'أحمد محمد', programs: 12, lastActive: 'منذ 5 دقائق' },
    { name: 'سارة علي', programs: 8, lastActive: 'منذ ساعة' },
    { name: 'محمد أحمد', programs: 5, lastActive: 'منذ يومين' },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">لوحة تحكم المؤسس</h1>
        <p className="text-gray-400 mt-1">نظرة عامة على أداء الموقع والمستخدمين</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="#2196F3"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="الشرائح المسجلة"
          value={stats.totalBoards}
          icon={<Cpu className="w-6 h-6" />}
          color="#4CAF50"
          trend="+3"
          trendUp={true}
        />
        <StatCard
          title="العملاء النشطين"
          value={stats.onlineClients}
          subtitle={`من ${stats.totalClients}`}
          icon={<Activity className="w-6 h-6" />}
          color="#FF9800"
          trend={`${Math.round((stats.onlineClients / stats.totalClients) * 100)}%`}
          trendUp={true}
        />
        <StatCard
          title="إجمالي المنافذ"
          value={stats.totalInputs + stats.totalOutputs}
          subtitle={`${stats.totalInputs} مداخل + ${stats.totalOutputs} مخارج`}
          icon={<Package className="w-6 h-6" />}
          color="#9C27B0"
          trend="نشط"
          trendUp={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2196F3]" />
              النشاط الأسبوعي
            </h3>
            <button className="text-sm text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          {/* Simulated Chart */}
          <div className="space-y-3">
            {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, i) => {
              const value = Math.floor(Math.random() * 100);
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-16">{day}</span>
                  <div className="flex-1 bg-[#2a2a2a] rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-[#2196F3] to-[#64B5F6] rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-left">{value}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
              أكثر المستخدمين نشاطاً
            </h3>
            <Link to="/admin/users" className="text-sm text-[#2196F3] hover:underline">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-4">
            {topUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#2196F3]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#2196F3] font-bold">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.programs} برنامج • {user.lastActive}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[#4CAF50]">{user.programs}</div>
                  <div className="text-xs text-gray-500">برنامج</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF9800]" />
            النشاطات الأخيرة
          </h3>
          <Link to="/admin/activity" className="text-sm text-[#2196F3] hover:underline">
            عرض السجل الكامل
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivities.map(activity => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333] transition-all">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: activity.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    <span className="text-[#2196F3]">{activity.user}</span>
                    {' '}{activity.action}
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          title="إدارة المستخدمين"
          description="عرض وإدارة جميع المستخدمين"
          icon={<Users className="w-6 h-6" />}
          color="#2196F3"
          link="/admin/users"
        />
        <QuickAction
          title="إدارة الشرائح"
          description="إضافة وتعديل الشرائح"
          icon={<Cpu className="w-6 h-6" />}
          color="#4CAF50"
          link="/admin/boards"
        />
        <QuickAction
          title="إعدادات الموقع"
          description="تخصيص إعدادات المنصة"
          icon={<AlertCircle className="w-6 h-6" />}
          color="#FF9800"
          link="/admin/settings"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, trend, trendUp }: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-[#4CAF50]' : 'text-[#f44336]'}`}>
          {trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span>{trend}</span>
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function QuickAction({ title, description, icon, color, link }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}
