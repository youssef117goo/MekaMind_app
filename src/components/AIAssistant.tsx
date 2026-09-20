import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import {
  MessageCircle, Send, X, Bot, User, Lightbulb,
  Sparkles, Code, Zap, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

export default function AIAssistant() {
  const { currentClient, getBoardById } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const board = currentClient ? getBoardById(currentClient.assignedBoard) : null;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && board) {
      addAssistantMessage(getWelcomeMessage());
    }
  }, [isOpen, board]);

  const getWelcomeMessage = (): string => {
    if (!board) return 'مرحباً! أنا مساعدك الذكي. اختر شريحة أولاً لأتمكن من مساعدتك.';

    const inputsCount = Object.keys(board.pinMapping.inputs).length;
    const outputsCount = Object.keys(board.pinMapping.outputs).length;

    return `مرحباً! 👋 أنا مساعدك الذكي في MekaMind.

أنا جاهز لمساعدتك في برمجة شريحة **${board.name}**.

📊 **معلومات الشريحة:**
• عدد المداخل: ${inputsCount}
• عدد المخارج: ${outputsCount}

🎯 **كيف يمكنني مساعدتك؟**
• اقتراح مشاريع مناسبة
• شرح كيفية استخدام البلوكات
• كتابة كود جاهز
• حل المشاكل

اختر من الاقتراحات أدناه أو اكتب سؤالك!`;
  };

  const addAssistantMessage = (content: string, suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      suggestions,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const processUserInput = (userInput: string) => {
    addUserMessage(userInput);
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateAIResponse(userInput);
      addAssistantMessage(response.content, response.suggestions);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    // Project suggestions
    if (lowerInput.includes('مشروع') || lowerInput.includes('اقترح') || lowerInput.includes('فكرة')) {
      return {
        content: `بناءً على شريحتك **${board?.name}**، إليك بعض المشاريع المقترحة:

🌡️ **1. نظام مراقبة الحرارة والرطوبة**
• قراءة حساس الحرارة
• عرض على الشاشة
• إرسال تنبيه إذا ارتفعت الحرارة

🚰 **2. نظام ري تلقائي**
• قراءة حساس رطوبة التربة
• تشغيل المضخة عند الحاجة
• عرض الحالة على الشاشة

🔒 **3. نظام أمان**
• قراءة حساس الحركة
• إرسال تنبيه تليجرام
• تشغيل إنذار

💡 **4. نظام إضاءة ذكي**
• قراءة حساس الضوء
• تشغيل/إيقاف LED تلقائياً
• جدولة زمنية

أي مشروع تريد أن نبدأ به؟`,
        suggestions: ['ابدأ مشروع مراقبة الحرارة', 'مشروع الري التلقائي', 'مشروع الأمان']
      };
    }

    // Temperature monitoring project
    if (lowerInput.includes('حرارة') || lowerInput.includes('مراقبة')) {
      return {
        content: `ممتاز! لنبرمج **نظام مراقبة الحرارة** 🌡️

**الخطوات:**

**1. في قسم التهيئة (Setup):**
• اسحب بلوك "تفعيل الشاشة" → اختر OLED I2C
• اسحب بلوك "تهيئة تليجرام" → أدخل Token و Chat ID

**2. في قسم التكرار (Loop):**
• اسحب بلوك "نفّذ كل 2 ثانية"
  - داخله: "مسح الشاشة"
  - ثم: "اكتب على الشاشة" → السطر 1 → "الحرارة: " + قراءة المدخل 1
  - ثم: "تحديث الشاشة"

**3. إضافة الشرط:**
• اسحب بلوك "إذا كان"
  - الشرط: analogRead(2) > 30
  - داخله: "أرسل لتليجرام" → "تحذير: الحرارة مرتفعة!"

هل تريد أن أشرح أي خطوة بالتفصيل؟`,
        suggestions: ['اشرح خطوة التهيئة', 'اشرح خطوة التكرار', 'أضف البلوكات تلقائياً']
      };
    }

    // Explain blocks
    if (lowerInput.includes('بلوك') || lowerInput.includes('شرح')) {
      return {
        content: `دعني أشرح لك البلوكات المتاحة في شريحتك:

📖 **بلوكات المداخل (قراءة الحساسات):**
${Object.keys(board?.pinMapping.inputs || {}).map(key => 
  `• قراءة ${currentClient?.aliases[key] || key}`
).join('\n')}

⚡ **بلوكات المخارج (التحكم):**
${Object.keys(board?.pinMapping.outputs || {}).map(key => 
  `• تشغيل ${currentClient?.aliases[key] || key}`
).join('\n')}

⏱️ **بلوكات التدفق الزمني:**
• نفّذ كل (مؤقت دوري)
• انتظر (تأخير)

🔀 **بلوكات المنطق:**
• إذا كان (شرط)
• عندما تتغير حالة (Edge Detection)

📝 **بلوكات الشاشة:**
• اكتب على الشاشة
• مسح الشاشة
• تحديث الشاشة

🚀 **بلوكات تليجرام:**
• تهيئة تليجرام
• أرسل لتليجرام

أي بلوك تريد معرفة المزيد عنه؟`,
        suggestions: ['اشرح بلوك نفّذ كل', 'اشرح بلوك إذا كان', 'اشرح بلوك تليجرام']
      };
    }

    // Explain interval block
    if (lowerInput.includes('نفّذ كل') || lowerInput.includes('مؤقت')) {
      return {
        content: `**بلوك "نفّذ كل" ⏱️**

هذا البلوك مهم جداً! يسمح لك بتنفيذ أوامر بشكل دوري بدون إيقاف باقي الكود.

**كيف يعمل:**
• حدد القيمة: مثلاً 5
• حدد الوحدة: ثانية / دقيقة / ساعة
• اسحب البلوكات التي تريد تنفيذها داخله

**مثال عملي:**
\`\`\`
[نفّذ كل 5 ثواني]
  ├─ [مسح الشاشة]
  ├─ [اكتب: "الحرارة: " + قراءة المدخل 1]
  └─ [تحديث الشاشة]
\`\`\`

**الفرق بينه وبين "انتظر":**
• "نفّذ كل": لا يوقف باقي الكود (Non-blocking)
• "انتظر": يوقف كل شيء (Blocking)

**نصيحة:** استخدم "نفّذ كل" للقراءة الدورية، و"انتظر" للتأخير البسيط.

هل تريد مثال آخر؟`,
        suggestions: ['مثال على مؤقت', 'الفرق بين البلوكات', 'اشرح بلوك آخر']
      };
    }

    // Telegram help
    if (lowerInput.includes('تليجرام') || lowerInput.includes('telegram')) {
      return {
        content: `**إعداد تليجرام 🚀**

**الخطوة 1: إنشاء بوت تليجرام**
1. افتح تليجرام وابحث عن: @BotFather
2. أرسل: /newbot
3. اتبع التعليمات واختر اسم للبوت
4. احصل على **Token** (مثل: 123456:ABC-DEF...)

**الخطوة 2: الحصول على Chat ID**
1. افتح البوت الذي أنشأته
2. أرسل أي رسالة
3. افتح هذا الرابط في المتصفح:
   https://api.telegram.org/bot<TOKEN>/getUpdates
4. ابحث عن "chat":{"id":123456789}
5. هذا هو **Chat ID**

**الخطوة 3: في MekaMind**
1. اسحب بلوك "تهيئة تليجرام" في قسم Setup
2. أدخل Token
3. أدخل Chat ID
4. الآن يمكنك استخدام بلوك "أرسل لتليجرام" في Loop

**ملاحظة مهمة:** النظام يضيف Rate Limiting تلقائياً (رسالة كل دقيقة كحد أقصى) لحماية البوت.

هل تحتاج مساعدة في خطوة معينة؟`,
        suggestions: ['كيف أحصل على Token', 'كيف أحصل على Chat ID', 'مثال على إرسال رسالة']
      };
    }

    // Auto-add blocks
    if (lowerInput.includes('أضف') || lowerInput.includes('تلقائياً')) {
      return {
        content: `للأسف، لا يمكنني إضافة البلوكات تلقائياً حالياً، لكن يمكنني إرشادك خطوة بخطوة!

**لإضافة بلوكات لمشروع مراقبة الحرارة:**

1️⃣ **في قسم التهيئة:**
   - اضغط على "التهيئة والاتصال" في صندوق الأدوات
   - اسحب "تفعيل الشاشة" إلى قسم Setup
   - اسحب "تهيئة تليجرام" إلى قسم Setup

2️⃣ **في قسم التكرار:**
   - اضغط على "التدفق الزمني"
   - اسحب "نفّذ كل 2 ثانية" إلى قسم Loop
   - اضغط على "الشاشة" واسحب البلوكات داخل بلوك المؤقت

3️⃣ **إضافة الشرط:**
   - اضغط على "المنطق المتقدم"
   - اسحب "إذا كان" إلى قسم Loop

هل تريد أن أشرح أي خطوة بالتفصيل؟`,
        suggestions: ['اشرح الخطوة الأولى', 'اشرح الخطوة الثانية', 'مشروع آخر']
      };
    }

    // Help
    if (lowerInput.includes('مساعدة') || lowerInput.includes('help') || lowerInput.includes('كيف')) {
      return {
        content: `**كيف يمكنني مساعدتك؟ 🤖**

يمكنني مساعدتك في:

📚 **التعلم:**
• شرح البلوكات وكيفية استخدامها
• شرح المفاهيم (مؤقتات، شروط، أحداث)
• أمثلة عملية

💡 **الاقتراحات:**
• اقتراح مشاريع مناسبة لشريحتك
• اقتراح حلول للمشاكل
• اقتراح تحسينات

🔧 **المساعدة التقنية:**
• إعداد تليجرام
• إعداد الشاشات
• حل المشاكل

📝 **كتابة الكود:**
• شرح الكود المُولَّد
• تحسين الكود
• إضافة ميزات

**جرب أن تسألني:**
• "اقترح مشروع"
• "اشرح بلوك نفّذ كل"
• "كيف أعد تليجرام"
• "مشروع مراقبة الحرارة"

أو اكتب سؤالك مباشرة!`,
        suggestions: ['اقترح مشروع', 'اشرح البلوكات', 'كيف أعد تليجرام', 'مشروع مراقبة الحرارة']
      };
    }

    // Default response
    return {
      content: `فهمت سؤالك! دعني أساعدك.

بناءً على شريحتك **${board?.name}**، يمكنك:

• قراءة ${Object.keys(board?.pinMapping.inputs || {}).length} حساس
• التحكم في ${Object.keys(board?.pinMapping.outputs || {}).length} مخرج
• استخدام الشاشة وإرسال تنبيهات تليجرام

**جرب أن تسألني عن:**
• اقتراح مشروع
• شرح البلوكات
• إعداد تليجرام
• مشروع معين (مثل: مراقبة الحرارة)

أو اختر من الاقتراحات أدناه!`,
      suggestions: ['اقترح مشروع', 'اشرح البلوكات', 'مشروع مراقبة الحرارة', 'كيف أعد تليجرام']
    };
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    processUserInput(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (board) {
      addAssistantMessage(getWelcomeMessage());
    }
  };

  if (!board) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-[#2196F3] hover:bg-[#1976D2] rounded-full shadow-lg shadow-[#2196F3]/30 flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-96 h-[600px] bg-[#1e1e1e] border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="bg-[#2196F3] rounded-t-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">المساعد الذكي</h3>
                <p className="text-xs text-white/80">جاهز لمساعدتك</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-[#4CAF50]' : 'bg-[#2196F3]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${msg.role === 'user' ? 'text-left' : ''}`}>
                  <div className={`inline-block rounded-2xl px-4 py-2 max-w-full ${
                    msg.role === 'user'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-[#2a2a2a] text-gray-200'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                  
                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => processUserInput(suggestion)}
                          className="text-xs bg-[#2196F3]/10 text-[#2196F3] border border-[#2196F3]/30 rounded-lg px-3 py-1 hover:bg-[#2196F3]/20 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[#2196F3] rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#2a2a2a] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`px-4 py-2 rounded-lg transition-all ${
                  input.trim() === ''
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2196F3] hover:bg-[#1976D2] text-white'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Sparkles className="w-3 h-3" />
              <span>مدعوم بالذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
