import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await login({ email, password });
      showSuccess('تم تسجيل الدخول بنجاح');
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = (error as Error).message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك';
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
          <p className="auth-subtitle">تسجيل الدخول إلى حسابك</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={formError} />

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">
            نسيت كلمة المرور؟
          </Link>
          <span className="auth-links-divider">|</span>
          <Link to="/register" className="auth-link">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
