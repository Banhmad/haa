import React, { useState } from 'react';
import { validateEmail } from '../../utils/validators';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const emailErr = validateEmail(email);
    const passwordErr = !password ? 'كلمة المرور مطلوبة' : null;
    setErrors({ email: emailErr || undefined, password: passwordErr || undefined });
    return !emailErr && !passwordErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="auth-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
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
        <label htmlFor="password">كلمة المرور</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أدخل كلمة المرور"
          className={errors.password ? 'input-error' : ''}
          autoComplete="current-password"
          disabled={isLoading}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
};

export default LoginForm;
