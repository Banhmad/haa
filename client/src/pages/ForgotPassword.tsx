import React from 'react';
import { Link } from 'react-router-dom';
import PasswordReset from '../components/Auth/PasswordReset';
import './Login.css';

const ForgotPassword: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🔑</div>
          <h1 className="auth-title">إعادة تعيين كلمة المرور</h1>
          <p className="auth-subtitle">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        <PasswordReset />

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
