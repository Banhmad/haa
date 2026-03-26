export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) return 'البريد الإلكتروني مطلوب';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'صيغة البريد الإلكتروني غير صحيحة';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'كلمة المرور مطلوبة';
  if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  if (!/[A-Z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
  if (!/[0-9]/.test(password)) return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username || !username.trim()) return 'اسم المستخدم مطلوب';
  if (username.trim().length < 3) return 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
  if (username.trim().length > 30) return 'اسم المستخدم يجب أن لا يتجاوز 30 حرفاً';
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
    return 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة سفلية فقط';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) return 'رقم الهاتف مطلوب';
  const digits = phone.replace(/[\s\-+()]/g, '');
  if (!/^\d{9,15}$/.test(digits)) return 'رقم الهاتف غير صحيح';
  return null;
};

export const validateRequired = (value: string, fieldName = 'الحقل'): string | null => {
  if (!value || !value.trim()) return `${fieldName} مطلوب`;
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) return 'تأكيد كلمة المرور مطلوب';
  if (password !== confirmPassword) return 'كلمتا المرور غير متطابقتين';
  return null;
};
