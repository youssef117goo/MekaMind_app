import React, { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import {
  Trash2, Download, RotateCcw, GripVertical, ArrowDown, Code,
  Cpu, Layers, X, Check, ChevronDown, Plus, MessageSquare,
  Monitor, Clock, AlertTriangle, Zap, Link2, RefreshCw
} from 'lucide-react';
import AIAssistant from '../../components/AIAssistant';

// ==================== Types ====================
type BlockCategory = 'io' | 'setup' | 'display' | 'timing' | 'telegram' | 'logic' | 'text';

interface BlockDef {
  type: string;
  category: BlockCategory;
  label: string;
  icon: string;
  color: string;
  hasChildren?: boolean;
  fields?: Record<string, { type: 'text' | 'number' | 'select' | 'slot' | 'condition'; options?: string[]; placeholder?: string; default?: any }>;
}

interface BlockInstance {
  id: string;
  defType: string;
  fields: Record<string, any>;
  children?: BlockInstance[];
}

// ==================== Block Definitions ====================
const BLOCK_DEFS: Record<string, BlockDef> = {
  // === IO Blocks ===
  read_input: {
    type: 'read_input', category: 'io', label: 'قراءة', icon: '📖', color: '#4CAF50',
    fields: { target: { type: 'select', options: [] } }
  },
  set_output: {
    type: 'set_output', category: 'io', label: 'تشغيل', icon: '⚡', color: '#FF9800',
    fields: { target: { type: 'select', options: [] }, state: { type: 'select', options: ['تشغيل', 'إيقاف'], default: 'تشغيل' } }
  },

  // === Setup Blocks ===
  telegram_setup: {
    type: 'telegram_setup', category: 'setup', label: 'تهيئة تليجرام', icon: '⚙️', color: '#0088cc',
    fields: {
      token: { type: 'text', placeholder: 'Bot Token', default: '' },
      chatId: { type: 'text', placeholder: 'Chat ID', default: '' }
    }
  },
  display_init: {
    type: 'display_init', category: 'setup', label: 'تفعيل الشاشة', icon: '🖥️', color: '#9C27B0',
    fields: {
      type: { type: 'select', options: ['OLED I2C', 'LCD 16x2'], default: 'OLED I2C' }
    }
  },

  // === Display Blocks ===
  print_screen: {
    type: 'print_screen', category: 'display', label: 'اكتب على الشاشة', icon: '📝', color: '#9C27B0',
    fields: {
      content: { type: 'slot', placeholder: 'اسحب نص أو قيمة هنا' },
      line: { type: 'select', options: ['1', '2', '3', '4'], default: '1' }
    }
  },
  clear_screen: {
    type: 'clear_screen', category: 'display', label: 'مسح الشاشة', icon: '🧹', color: '#9C27B0',
    fields: {}
  },
  update_display: {
    type: 'update_display', category: 'display', label: 'تحديث الشاشة', icon: '🔄', color: '#9C27B0',
    fields: {}
  },

  // === Timing Blocks ===
  interval_trigger: {
    type: 'interval_trigger', category: 'timing', label: 'نفّذ كل', icon: '⏱️', color: '#607D8B',
    hasChildren: true,
    fields: {
      value: { type: 'number', placeholder: 'القيمة', default: 5 },
      unit: { type: 'select', options: ['ثانية', 'دقيقة', 'ساعة'], default: 'ثانية' }
    }
  },

  // === Text Blocks ===
  join_text: {
    type: 'join_text', category: 'text', label: 'ادمج النصوص', icon: '🔗', color: '#E91E63',
    fields: {
      part1: { type: 'slot', placeholder: 'القطعة 1', default: '' },
      part2: { type: 'slot', placeholder: 'القطعة 2', default: '' },
      part3: { type: 'slot', placeholder: 'القطعة 3', default: '' }
    }
  },
  text_literal: {
    type: 'text_literal', category: 'text', label: 'نص ثابت', icon: '📄', color: '#E91E63',
    fields: { value: { type: 'text', placeholder: 'اكتب النص هنا', default: '' } }
  },

  // === Telegram Blocks ===
  send_telegram: {
    type: 'send_telegram', category: 'telegram', label: 'أرسل لتليجرام', icon: '🚀', color: '#0088cc',
    fields: {
      message: { type: 'slot', placeholder: 'اسحب رسالة أو ادمج نصوص' }
    }
  },

  // === Logic Blocks ===
  on_state_change: {
    type: 'on_state_change', category: 'logic', label: 'عندما تتغير حالة', icon: '⚡', color: '#f44336',
    hasChildren: true,
    fields: {
      input: { type: 'select', options: [] },
      state: { type: 'select', options: ['تشغيل', 'إيقاف'], default: 'تشغيل' }
    }
  },
  condition_if: {
    type: 'condition_if', category: 'logic', label: 'إذا كان', icon: '🔀', color: '#f44336',
    hasChildren: true,
    fields: {
      condition: { type: 'condition' }
    }
  },
  delay_block: {
    type: 'delay_block', category: 'logic', label: 'انتظر', icon: '⏳', color: '#607D8B',
    fields: { value: { type: 'number', placeholder: 'ثواني', default: 1 } }
  }
};

// ==================== Main Component ====================
export default function BlocklyWorkspace() {
  const { currentClient, boards, getBoardById } = useApp();
  const [showCode, setShowCode] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [showBoardsModal, setShowBoardsModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<BlockCategory | null>('io');
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);
  const [dragTargetParent, setDragTargetParent] = useState<string | null>(null);

  // Workspace sections
  const [setupBlocks, setSetupBlocks] = useState<BlockInstance[]>([]);
  const [loopBlocks, setLoopBlocks] = useState<BlockInstance[]>([]);

  if (!currentClient) return null;
  const activeBoardId = selectedBoardId || currentClient.assignedBoard;
  const board = getBoardById(activeBoardId);
  if (!board) return null;

  // Build dynamic options for input/output selects
  const inputOptions = Object.keys(board.pinMapping.inputs).map(k => ({
    value: k,
    label: currentClient.aliases[k] || k
  }));
  const outputOptions = Object.keys(board.pinMapping.outputs).map(k => ({
    value: k,
    label: currentClient.aliases[k] || k
  }));

  // Get block definition with resolved options
  const getBlockDef = (type: string): BlockDef => {
    const def = { ...BLOCK_DEFS[type] };
    if (!def) return BLOCK_DEFS.text_literal;
    if (def.fields?.target) {
      def.fields.target.options = type === 'read_input' || type === 'on_state_change'
        ? inputOptions.map(o => o.label)
        : outputOptions.map(o => o.label);
    }
    if (def.fields?.input) {
      def.fields.input.options = inputOptions.map(o => o.label);
    }
    return def;
  };

  // Create block instance
  const createBlock = (type: string): BlockInstance => {
    const def = getBlockDef(type);
    const fields: Record<string, any> = {};
    Object.entries(def.fields || {}).forEach(([key, cfg]) => {
      if (cfg.type === 'slot') fields[key] = '';
      else fields[key] = cfg.default ?? '';
    });
    // Set default target to first available
    if (def.fields?.target && def.fields.target.options?.length) {
      fields.target = def.fields.target.options[0];
    }
    if (def.fields?.input && def.fields.input.options?.length) {
      fields.input = def.fields.input.options[0];
    }
    return { id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, defType: type, fields, children: def.hasChildren ? [] : undefined };
  };

  // Add to setup or loop
  const addBlock = (type: string, section: 'setup' | 'loop') => {
    const block = createBlock(type);
    if (section === 'setup') setSetupBlocks(prev => [...prev, block]);
    else setLoopBlocks(prev => [...prev, block]);
    setDeployed(false);
  };

  const removeBlock = (id: string, section: 'setup' | 'loop') => {
    if (section === 'setup') setSetupBlocks(prev => prev.filter(b => b.id !== id));
    else setLoopBlocks(prev => prev.filter(b => b.id !== id));
    setDeployed(false);
  };

  const updateField = (id: string, section: 'setup' | 'loop', field: string, value: any) => {
    const updater = (blocks: BlockInstance[]) => blocks.map(b =>
      b.id === id ? { ...b, fields: { ...b.fields, [field]: value } } : b
    );
    if (section === 'setup') setSetupBlocks(prev => updater(prev));
    else setLoopBlocks(prev => updater(prev));
    setDeployed(false);
  };

  // Add child block to a parent
  const addChildBlock = (parentId: string, section: 'setup' | 'loop', childType: string) => {
    const child = createBlock(childType);
    const updater = (blocks: BlockInstance[]): BlockInstance[] =>
      blocks.map(b => {
        if (b.id === parentId) {
          return { ...b, children: [...(b.children || []), child] };
        }
        if (b.children) {
          return { ...b, children: updater(b.children) };
        }
        return b;
      });
    if (section === 'setup') setSetupBlocks(prev => updater(prev));
    else setLoopBlocks(prev => updater(prev));
    setDeployed(false);
  };

  const removeChildBlock = (parentId: string, childId: string, section: 'setup' | 'loop') => {
    const updater = (blocks: BlockInstance[]): BlockInstance[] =>
      blocks.map(b => {
        if (b.id === parentId) {
          return { ...b, children: (b.children || []).filter(c => c.id !== childId) };
        }
        if (b.children) {
          return { ...b, children: updater(b.children) };
        }
        return b;
      });
    if (section === 'setup') setSetupBlocks(prev => updater(prev));
    else setLoopBlocks(prev => updater(prev));
    setDeployed(false);
  };

  const updateChildField = (parentId: string, childId: string, section: 'setup' | 'loop', field: string, value: any) => {
    const updater = (blocks: BlockInstance[]): BlockInstance[] =>
      blocks.map(b => {
        if (b.id === parentId) {
          return {
            ...b,
            children: (b.children || []).map(c =>
              c.id === childId ? { ...c, fields: { ...c.fields, [field]: value } } : c
            )
          };
        }
        if (b.children) {
          return { ...b, children: updater(b.children) };
        }
        return b;
      });
    if (section === 'setup') setSetupBlocks(prev => updater(prev));
    else setLoopBlocks(prev => updater(prev));
    setDeployed(false);
  };

  const clearAll = () => {
    setSetupBlocks([]);
    setLoopBlocks([]);
    setDeployed(false);
  };

  // ==================== Code Generation ====================
  const resolveTargetPin = (label: string, type: 'input' | 'output'): number | null => {
    const options = type === 'input' ? inputOptions : outputOptions;
    const opt = options.find(o => o.label === label);
    if (!opt) return null;
    return type === 'input'
      ? board.pinMapping.inputs[opt.value]
      : board.pinMapping.outputs[opt.value];
  };

  const renderFieldValue = (block: BlockInstance, fieldKey: string): string => {
    const val = block.fields[fieldKey];
    if (typeof val === 'string' && val.trim() === '') return '';
    if (typeof val === 'object' && val?.defType) {
      return renderBlockAsExpression(val as BlockInstance);
    }
    return String(val ?? '');
  };

  const renderBlockAsExpression = (block: BlockInstance): string => {
    switch (block.defType) {
      case 'read_input': {
        const pin = resolveTargetPin(block.fields.target, 'input');
        return `analogRead(${pin})`;
      }
      case 'text_literal':
        return `"${block.fields.value || ''}"`;
      case 'join_text': {
        const parts = [block.fields.part1, block.fields.part2, block.fields.part3]
          .filter(p => p !== '' && p !== undefined)
          .map(p => {
            if (typeof p === 'object' && p?.defType) return renderBlockAsExpression(p);
            return `"${p}"`;
          });
        return parts.join(' + ');
      }
      default:
        return '""';
    }
  };

  const generateCode = (): string => {
    const hasTelegram = setupBlocks.some(b => b.defType === 'telegram_setup');
    const hasDisplay = setupBlocks.some(b => b.defType === 'display_init');
    const displayBlock = setupBlocks.find(b => b.defType === 'display_init');
    const telegramBlock = setupBlocks.find(b => b.defType === 'telegram_setup');
    const isOLED = displayBlock?.fields.type === 'OLED I2C';

    let code = `// ======================================\n`;
    code += `// MekaMind - Generated Arduino Code\n`;
    code += `// Board: ${board.name} (${board.id})\n`;
    code += `// Client: ${currentClient.name}\n`;
    code += `// ======================================\n\n`;

    // Includes
    code += `#include <Arduino.h>\n`;
    if (hasDisplay) {
      if (isOLED) {
        code += `#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n`;
      } else {
        code += `#include <LiquidCrystal_I2C.h>\n`;
      }
    }
    if (hasTelegram) {
      code += `#include <WiFi.h>\n#include <WiFiClientSecure.h>\n#include <UniversalTelegramBot.h>\n`;
    }
    code += `\n`;

    // Constants
    if (hasTelegram && telegramBlock) {
      code += `// Telegram credentials (hidden from user)\n`;
      code += `#define BOT_TOKEN "${telegramBlock.fields.token || 'YOUR_TOKEN'}"\n`;
      code += `#define CHAT_ID "${telegramBlock.fields.chatId || 'YOUR_CHAT_ID'}"\n`;
    }
    if (hasDisplay) {
      code += `// Display config (pins auto-mapped by admin)\n`;
      if (isOLED) code += `#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\n#define OLED_RESET -1\n`;
      else code += `#define LCD_COLS 16\n#define LCD_ROWS 2\n`;
    }
    code += `\n`;

    // Objects
    if (hasDisplay) {
      if (isOLED) code += `Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);\n`;
      else code += `LiquidCrystal_I2C lcd(0x27, LCD_COLS, LCD_ROWS);\n`;
    }
    if (hasTelegram) {
      code += `WiFiClientSecure net;\nUniversalTelegramBot bot(BOT_TOKEN, net);\n`;
    }

    // State tracking for edge detection
    const stateChangeBlocks = loopBlocks.filter(b => b.defType === 'on_state_change');
    if (stateChangeBlocks.length > 0) {
      code += `\n// State tracking for edge detection\n`;
      stateChangeBlocks.forEach(b => {
        const pin = resolveTargetPin(b.fields.input, 'input');
        code += `int lastState_${pin} = -1;\n`;
      });
    }

    // Interval tracking
    const intervalBlocks = loopBlocks.filter(b => b.defType === 'interval_trigger');
    if (intervalBlocks.length > 0) {
      code += `\n// Non-blocking interval timers\n`;
      intervalBlocks.forEach((b, i) => {
        const mult = b.fields.unit === 'دقيقة' ? 60000 : b.fields.unit === 'ساعة' ? 3600000 : 1000;
        code += `unsigned long lastTime_${i} = 0;\n`;
        code += `const unsigned long interval_${i} = ${b.fields.value * mult};\n`;
      });
    }

    code += `\n// Rate limiting for Telegram\nunsigned long lastTelegramTime = 0;\nconst unsigned long TELEGRAM_RATE_LIMIT = 60000; // 1 minute\n\n`;

    // Setup
    code += `void setup() {\n`;
    code += `  Serial.begin(115200);\n`;

    // Pin modes
    Object.entries(board.pinMapping.inputs).forEach(([key, pin]) => {
      code += `  pinMode(${pin}, INPUT);  // ${currentClient.aliases[key] || key} (${key})\n`;
    });
    Object.entries(board.pinMapping.outputs).forEach(([key, pin]) => {
      code += `  pinMode(${pin}, OUTPUT); // ${currentClient.aliases[key] || key} (${key})\n`;
    });

    // Setup blocks
    setupBlocks.forEach(b => {
      if (b.defType === 'display_init') {
        if (isOLED) {
          code += `  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {\n    Serial.println(F("SSD1306 failed"));\n  }\n`;
          code += `  display.clearDisplay();\n  display.setTextColor(SSD1306_WHITE);\n`;
        } else {
          code += `  lcd.init();\n  lcd.backlight();\n  lcd.clear();\n`;
        }
      }
      if (b.defType === 'telegram_setup') {
        code += `  // WiFi connection for Telegram\n`;
        code += `  WiFi.begin("SSID", "PASSWORD");\n`;
        code += `  while(WiFi.status() != WL_CONNECTED) { delay(500); }\n`;
        code += `  net.setInsecure();\n`;
      }
    });

    code += `}\n\n`;

    // Loop helper function
    code += `void executeAction(BlockInstance action) {\n  // Generated action handlers\n}\n\n`;
    code = code.replace(/void executeAction\(BlockInstance action\) \{[\s\S]*?\}\n\n/, '');

    // Generate action code
    const generateAction = (b: BlockInstance, indent: string = '  '): string => {
      let c = '';
      switch (b.defType) {
        case 'set_output': {
          const pin = resolveTargetPin(b.fields.target, 'output');
          const state = b.fields.state === 'تشغيل' ? 'HIGH' : 'LOW';
          c += `${indent}digitalWrite(${pin}, ${state}); // ${b.fields.target}\n`;
          break;
        }
        case 'print_screen': {
          const line = parseInt(b.fields.line) || 1;
          const content = renderFieldValue(b, 'content');
          if (hasDisplay) {
            if (isOLED) {
              c += `${indent}display.setCursor(0, ${(line - 1) * 16});\n`;
              c += `${indent}display.print(${content || '""'});\n`;
            } else {
              c += `${indent}lcd.setCursor(0, ${line - 1});\n`;
              c += `${indent}lcd.print(${content || '""'});\n`;
            }
          }
          break;
        }
        case 'clear_screen': {
          if (hasDisplay) {
            if (isOLED) c += `${indent}display.clearDisplay();\n`;
            else c += `${indent}lcd.clear();\n`;
          }
          break;
        }
        case 'update_display': {
          if (hasDisplay && isOLED) c += `${indent}display.display();\n`;
          break;
        }
        case 'send_telegram': {
          const msg = renderFieldValue(b, 'message');
          c += `${indent}if(millis() - lastTelegramTime > TELEGRAM_RATE_LIMIT) {\n`;
          c += `${indent}  bot.sendMessage(CHAT_ID, ${msg || '""'}, "");\n`;
          c += `${indent}  lastTelegramTime = millis();\n`;
          c += `${indent}}\n`;
          break;
        }
        case 'delay_block': {
          c += `${indent}delay(${(parseInt(b.fields.value) || 1) * 1000});\n`;
          break;
        }
      }
      return c;
    };

    // Loop
    code += `void loop() {\n`;

    // Interval triggers
    intervalBlocks.forEach((b, i) => {
      code += `  // ⏱️ ${b.fields.value} ${b.fields.unit}\n`;
      code += `  if(millis() - lastTime_${i} >= interval_${i}) {\n`;
      code += `    lastTime_${i} = millis();\n`;
      (b.children || []).forEach(child => {
        code += generateAction(child, '    ');
      });
      code += `  }\n\n`;
    });

    // State change blocks (edge detection)
    stateChangeBlocks.forEach(b => {
      const pin = resolveTargetPin(b.fields.input, 'input');
      const targetState = b.fields.state === 'تشغيل' ? 'HIGH' : 'LOW';
      code += `  // ⚡ Edge detection: ${b.fields.input}\n`;
      code += `  {\n`;
      code += `    int currentState_${pin} = digitalRead(${pin});\n`;
      code += `    if(currentState_${pin} != lastState_${pin} && currentState_${pin} == ${targetState}) {\n`;
      (b.children || []).forEach(child => {
        code += generateAction(child, '      ');
      });
      code += `    }\n`;
      code += `    lastState_${pin} = currentState_${pin};\n`;
      code += `  }\n\n`;
    });

    // Condition blocks
    loopBlocks.filter(b => b.defType === 'condition_if').forEach(b => {
      const cond = b.fields.condition;
      if (cond) {
        code += `  // 🔀 Condition\n`;
        code += `  if(${cond}) {\n`;
        (b.children || []).forEach(child => {
          code += generateAction(child, '    ');
        });
        code += `  }\n\n`;
      }
    });

    // Other loop blocks
    loopBlocks.filter(b => !['interval_trigger', 'on_state_change', 'condition_if'].includes(b.defType)).forEach(b => {
      code += generateAction(b, '  ');
    });

    code += `}\n`;
    return code;
  };

  // ==================== UI Helpers ====================
  const categories: { id: BlockCategory; label: string; color: string; icon: React.ReactNode }[] = [
    { id: 'io', label: 'المداخل والمخارج', color: '#4CAF50', icon: <Zap className="w-4 h-4" /> },
    { id: 'setup', label: 'التهيئة والاتصال', color: '#0088cc', icon: <Cpu className="w-4 h-4" /> },
    { id: 'display', label: 'الشاشة', color: '#9C27B0', icon: <Monitor className="w-4 h-4" /> },
    { id: 'timing', label: 'التدفق الزمني', color: '#607D8B', icon: <Clock className="w-4 h-4" /> },
    { id: 'text', label: 'النصوص', color: '#E91E63', icon: <Link2 className="w-4 h-4" /> },
    { id: 'telegram', label: 'تليجرام', color: '#0088cc', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'logic', label: 'المنطق المتقدم', color: '#f44336', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const getBlocksByCategory = (cat: BlockCategory) =>
    Object.values(BLOCK_DEFS).filter(b => b.category === cat);

  // ==================== Block Renderer ====================
  const renderBlock = (block: BlockInstance, section: 'setup' | 'loop', depth: number = 0, parentId?: string) => {
    const def = getBlockDef(block.defType);
    const indent = depth * 16;

    return (
      <div key={block.id} className="animate-fade-in" style={{ marginRight: indent }}>
        <div
          className="rounded-xl p-3 border"
          style={{
            backgroundColor: `${def.color}15`,
            borderColor: `${def.color}50`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 opacity-40" style={{ color: def.color }} />
              <span className="text-lg">{def.icon}</span>
              <span className="font-bold text-sm" style={{ color: def.color }}>{def.label}</span>
            </div>
            <button
              onClick={() => {
                if (parentId) removeChildBlock(parentId, block.id, section);
                else removeBlock(block.id, section);
              }}
              className="p-1 hover:bg-black/20 rounded transition-all"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-2">
            {Object.entries(def.fields || {}).map(([key, cfg]) => {
              if (cfg.type === 'slot') {
                return (
                  <div key={key} className="bg-black/20 rounded-lg p-2 border border-dashed border-gray-600">
                    <div className="text-xs text-gray-500 mb-1">{cfg.placeholder}</div>
                    <input
                      type="text"
                      value={block.fields[key] || ''}
                      onChange={(e) => {
                        if (parentId) updateChildField(parentId, block.id, section, key, e.target.value);
                        else updateField(block.id, section, key, e.target.value);
                      }}
                      placeholder="اكتب قيمة أو اسم متغير"
                      className="w-full bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
                );
              }
              if (cfg.type === 'select') {
                return (
                  <div key={key} className="flex items-center gap-2 flex-wrap">
                    {key !== 'target' && key !== 'input' && key !== 'state' && key !== 'unit' && key !== 'line' && key !== 'type' && (
                      <span className="text-xs text-gray-400">{key}:</span>
                    )}
                    <select
                      value={block.fields[key] || cfg.default || ''}
                      onChange={(e) => {
                        if (parentId) updateChildField(parentId, block.id, section, key, e.target.value);
                        else updateField(block.id, section, key, e.target.value);
                      }}
                      className="bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white"
                    >
                      {(cfg.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (cfg.type === 'number') {
                return (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="number"
                      value={block.fields[key] ?? cfg.default ?? ''}
                      onChange={(e) => {
                        if (parentId) updateChildField(parentId, block.id, section, key, e.target.value);
                        else updateField(block.id, section, key, e.target.value);
                      }}
                      className="bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white w-20"
                      min="0"
                    />
                  </div>
                );
              }
              if (cfg.type === 'text') {
                return (
                  <div key={key}>
                    <input
                      type="text"
                      value={block.fields[key] || ''}
                      onChange={(e) => {
                        if (parentId) updateChildField(parentId, block.id, section, key, e.target.value);
                        else updateField(block.id, section, key, e.target.value);
                      }}
                      placeholder={cfg.placeholder}
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white"
                      dir="ltr"
                    />
                  </div>
                );
              }
              if (cfg.type === 'condition') {
                return (
                  <div key={key}>
                    <input
                      type="text"
                      value={block.fields[key] || ''}
                      onChange={(e) => {
                        if (parentId) updateChildField(parentId, block.id, section, key, e.target.value);
                        else updateField(block.id, section, key, e.target.value);
                      }}
                      placeholder="مثال: analogRead(2) < 20"
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Children slot */}
          {def.hasChildren && (
            <div
              className="mt-3 pt-3 border-t border-dashed"
              style={{ borderColor: `${def.color}40` }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedBlockType) {
                  addChildBlock(block.id, section, draggedBlockType);
                  setDraggedBlockType(null);
                }
              }}
            >
              <div className="text-xs text-gray-500 mb-2">⤵️ الأفعال الداخلية (اسحب بلوكات هنا):</div>
              {(block.children || []).length === 0 ? (
                <div className="bg-black/20 rounded-lg p-3 text-center text-xs text-gray-500 border border-dashed border-gray-600 min-h-[40px] flex items-center justify-center">
                  اسحب بلوكات الإجراءات هنا
                </div>
              ) : (
                <div className="space-y-2">
                  {(block.children || []).map(child => renderBlock(child, section, depth + 1, block.id))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, blocks: BlockInstance[], section: 'setup' | 'loop', color: string) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <h3 className="font-bold text-lg" style={{ color }}>{title}</h3>
        <span className="text-xs text-gray-500 bg-[#2a2a2a] px-2 py-0.5 rounded">
          {blocks.length} بلوك
        </span>
      </div>
      <div
        className="min-h-[120px] bg-[#0d1117] rounded-xl p-4 border-2 border-dashed border-gray-700 transition-all hover:border-gray-500"
        style={{
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedBlockType) {
            addBlock(draggedBlockType, section);
            setDraggedBlockType(null);
          }
        }}
      >
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
            اسحب البلوكات من صندوق الأدوات هنا
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map(b => renderBlock(b, section))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">مساحة البرمجة المتقدمة</h1>
          <button
            onClick={() => setShowBoardsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-lg text-[#2196F3] text-sm hover:bg-[#2196F3]/20 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span className="font-medium">{board.name}</span>
          </button>
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
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            مسح الكل
          </button>
          <button
            onClick={() => { setDeployed(true); console.log(generateCode()); }}
            disabled={setupBlocks.length === 0 && loopBlocks.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              setupBlocks.length === 0 && loopBlocks.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : deployed ? 'bg-[#4CAF50] text-white' : 'bg-[#2196F3] hover:bg-[#1976D2] text-white'
            }`}
          >
            {deployed ? <><Check className="w-4 h-4" /> تم الإرسال</> : <><Download className="w-4 h-4" /> إرسال للشريحة</>}
          </button>
        </div>
      </div>

      {/* Boards Modal */}
      {showBoardsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#2196F3]" />
                اختر الشريحة
              </h2>
              <button onClick={() => setShowBoardsModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-4">
              {boards.map(b => {
                const isSelected = b.id === activeBoardId;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBoardId(b.id);
                      setShowBoardsModal(false);
                      clearAll();
                    }}
                    className={`border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                      isSelected ? 'border-[#2196F3] bg-[#2196F3]/10' : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className={`w-6 h-6 ${isSelected ? 'text-[#2196F3]' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="font-bold">{b.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{b.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-[#1e1e1e] rounded p-2">
                        <div className="text-xl font-bold text-[#4CAF50]">{Object.keys(b.pinMapping.inputs).length}</div>
                        <div className="text-xs text-gray-400">مداخل</div>
                      </div>
                      <div className="bg-[#1e1e1e] rounded p-2">
                        <div className="text-xl font-bold text-[#FF9800]">{Object.keys(b.pinMapping.outputs).length}</div>
                        <div className="text-xs text-gray-400">مخارج</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <div className="w-80 bg-[#1a1a1a] border-l border-gray-800 overflow-auto p-4">
          <h3 className="text-sm font-bold text-gray-400 mb-2">🧩 صندوق الأدوات المتقدم</h3>
          <p className="text-xs text-gray-500 mb-4">اضغط على البلوك لإضافته، أو اسحبه إلى المساحة</p>

          {categories.map(cat => (
            <div key={cat.id} className="mb-3">
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-all"
              >
                <div className="flex items-center gap-2" style={{ color: cat.color }}>
                  {cat.icon}
                  <span className="text-sm font-bold">{cat.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
              </button>

              {expandedCategory === cat.id && (
                <div className="mt-2 space-y-2 pr-2 animate-fade-in">
                  {getBlocksByCategory(cat.id).map(def => (
                    <div key={def.type} className="space-y-1">
                      <div
                        draggable
                        onDragStart={(e) => {
                          setDraggedBlockType(def.type);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onDragEnd={() => setDraggedBlockType(null)}
                        onClick={() => {
                          // Add to appropriate section
                          if (def.category === 'setup') addBlock(def.type, 'setup');
                          else addBlock(def.type, 'loop');
                        }}
                        className="w-full block-item text-sm text-right cursor-grab active:cursor-grabbing"
                        style={{
                          backgroundColor: `${def.color}20`,
                          borderColor: `${def.color}40`,
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          color: def.color
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 opacity-50" />
                          <span className="text-base">{def.icon}</span>
                          <span className="font-medium flex-1 text-right">{def.label}</span>
                          {def.hasChildren && <span className="text-xs opacity-60">[⤵️]</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Info */}
          <div className="mt-4 bg-[#2a2a2a] rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 <strong>نظام متقدم:</strong> بلوكات التهيئة توضع في قسم Setup، والباقي في Loop. البلوكات ذات الأيقونة [⤵️] تقبل بلوكات داخلية.
            </p>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6 bg-[#121212]">
            {renderSection(
              'التهيئة (Setup)',
              <Cpu className="w-4 h-4" />,
              setupBlocks,
              'setup',
              '#0088cc'
            )}
            {renderSection(
              'التكرار (Loop)',
              <RefreshCw className="w-4 h-4" />,
              loopBlocks,
              'loop',
              '#FF9800'
            )}

            {(setupBlocks.length === 0 && loopBlocks.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">ابدأ ببناء مشروعك</p>
                <p className="text-sm mt-1">اختر بلوكات التهيئة أولاً، ثم أضف منطق التنفيذ</p>
              </div>
            )}
          </div>

          {/* Code Preview */}
          {showCode && (
            <div className="h-80 bg-[#0d1117] border-t border-gray-800 overflow-auto p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">كود Arduino المُولَّد</h3>
                <span className="text-xs text-gray-500">يُظهر الترجمة الكاملة مع المكتبات والمؤقتات غير المعطلة</span>
              </div>
              <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap" dir="ltr">
                {generateCode()}
              </pre>
            </div>
          )}
        </div>
      </div>

      {deployed && (
        <div className="bg-[#4CAF50]/10 border-t border-[#4CAF50]/30 px-6 py-3 flex items-center gap-3 animate-fade-in">
          <div className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
          <span className="text-[#4CAF50] text-sm font-medium">
            تم إرسال المنطق إلى "{board.name}" بنجاح
          </span>
          <span className="text-xs text-gray-500 mr-auto">
            {setupBlocks.length + loopBlocks.length} بلوك • {new Date().toLocaleTimeString('ar-EG')}
          </span>
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
