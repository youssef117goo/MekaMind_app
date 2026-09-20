import React, { useState } from 'react';
import {
  Settings, Save, Globe, Palette, Bell, Shield, Database,
  Mail, MessageSquare, CheckCircle, AlertCircle
} from 'lucide-react';

export default function SiteSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'MekaMind',
    siteDescription: 'منصة IoT الذكية للبرمجة البصرية',
    siteUrl: 'https://mekamind.vercel.app',
    primaryColor: '#2196F3',
    language: 'ar',
    timezone: 'Africa/Cairo',
    enableRegistration: true,
    requireEmailVerification: true,
    maxUsers: 1000,
    enableTelegram: true,
    telegramBotToken: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    maintenanceMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
          <p className="text-gray-400 mt-1">تخصيص إعدادات المنصة والتكاملات</p>
        </div>
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
              <CheckCircle className="w-4 h-4" />
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

      {/* General Settings */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#2196F3]" />
          الإعدادات العامة
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">اسم الموقع</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">وصف الموقع</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">رابط الموقع</label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleChange('siteUrl', e.target.value)}
              dir="ltr"
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">اللغة الافتراضية</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">المنطقة الزمنية</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
              >
                <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                <option value="Asia/Dubai">دبي (GMT+4)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#9C27B0]" />
          المظهر
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">اللون الأساسي</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-16 h-12 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              dir="ltr"
              className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:border-[#2196F3] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* User Settings */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#4CAF50]" />
          إعدادات المستخدمين
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
            <div>
              <div className="font-medium">تفعيل التسجيل</div>
              <div className="text-sm text-gray-400">السماح للمستخدمين الجدد بالتسجيل</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={(e) => handleChange('enableRegistration', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
            <div>
              <div className="font-medium">تفعيل التحقق من البريد</div>
              <div className="text-sm text-gray-400">إرسال بريد تأكيد عند التسجيل</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">الحد الأقصى للمستخدمين</label>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) => handleChange('maxUsers', parseInt(e.target.value))}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-[#FF9800]" />
          التكاملات
        </h2>
        
        <div className="space-y-6">
          {/* Telegram */}
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0088cc]" />
                <span className="font-bold">تليجرام</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTelegram}
                  onChange={(e) => handleChange('enableTelegram', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0088cc]"></div>
              </label>
            </div>
            {settings.enableTelegram && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bot Token</label>
                <input
                  type="text"
                  value={settings.telegramBotToken}
                  onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  dir="ltr"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#2196F3] focus:outline-none font-mono text-sm"
                />
              </div>
            )}
          </div>

          {/* Email (SMTP) */}
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#f44336]" />
              <span className="font-bold">البريد الإلكتروني (SMTP)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => handleChange('smtpPort', e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => handleChange('smtpUser', e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleChange('smtpPassword', e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#2196F3] focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Mode */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#f44336]" />
          وضع الصيانة
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
          <div>
            <div className="font-medium">تفعيل وضع الصيانة</div>
            <div className="text-sm text-gray-400">إيقاف الموقع مؤقتاً للصيانة</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f44336]"></div>
          </label>
        </div>
      </section>
    </div>
  );
}
