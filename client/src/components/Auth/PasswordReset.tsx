import React, { useState } from 'react';
import { validateEmail } from '../../utils/validators';
import authService from '../../services/authService';

interface PasswordResetProps {
  onSuccess?: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsLoading(true);
    setServerError(null);
    try {
      const { message } = await authService.forgotPassword(email);
      setSuccessMessage(message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      onSuccess?.();
    } catch (error: unknown) {
      setServerError((error as Error).message || 'حدث خطأ. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="auth-error">{serverError}</div>}
      {successMessage && <div className="auth-success">{successMessage}</div>}

      <div className="form-group">
        <label htmlFor="reset-email">البريد الإلكتروني</label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني"
          className={emailError ? 'input-error' : ''}
          autoComplete="email"
          disabled={isLoading || Boolean(successMessage)}
        />
        {emailError && <span className="field-error">{emailError}</span>}
      </div>

      <button
        type="submit"
        className="btn-primary auth-submit"
        disabled={isLoading || Boolean(successMessage)}
      >
        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
      </button>
    </form>
  );
};

export default PasswordReset;
