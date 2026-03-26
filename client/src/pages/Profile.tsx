import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import authService from '../services/authService';
import { validateEmail, validateUsername } from '../utils/validators';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setUsernameError(null);
    setEmailError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    setUsernameError(uErr);
    setEmailError(eErr);
    if (uErr || eErr) return;

    setIsSaving(true);
    try {
      await authService.updateProfile({ username, email });
      await refreshProfile();
      showSuccess('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (err: unknown) {
      showError((err as Error).message || 'فشل تحديث الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const roleLabels: Record<string, string> = {
    student: 'طالب',
    instructor: 'مدرب',
    admin: 'مدير',
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.username}</h1>
            <span className="profile-role">{roleLabels[user.role] || user.role}</span>
          </div>
        </div>

        <div className="profile-card card">
          <h2 className="profile-section-title">معلومات الحساب</h2>

          {!isEditing ? (
            <div className="profile-info">
              <div className="profile-field">
                <span className="profile-field-label">اسم المستخدم</span>
                <span className="profile-field-value">{user.username}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">البريد الإلكتروني</span>
                <span className="profile-field-value profile-field-ltr">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">تاريخ الانضمام</span>
                <span className="profile-field-value">
                  {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <button className="btn-primary profile-edit-btn" onClick={handleEdit}>
                تعديل المعلومات
              </button>
            </div>
          ) : (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="profile-username">اسم المستخدم</label>
                <input
                  id="profile-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={usernameError ? 'input-error' : ''}
                  disabled={isSaving}
                />
                {usernameError && <span className="field-error">{usernameError}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="profile-email">البريد الإلكتروني</label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={emailError ? 'input-error' : ''}
                  disabled={isSaving}
                />
                {emailError && <span className="field-error">{emailError}</span>}
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-card card profile-danger-zone">
          <h2 className="profile-section-title">إعدادات الحساب</h2>
          <button className="btn-danger" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
