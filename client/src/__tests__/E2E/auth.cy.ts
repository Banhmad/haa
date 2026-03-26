/// <reference types="cypress" />

describe('تدفقات المصادقة', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('صفحة تسجيل الدخول', () => {
    beforeEach(() => cy.visit('/login'));

    it('يجب أن تُعرض صفحة تسجيل الدخول', () => {
      cy.contains('منصة التحليل المالي').should('be.visible');
      cy.contains('تسجيل الدخول إلى حسابك').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('يجب أن تظهر أخطاء التحقق', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('البريد الإلكتروني مطلوب').should('be.visible');
      cy.contains('كلمة المرور مطلوبة').should('be.visible');
    });

    it('يجب أن تظهر خطأ لبريد إلكتروني غير صحيح', () => {
      cy.get('input[type="email"]').type('not-an-email');
      cy.get('button[type="submit"]').click();
      cy.contains('صيغة البريد الإلكتروني غير صحيحة').should('be.visible');
    });

    it('يجب أن تنتقل إلى صفحة التسجيل', () => {
      cy.contains('إنشاء حساب جديد').click();
      cy.url().should('include', '/register');
    });

    it('يجب أن تنتقل إلى صفحة نسيان كلمة المرور', () => {
      cy.contains('نسيت كلمة المرور؟').click();
      cy.url().should('include', '/forgot-password');
    });

    it('يجب أن يُسجّل الدخول بنجاح ويوجه إلى لوحة التحكم', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          user: {
            id: '1',
            username: 'أحمد',
            email: 'ahmed@example.com',
            role: 'student',
            createdAt: new Date().toISOString(),
          },
        },
      }).as('loginRequest');

      cy.get('input[type="email"]').type('ahmed@example.com');
      cy.get('input[type="password"]').type('Password1');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
      cy.url().should('include', '/dashboard');
    });
  });

  describe('صفحة إنشاء الحساب', () => {
    beforeEach(() => cy.visit('/register'));

    it('يجب أن تُعرض صفحة التسجيل', () => {
      cy.contains('إنشاء حساب جديد').should('be.visible');
      cy.get('#username').should('be.visible');
      cy.get('#reg-email').should('be.visible');
      cy.get('#reg-password').should('be.visible');
      cy.get('#confirm-password').should('be.visible');
    });

    it('يجب أن تظهر خطأ عند عدم تطابق كلمتي المرور', () => {
      cy.get('#username').type('testuser');
      cy.get('#reg-email').type('test@example.com');
      cy.get('#reg-password').type('Password1');
      cy.get('#confirm-password').type('Password2');
      cy.get('button[type="submit"]').click();
      cy.contains('كلمتا المرور غير متطابقتين').should('be.visible');
    });

    it('يجب أن يُنشئ الحساب بنجاح', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 201,
        body: {
          token: 'new-token',
          user: {
            id: '2',
            username: 'testuser',
            email: 'test@example.com',
            role: 'student',
            createdAt: new Date().toISOString(),
          },
        },
      }).as('registerRequest');

      cy.get('#username').type('testuser');
      cy.get('#reg-email').type('test@example.com');
      cy.get('#reg-password').type('Password1');
      cy.get('#confirm-password').type('Password1');
      cy.get('button[type="submit"]').click();

      cy.wait('@registerRequest');
      cy.url().should('include', '/dashboard');
    });
  });

  describe('المسارات المحمية', () => {
    it('يجب أن يُعيد توجيه المستخدم غير المصادق إلى صفحة تسجيل الدخول', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('يجب أن يُعيد توجيه من صفحة الملف الشخصي', () => {
      cy.visit('/profile');
      cy.url().should('include', '/login');
    });
  });

  describe('صفحة نسيان كلمة المرور', () => {
    beforeEach(() => cy.visit('/forgot-password'));

    it('يجب أن تُعرض الصفحة', () => {
      cy.contains('إعادة تعيين كلمة المرور').should('be.visible');
    });

    it('يجب أن ترسل طلب إعادة التعيين', () => {
      cy.intercept('POST', '**/auth/forgot-password', {
        statusCode: 200,
        body: { message: 'تم إرسال رابط إعادة تعيين كلمة المرور' },
      }).as('forgotRequest');

      cy.get('input[type="email"]').type('user@example.com');
      cy.get('button[type="submit"]').click();

      cy.wait('@forgotRequest');
      cy.contains('تم إرسال رابط إعادة تعيين كلمة المرور').should('be.visible');
    });
  });
});
