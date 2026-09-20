import React, { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Play, Trash2, Download, RotateCcw, GripVertical, ArrowDown, Code } from 'lucide-react';

interface Block {
  id: string;
  type: 'read_input' | 'set_output' | 'condition' | 'delay' | 'loop';
  logicalId: string;
  label: string;
  color: string;
  value?: string;
}

export default function BlocklyWorkspace() {
  const { currentClient, getBoardById } = useApp();
  const [workspace, setWorkspace] = useState<Block[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  if (!currentClient) return null;
  const board = getBoardById(currentClient.assignedBoard);
  if (!board) return null;

  // Generate toolbox blocks dynamically based on board config
  const toolboxBlocks = [
    // Input reading blocks
    ...Object.entries(board.pinMapping.inputs).map(([key, _pin]) => ({
      type: 'read_input' as const,
      logicalId: key,
      label: `📖 قراءة ${currentClient.aliases[key] || key}`,
      color: '#4CAF50'
    })),
    // Output control blocks
    ...Object.entries(board.pinMapping.outputs).map(([key, _pin]) => ({
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

  // Generate code from blocks (simulating the compiler)
  const generateCode = () => {
    let code = '// === MekaMind Generated Code ===\n';
    code += `// Board: ${board.name} (${board.id})\n`;
    code += `// Client: ${currentClient.name}\n`;
    code += '// ================================\n\n';
    code += 'void setup() {\n';
    
    // Setup pins
    Object.entries(board.pinMapping.inputs).forEach(([key, pin]) => {
      const alias = currentClient.aliases[key] || key;
      code += `  pinMode(${pin}, INPUT);  // ${alias} (${key})\n`;
    });
    Object.entries(board.pinMapping.outputs).forEach(([key, pin]) => {
      const alias = currentClient.aliases[key] || key;
      code += `  pinMode(${pin}, OUTPUT); // ${alias} (${key})\n`;
    });
    
    code += '}\n\nvoid loop() {\n';
    
    // Generate logic from blocks
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

  // Generate JSON logic (for MQTT transmission)
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
    // In real app, this would send to backend via MQTT
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
    // Find the block type from the dragged data
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
            {currentClient.name} • {board.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              showCode ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
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

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox - Right Side (RTL) */}
        <div className="w-72 bg-[#1a1a1a] border-l border-gray-800 overflow-auto p-4">
          <h3 className="text-sm font-bold text-gray-400 mb-3">🧩 صندوق الأدوات</h3>
          <p className="text-xs text-gray-500 mb-4">اسحب البلوكات إلى مساحة العمل</p>
          
          {/* Inputs Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#4CAF50] mb-2 uppercase">المداخل (حساسات)</h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => b.type === 'read_input').map((block, i) => (
                <div
                  key={`tool_${i}`}
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
            </div>
          </div>

          {/* Outputs Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#FF9800] mb-2 uppercase">المخارج (محركات)</h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => b.type === 'set_output').map((block, i) => (
                <div
                  key={`tool_${i}`}
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
            </div>
          </div>

          {/* Logic Category */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-[#9C27B0] mb-2 uppercase">المنطق والتحكم</h4>
            <div className="space-y-2">
              {toolboxBlocks.filter(b => ['condition', 'delay', 'loop'].includes(b.type)).map((block, i) => (
                <div
                  key={`tool_${i}`}
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
                        
                        {/* Editable values */}
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
