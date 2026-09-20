# 🚀 MekaMind - منصة IoT الذكية للبرمجة البصرية

<div align="center">

![MekaMind](https://img.shields.io/badge/MekaMind-IoT_Platform-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-6-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)

**برمجة الأجهزة الذكية بالسحب والإفلات - بدون أكواد معقدة**

[📖 دليل الاستخدام](#دليل-الاستخدام) • [🚀 النشر](#النشر-على-vercel) • [💡 أمثلة](#أمثلة-تطبيقية)

</div>

---

## 📋 المحتويات

1. [نظرة عامة](#-نظرة-عامة)
2. [الميزات](#-الميزات)
3. [التثبيت والتشغيل](#-التثبيت-والتشغيل)
4. [دليل الاستخدام](#-دليل-الاستخدام)
   - [كيف تبرمج برنامج بسيط](#1-كيف-تبرمج-برنامج-بسيط)
   - [نظام تسجيل المستخدمين](#2-نظام-تسجيل-المستخدمين)
   - [إدارة المشروع](#3-إدارة-المشروع)
5. [النشر على Vercel](#-النشر-على-vercel)
6. [البنية التقنية](#-البنية-التقنية)

---

## 🎯 نظرة عامة

**MekaMind** هي منصة IoT متقدمة تتيح للمستخدمين البرمجة البصرية للشرائح الإلكترونية (ESP32, Arduino) بدون الحاجة لكتابة أكواد معقدة أو معرفة أرقام الـ Pins.

### الفكرة الأساسية

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   الإدارة       │ ───▶ │   المستخدم      │ ───▶ │   الشريحة       │
│                 │      │                 │      │                 │
│ • تحديد Pins    │      │ • سحب بلوكات    │      │ • تنفيذ الأوامر │
│ • تعيين شرائح   │      │ • أسماء سهلة    │      │ • قراءة حساسات  │
│ • خريطة عتاد    │      │ • لا يرى Pins   │      │ • تشغيل محركات  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## ✨ الميزات

### للمستخدمين
- ✅ **برمجة بصرية** بالسحب والإفلات
- ✅ **15+ بلوك** متقدم (تليجرام، شاشات، مؤقتات، شروط)
- ✅ **توليد كود Arduino** تلقائياً
- ✅ **تخصيص الأسماء** للمداخل والمخارج
- ✅ **لوحة تحكم** لعرض قراءات الحساسات

### للإدارة
- ✅ **حماية كاملة** بنظام مصادقة
- ✅ **إدارة الشرائح** وتعيين الـ Pins
- ✅ **إدارة العملاء** وربطهم بالشرائح
- ✅ **مراقبة الحالة** (متصل/غير متصل)

### تقنياً
- ✅ **React 18** + **TypeScript**
- ✅ **Tailwind CSS 4** للتصميم
- ✅ **Context API** لإدارة الحالة
- ✅ **React Router** للتوجيه
- ✅ **تصميم RTL** كامل للعربية

---

## 🔧 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn

### الخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/yourusername/mekamind.git
cd mekamind

# 2. تثبيت الحزم
npm install

# 3. تشغيل المشروع
npm run dev

# 4. فتح المتصفح
# http://localhost:3000
```

### الأوامر المتاحة

```bash
npm run dev        # تشغيل بيئة التطوير
npm run build      # بناء المشروع للإنتاج
npm run typecheck  # فحص أخطاء TypeScript
```

---

## 📖 دليل الاستخدام

### 1. كيف تبرمج برنامج بسيط

#### الخطوة 1: تسجيل الدخول

```
الصفحة: /auth

بيانات تجريبية:
├─ البريد: ahmed@example.com
└─ كلمة المرور: user123

أو أنشئ حساب جديد
```

#### الخطوة 2: الدخول لمساحة البرمجة

```
من القائمة الجانبية:
└─ البرمجة بالبلوكات
```

#### الخطوة 3: اختيار الشريحة

```
اضغط على زر الشريحة في الأعلى
→ اختر الشريحة المناسبة
→ النظام يولد البلوكات تلقائياً
```

#### الخطوة 4: بناء البرنامج - مثال عملي

**مثال: مراقبة الحرارة وإرسال تنبيه**

```
┌─────────────────────────────────────────┐
│ قسم التهيئة (Setup)                      │
├─────────────────────────────────────────┤
│ [⚙️ تهيئة تليجرام]                      │
│   Token: 12345:ABC...                   │
│   Chat ID: 987654                       │
│                                         │
│ [🖥️ تفعيل الشاشة]                       │
│   النوع: OLED I2C                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ قسم التكرار (Loop)                       │
├─────────────────────────────────────────┤
│ [⏱️ نفّذ كل 2 ثانية]                     │
│   ├─ [🧹 مسح الشاشة]                    │
│   ├─ [📝 اكتب: "الحرارة: " + قراءة 1]  │
│   └─ [🔄 تحديث الشاشة]                  │
│                                         │
│ [⚡ عندما تتغير حالة المدخل 1]           │
│   ├─ [🚀 أرسل تليجرام: "تحذير!"]       │
│   └─ [⚡ تشغيل المخرج 1]                 │
└─────────────────────────────────────────┘
```

#### الخطوة 5: عرض الكود

```
اضغط "عرض الكود" → سترى كود Arduino كامل:

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <UniversalTelegramBot.h>

void setup() {
  pinMode(2, INPUT);   // حساس الحرارة
  pinMode(15, OUTPUT); // المحرك
  // ... تهيئة الشاشة وتليجرام
}

void loop() {
  // المؤقت الدوري
  if(millis() - lastTime >= 2000) {
    display.clearDisplay();
    display.print(analogRead(2));
    display.display();
  }
  
  // Edge detection
  if(currentState != lastState) {
    bot.sendMessage(CHAT_ID, "تحذير!", "");
    digitalWrite(15, HIGH);
  }
}
```

#### الخطوة 6: الإرسال

```
اضغط "إرسال للشريحة"
→ في النسخة الحقيقية: يُرسل عبر MQTT للـ ESP32
→ في النسخة التجريبية: يُعرض الكود فقط
```

---

### 2. نظام تسجيل المستخدمين

#### للمستخدمين العاديين

```
الصفحة: /auth

التسجيل:
├─ الاسم الكامل
├─ البريد الإلكتروني
├─ كلمة المرور (6+ أحرف)
└─ تأكيد كلمة المرور

تسجيل الدخول:
├─ البريد الإلكتروني
└─ كلمة المرور

الجلسة: 24 ساعة
```

#### للمسؤول (Admin)

```
الصفحة: /admin/login (رابط سري)

بيانات الدخول:
├─ المستخدم: admin
└─ كلمة المرور: mekamind2024

الصلاحيات:
├─ إدارة الشرائح
├─ إدارة العملاء
├─ تعيين الـ Pins
└─ مراقبة الحالة
```

#### هيكل البيانات

```typescript
// المستخدم
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// الشريحة (يحددها الأدمن)
interface Board {
  id: string;
  name: string;
  pinMapping: {
    inputs: { [key: string]: number };
    outputs: { [key: string]: number };
  };
}

// الأسماء المخصصة (يحددها المستخدم)
interface Aliases {
  [logicalId: string]: string;
  // مثال: "INP_1": "حساس الحرارة"
}
```

---

### 3. إدارة المشروع

#### هيكل المجلدات

```
src/
├── App.tsx                    # التوجيه الرئيسي
├── main.tsx                   # نقطة الدخول
├── index.css                  # الأنماط العامة
│
├── store/                     # إدارة الحالة
│   ├── AppContext.tsx         # حالة التطبيق
│   ├── AuthContext.tsx        # مصادقة الأدمن
│   └── UserAuthContext.tsx    # مصادقة المستخدمين
│
├── components/                # مكونات مشتركة
│   └── ProtectedRoute.tsx     # حماية المسارات
│
└── pages/                     # الصفحات
    ├── Landing.tsx            # الصفحة الرئيسية
    ├── AuthPage.tsx           # تسجيل الدخول/التسجيل
    ├── GuidePage.tsx          # دليل الاستخدام
    │
    ├── admin/                 # لوحة الإدارة
    │   ├── AdminLogin.tsx
    │   ├── AdminLayout.tsx
    │   ├── BoardsManagement.tsx
    │   └── ClientsManagement.tsx
    │
    └── user/                  # بوابة المستخدم
        ├── UserLayout.tsx
        ├── UserDashboard.tsx
        ├── BlocklyWorkspace.tsx
        └── UserSettings.tsx
```

#### التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| React 18 | واجهة المستخدم |
| TypeScript | الأمان النوعي |
| Vite | أداة البناء |
| Tailwind CSS 4 | التصميم |
| React Router | التوجيه |
| Context API | إدارة الحالة |
| Lucide React | الأيقونات |
| LocalStorage | حفظ البيانات |

---

## 🚀 النشر على Vercel

### الطريقة 1: عبر GitHub (موصى بها)

#### الخطوة 1: إنشاء حساب GitHub

```bash
# إذا لم يكن لديك حساب
# اذهب إلى: https://github.com
```

#### الخطوة 2: رفع المشروع

```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit: MekaMind IoT Platform"

# إنشاء مستودع على GitHub ثم:
git remote add origin https://github.com/username/mekamind.git
git branch -M main
git push -u origin main
```

#### الخطوة 3: إنشاء حساب Vercel

```
1. اذهب إلى: https://vercel.com
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"
4. authorize الوصول
```

#### الخطوة 4: استيراد المشروع

```
1. من لوحة Vercel، اضغط "Add New..." → "Project"
2. اختر المستودع: mekamind
3. Vercel سيكتشف الإعدادات تلقائياً:
   ├─ Framework Preset: Vite
   ├─ Build Command: npm run build
   ├─ Output Directory: dist
   └─ Install Command: npm install
4. اضغط "Deploy"
```

#### الخطوة 5: الانتظار والانتهاء

```
⏳ انتظر 2-3 دقائق
✅ سيُعطى رابط مباشر: https://mekamind.vercel.app
```

### الطريقة 2: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# للإنتاج
vercel --prod
```

### إعدادات إضافية

#### ربط دومين مخصص

```
1. من لوحة Vercel → Settings → Domains
2. أضف الدومين: mekamind.com
3. اتبع تعليمات DNS
```

#### المتغيرات البيئية (للإنتاج الحقيقي)

```bash
# في Vercel Dashboard → Settings → Environment Variables

VITE_API_URL=https://api.mekamind.com
VITE_MQTT_BROKER=mqtt.mekamind.com
VITE_TELEGRAM_API=https://api.telegram.org
```

### بدائل للاستضافة

| المنصة | المميزات | الرابط |
|--------|----------|--------|
| **Vercel** | سهل، مجاني، سريع | vercel.com |
| **Netlify** | مشابه لـ Vercel | netlify.com |
| **Railway** | يدعم Backend + DB | railway.app |
| **GitHub Pages** | مجاني للمشاريع الثابتة | pages.github.com |
| **Cloudflare Pages** | سريع جداً، مجاني | pages.cloudflare.com |

---

## 🏗️ البنية التقنية

### معمارية النظام

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Admin   │  │   User   │  │  Blockly │              │
│  │  Portal  │  │  Portal  │  │ Compiler │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │              │              │                  │
│         └──────────────┴──────────────┘                 │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │  Context API      │                      │
│              │  (State Mgmt)     │                      │
│              └───────────────────┘                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (في الإنتاج)                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   API    │  │  MQTT    │  │   Auth   │              │
│  │  Server  │  │  Broker  │  │  Server  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │              │              │                  │
│         └──────────────┴──────────────┘                 │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │    Database       │                      │
│              │   (MongoDB)       │                      │
│              └───────────────────┘                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Hardware (ESP32)                            │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Sensors │  │  Motors  │  │ Display  │              │
│  │ (Inputs) │  │(Outputs) │  │  (OLED)  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### نظام البلوكات

```typescript
// تعريف البلوك
interface BlockDef {
  type: string;
  category: 'io' | 'setup' | 'display' | 'timing' | 'telegram' | 'logic' | 'text';
  label: string;
  icon: string;
  color: string;
  hasChildren?: boolean;
  fields?: Record<string, FieldConfig>;
}

// مثيل البلوك
interface BlockInstance {
  id: string;
  defType: string;
  fields: Record<string, any>;
  children?: BlockInstance[];
}
```

### مولد الكود

```typescript
// مثال: توليد كود لبلوك "قراءة المدخل"
function generateReadInput(block: BlockInstance): string {
  const pin = resolveTargetPin(block.fields.target, 'input');
  return `analogRead(${pin})`;
}

// مثال: توليد كود لبلوك "نفّذ كل"
function generateInterval(block: BlockInstance): string {
  const ms = block.fields.value * getMultiplier(block.fields.unit);
  return `
    if(millis() - lastTime >= ${ms}) {
      lastTime = millis();
      ${block.children.map(generateAction).join('\n')}
    }
  `;
}
```

---

## 💡 أمثلة تطبيقية

### مثال 1: نظام ري تلقائي

```
التهيئة:
└─ [🖥️ تفعيل الشاشة: OLED I2C]

التكرار:
├─ [⏱️ كل 5 دقائق]
│   ├─ [📖 قراءة حساس الرطوبة]
│   ├─ [📝 عرض على الشاشة]
│   └─ [🔄 تحديث الشاشة]
│
└─ [⚡ عندما الرطوبة < 30%]
    └─ [⚡ تشغيل المضخة 10 ثواني]
```

### مثال 2: نظام أمان

```
التهيئة:
├─ [⚙️ تهيئة تليجرام]
└─ [🖥️ تفعيل الشاشة]

التكرار:
├─ [⏱️ كل ثانية]
│   └─ [📖 قراءة حساس الحركة]
│
└─ [⚡ عندما حركة = تشغيل]
    ├─ [🚀 إرسال تليجرام: "حركة مكتشفة!"]
    ├─ [⚡ تشغيل الإنذار]
    └─ [⚡ تشغيل الإضاءة]
```

### مثال 3: محطة طقس

```
التهيئة:
└─ [⚙️ تهيئة تليجرام]

التكرار:
├─ [⏱️ كل 10 دقائق]
│   ├─ [📖 قراءة الحرارة]
│   ├─ [📖 قراءة الرطوبة]
│   ├─ [📖 قراءة الضغط]
│   ├─ [🔗 دمج: "الحرارة: X° الرطوبة: Y%"]
│   ├─ [🚀 إرسال تليجرام]
│   └─ [📝 عرض على الشاشة]
```

---

## 🔮 التطوير المستقبلي

### مخطط
- [ ] دعم MQTT حقيقي للاتصال بالشرائح
- [ ] قاعدة بيانات حقيقية (MongoDB/Firebase)
- [ ] نظام مصادقة كامل مع JWT
- [ ] مكتبة بلوكات مخصصة
- [ ] تصدير/استيراد المشاريع
- [ ] محاكي افتراضي للاختبار
- [ ] دعم بلوكات PID Controller
- [ ] بلوكات Bluetooth/WiFi

### المساهمة
المساهمات مرحب بها! يرجى:
1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع تعليمي/تجريبي - مفتوح المصدر.

---

## 📧 التواصل

للاستفسارات والاقتراحات:
- 📧 افتح Issue في GitHub
- 💬 انضم للنقاش في Discussions

---

<div align="center">

**صُنع بـ ❤️ لمجتمع IoT العربي**

[MekaMind](https://github.com/yourusername/mekamind) © 2024

</div>
