import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Login from '../../pages/Login';

const mockLogin = jest.fn();
const mockAddNotification = jest.fn();

const mockAuthValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  logout: jest.fn(),
  register: jest.fn(),
  refreshProfile: jest.fn(),
};

const mockNotifValue = {
  notifications: [],
  addNotification: mockAddNotification,
  removeNotification: jest.fn(),
};

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthContext.Provider value={mockAuthValue}>
        <NotificationContext.Provider value={mockNotifValue}>
          <Login />
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe('صفحة تسجيل الدخول', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يجب أن تُعرض الصفحة بشكل صحيح', () => {
    renderLogin();
    expect(screen.getByText('منصة التحليل المالي')).toBeInTheDocument();
    expect(screen.getByText('تسجيل الدخول إلى حسابك')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /تسجيل الدخول/ })).toBeInTheDocument();
  });

  it('يجب أن يظهر روابط التسجيل ونسيان كلمة المرور', () => {
    renderLogin();
    expect(screen.getByText('إنشاء حساب جديد')).toBeInTheDocument();
    expect(screen.getByText('نسيت كلمة المرور؟')).toBeInTheDocument();
  });

  it('يجب أن تظهر أخطاء التحقق عند الإرسال بحقول فارغة', async () => {
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /تسجيل الدخول/ });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('البريد الإلكتروني مطلوب')).toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('يجب أن تظهر خطأ عند بريد إلكتروني غير صحيح', async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'not-an-email');
    fireEvent.click(screen.getByRole('button', { name: /تسجيل الدخول/ }));
    await waitFor(() => {
      expect(screen.getByText('صيغة البريد الإلكتروني غير صحيحة')).toBeInTheDocument();
    });
  });

  it('يجب أن يستدعي login بالبيانات الصحيحة', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderLogin();
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('كلمة المرور'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /تسجيل الدخول/ }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password1',
      });
    });
  });

  it('يجب أن يعرض رسالة خطأ عند فشل تسجيل الدخول', async () => {
    mockLogin.mockRejectedValue(new Error('بيانات غير صحيحة'));
    renderLogin();
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('كلمة المرور'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /تسجيل الدخول/ }));
    await waitFor(() => {
      expect(screen.getByText('بيانات غير صحيحة')).toBeInTheDocument();
    });
  });
});
