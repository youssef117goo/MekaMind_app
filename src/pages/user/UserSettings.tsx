import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Save, Tag, Cpu, Check, RefreshCw } from 'lucide-react';

export default function UserSettings() {
  const { currentClient, getBoardById, updateAliases } = useApp();
  const [localAliases, setLocalAliases] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const initializedRef = useRef<string | null>(null);

  if (!currentClient) return null;
  const board = getBoardById(currentClient.assignedBoard);
  if (!board) return null;

  // Initialize local aliases from current client (only once per client)
  useEffect(() => {
    if (initializedRef.current !== currentClient.id) {
      setLocalAliases({ ...currentClient.aliases });
      initializedRef.current = currentClient.id;
    }
  }, [currentClient.id, currentClient.aliases]);

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

  // Get the resolved pin for display
  const getResolvedPin = (key: string): number | null => {
    if (board.pinMapping.inputs[key] !== undefined) return board.pinMapping.inputs[key];
    if (board.pinMapping.outputs[key] !== undefined) return board.pinMapping.outputs[key];
    return null;
  };

  const isInput = (key: string) => board.pinMapping.inputs[key] !== undefined;

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات وتخصيص الأسماء</h1>
          <p className="text-gray-400 mt-1">
            أعد تسمية المداخل والمخارج بأسماء سهلة. ستنعكس التغييرات تلقائياً في صفحة البرمجة.
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

      {/* How it works */}
      <div className="bg-[#1e1e1e] border border-[#2196F3]/30 rounded-xl p-5 mb-8">
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

      {/* Board Info */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="w-5 h-5 text-[#2196F3]" />
          <h3 className="font-bold">الشريحة المخصصة: {board.name}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>المعرف: {board.id}</span>
          <span>•</span>
          <span className="text-[#4CAF50]">{Object.keys(board.pinMapping.inputs).length} مداخل</span>
          <span>•</span>
          <span className="text-[#FF9800]">{Object.keys(board.pinMapping.outputs).length} مخارج</span>
        </div>
      </div>

      {/* Inputs Aliases */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#4CAF50]" />
          أسماء المداخل (الحساسات)
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
        </div>
      </div>

      {/* Outputs Aliases */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#FF9800]" />
          أسماء المخارج (المحركات)
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
        </div>
      </div>

      {/* Mapping Summary */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#2196F3]" />
          ملخص الخريطة المنطقية
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
