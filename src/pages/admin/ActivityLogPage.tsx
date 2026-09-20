import React, { useState } from 'react';
import {
  Activity, Filter, Search, UserPlus, Cpu, Zap, Settings,
  AlertTriangle, CheckCircle, LogIn, LogOut, Edit3, Trash2,
  Calendar, Clock, MoreVertical, Ban
} from 'lucide-react';

interface ActivityLog {
  id: number;
  type: string;
  user: string;
  action: string;
  details?: string;
  timestamp: string;
  icon: any;
  color: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export default function ActivityLogPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated activity logs
  const activityLogs: ActivityLog[] = [
    {
      id: 1,
      type: 'auth',
      user: 'admin',
      action: 'تسجيل دخول ناجح',
      details: 'من IP: 192.168.1.1',
      timestamp: '2024-03-15 14:30:22',
      icon: LogIn,
      color: '#4CAF50',
      severity: 'success'
    },
    {
      id: 2,
      type: 'user',
      user: 'محمد أحمد',
      action: 'إنشاء حساب جديد',
      details: 'البريد: mohamed@example.com',
      timestamp: '2024-03-15 14:25:10',
      icon: UserPlus,
      color: '#2196F3',
      severity: 'info'
    },
    {
      id: 3,
      type: 'board',
      user: 'admin',
      action: 'إنشاء شريحة جديدة',
      details: 'MekaMind Pro - 5 مداخل / 4 مخارج',
      timestamp: '2024-03-15 14:20:05',
      icon: Cpu,
      color: '#2196F3',
      severity: 'info'
    },
    {
      id: 4,
      type: 'program',
      user: 'أحمد محمد',
      action: 'نشر برنامج',
      details: '15 بلوك - شريحة MekaMind Standard',
      timestamp: '2024-03-15 14:15:30',
      icon: Zap,
      color: '#FF9800',
      severity: 'info'
    },
    {
      id: 5,
      type: 'auth',
      user: 'unknown',
      action: 'محاولة دخول فاشلة',
      details: 'البريد: hacker@evil.com - 3 محاولات',
      timestamp: '2024-03-15 14:10:15',
      icon: AlertTriangle,
      color: '#f44336',
      severity: 'error'
    },
    {
      id: 6,
      type: 'settings',
      user: 'admin',
      action: 'تحديث إعدادات الموقع',
      details: 'تم تغيير اسم الموقع',
      timestamp: '2024-03-15 13:45:00',
      icon: Settings,
      color: '#9C27B0',
      severity: 'info'
    },
    {
      id: 7,
      type: 'user',
      user: 'admin',
      action: 'حظر مستخدم',
      details: 'المستخدم: spam_user - السبب: إساءة استخدام',
      timestamp: '2024-03-15 13:30:22',
      icon: Ban,
      color: '#f44336',
      severity: 'warning'
    },
    {
      id: 8,
      type: 'board',
      user: 'admin',
      action: 'تعديل شريحة',
      details: 'MekaMind Standard - تحديث Pin mapping',
      timestamp: '2024-03-15 13:15:10',
      icon: Edit3,
      color: '#FF9800',
      severity: 'info'
    },
    {
      id: 9,
      type: 'auth',
      user: 'سارة علي',
      action: 'تسجيل خروج',
      timestamp: '2024-03-15 12:45:00',
      icon: LogOut,
      color: '#607D8B',
      severity: 'info'
    },
    {
      id: 10,
      type: 'board',
      user: 'admin',
      action: 'حذف شريحة',
      details: 'MekaMind Old - تم النقل للأرشيف',
      timestamp: '2024-03-15 12:30:45',
      icon: Trash2,
      color: '#f44336',
      severity: 'warning'
    },
  ];

  // Filter logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Stats
  const stats = {
    total: activityLogs.length,
    success: activityLogs.filter(l => l.severity === 'success').length,
    warning: activityLogs.filter(l => l.severity === 'warning').length,
    error: activityLogs.filter(l => l.severity === 'error').length,
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">سجل النشاطات</h1>
          <p className="text-gray-400 mt-1">تتبع جميع الأحداث والإجراءات في النظام</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2196F3]/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#2196F3]" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-400">إجمالي الأحداث</div>
            </div>
          </div>
        </div>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#4CAF50]">{stats.success}</div>
              <div className="text-xs text-gray-400">ناجح</div>
            </div>
          </div>
        </div>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF9800]/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#FF9800]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FF9800]">{stats.warning}</div>
              <div className="text-xs text-gray-400">تحذير</div>
            </div>
          </div>
        </div>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f44336]/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#f44336]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f44336]">{stats.error}</div>
              <div className="text-xs text-gray-400">خطأ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في السجل..."
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-2 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
          >
            <option value="all">جميع الأنواع</option>
            <option value="auth">المصادقة</option>
            <option value="user">المستخدمين</option>
            <option value="board">الشرائح</option>
            <option value="program">البرامج</option>
            <option value="settings">الإعدادات</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {filteredLogs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="p-4 hover:bg-[#2a2a2a] transition-all">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${log.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: log.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">
                          <span className="text-[#2196F3]">{log.user}</span>
                          {' '}{log.action}
                        </div>
                        {log.details && (
                          <div className="text-sm text-gray-400 mt-1">{log.details}</div>
                        )}
                      </div>
                      <div className="text-left flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{log.timestamp.split(' ')[1]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{log.timestamp.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        log.severity === 'success' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                        log.severity === 'warning' ? 'bg-[#FF9800]/10 text-[#FF9800]' :
                        log.severity === 'error' ? 'bg-[#f44336]/10 text-[#f44336]' :
                        'bg-[#2196F3]/10 text-[#2196F3]'
                      }`}>
                        {log.severity === 'success' ? 'ناجح' :
                         log.severity === 'warning' ? 'تحذير' :
                         log.severity === 'error' ? 'خطأ' : 'معلومات'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">لا توجد نشاطات</p>
            <p className="text-sm">لم يتم العثور على نشاطات مطابقة للفلترة</p>
          </div>
        )}
      </div>
    </div>
  );
}
