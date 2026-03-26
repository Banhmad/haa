import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import './Register.css';

const Register: React.FC = () => {
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await register({ username, email, password });
      showSuccess('تم إنشاء حسابك بنجاح! مرحباً بك');
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      const message = (error as Error).message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى';
      setFormError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">📊</div>
          <h1 className="auth-title">منصة التحليل المالي</h1>
          <p className="auth-subtitle">إنشاء حساب جديد</p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={formError} />

        <div className="auth-links">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            لديك حساب بالفعل؟
          </span>
          <Link to="/login" className="auth-link">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
