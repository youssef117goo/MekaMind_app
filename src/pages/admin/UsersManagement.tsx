import React, { useState } from 'react';
import { useUserAuth } from '../../store/UserAuthContext';
import {
  Users, Search, Filter, MoreVertical, Mail, Calendar,
  Ban, Trash2, Edit3, Eye, Shield, UserCheck, AlertCircle
} from 'lucide-react';

export default function UsersManagement() {
  const { users } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-gray-400 mt-1">عرض وإدارة جميع المستخدمين المسجلين</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1e1e1e] border border-gray-800 rounded-lg px-4 py-2 text-sm">
            <span className="text-gray-400">الإجمالي: </span>
            <span className="font-bold text-[#2196F3]">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg pr-11 pl-4 py-2 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="banned">محظور</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#2a2a2a] border-b border-gray-800">
            <tr>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">المستخدم</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">البريد الإلكتروني</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">تاريخ التسجيل</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">الحالة</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-all">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2196F3]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#2196F3] font-bold">
                        {user.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span dir="ltr">{user.email}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{user.createdAt}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm">
                    <UserCheck className="w-3 h-3" />
                    نشط
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-[#2196F3] hover:bg-[#2a2a2a] rounded-lg transition-all"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-[#FF9800] hover:bg-[#2a2a2a] rounded-lg transition-all"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-[#f44336] hover:bg-[#2a2a2a] rounded-lg transition-all"
                      title="حظر"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-[#f44336] hover:bg-[#2a2a2a] rounded-lg transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">لا يوجد مستخدمين</p>
            <p className="text-sm">لم يتم العثور على مستخدمين مطابقين للبحث</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#2196F3] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-[#2196F3] mb-1">ملاحظة مهمة</p>
            <p>
              في النسخة التجريبية، البيانات محفوظة في localStorage. للإنتاج الحقيقي، يجب ربط النظام بقاعدة بيانات حقيقية مثل MongoDB أو Firebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
