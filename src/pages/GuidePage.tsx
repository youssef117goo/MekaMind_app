import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Cpu, Users, Settings, Rocket, CheckCircle, Lightbulb, Terminal, Globe, GitBranch, Package } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-[#121212]/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2196F3]" />
            <h1 className="text-xl font-bold">دليل MekaMind الشامل</h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Table of Contents */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#2196F3]" />
            محتويات الدليل
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TOCItem num="1" title="كيف تبرمج برنامج بسيط" icon={<Code className="w-5 h-5" />} />
            <TOCItem num="2" title="نظام تسجيل المستخدمين" icon={<Users className="w-5 h-5" />} />
            <TOCItem num="3" title="إدارة المشروع" icon={<Settings className="w-5 h-5" />} />
            <TOCItem num="4" title="رفع المشروع على Vercel" icon={<Rocket className="w-5 h-5" />} />
          </div>
        </div>

        {/* Section 1: How to Program */}
        <section id="programming" className="mb-16">
          <SectionHeader num="1" title="كيف تبرمج برنامج بسيط" icon={<Code className="w-8 h-8" />} />
          
          <div className="space-y-6">
            <StepCard
              step="1"
              title="تسجيل الدخول"
              description="اذهب إلى الصفحة الرئيسية واضغط 'تسجيل الدخول'. استخدم البيانات التجريبية أو أنشئ حساب جديد."
              code="البريد: ahmed@example.com | كلمة المرور: user123"
            />

            <StepCard
              step="2"
              title="الدخول لبوابة المستخدم"
              description="بعد تسجيل الدخول، ستدخل تلقائياً إلى لوحة التحكم. من القائمة الجانبية اختر 'البرمجة بالبلوكات'."
            />

            <StepCard
              step="3"
              title="اختيار الشريحة"
              description="اضغط على زر الشريحة في الأعلى واختر الشريحة المناسبة. النظام سيولد البلوكات تلقائياً حسب عدد المداخل والمخارج."
            />

            <StepCard
              step="4"
              title="بناء البرنامج - مثال عملي"
              description="لنبني برنامج 'مراقبة الحرارة وإرسال تنبيه':"
              codeBlock={`// الخطوة 1: في قسم التهيئة (Setup)
اسحب بلوك "تفعيل الشاشة" → اختر OLED I2C
اسحب بلوك "تهيئة تليجرام" → أدخل Token و Chat ID

// الخطوة 2: في قسم التكرار (Loop)
اسحب بلوك "نفّذ كل 2 ثانية"
  داخله اسحب: "مسح الشاشة"
  ثم: "اكتب على الشاشة" → السطر 1 → "الحرارة: " + قراءة المدخل 1
  ثم: "تحديث الشاشة"

// الخطوة 3: إضافة الشرط
اسحب بلوك "إذا كان"
  الشرط: analogRead(2) > 30
  داخله اسحب: "أرسل لتليجرام" → "تحذير: الحرارة مرتفعة!"`}
            />

            <StepCard
              step="5"
              title="عرض الكود المُولَّد"
              description="اضغط 'عرض الكود' لرؤية كود Arduino الكامل. ستجد المكتبات، الـ Setup، والـ Loop جاهزة."
            />

            <StepCard
              step="6"
              title="إرسال للشريحة"
              description="اضغط 'إرسال للشريحة' لنشر البرنامج. في النسخة الحقيقية، سيتم إرسال الكود عبر MQTT للـ ESP32."
            />

            <div className="bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-xl p-6 mt-6">
              <h4 className="font-bold text-[#2196F3] mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                نصائح مهمة
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• ابدأ دائماً ببلوكات التهيئة قبل بلوكات التنفيذ</li>
                <li>• البلوكات ذات [⤵️] تقبل بلوكات داخلية - اسحبها للداخل</li>
                <li>• يمكنك إعادة تسمية المداخل من صفحة 'الإعدادات'</li>
                <li>• الكود المُولَّد جاهز للنسخ واللصق في Arduino IDE</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: User Management */}
        <section id="users" className="mb-16">
          <SectionHeader num="2" title="نظام تسجيل المستخدمين" icon={<Users className="w-8 h-8" />} />
          
          <div className="space-y-6">
            <InfoCard
              title="🔐 للمستخدمين العاديين"
              items={[
                'الذهاب إلى /auth للتسجيل أو الدخول',
                'إنشاء حساب بالاسم والبريد وكلمة المرور',
                'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                'الجلسة تبقى 24 ساعة',
                'يمكن تسجيل الخروج من القائمة الجانبية'
              ]}
            />

            <InfoCard
              title="🛡️ للمسؤول (Admin)"
              items={[
                'الرابط السري: /admin/login',
                'بيانات الدخول: admin / mekamind2024',
                'إدارة الشرائح: إضافة/تعديل/حذف',
                'إدارة العملاء: ربط الشرائح بالمستخدمين',
                'عرض حالة الاتصال لكل عميل'
              ]}
            />

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
              <h4 className="font-bold mb-4">📊 هيكل البيانات</h4>
              <pre className="text-xs font-mono text-green-400 overflow-auto" dir="ltr">
{`// بيانات المستخدم
{
  "id": "USER_001",
  "username": "أحمد محمد",
  "email": "ahmed@example.com",
  "createdAt": "2024-01-15"
}

// بيانات الشريحة (يحددها الأدمن)
{
  "board_id": "BOARD_7788",
  "board_name": "MekaMind Standard",
  "pin_mapping": {
    "inputs": { "INP_1": 2, "INP_2": 4 },
    "outputs": { "OUT_1": 15, "OUT_2": 16 }
  }
}

// الأسماء المخصصة (يحددها المستخدم)
{
  "client_id": "USER_001",
  "aliases": {
    "INP_1": "حساس الحرارة",
    "OUT_1": "موتور السير"
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 3: Project Management */}
        <section id="management" className="mb-16">
          <SectionHeader num="3" title="إدارة المشروع" icon={<Settings className="w-8 h-8" />} />
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <CommandCard
                title="تشغيل المشروع محلياً"
                commands={[
                  'npm install',
                  'npm run dev'
                ]}
                description="يشغل المشروع على http://localhost:3000"
              />

              <CommandCard
                title="بناء المشروع"
                commands={[
                  'npm run build'
                ]}
                description="ينتج مجلد dist/ جاهز للنشر"
              />

              <CommandCard
                title="فحص الأنواع"
                commands={[
                  'npm run typecheck'
                ]}
                description="يتحقق من أخطاء TypeScript"
              />

              <CommandCard
                title="هيكل المجلدات"
                commands={[
                  'src/',
                  '├── App.tsx          # التوجيه الرئيسي',
                  '├── store/           # إدارة الحالة',
                  '├── pages/           # الصفحات',
                  '│   ├── admin/       # لوحة الإدارة',
                  '│   └── user/        # بوابة المستخدم',
                  '└── components/      # مكونات مشتركة'
                ]}
                description=""
              />
            </div>

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2196F3]" />
                التقنيات المستخدمة
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <TechBadge name="React 18" />
                <TechBadge name="TypeScript" />
                <TechBadge name="Vite" />
                <TechBadge name="Tailwind CSS 4" />
                <TechBadge name="React Router" />
                <TechBadge name="Lucide Icons" />
                <TechBadge name="Framer Motion" />
                <TechBadge name="Context API" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Vercel Deployment */}
        <section id="vercel" className="mb-16">
          <SectionHeader num="4" title="رفع المشروع على Vercel" icon={<Rocket className="w-8 h-8" />} />
          
          <div className="space-y-6">
            <StepCard
              step="1"
              title="إنشاء حساب GitHub"
              description="إذا لم يكن لديك حساب، أنشئ واحداً على github.com"
            />

            <StepCard
              step="2"
              title="رفع المشروع على GitHub"
              description="أنشئ مستودع جديد وارفع ملفات المشروع"
              codeBlock={`# تهيئة Git
git init
git add .
git commit -m "Initial commit"

# ربط المستودع البعيد
git remote add origin https://github.com/username/mekamind.git
git branch -M main
git push -u origin main`}
            />

            <StepCard
              step="3"
              title="إنشاء حساب Vercel"
              description="اذهب إلى vercel.com وسجل دخول بحساب GitHub"
            />

            <StepCard
              step="4"
              title="استيراد المشروع"
              description="من لوحة Vercel، اضغط 'New Project' واختر المستودع"
              codeBlock={`# إعدادات Vercel التلقائية:
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install`}
            />

            <StepCard
              step="5"
              title="النشر"
              description="اضغط 'Deploy' وانتظر دقائق. سيُعطى رابط مباشر للمشروع"
              code="https://mekamind.vercel.app"
            />

            <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-xl p-6 mt-6">
              <h4 className="font-bold text-[#4CAF50] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                ملاحظات مهمة للنشر
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Vercel يدعم React/Vite تلقائياً بدون إعدادات إضافية</li>
                <li>• كل push لـ main سيُنتج نشر جديد تلقائياً</li>
                <li>• يمكن ربط دومين مخصص من إعدادات Vercel</li>
                <li>• البيانات محفوظة في localStorage (تُفقد عند مسح المتصفح)</li>
                <li>• للإنتاج الحقيقي، استخدم قاعدة بيانات مثل MongoDB أو Firebase</li>
              </ul>
            </div>

            <div className="bg-[#FF9800]/10 border border-[#FF9800]/30 rounded-xl p-6">
              <h4 className="font-bold text-[#FF9800] mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                بدائل أخرى للاستضافة
              </h4>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <AltHost name="Netlify" desc="سهل الاستخدام، مجاني" />
                <AltHost name="Railway" desc="يدعم Backend + DB" />
                <AltHost name="GitHub Pages" desc="مجاني للمشاريع الثابتة" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>MekaMind © 2024 - منصة IoT الذكية للبرمجة البصرية</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/" className="hover:text-[#2196F3] transition-colors">الرئيسية</Link>
            <Link to="/portal" className="hover:text-[#2196F3] transition-colors">بوابة المستخدم</Link>
            <Link to="/admin/login" className="hover:text-[#2196F3] transition-colors">لوحة الإدارة</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helper Components
function TOCItem({ num, title, icon }: { num: string; title: string; icon: React.ReactNode }) {
  return (
    <a href={`#section-${num}`} className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333] transition-all">
      <div className="w-8 h-8 bg-[#2196F3]/20 rounded-lg flex items-center justify-center text-[#2196F3]">
        {icon}
      </div>
      <span className="font-medium">{num}. {title}</span>
    </a>
  );
}

function SectionHeader({ num, title, icon }: { num: string; title: string; icon: React.ReactNode }) {
  return (
    <div id={`section-${num}`} className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-[#2196F3] rounded-xl flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <span className="text-sm text-[#2196F3] font-medium">القسم {num}</span>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

function StepCard({ step, title, description, code, codeBlock }: {
  step: string;
  title: string;
  description: string;
  code?: string;
  codeBlock?: string;
}) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {step}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">{title}</h4>
          <p className="text-gray-400 mb-3">{description}</p>
          {code && (
            <code className="inline-block bg-[#2a2a2a] px-3 py-1 rounded text-[#2196F3] text-sm font-mono" dir="ltr">
              {code}
            </code>
          )}
          {codeBlock && (
            <pre className="mt-3 bg-[#0d1117] rounded-lg p-4 text-xs font-mono text-green-400 overflow-auto" dir="ltr">
              {codeBlock}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-[#4CAF50] mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommandCard({ title, commands, description }: { title: string; commands: string[]; description: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-5 h-5 text-[#2196F3]" />
        <h4 className="font-bold">{title}</h4>
      </div>
      <div className="bg-[#0d1117] rounded-lg p-3 mb-2">
        {commands.map((cmd, i) => (
          <div key={i} className="text-sm font-mono text-green-400" dir="ltr">
            <span className="text-gray-500">$ </span>{cmd}
          </div>
        ))}
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 text-center text-sm text-gray-300">
      {name}
    </div>
  );
}

function AltHost({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg p-3">
      <div className="font-bold text-[#FF9800]">{name}</div>
      <div className="text-xs text-gray-400 mt-1">{desc}</div>
    </div>
  );
}
