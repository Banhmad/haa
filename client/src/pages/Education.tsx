import React, { useState } from 'react';
import './Education.css';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'مقدمة في التحليل الفني',
    description: 'تعرف على أساسيات التحليل الفني وكيفية قراءة الرسوم البيانية للأسعار',
    duration: '45 دقيقة',
    level: 'مبتدئ',
    category: 'التحليل الفني',
  },
  {
    id: 2,
    title: 'أنماط الشموع اليابانية',
    description: 'دراسة أهم أنماط الشموع اليابانية وكيفية الاستفادة منها في التوقع',
    duration: '60 دقيقة',
    level: 'مبتدئ',
    category: 'التحليل الفني',
  },
  {
    id: 3,
    title: 'مستويات الدعم والمقاومة',
    description: 'كيفية تحديد مستويات الدعم والمقاومة واستخدامها في صناعة القرار',
    duration: '50 دقيقة',
    level: 'متوسط',
    category: 'التحليل الفني',
  },
  {
    id: 4,
    title: 'المؤشرات الفنية الأساسية',
    description: 'شرح المتوسطات المتحركة، RSI، MACD وكيفية استخدامها',
    duration: '75 دقيقة',
    level: 'متوسط',
    category: 'المؤشرات',
  },
  {
    id: 5,
    title: 'مقدمة في التحليل الأساسي',
    description: 'فهم القوائم المالية وكيفية تقييم قيمة الشركات',
    duration: '90 دقيقة',
    level: 'متوسط',
    category: 'التحليل الأساسي',
  },
  {
    id: 6,
    title: 'إدارة المخاطر والمحفظة',
    description: 'استراتيجيات إدارة المخاطر وبناء محفظة استثمارية متوازنة',
    duration: '60 دقيقة',
    level: 'متقدم',
    category: 'إدارة المخاطر',
  },
];

const categories = ['الكل', ...Array.from(new Set(lessons.map((l) => l.category)))];
const levels = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

const Education: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedLevel, setSelectedLevel] = useState('الكل');

  const filtered = lessons.filter((lesson) => {
    const matchCategory = selectedCategory === 'الكل' || lesson.category === selectedCategory;
    const matchLevel = selectedLevel === 'الكل' || lesson.level === selectedLevel;
    return matchCategory && matchLevel;
  });

  const levelColors: Record<string, string> = {
    'مبتدئ': 'success',
    'متوسط': 'warning',
    'متقدم': 'danger',
  };

  return (
    <div className="education">
      <div className="edu-header">
        <h1 className="edu-title">مركز التعليم المالي</h1>
        <p className="edu-subtitle">
          تعلم التحليل المالي من الصفر إلى الاحتراف مع دروس تفاعلية ومحتوى شامل
        </p>
      </div>

      <div className="edu-stats">
        <div className="stat-card">
          <div className="stat-value">{lessons.length}</div>
          <div className="stat-label">درس</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.length - 1}</div>
          <div className="stat-label">تخصص</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">مجاني</div>
          <div className="stat-label">الوصول</div>
        </div>
      </div>

      <div className="edu-filters">
        <div className="filter-group">
          <span className="filter-label">التخصص:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">المستوى:</span>
          {levels.map((level) => (
            <button
              key={level}
              className={`filter-chip ${selectedLevel === level ? 'active' : ''}`}
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="lessons-grid">
        {filtered.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-top">
              <span className="lesson-category">{lesson.category}</span>
              <span className={`lesson-level level-${levelColors[lesson.level]}`}>
                {lesson.level}
              </span>
            </div>
            <h3 className="lesson-title">{lesson.title}</h3>
            <p className="lesson-description">{lesson.description}</p>
            <div className="lesson-footer">
              <span className="lesson-duration">⏱ {lesson.duration}</span>
              <button className="btn-primary lesson-btn">ابدأ الدرس</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-lessons">لا توجد دروس تطابق الفلاتر المحددة</p>
      )}
    </div>
  );
};

export default Education;
