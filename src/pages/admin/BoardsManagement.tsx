import React, { useState } from 'react';
import { useApp, Board } from '../../store/AppContext';
import { Plus, Trash2, Edit3, Cpu, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function BoardsManagement() {
  const { boards, addBoard, updateBoard, deleteBoard } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [inputsCount, setInputsCount] = useState(2);
  const [outputsCount, setOutputsCount] = useState(2);
  const [pinMapping, setPinMapping] = useState<{ inputs: Record<string, number>; outputs: Record<string, number> }>({
    inputs: {},
    outputs: {}
  });

  const resetForm = () => {
    setName('');
    setInputsCount(2);
    setOutputsCount(2);
    setPinMapping({ inputs: {}, outputs: {} });
    setEditingBoard(null);
    setShowForm(false);
  };

  const handleCountsChange = (inputs: number, outputs: number) => {
    setInputsCount(inputs);
    setOutputsCount(outputs);
    
    const newInputs: Record<string, number> = {};
    const newOutputs: Record<string, number> = {};
    
    for (let i = 1; i <= inputs; i++) {
      const key = `INP_${i}`;
      newInputs[key] = pinMapping.inputs[key] || 0;
    }
    for (let i = 1; i <= outputs; i++) {
      const key = `OUT_${i}`;
      newOutputs[key] = pinMapping.outputs[key] || 0;
    }
    
    setPinMapping({ inputs: newInputs, outputs: newOutputs });
  };

  const handlePinChange = (type: 'inputs' | 'outputs', key: string, value: number) => {
    setPinMapping(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    if (editingBoard) {
      updateBoard({
        ...editingBoard,
        name,
        inputsCount,
        outputsCount,
        pinMapping
      });
    } else {
      const newBoard: Board = {
        id: `BOARD_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name,
        inputsCount,
        outputsCount,
        pinMapping,
        createdAt: new Date().toISOString().split('T')[0]
      };
      addBoard(newBoard);
    }
    resetForm();
  };

  const handleEdit = (board: Board) => {
    setEditingBoard(board);
    setName(board.name);
    setInputsCount(board.inputsCount);
    setOutputsCount(board.outputsCount);
    setPinMapping({ ...board.pinMapping });
    setShowForm(true);
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة الشرائح</h1>
          <p className="text-gray-400 mt-1">إنشاء قوالب هاردوير وتعيين خريطة الـ Pins</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-[#2196F3] hover:bg-[#1976D2] rounded-lg font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة شريحة جديدة
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-fade-in">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingBoard ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Board Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">اسم الشريحة</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: MekaMind_V1"
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
                />
              </div>

              {/* Counts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">عدد المداخل (Inputs)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={inputsCount}
                    onChange={(e) => handleCountsChange(parseInt(e.target.value) || 1, outputsCount)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#2196F3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">عدد المخارج (Outputs)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={outputsCount}
                    onChange={(e) => handleCountsChange(inputsCount, parseInt(e.target.value) || 1)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#2196F3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pin Mapping - Inputs */}
              <div>
                <h3 className="text-lg font-bold text-[#4CAF50] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#4CAF50] rounded-full"></span>
                  تعيين الـ Pins للمداخل
                </h3>
                <div className="space-y-3">
                  {Object.keys(pinMapping.inputs).map(key => (
                    <div key={key} className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3">
                      <span className="text-sm font-mono text-[#4CAF50] w-20">{key}</span>
                      <span className="text-gray-400 text-sm">→</span>
                      <span className="text-sm text-gray-300">Pin رقم</span>
                      <input
                        type="number"
                        value={pinMapping.inputs[key]}
                        onChange={(e) => handlePinChange('inputs', key, parseInt(e.target.value) || 0)}
                        className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#2196F3] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pin Mapping - Outputs */}
              <div>
                <h3 className="text-lg font-bold text-[#FF9800] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#FF9800] rounded-full"></span>
                  تعيين الـ Pins للمخارج
                </h3>
                <div className="space-y-3">
                  {Object.keys(pinMapping.outputs).map(key => (
                    <div key={key} className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3">
                      <span className="text-sm font-mono text-[#FF9800] w-20">{key}</span>
                      <span className="text-gray-400 text-sm">→</span>
                      <span className="text-sm text-gray-300">Pin رقم</span>
                      <input
                        type="number"
                        value={pinMapping.outputs[key]}
                        onChange={(e) => handlePinChange('outputs', key, parseInt(e.target.value) || 0)}
                        className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#2196F3] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
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
                {editingBoard ? 'حفظ التعديلات' : 'إضافة الشريحة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards List */}
      <div className="space-y-4">
        {boards.map(board => (
          <div key={board.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2196F3]/10 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[#2196F3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{board.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span>ID: {board.id}</span>
                    <span>•</span>
                    <span className="text-[#4CAF50]">{board.inputsCount} مداخل</span>
                    <span>•</span>
                    <span className="text-[#FF9800]">{board.outputsCount} مخارج</span>
                    <span>•</span>
                    <span>{board.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedBoard(expandedBoard === board.id ? null : board.id)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  {expandedBoard === board.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleEdit(board)}
                  className="p-2 text-gray-400 hover:text-[#2196F3] hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="p-2 text-gray-400 hover:text-[#f44336] hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Pin Map */}
            {expandedBoard === board.id && (
              <div className="px-6 pb-6 animate-fade-in">
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-300 mb-3">خريطة الـ Pins (JSON)</h4>
                  <pre className="text-sm font-mono text-gray-400 overflow-auto" dir="ltr">
{JSON.stringify(board.pinMapping, null, 2)}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#4CAF50] mb-2">المداخل</h4>
                    <div className="space-y-2">
                      {Object.entries(board.pinMapping.inputs).map(([key, pin]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <span className="text-[#4CAF50] font-mono">{key}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-gray-300">Pin {pin}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#FF9800] mb-2">المخارج</h4>
                    <div className="space-y-2">
                      {Object.entries(board.pinMapping.outputs).map(([key, pin]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <span className="text-[#FF9800] font-mono">{key}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-gray-300">Pin {pin}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {boards.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Cpu className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">لا توجد شرائح مسجلة بعد</p>
          <p className="text-sm">اضغط على "إضافة شريحة جديدة" للبدء</p>
        </div>
      )}
    </div>
  );
}
