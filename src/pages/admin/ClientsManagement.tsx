import React, { useState } from 'react';
import { useApp, Client } from '../../store/AppContext';
import { Plus, Trash2, Edit3, Users, Save, X, Wifi, WifiOff } from 'lucide-react';

export default function ClientsManagement() {
  const { clients, boards, addClient, updateClient, deleteClient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [assignedBoard, setAssignedBoard] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setAssignedBoard('');
    setEditingClient(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !assignedBoard) return;
    
    const board = boards.find(b => b.id === assignedBoard);
    const defaultAliases: Record<string, string> = {};
    if (board) {
      Object.keys(board.pinMapping.inputs).forEach(key => {
        defaultAliases[key] = `مدخل ${key.split('_')[1]}`;
      });
      Object.keys(board.pinMapping.outputs).forEach(key => {
        defaultAliases[key] = `مخرج ${key.split('_')[1]}`;
      });
    }

    if (editingClient) {
      updateClient({
        ...editingClient,
        name,
        email,
        assignedBoard
      });
    } else {
      const newClient: Client = {
        id: `USER_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name,
        email,
        assignedBoard,
        status: Math.random() > 0.5 ? 'online' : 'offline',
        aliases: defaultAliases,
        lastSeen: new Date().toLocaleString('ar-EG')
      };
      addClient(newClient);
    }
    resetForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setAssignedBoard(client.assignedBoard);
    setShowForm(true);
  };

  const getBoardName = (boardId: string) => {
    return boards.find(b => b.id === boardId)?.name || 'غير معروف';
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة العملاء</h1>
          <p className="text-gray-400 mt-1">إنشاء حسابات العملاء وربطهم بالشرائح</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-[#2196F3] hover:bg-[#1976D2] rounded-lg font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة عميل جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-[#2196F3]">{clients.length}</div>
          <div className="text-gray-400 text-sm mt-1">إجمالي العملاء</div>
        </div>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-[#4CAF50]">
            {clients.filter(c => c.status === 'online').length}
          </div>
          <div className="text-gray-400 text-sm mt-1">متصل الآن</div>
        </div>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-[#FF9800]">
            {clients.filter(c => c.status === 'offline').length}
          </div>
          <div className="text-gray-400 text-sm mt-1">غير متصل</div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl w-full max-w-lg animate-fade-in">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">اسم العميل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الشريحة المخصصة</label>
                <select
                  value={assignedBoard}
                  onChange={(e) => setAssignedBoard(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#2196F3] focus:outline-none"
                >
                  <option value="">اختر شريحة...</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.name} ({board.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-5 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#2a2a2a] transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#2196F3] hover:bg-[#1976D2] rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="space-y-4">
        {clients.map(client => (
          <div key={client.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2196F3]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#2196F3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{client.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span dir="ltr">{client.email}</span>
                    <span>•</span>
                    <span>الشريحة: {getBoardName(client.assignedBoard)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  client.status === 'online'
                    ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {client.status === 'online' ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                  {client.status === 'online' ? 'متصل' : 'غير متصل'}
                </div>
                
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 text-gray-400 hover:text-[#2196F3] hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteClient(client.id)}
                  className="p-2 text-gray-400 hover:text-[#f44336] hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Aliases Preview */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500 mb-2">الأسماء المخصصة:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(client.aliases).slice(0, 5).map(([key, alias]) => (
                  <span key={key} className="px-2 py-1 bg-[#2a2a2a] rounded text-xs text-gray-300">
                    <span className="text-gray-500 font-mono">{key}:</span> {alias}
                  </span>
                ))}
                {Object.keys(client.aliases).length > 5 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{Object.keys(client.aliases).length - 5} المزيد
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">لا يوجد عملاء مسجلين بعد</p>
          <p className="text-sm">اضغط على "إضافة عميل جديد" للبدء</p>
        </div>
      )}
    </div>
  );
}
