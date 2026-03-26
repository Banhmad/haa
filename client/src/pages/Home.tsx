import React from 'react';
import { Link } from 'react-router-dom';
import LiveStream from '../components/LiveStream/LiveStream';
import './Home.css';

const Home: React.FC = () => {
  const features = [
    {
      icon: '📊',
      title: 'تحليل الرسوم البيانية',
      description: 'تحليل رسوم بيانية متقدمة مع أدوات التحليل الفني المتكاملة',
      link: '/dashboard',
    },
    {
      icon: '📈',
      title: 'التحليل الفني',
      description: 'استخدام المؤشرات الفنية المتطورة لتحديد الاتجاهات والإشارات',
      link: '/dashboard',
    },
    {
      icon: '🏢',
      title: 'التحليل الأساسي',
      description: 'تقييم الشركات بناءً على البيانات المالية والنسب الأساسية',
      link: '/dashboard',
    },
    {
      icon: '🎯',
      title: 'مكتشف الفرص',
      description: 'تحديد أفضل الفرص الاستثمارية بناءً على معايير متعددة',
      link: '/dashboard',
    },
    {
      icon: '📡',
      title: 'البث المباشر',
      description: 'متابعة الأسعار والتحديثات في الوقت الفعلي',
      link: '/dashboard',
    },
    {
      icon: '📚',
      title: 'التعليم المالي',
      description: 'محتوى تعليمي شامل يغطي مفاهيم التحليل المالي',
      link: '/education',
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            منصة التحليل المالي
            <span className="hero-subtitle">التعليمية</span>
          </h1>
          <p className="hero-description">
            تعلم التحليل الفني والأساسي للأسواق المالية مع أدوات احترافية وتحديثات فورية
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">ابدأ التحليل</Link>
            <Link to="/education" className="btn-secondary">تعلم أكثر</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">مميزات المنصة</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.link} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="live-section">
        <h2 className="section-title">الأسعار المباشرة</h2>
        <LiveStream />
      </section>
    </div>
  );
};

export default Home;
