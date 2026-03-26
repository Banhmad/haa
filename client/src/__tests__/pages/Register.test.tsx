import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Register from '../../pages/Register';

const mockRegister = jest.fn();
const mockAddNotification = jest.fn();

const mockAuthValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: mockRegister,
  refreshProfile: jest.fn(),
};

const mockNotifValue = {
  notifications: [],
  addNotification: mockAddNotification,
  removeNotification: jest.fn(),
};

const renderRegister = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <NotificationContext.Provider value={mockNotifValue}>
          <Register />
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe('صفحة إنشاء الحساب', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يجب أن تُعرض الصفحة بشكل صحيح', () => {
    renderRegister();
    expect(screen.getByText('إنشاء حساب جديد')).toBeInTheDocument();
    expect(screen.getByLabelText('اسم المستخدم')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByLabelText('تأكيد كلمة المرور')).toBeInTheDocument();
  });

  it('يجب أن تظهر أخطاء التحقق عند الإرسال بحقول فارغة', async () => {
    renderRegister();
    fireEvent.click(screen.getByRole('button', { name: /إنشاء حساب/ }));
    await waitFor(() => {
      expect(screen.getByText('اسم المستخدم مطلوب')).toBeInTheDocument();
      expect(screen.getByText('البريد الإلكتروني مطلوب')).toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('يجب أن تظهر خطأ عند عدم تطابق كلمتي المرور', async () => {
    renderRegister();
    await userEvent.type(screen.getByLabelText('اسم المستخدم'), 'testuser');
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('كلمة المرور'), 'Password1');
    await userEvent.type(screen.getByLabelText('تأكيد كلمة المرور'), 'Password2');
    fireEvent.click(screen.getByRole('button', { name: /إنشاء حساب/ }));
    await waitFor(() => {
      expect(screen.getByText('كلمتا المرور غير متطابقتين')).toBeInTheDocument();
    });
  });

  it('يجب أن تظهر خطأ لكلمة مرور ضعيفة', async () => {
    renderRegister();
    await userEvent.type(screen.getByLabelText('كلمة المرور'), 'weak');
    fireEvent.click(screen.getByRole('button', { name: /إنشاء حساب/ }));
    await waitFor(() => {
      expect(
        screen.getByText('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
      ).toBeInTheDocument();
    });
  });

  it('يجب أن يستدعي register بالبيانات الصحيحة', async () => {
    mockRegister.mockResolvedValue(undefined);
    renderRegister();
    await userEvent.type(screen.getByLabelText('اسم المستخدم'), 'testuser');
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('كلمة المرور'), 'Password1');
    await userEvent.type(screen.getByLabelText('تأكيد كلمة المرور'), 'Password1');
    fireEvent.click(screen.getByRole('button', { name: /إنشاء حساب/ }));
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1',
      });
    });
  });
});
