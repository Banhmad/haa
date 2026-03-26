# منصة التحليل المالي التعليمية | Financial Analysis Educational Platform

منصة تعليمية متكاملة للتحليل المالي تتيح للمستخدمين تعلم وتطبيق مهارات التحليل الفني والأساسي للأسواق المالية.

## هيكل المشروع | Project Structure

```
haa/
├── client/          # React + TypeScript Frontend
├── server/          # Node.js + TypeScript Backend
├── .env.example     # Environment variables template
├── .gitignore
└── README.md
```

## المتطلبات | Prerequisites

- Node.js v18+
- npm v9+
- MongoDB v6+

## التثبيت | Installation

### 1. استنساخ المستودع
```bash
git clone https://github.com/Banhmad/haa.git
cd haa
```

### 2. إعداد الـ Frontend
```bash
cd client
npm install
npm start
```

### 3. إعداد الـ Backend
```bash
cd server
npm install
cp .env.example .env
# عدّل ملف .env بمتغيرات البيئة الخاصة بك
npm run dev
```

## المكونات الرئيسية | Main Components

### Frontend (React + TypeScript)
- **Header** - شريط التنقل الرئيسي
- **ChartAnalyzer** - محلل الرسوم البيانية
- **TechnicalAnalysis** - التحليل الفني
- **FundamentalAnalysis** - التحليل الأساسي
- **OpportunitiesFinder** - مكتشف الفرص الاستثمارية
- **LiveStream** - البث المباشر للأسعار

### Backend (Node.js + TypeScript)
- **Auth API** - المصادقة وإدارة المستخدمين
- **Chart API** - بيانات الرسوم البيانية
- **Analysis API** - نتائج التحليل

## الصفحات | Pages
- **Home** - الصفحة الرئيسية
- **Dashboard** - لوحة التحكم
- **Education** - المحتوى التعليمي

## المساهمة | Contributing

نرحب بمساهماتكم! يرجى قراءة [CONTRIBUTING.md](CONTRIBUTING.md) للمزيد من التفاصيل.

## الرخصة | License

MIT License - انظر ملف [LICENSE](LICENSE) للتفاصيل.