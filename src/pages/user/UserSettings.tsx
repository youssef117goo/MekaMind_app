import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Save, Tag, Cpu, Check, RefreshCw, Layers, ChevronDown } from 'lucide-react';

export default function UserSettings() {
  const { currentClient, boards, getBoardById, updateAliases } = useApp();
  const [localAliases, setLocalAliases] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const initializedRef = useRef<string | null>(null);

  if (!currentClient) return null;

  // Initialize with client's assigned board
  useEffect(() => {
    if (initializedRef.current !== currentClient.id) {
      setLocalAliases({ ...currentClient.aliases });
      setSelectedBoardId(currentClient.assignedBoard);
      initializedRef.current = currentClient.id;
    }
  }, [currentClient.id, currentClient.aliases, currentClient.assignedBoard]);

  const board = getBoardById(selectedBoardId);
  if (!board) return null;

  const handleAliasChange = (key: string, value: string) => {
    setLocalAliases(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateAliases(currentClient.id, localAliases);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultAliases: Record<string, string> = {};
    Object.keys(board.pinMapping.inputs).forEach(key => {
      defaultAliases[key] = `مدخل ${key.split('_')[1]}`;
    });
    Object.keys(board.pinMapping.outputs).forEach(key => {
      defaultAliases[key] = `مخرج ${key.split('_')[1]}`;
    });
    setLocalAliases(defaultAliases);
    setSaved(false);
  };

  const handleBoardChange = (newBoardId: string) => {
    setSelectedBoardId(newBoardId);
    // Reset aliases to defaults for new board
    const newBoard = getBoardById(newBoardId);
    if (newBoard) {
      const defaultAliases: Record<string, string> = {};
      Object.keys(newBoard.pinMapping.inputs).forEach(key => {
        defaultAliases[key] = currentClient.aliases[key] || `مدخل ${key.split('_')[1]}`;
      });
      Object.keys(newBoard.pinMapping.outputs).forEach(key => {
        defaultAliases[key] = currentClient.aliases[key] || `مخرج ${key.split('_')[1]}`;
      });
      setLocalAliases(defaultAliases);
    }
    setSaved(false);
  };

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات وتخصيص الأسماء</h1>
          <p className="text-gray-400 mt-1">
            اختر الشريحة ثم أعد تسمية المداخل والمخارج بأسماء سهلة. ستنعكس التغييرات تلقائياً في صفحة البرمجة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#2a2a2a] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة تعيين
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
              saved
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#2196F3] hover:bg-[#1976D2] text-white'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                تم الحفظ ✓
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>

      {/* Board Selector */}
      <div className="bg-[#1e1e1e] border border-[#2196F3]/30 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-[#2196F3]" />
          <h2 className="text-xl font-bold">اختر الشريحة</h2>
        </div>
        
        <div className="relative">
          <select
            value={selectedBoardId}
            onChange={(e) => handleBoardChange(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#2196F3] focus:outline-none appearance-none cursor-pointer"
          >
            {boards.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.id}) - {Object.keys(b.pinMapping.inputs).length} مداخل / {Object.keys(b.pinMapping.outputs).length} مخارج
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Selected Board Info */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#2196F3]">{board.name}</div>
            <div className="text-xs text-gray-400 mt-1">اسم الشريحة</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#4CAF50]">{Object.keys(board.pinMapping.inputs).length}</div>
            <div className="text-xs text-gray-400 mt-1">مداخل</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#FF9800]">{Object.keys(board.pinMapping.outputs).length}</div>
            <div className="text-xs text-gray-400 mt-1">مخارج</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 mb-8">
        <h3 className="font-bold text-[#2196F3] mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          كيف يعمل التجريد (Abstraction)؟
        </h3>
        <div className="text-sm text-gray-400 leading-relaxed space-y-2">
          <p>
            عند إعادة تسمية "INP_1" إلى "حساس الحرارة"، فإن:
          </p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>المستخدم يرى: "حساس الحرارة" في كل مكان</li>
            <li>البلوكات تُحدَّث تلقائياً لتعرض الاسم الجديد</li>
            <li>النظام برمجياً يعرف أن: حساس الحرارة = INP_1 = Pin {board.pinMapping.inputs['INP_1'] || '؟'}</li>
          </ul>
        </div>
      </div>

      {/* Inputs Aliases */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#4CAF50]" />
          أسماء المداخل (الحساسات)
          <span className="text-sm text-gray-500 font-normal">- {board.name}</span>
        </h2>
        <div className="space-y-3">
          {Object.entries(board.pinMapping.inputs).map(([key, pin]) => (
            <div key={key} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#4CAF50] font-mono text-sm">{key}</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={localAliases[key] || ''}
                  onChange={(e) => handleAliasChange(key, e.target.value)}
                  placeholder={`أدخل اسم مخصص لـ ${key}`}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#4CAF50] focus:outline-none"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Pin الفعلي</div>
                <div className="text-sm font-mono text-[#4CAF50]">{pin}</div>
              </div>
            </div>
          ))}
          {Object.keys(board.pinMapping.inputs).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد مداخل في هذه الشريحة</p>
            </div>
          )}
        </div>
      </div>

      {/* Outputs Aliases */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#FF9800]" />
          أسماء المخارج (المحركات)
          <span className="text-sm text-gray-500 font-normal">- {board.name}</span>
        </h2>
        <div className="space-y-3">
          {Object.entries(board.pinMapping.outputs).map(([key, pin]) => (
            <div key={key} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-[#FF9800]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#FF9800] font-mono text-sm">{key}</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={localAliases[key] || ''}
                  onChange={(e) => handleAliasChange(key, e.target.value)}
                  placeholder={`أدخل اسم مخصص لـ ${key}`}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#FF9800] focus:outline-none"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Pin الفعلي</div>
                <div className="text-sm font-mono text-[#FF9800]">{pin}</div>
              </div>
            </div>
          ))}
          {Object.keys(board.pinMapping.outputs).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد مخارج في هذه الشريحة</p>
            </div>
          )}
        </div>
      </div>

      {/* Mapping Summary */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#2196F3]" />
          ملخص الخريطة المنطقية - {board.name}
        </h3>
        <div className="bg-[#0d1117] rounded-lg p-4 overflow-auto">
          <table className="w-full text-sm" dir="ltr">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-right py-2 px-3">Logical ID</th>
                <th className="text-right py-2 px-3">Custom Name</th>
                <th className="text-right py-2 px-3">Type</th>
                <th className="text-right py-2 px-3">Physical Pin</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(board.pinMapping.inputs).map(([key, pin]) => (
                <tr key={key} className="border-b border-gray-800/50">
                  <td className="py-2 px-3 font-mono text-[#4CAF50]">{key}</td>
                  <td className="py-2 px-3 text-white">{localAliases[key] || '-'}</td>
                  <td className="py-2 px-3 text-gray-400">INPUT</td>
                  <td className="py-2 px-3 font-mono text-gray-300">{pin}</td>
                </tr>
              ))}
              {Object.entries(board.pinMapping.outputs).map(([key, pin]) => (
                <tr key={key} className="border-b border-gray-800/50">
                  <td className="py-2 px-3 font-mono text-[#FF9800]">{key}</td>
                  <td className="py-2 px-3 text-white">{localAliases[key] || '-'}</td>
                  <td className="py-2 px-3 text-gray-400">OUTPUT</td>
                  <td className="py-2 px-3 font-mono text-gray-300">{pin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
