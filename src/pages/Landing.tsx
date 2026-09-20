import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Users, Code, Zap, ArrowLeft } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2196F3] rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">MekaMind</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/portal"
              className="px-5 py-2 bg-[#2196F3] hover:bg-[#1976D2] rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              ابدأ الآن
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#2196F3]/10 border border-[#2196F3]/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[#2196F3]" />
            <span className="text-[#2196F3] text-sm font-medium">منصة IoT الذكية للبرمجة البصرية</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            برمجة الأجهزة بـ
            <span className="text-[#2196F3]"> السحب والإفلات</span>
            <br />
            بدون أكواد معقدة
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            منصة MekaMind تتيح لك التحكم في شرائح ESP32 والأجهزة الذكية من خلال واجهة بصرية سهلة.
            لا حاجة لمعرفة أرقام الـ Pins أو كتابة أكواد C++ معقدة.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/portal"
              className="px-8 py-4 bg-[#2196F3] hover:bg-[#1976D2] rounded-xl font-bold text-lg transition-all flex items-center gap-2 pulse-glow"
            >
              ابدأ البرمجة الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Cpu className="w-8 h-8" />}
            title="تجريد العتاد"
            description="النظام يخفي تعقيدات الهاردوير عن المستخدم. أنت تتعامل مع مداخل ومخارج منطقية فقط."
          />
          <FeatureCard
            icon={<Code className="w-8 h-8" />}
            title="برمجة بصرية"
            description="اسحب البلوكات وأفلتها لبناء منطق التحكم. لا تحتاج لكتابة سطر كود واحد."
          />
          <FeatureCard
            icon={<Code className="w-8 h-8" />}
            title="تحكم كامل للإدارة"
            description="الإدارة تتحكم في خريطة الـ Pins وتعيين الشرائح للعملاء مع عزل تام."
          />
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">كيف يعمل النظام؟</h3>
        <div className="grid md:grid-cols-4 gap-4 items-center">
          <ArchStep
            step="1"
            title="الإدارة"
            desc="تحدد خريطة الـ Pins لكل شريحة"
            color="bg-purple-500/20 border-purple-500/40"
          />
          <div className="hidden md:flex justify-center">
            <ArrowLeft className="w-8 h-8 text-gray-500 rotate-180" />
          </div>
          <ArchStep
            step="2"
            title="المستخدم"
            desc="يسحب بلوكات منطقية (بدون أرقام Pins)"
            color="bg-[#2196F3]/20 border-[#2196F3]/40"
          />
          <div className="hidden md:flex justify-center">
            <ArrowLeft className="w-8 h-8 text-gray-500 rotate-180" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 items-center mt-6">
          <ArchStep
            step="3"
            title="المترجم"
            desc="يحول المفاتيح المنطقية إلى أرقام Pins الفعلية"
            color="bg-orange-500/20 border-orange-500/40"
          />
          <div className="hidden md:flex justify-center">
            <ArrowLeft className="w-8 h-8 text-gray-500 rotate-180" />
          </div>
          <ArchStep
            step="4"
            title="الشريحة"
            desc="تنفذ الأوامر على الـ Pins الصحيحة"
            color="bg-green-500/20 border-green-500/40"
          />
          <div className="hidden md:block"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
          <p>© 2024 MekaMind - منصة IoT الذكية للبرمجة البصرية</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-8 hover:border-[#2196F3]/50 transition-all group">
      <div className="w-14 h-14 bg-[#2196F3]/10 rounded-xl flex items-center justify-center text-[#2196F3] mb-4 group-hover:bg-[#2196F3]/20 transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ArchStep({ step, title, desc, color }: { step: string; title: string; desc: string; color: string }) {
  return (
    <div className={`border rounded-xl p-6 text-center ${color}`}>
      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
        {step}
      </div>
      <h5 className="font-bold mb-1">{title}</h5>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
