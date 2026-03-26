# منصة HAA للتحليل المالي — دليل المرحلة الأولى
# HAA Financial Analysis Platform — Phase 1 Guide

---

## Table of Contents / فهرس المحتويات

1. [Project Overview / نظرة عامة](#1-project-overview--نظرة-عامة)
2. [Setup Instructions / تعليمات الإعداد](#2-setup-instructions--تعليمات-الإعداد)
3. [Features Implemented / الميزات المنفذة](#3-features-implemented--الميزات-المنفذة)
4. [Authentication Flow / تدفق المصادقة](#4-authentication-flow--تدفق-المصادقة)
5. [API Endpoints Summary / ملخص نقاط النهاية](#5-api-endpoints-summary--ملخص-نقاط-النهاية)
6. [Testing Guide / دليل الاختبار](#6-testing-guide--دليل-الاختبار)
7. [Environment Variables / متغيرات البيئة](#7-environment-variables--متغيرات-البيئة)

---

## 1. Project Overview / نظرة عامة

### English

**HAA Financial Analysis Platform** is a full-stack educational and analytical web application that provides:

- Real-time stock, forex, and cryptocurrency market data
- Interactive charting and technical analysis tools
- Fundamental analysis reports
- Investment opportunity discovery
- Secure user authentication and personalised chart saving

**Technology Stack:**

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, React Router 6 |
| Backend   | Node.js, Express, TypeScript        |
| Database  | MongoDB 7 (Mongoose ODM)            |
| Cache     | Redis 7                             |
| Auth      | JWT (access + refresh tokens)       |
| APIs      | Alpha Vantage, Finnhub, CoinGecko   |
| DevOps    | Docker, GitHub Actions              |

### العربية

**منصة HAA للتحليل المالي** هي تطبيق ويب تعليمي وتحليلي متكامل يقدم:

- بيانات سوق الأسهم والعملات والعملات المشفرة في الوقت الفعلي
- أدوات رسم بياني وتحليل تقني تفاعلية
- تقارير التحليل الأساسي
- اكتشاف الفرص الاستثمارية
- مصادقة آمنة للمستخدمين وحفظ الرسوم البيانية الشخصية

---

## 2. Setup Instructions / تعليمات الإعداد

### Prerequisites / المتطلبات الأساسية

- Node.js ≥ 18
- npm ≥ 9
- MongoDB ≥ 7 (local) **or** Docker + Docker Compose
- Git

---

### Option A — Local Development / التطوير المحلي

#### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/haa.git
cd haa
```

#### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

#### 3. Configure environment variables

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env — set your API keys, JWT secret, etc.

# Frontend
cp .env.example client/.env
# Edit client/.env if needed
```

#### 4. Start MongoDB and Redis (local)

```bash
mongod --dbpath ./data/db &
redis-server &
```

#### 5. Run development servers

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd client && npm start
```

---

### Option B — Docker Compose

```bash
# Build and start all services
docker compose up --build

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

Services will be available at:

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:3000     |
| Backend  | http://localhost:5000/api |
| MongoDB  | localhost:27017           |
| Redis    | localhost:6379            |

---

### Building for Production / البناء للإنتاج

```bash
# Build backend TypeScript
cd server && npm run build
# Output: server/dist/

# Build frontend
cd client && npm run build
# Output: client/build/
```

---

## 3. Features Implemented / الميزات المنفذة

### Authentication & Users / المصادقة والمستخدمون
- [x] User registration with email verification
- [x] JWT-based login (access token + refresh token)
- [x] Logout (token invalidation)
- [x] Forgot password / reset password via email
- [x] Profile management (view, update, avatar upload)
- [x] Change password
- [x] Account deletion

### Market Data / بيانات السوق
- [x] Real-time stock quotes (via Alpha Vantage & Finnhub)
- [x] Historical OHLCV price data
- [x] Symbol search
- [x] Cryptocurrency prices (via CoinGecko)

### Charts / الرسوم البيانية
- [x] Save personalised charts
- [x] List user-saved charts

### Analysis / التحليل
- [x] Technical analysis indicators (MA, RSI, MACD, Bollinger Bands)
- [x] Fundamental analysis (P/E, EPS, market cap, etc.)
- [x] Investment opportunity scanner

### Infrastructure / البنية التحتية
- [x] Rate limiting (express-rate-limit)
- [x] Security headers (Helmet)
- [x] Request logging (Morgan + Winston)
- [x] Docker Compose multi-service setup
- [x] GitHub Actions CI pipeline

---

## 4. Authentication Flow / تدفق المصادقة

```
┌──────────┐        POST /api/auth/register         ┌────────────┐
│  Client  │ ───────────────────────────────────── ▶ │   Server   │
│          │ ◀───────────────────────────────────── │            │
│          │   201 { message: "Verify your email" }  │            │
│          │                                         │  Sends     │
│          │   GET /api/auth/verify-email?token=…    │  email     │
│          │ ───────────────────────────────────── ▶ │            │
│          │ ◀───────────────────────────────────── │            │
│          │        200 { message: "Verified" }      │            │
│          │                                         │            │
│          │        POST /api/auth/login             │            │
│          │ ───────────────────────────────────── ▶ │            │
│          │ ◀───────────────────────────────────── │            │
│          │  200 { accessToken, refreshToken, user }│            │
│          │                                         │            │
│          │  Authorization: Bearer <accessToken>    │            │
│          │ ─── Protected requests ───────────── ▶ │            │
│          │                                         │            │
│          │   POST /api/auth/refresh-token          │            │
│          │ ───────────────────────────────────── ▶ │            │
│          │ ◀───────────────────────────────────── │            │
│          │      200 { accessToken }                │            │
└──────────┘                                         └────────────┘
```

**Token Strategy:**
- `accessToken` — short-lived (7 days default), sent in `Authorization: Bearer` header
- `refreshToken` — longer-lived (30 days), stored securely by client, used to obtain new access tokens

---

## 5. API Endpoints Summary / ملخص نقاط النهاية

Base URL: `http://localhost:5000/api`

| Method | Endpoint                          | Auth | Description                  |
|--------|-----------------------------------|------|------------------------------|
| POST   | /auth/register                    | ✗    | Register new user            |
| POST   | /auth/login                       | ✗    | Login                        |
| POST   | /auth/logout                      | ✓    | Logout                       |
| POST   | /auth/refresh-token               | ✗    | Refresh access token         |
| POST   | /auth/forgot-password             | ✗    | Request password reset email |
| POST   | /auth/reset-password              | ✗    | Reset password with token    |
| GET    | /auth/verify-email                | ✗    | Verify email address         |
| GET    | /auth/profile                     | ✓    | Get auth'd user profile      |
| GET    | /users/profile                    | ✓    | Get user profile             |
| PUT    | /users/profile                    | ✓    | Update profile               |
| PUT    | /users/change-password            | ✓    | Change password              |
| PUT    | /users/avatar                     | ✓    | Upload avatar                |
| DELETE | /users/account                    | ✓    | Delete account               |
| GET    | /charts/quote/:symbol             | ✗    | Get stock quote              |
| GET    | /charts/history/:symbol           | ✗    | Get price history            |
| GET    | /charts/search?q=…                | ✗    | Search symbols               |
| GET    | /charts/crypto/:coinId            | ✗    | Get crypto price             |
| POST   | /charts/save                      | ✓    | Save a chart                 |
| GET    | /charts/my-charts                 | ✓    | List saved charts            |
| GET    | /analysis/technical/:symbol       | ✗    | Technical analysis           |
| GET    | /analysis/fundamental/:symbol     | ✗    | Fundamental analysis         |
| GET    | /analysis/opportunities           | ✗    | Investment opportunities     |

---

## 6. Testing Guide / دليل الاختبار

### Frontend tests

```bash
cd client
npm test                        # Interactive watch mode
npm test -- --watchAll=false    # Single run
```

### Backend tests

```bash
cd server
npm test                        # Run all tests (Jest + Supertest)
```

### E2E tests (Cypress)

```bash
cd client
# Make sure both servers are running first
npx cypress open        # Interactive
npx cypress run         # Headless CI mode
```

---

## 7. Environment Variables / متغيرات البيئة

### server/.env

| Variable                | Default / Example                          | Required | Description                  |
|-------------------------|--------------------------------------------|----------|------------------------------|
| PORT                    | 5000                                       | ✓        | HTTP server port             |
| NODE_ENV                | development                                | ✓        | Runtime environment          |
| MONGODB_URI             | mongodb://localhost:27017/haa_db           | ✓        | MongoDB connection string    |
| JWT_SECRET              | change_in_production                       | ✓        | JWT signing secret           |
| JWT_EXPIRES_IN          | 7d                                         | ✓        | Access token TTL             |
| JWT_REFRESH_EXPIRES_IN  | 30d                                        | ✓        | Refresh token TTL            |
| ALPHA_VANTAGE_API_KEY   | demo                                       | ✓        | Alpha Vantage API key        |
| FINNHUB_API_KEY         | demo                                       | ✓        | Finnhub API key              |
| COINGECKO_API_KEY       | (empty = free tier)                        | ✗        | CoinGecko API key            |
| REDIS_URL               | redis://localhost:6379                     | ✗        | Redis connection URL         |
| EMAIL_HOST              | smtp.gmail.com                             | ✗        | SMTP host                    |
| EMAIL_PORT              | 587                                        | ✗        | SMTP port                    |
| EMAIL_USER              |                                            | ✗        | SMTP username                |
| EMAIL_PASS              |                                            | ✗        | SMTP password                |
| FRONTEND_URL            | http://localhost:3000                      | ✓        | Allowed CORS origin          |
| RATE_LIMIT_WINDOW_MS    | 900000                                     | ✗        | Rate limit window (ms)       |
| RATE_LIMIT_MAX          | 100                                        | ✗        | Max requests per window      |

### client/.env

| Variable              | Default                          | Description             |
|-----------------------|----------------------------------|-------------------------|
| REACT_APP_API_URL     | http://localhost:5000/api        | Backend API base URL    |
| REACT_APP_ENV         | development                      | App environment         |
| REACT_APP_APP_NAME    | منصة HAA للتحليل المالي          | Application display name |

> ⚠️ **Security:** Never commit real secrets to version control. The `.env` files are listed in `.gitignore`. Use environment secrets (e.g., GitHub Actions Secrets) for production deployments.
