# HAA Platform — Testing Guide

---

## Table of Contents

1. [Overview](#1-overview)
2. [Frontend Tests (Jest + React Testing Library)](#2-frontend-tests-jest--react-testing-library)
3. [Backend Tests (Jest + Supertest)](#3-backend-tests-jest--supertest)
4. [End-to-End Tests (Cypress)](#4-end-to-end-tests-cypress)
5. [Test Coverage](#5-test-coverage)
6. [Writing New Tests](#6-writing-new-tests)
7. [CI Integration](#7-ci-integration)

---

## 1. Overview

| Layer    | Framework                     | Location                     |
|----------|-------------------------------|------------------------------|
| Frontend | Jest + React Testing Library  | `client/src/__tests__/`      |
| Backend  | Jest + Supertest              | `server/src/__tests__/`      |
| E2E      | Cypress                       | `client/cypress/`            |

---

## 2. Frontend Tests (Jest + React Testing Library)

### Running Tests

```bash
cd client

# Interactive watch mode (recommended during development)
npm test

# Single run — no watch (useful for CI)
npm test -- --watchAll=false

# Run a specific test file
npm test -- --watchAll=false --testPathPattern="Auth"

# Run with verbose output
npm test -- --watchAll=false --verbose
```

### Test File Locations

```
client/
└── src/
    └── __tests__/
        ├── components/
        │   ├── Auth/
        │   ├── Charts/
        │   └── Common/
        ├── hooks/
        ├── services/
        └── utils/
```

### Example — Component Test

```tsx
// src/__tests__/components/Auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../../components/Auth/LoginForm';

describe('LoginForm', () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<BrowserRouter>{ui}</BrowserRouter>);

  it('renders email and password fields', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error for empty submission', async () => {
    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct credentials', async () => {
    const mockSubmit = jest.fn();
    renderWithRouter(<LoginForm onSubmit={mockSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!',
      });
    });
  });
});
```

### Example — Service / Hook Test

```tsx
// src/__tests__/services/authService.test.ts
import { authService } from '../../../services/authService';

jest.mock('../../../services/authService');

describe('authService.login', () => {
  it('returns tokens on success', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      accessToken: 'mock-access',
      refreshToken: 'mock-refresh',
    });

    const result = await authService.login('test@example.com', 'pass');
    expect(result.accessToken).toBe('mock-access');
  });
});
```

---

## 3. Backend Tests (Jest + Supertest)

### Setup

Tests require a running MongoDB instance. Set environment variables via the test runner or a `.env.test` file:

```bash
# .env.test (do NOT commit real secrets)
NODE_ENV=test
PORT=5001
MONGODB_URI=mongodb://localhost:27017/haa_test
JWT_SECRET=test_secret_not_for_production
JWT_EXPIRES_IN=7d
ALPHA_VANTAGE_API_KEY=demo
FINNHUB_API_KEY=demo
```

### Running Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run a specific test file
npm test -- --testPathPattern="auth"

# Run tests matching a name pattern
npm test -- --testNamePattern="should register"
```

### Test File Locations

```
server/
└── src/
    └── __tests__/
        ├── auth.test.ts
        ├── user.test.ts
        ├── chart.test.ts
        └── analysis.test.ts
```

### Example — Integration Test

```typescript
// src/__tests__/auth.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'SecureP@ss1',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user — 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_USER)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/verify/i);
  });

  it('should reject duplicate email — 409', async () => {
    await request(app).post('/api/auth/register').send(TEST_USER);

    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_USER)
      .expect(409);

    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  it('should return tokens for valid credentials — 200', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);

    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should reject wrong password — 401', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: 'wrongpassword' })
      .expect(401);
  });
});

describe('Protected routes', () => {
  let accessToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password });
    accessToken = res.body.data?.accessToken;
  });

  it('GET /api/auth/profile — 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.email).toBe(TEST_USER.email);
  });

  it('GET /api/auth/profile — 401 without token', async () => {
    await request(app).get('/api/auth/profile').expect(401);
  });
});
```

---

## 4. End-to-End Tests (Cypress)

### Prerequisites

Both the frontend (port 3000) and backend (port 5000) must be running before executing E2E tests.

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm start
```

### Running Cypress

```bash
cd client

# Open the Cypress interactive test runner (recommended for development)
npx cypress open

# Run all tests headlessly (CI mode)
npx cypress run

# Run a specific spec file
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run with a specific browser
npx cypress run --browser chrome
```

### Test File Locations

```
client/
└── cypress/
    ├── e2e/
    │   ├── auth.cy.ts
    │   ├── charts.cy.ts
    │   └── dashboard.cy.ts
    ├── fixtures/
    │   └── users.json
    └── support/
        ├── commands.ts
        └── e2e.ts
```

### Example — Auth E2E Test

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('SecureP@ss1');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('shows error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.contains(/invalid credentials/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('navigates to forgot password page', () => {
    cy.contains('Forgot password').click();
    cy.url().should('include', '/forgot-password');
  });
});
```

### Custom Cypress Commands

Add reusable commands in `cypress/support/commands.ts`:

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
    email,
    password,
  }).then(({ body }) => {
    localStorage.setItem('accessToken', body.data.accessToken);
  });
  cy.visit('/dashboard');
});

// Usage in tests:
// cy.login('test@example.com', 'SecureP@ss1');
```

---

## 5. Test Coverage

### Frontend Coverage

```bash
cd client
npm test -- --watchAll=false --coverage

# Coverage report is generated in: client/coverage/
# Open HTML report:
open coverage/lcov-report/index.html
```

### Backend Coverage

```bash
cd server
npm test -- --coverage

# Coverage report is generated in: server/coverage/
# Open HTML report:
open coverage/lcov-report/index.html
```

### Coverage Thresholds

The project targets the following minimum coverage thresholds:

| Metric     | Target |
|------------|--------|
| Statements | 70%    |
| Branches   | 60%    |
| Functions  | 70%    |
| Lines      | 70%    |

To enforce thresholds, add to `jest.config.js` / `package.json`:

```json
"coverageThreshold": {
  "global": {
    "statements": 70,
    "branches": 60,
    "functions": 70,
    "lines": 70
  }
}
```

---

## 6. Writing New Tests

### Frontend Guidelines

1. **File naming:** `ComponentName.test.tsx` or `hookName.test.ts`
2. **Location:** Mirror the `src/` directory structure inside `src/__tests__/`
3. **Use `data-testid`** attributes for Cypress / RTL selectors
4. **Mock external services** with `jest.mock()` — never make real API calls in unit tests
5. **Use `screen` queries** over direct container queries
6. **Prefer `userEvent`** over `fireEvent` for realistic interactions

### Backend Guidelines

1. **File naming:** `routeName.test.ts` (e.g., `auth.test.ts`)
2. **Isolate tests** — use a dedicated test database (`haa_test`)
3. **Clean up** the database in `afterAll` / `afterEach` hooks
4. **Test both happy and error paths** for every endpoint
5. **Verify response shape** — check `success`, `data`, and `message` fields
6. **Use factories** for test data to avoid duplication

### Test Data Factories

```typescript
// src/__tests__/factories/user.factory.ts
import { Types } from 'mongoose';

export const createTestUser = (overrides = {}) => ({
  _id: new Types.ObjectId(),
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'SecureP@ss1',
  isEmailVerified: true,
  role: 'user',
  ...overrides,
});
```

---

## 7. CI Integration

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/ci.yml`).

### Pipeline Steps

```
push / pull_request
        │
        ├── lint-and-test-client
        │       └── npm ci → lint → npm test (--watchAll=false)
        │
        ├── lint-and-test-server
        │       └── npm ci → lint → npm test (with MongoDB service)
        │
        ├── build-client (needs lint-and-test-client)
        │       └── npm run build
        │
        └── build-server (needs lint-and-test-server)
                └── npm run build (tsc)
```

### Environment Variables in CI

Secrets are injected via GitHub Actions environment variables — **never** hardcode credentials. Configure secrets at:

`GitHub → Repository → Settings → Secrets and variables → Actions`

| Secret name             | Used by          |
|-------------------------|------------------|
| `JWT_SECRET`            | lint-and-test-server |
| `ALPHA_VANTAGE_API_KEY` | lint-and-test-server |
| `FINNHUB_API_KEY`       | lint-and-test-server |
