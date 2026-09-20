import React, { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Trash2, Download, RotateCcw, GripVertical, ArrowDown, Code, Cpu, Layers, X, Check } from 'lucide-react';

interface Block {
  id: string;
  type: 'read_input' | 'set_output' | 'condition' | 'delay' | 'loop';
  logicalId: string;
  label: string;
  color: string;
  value?: string;
}

export default function BlocklyWorkspace() {
  const { currentClient, boards, getBoardById } = useApp();
  const [workspace, setWorkspace] = useState<Block[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [showBoardsModal, setShowBoardsModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  if (!currentClient) return null;

  // Use selected board or fallback to client's assigned board
  const activeBoardId = selectedBoardId || currentClient.assignedBoard;
  const board = getBoardById(activeBoardId);
  if (!board) return null;

  // Generate toolbox blocks dynamically based on selected board config
  const toolboxBlocks = [
    // Input reading blocks
    ...Object.entries(board.pinMapping.inputs).map(([key]) => ({
      type: 'read_input' as const,
      logicalId: key,
      label: `📖 قراءة ${currentClient.aliases[key] || key}`,
      color: '#4CAF50'
    })),
    // Output control blocks
    ...Object.entries(board.pinMapping.outputs).map(([key]) => ({
      type: 'set_output' as const,
      logicalId: key,
      label: `⚡ تشغيل ${currentClient.aliases[key] || key}`,
      color: '#FF9800'
    })),
    // Logic blocks
    { type: 'condition' as const, logicalId: 'IF', label: '🔀 إذا كان الشرط صحيح', color: '#9C27B0' },
    { type: 'delay' as const, logicalId: 'DELAY', label: '⏱️ انتظر (ثواني)', color: '#607D8B' },
    { type: 'loop' as const, logicalId: 'LOOP', label: '🔄 كرر دائماً', color: '#2196F3' },
  ];

  const addBlockToWorkspace = (block: typeof toolboxBlocks[0]) => {
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: block.type,
      logicalId: block.logicalId,
      label: block.label,
      color: block.color,
      value: block.type === 'delay' ? '1' : block.type === 'set_output' ? 'HIGH' : undefined
    };
    setWorkspace(prev => [...prev, newBlock]);
    setDeployed(false);
  };

  const removeBlock = (id: string) => {
    setWorkspace(prev => prev.filter(b => b.id !== id));
    setDeployed(false);
  };

  const clearWorkspace = () => {
    setWorkspace([]);
    setDeployed(false);
  };

  const updateBlockValue = (id: string, value: string) => {
    setWorkspace(prev => prev.map(b => b.id === id ? { ...b, value } : b));
    setDeployed(false);
  };

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setShowBoardsModal(false);
    // Clear workspace when changing board
    setWorkspace([]);
    setDeployed(false);
  };

  // Generate code from blocks
  const generateCode = () => {
    let code = '// === MekaMind Generated Code ===\n';
    code += `// Board: ${board.name} (${board.id})\n`;
    code += `// Client: ${currentClient.name}\n`;
    code += '// ================================\n\n';
    code += 'void setup() {\n';
    
    Object.entries(board.pinMapping.inputs).forEach(([key, pin]) => {
      const alias = currentClient.aliases[key] || key;
      code += `  pinMode(${pin}, INPUT);  // ${alias} (${key})\n`;
    });
    Object.entries(board.pinMapping.outputs).forEach(([key, pin]) => {
      const alias = currentClient.aliases[key] || key;
      code += `  pinMode(${pin}, OUTPUT); // ${alias} (${key})\n`;
    });
    
    code += '}\n\nvoid loop() {\n';
    
    workspace.forEach(block => {
      switch (block.type) {
        case 'read_input':
          const inpPin = board.pinMapping.inputs[block.logicalId];
          const inpAlias = currentClient.aliases[block.logicalId] || block.logicalId;
          code += `  int ${block.logicalId}_value = digitalRead(${inpPin}); // ${inpAlias}\n`;
          break;
        case 'set_output':
          const outPin = board.pinMapping.outputs[block.logicalId];
          const outAlias = currentClient.aliases[block.logicalId] || block.logicalId;
          code += `  digitalWrite(${outPin}, ${block.value || 'HIGH'}); // ${outAlias}\n`;
          break;
        case 'condition':
          code += `  if (${workspace.find(b => b.type === 'read_input')?.logicalId || 'INP_1'}_value == HIGH) {\n`;
          break;
        case 'delay':
          code += `  delay(${(parseInt(block.value || '1') || 1) * 1000});\n`;
          break;
        case 'loop':
          code += `  // Loop start\n`;
          break;
      }
    });
    
    code += '}\n';
    return code;
  };

  const generateJSONLogic = () => {
    return {
      board_id: board.id,
      client_id: currentClient.id,
      logic: workspace.map(block => ({
        action: block.type,
        target: block.logicalId,
        resolved_pin: block.type === 'read_input' 
          ? board.pinMapping.inputs[block.logicalId]
          : block.type === 'set_output'
          ? board.pinMapping.outputs[block.logicalId]
          : null,
        value: block.value || null
      })),
      timestamp: new Date().toISOString()
    };
  };

  const handleDeploy = () => {
    setDeployed(true);
    console.log('Deployed logic:', generateJSONLogic());
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    setDraggedBlock(blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockData = toolboxBlocks.find(b => b.logicalId === draggedBlock || b.label === draggedBlock);
    if (blockData) {
      addBlockToWorkspace(blockData);
    }
    setDraggedBlock(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">مساحة البرمجة</h1>
          <span className="text-sm text-gray-500">
            {currentClient.name}
          </span>
          
          {/* Board Selector Button */}
          <button
            onClick={() => setShowBoardsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-lg text-[#2196F3] text-sm hover:bg-[#2196F3]/20 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span className="font-medium">{board.name}</span>
            <span className="text-xs opacity-70">
              ({Object.keys(board.pinMapping.inputs).length} مداخل / {Object.keys(board.pinMapping.outputs).length} مخارج)
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              showCode ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:bg-[#2a2a2a]'
            }`
          }>
            <Code className="w-4 h-4" />
            عرض الكود
          </button>
          <button
            onClick={clearWorkspace}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            مسح
          </button>
          <button
            onClick={handleDeploy}
            disabled={workspace.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              workspace.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : deployed
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#2196F3] hover:bg-[#1976D2] text-white'
            }`}
          >
            {deployed ? (
              <>✓ تم الإرسال</>
            ) : (
              <>
                <Download className="w-4 h-4" />
                إرسال للشريحة
              </>
            )}
          </button>
        </div>
      </div>

      {/* Boards Selection Modal */}
      {showBoardsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Layers className="w-6 h-6 text-[#2196F3]" />
                  اختر الشريحة
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  سيتم توليد البلوكات بناءً على عدد المداخل والمخارج في الشريحة المختارة
                </p>
              </div>
              <button
                onClick={() => setShowBoardsModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Boards Grid */}
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boards.map(b => {
                  const isSelected = b.id === activeBoardId;
                  const inputsCount = Object.keys(b.pinMapping.inputs).length;
                  const outputsCount = Object.keys(b.pinMapping.outputs).length;
                  
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBoard(b.id)}
                      className={`relative border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                        isSelected
                          ? 'border-[#2196F3] bg-[#2196F3]/10 ring-2 ring-[#2196F3]/30'
                          : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-500'
                      }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 w-6 h-6 bg-[#2196F3] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Board Icon & Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#2196F3]/20' : 'bg-[#1e1e1e]'
                        }`}>
                          <Cpu className={`w-6 h-6 ${isSelected ? 'text-[#2196F3]' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{b.name}</h3>
                          <p className="text-xs text-gray-500 font-mono">{b.id}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#1e1e1e] rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-[#4CAF50]">{inputsCount}</div>
                          <div className="text-xs text-gray-400">مداخل</div>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-[#FF9800]">{outputsCount}</div>
                          <div className="text-xs text-gray-400">مخارج</div>
                        </div>
                      </div>

                      {/* Pin Details */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-[#4CAF50] font-bold mb-1">المداخل:</div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(b.pinMapping.inputs).map(([key, pin]) => (
                              <span key={key} className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded font-mono">
                                {key} → Pin {pin}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#FF9800] font-bold mb-1">المخارج:</div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(b.pinMapping.outputs).map(([key, pin]) => (
                              <span key={key} className="text-xs bg-[#FF9800]/10 text-[#FF9800] px-2 py-0.5 rounded font-mono">
                                {key} → Pin {pin}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Blocks Preview */}
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-500 mb-2">سيتم توليد {inputsCount + outputsCount} بلوك:</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(b.pinMapping.inputs).map(key => (
                            <span key={key} className="text-xs bg-[#4CAF50]/20 text-[#4CAF50] px-2 py-1 rounded">
                              📖 {currentClient.aliases[key] || key}
                            </span>
                          ))}
                          {Object.keys(b.pinMapping.outputs).map(key => (
                            <span key={key} className="text-xs bg-[#FF9800]/20 text-[#FF9800] px-2 py-1 rounded">
                              ⚡ {currentClient.aliases[key] || key}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {boards.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Cpu className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">لا توجد شرائح متاحة</p>
                  <p className="text-sm">يرجى إضافة شرائح من لوحة الإدارة</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-700 bg-[#1a1a1a] flex items-center justify-between">
              <p className="text-sm text-gray-400">
                الشريحة الحالية: <span className="text-[#2196F3] font-medium">{board.name}</span>
              </p>
              <button
                onClick={() => setShowBoardsModal(false)}
                className="px-5 py-2 bg-[#2196F3] hover:bg-[#1976D2] rounded-lg font-medium transition-all"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox - Right Side (RTL) */}
        <div className="w-72 bg-[#1a1a1a] border-l border-gray-800 overflow-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-400">🧩 صندوق الأدوات</h3>
            <button
              onClick={() => setShowBoardsModal(true)}
              className="text-xs text-[#2196F3] hover:underline"
            >
              تغيير الشريحة
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            اسحب البلوكات إلى مساحة العمل
          </p>
          <div className="text-xs text-gray-600 mb-4 bg-[#2a2a2a] rounded p-2">
            الشريحة: <span className="text-[#2196F3]">{board.name}</span>
            <br />
            {Object.keys(board.pinMapping.inputs).length} مداخل • {Object.keys(board.pinMapping.outputs).length} مخارج
          </div>
          
          {/* Inputs Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#4CAF50] mb-2 uppercase flex items-center gap-1">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full"></span>
              المداخل ({Object.keys(board.pinMapping.inputs).length})
            </h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => b.type === 'read_input').map((block, i) => (
                <div
                  key={`tool_inp_${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.logicalId)}
                  onClick={() => addBlockToWorkspace(block)}
                  className="block-item bg-[#4CAF50]/20 border border-[#4CAF50]/40 text-[#4CAF50] text-sm"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 opacity-50" />
                    {block.label}
                  </div>
                </div>
              ))}
              {Object.keys(board.pinMapping.inputs).length === 0 && (
                <p className="text-xs text-gray-600 italic">لا توجد مداخل في هذه الشريحة</p>
              )}
            </div>
          </div>

          {/* Outputs Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#FF9800] mb-2 uppercase flex items-center gap-1">
              <span className="w-2 h-2 bg-[#FF9800] rounded-full"></span>
              المخارج ({Object.keys(board.pinMapping.outputs).length})
            </h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => b.type === 'set_output').map((block, i) => (
                <div
                  key={`tool_out_${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.logicalId)}
                  onClick={() => addBlockToWorkspace(block)}
                  className="block-item bg-[#FF9800]/20 border border-[#FF9800]/40 text-[#FF9800] text-sm"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 opacity-50" />
                    {block.label}
                  </div>
                </div>
              ))}
              {Object.keys(board.pinMapping.outputs).length === 0 && (
                <p className="text-xs text-gray-600 italic">لا توجد مخارج في هذه الشريحة</p>
              )}
            </div>
          </div>

          {/* Logic Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#9C27B0] mb-2 uppercase flex items-center gap-1">
              <span className="w-2 h-2 bg-[#9C27B0] rounded-full"></span>
              المنطق والتحكم
            </h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => ['condition', 'delay', 'loop'].includes(b.type)).map((block, i) => (
                <div
                  key={`tool_logic_${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.logicalId)}
                  onClick={() => addBlockToWorkspace(block)}
                  className="block-item text-sm"
                  style={{
                    backgroundColor: `${block.color}20`,
                    borderColor: `${block.color}40`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: block.color
                  }}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 opacity-50" />
                    {block.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-[#2a2a2a] rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 <strong>ملاحظة:</strong> البلوكات لا تحتوي على أرقام Pins. النظام يترجمها تلقائياً بناءً على خريطة الإدارة.
            </p>
          </div>
        </div>

        {/* Workspace - Center */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={workspaceRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 overflow-auto p-6 bg-[#121212] relative"
            style={{
              backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {workspace.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="w-20 h-20 bg-[#1e1e1e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="text-lg font-medium">اسحب البلوكات هنا للبدء</p>
                  <p className="text-sm mt-1">أو اضغط على أي بلوك من صندوق الأدوات</p>
                  <button
                    onClick={() => setShowBoardsModal(true)}
                    className="mt-4 px-4 py-2 bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-lg text-[#2196F3] text-sm hover:bg-[#2196F3]/20 transition-all inline-flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    اختر شريحة أخرى
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 max-w-xl mx-auto">
                {workspace.map((block, index) => (
                  <div key={block.id} className="animate-fade-in">
                    <div
                      className="block-item flex items-center justify-between"
                      style={{
                        backgroundColor: `${block.color}15`,
                        borderColor: `${block.color}40`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: block.color
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 opacity-30" />
                        <span className="font-medium">{block.label}</span>
                        
                        {block.type === 'set_output' && (
                          <select
                            value={block.value || 'HIGH'}
                            onChange={(e) => updateBlockValue(block.id, e.target.value)}
                            className="bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white"
                          >
                            <option value="HIGH">تشغيل</option>
                            <option value="LOW">إيقاف</option>
                          </select>
                        )}
                        {block.type === 'delay' && (
                          <input
                            type="number"
                            value={block.value || '1'}
                            onChange={(e) => updateBlockValue(block.id, e.target.value)}
                            className="bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white w-16"
                            min="1"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50 font-mono" dir="ltr">{block.logicalId}</span>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="p-1 hover:bg-black/20 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {index < workspace.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Preview */}
          {showCode && (
            <div className="h-64 bg-[#0d1117] border-t border-gray-800 overflow-auto p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">الكود المُولَّد (C++ / Arduino)</h3>
                <span className="text-xs text-gray-500">يُظهر كيف يترجم النظام البلوكات إلى أرقام Pins</span>
              </div>
              <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap" dir="ltr">
                {generateCode()}
              </pre>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h4 className="text-sm font-bold text-gray-300 mb-2">JSON Logic (للإرسال عبر MQTT)</h4>
                <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap" dir="ltr">
                  {JSON.stringify(generateJSONLogic(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deploy Status */}
      {deployed && (
        <div className="bg-[#4CAF50]/10 border-t border-[#4CAF50]/30 px-6 py-3 flex items-center gap-3 animate-fade-in">
          <div className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
          <span className="text-[#4CAF50] text-sm font-medium">
            تم إرسال المنطق بنجاح إلى الشريحة "{board.name}"
          </span>
          <span className="text-xs text-gray-500 mr-auto">
            {workspace.length} بلوك • {new Date().toLocaleTimeString('ar-EG')}
          </span>
        </div>
      )}
    </div>
  );
}
