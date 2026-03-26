import React, { useState } from 'react';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '../../utils/validators';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    setErrors({
      username: usernameErr || undefined,
      email: emailErr || undefined,
      password: passwordErr || undefined,
      confirmPassword: confirmErr || undefined,
    });
    return !usernameErr && !emailErr && !passwordErr && !confirmErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(username, email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="auth-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">اسم المستخدم</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="أدخل اسم المستخدم"
          className={errors.username ? 'input-error' : ''}
          autoComplete="username"
          disabled={isLoading}
        />
        {errors.username && <span className="field-error">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">البريد الإلكتروني</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني"
          className={errors.email ? 'input-error' : ''}
          autoComplete="email"
          disabled={isLoading}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="reg-password">كلمة المرور</label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8 أحرف على الأقل، حرف كبير ورقم"
          className={errors.password ? 'input-error' : ''}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">تأكيد كلمة المرور</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="أعد إدخال كلمة المرور"
          className={errors.confirmPassword ? 'input-error' : ''}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
        {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
      </button>
    </form>
  );
};

export default RegisterForm;
