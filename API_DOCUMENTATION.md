# HAA Platform — API Documentation

Base URL: `http://localhost:5000/api`

All responses are JSON. All authenticated endpoints require the header:

```
Authorization: Bearer <accessToken>
```

---

## Error Codes

| HTTP Status | Code                    | Meaning                                  |
|-------------|-------------------------|------------------------------------------|
| 400         | VALIDATION_ERROR        | Request body / query params invalid      |
| 401         | UNAUTHORIZED            | Missing or invalid access token          |
| 403         | FORBIDDEN               | Token valid but insufficient permissions |
| 404         | NOT_FOUND               | Resource not found                       |
| 409         | CONFLICT                | Duplicate resource (e.g. email taken)    |
| 429         | RATE_LIMIT_EXCEEDED     | Too many requests                        |
| 500         | INTERNAL_SERVER_ERROR   | Unexpected server error                  |

### Error Response Shape

```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## Auth Endpoints `/api/auth`

### POST /register

Register a new user account. A verification email is sent automatically.

**Request Body**

```json
{
  "name": "Ahmed Al-Hassan",
  "email": "ahmed@example.com",
  "password": "SecureP@ss1"
}
```

| Field    | Type   | Required | Constraints              |
|----------|--------|----------|--------------------------|
| name     | string | ✓        | 2–50 chars               |
| email    | string | ✓        | Valid email              |
| password | string | ✓        | Min 8 chars              |

**Response `201`**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

**Error `409`** — email already registered

---

### POST /login

Authenticate and receive tokens.

**Request Body**

```json
{
  "email": "ahmed@example.com",
  "password": "SecureP@ss1"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Ahmed Al-Hassan",
      "email": "ahmed@example.com",
      "role": "user",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error `401`** — invalid credentials  
**Error `403`** — email not verified

---

### POST /logout

Invalidate the current access token. Requires authentication.

**Response `200`**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /refresh-token

Exchange a refresh token for a new access token.

**Request Body**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error `401`** — invalid or expired refresh token

---

### POST /forgot-password

Send a password reset link to the provided email address.

**Request Body**

```json
{
  "email": "ahmed@example.com"
}
```

**Response `200`** *(always 200 to prevent email enumeration)*

```json
{
  "success": true,
  "message": "If that email exists, a reset link has been sent."
}
```

---

### POST /reset-password

Reset a user's password using the token from the email.

**Request Body**

```json
{
  "token": "abc123resettoken",
  "password": "NewSecureP@ss1"
}
```

**Response `200`**

```json
{
  "success": true,
  "message": "Password reset successful. You can now log in."
}
```

**Error `400`** — invalid or expired reset token

---

### GET /verify-email

Verify a user's email address via the link sent during registration.

**Query Parameters**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| token | string | ✓        | Verification token       |

**Example:** `GET /api/auth/verify-email?token=abc123`

**Response `200`**

```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

**Error `400`** — invalid or expired token

---

### GET /profile *(auth required)*

Return the currently authenticated user's profile. Alias of `GET /api/users/profile`.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ahmed Al-Hassan",
    "email": "ahmed@example.com",
    "role": "user",
    "isEmailVerified": true,
    "avatar": "https://example.com/avatar.png",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T08:15:00.000Z"
  }
}
```

---

## User Endpoints `/api/users`

All user endpoints require authentication (`Authorization: Bearer <token>`).

---

### GET /profile

Get the authenticated user's full profile.

**Response `200`** — same shape as `GET /api/auth/profile` above.

---

### PUT /profile

Update the authenticated user's profile.

**Request Body** *(all fields optional)*

```json
{
  "name": "Ahmed Hassan",
  "bio": "Financial analyst & investor",
  "language": "ar",
  "timezone": "Asia/Riyadh"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ahmed Hassan",
    "bio": "Financial analyst & investor",
    "language": "ar",
    "timezone": "Asia/Riyadh",
    "updatedAt": "2024-01-21T09:00:00.000Z"
  }
}
```

---

### PUT /change-password

Change the authenticated user's password.

**Request Body**

```json
{
  "currentPassword": "OldP@ss1",
  "newPassword": "NewSecureP@ss1"
}
```

**Response `200`**

```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

**Error `401`** — currentPassword incorrect

---

### PUT /avatar

Upload or update the user's avatar image.

**Request** — `multipart/form-data`

| Field  | Type | Description       |
|--------|------|-------------------|
| avatar | file | JPEG / PNG / WebP |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "avatar": "https://cdn.example.com/avatars/64f1a2b3.png"
  }
}
```

---

### DELETE /account

Permanently delete the authenticated user's account and all associated data.

**Request Body**

```json
{
  "password": "SecureP@ss1"
}
```

**Response `200`**

```json
{
  "success": true,
  "message": "Account deleted successfully."
}
```

---

## Chart Endpoints `/api/charts`

---

### GET /quote/:symbol

Get the latest quote for a stock or ETF symbol.

**Path Parameters**

| Param  | Example | Description       |
|--------|---------|-------------------|
| symbol | AAPL    | Ticker symbol     |

**Example:** `GET /api/charts/quote/AAPL`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 189.71,
    "change": 1.23,
    "changePercent": 0.65,
    "high": 190.50,
    "low": 188.20,
    "open": 188.90,
    "previousClose": 188.48,
    "volume": 52348712,
    "timestamp": "2024-01-21T20:00:00.000Z"
  }
}
```

---

### GET /history/:symbol

Get historical OHLCV (candlestick) data.

**Path Parameters**

| Param  | Example | Description   |
|--------|---------|---------------|
| symbol | AAPL    | Ticker symbol |

**Query Parameters**

| Param    | Type   | Default | Description                      |
|----------|--------|---------|----------------------------------|
| interval | string | daily   | `daily`, `weekly`, `monthly`     |
| outputsize | string | compact | `compact` (100), `full` (20y)  |

**Example:** `GET /api/charts/history/AAPL?interval=daily&outputsize=compact`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "interval": "daily",
    "prices": [
      {
        "date": "2024-01-21",
        "open": 188.90,
        "high": 190.50,
        "low": 188.20,
        "close": 189.71,
        "volume": 52348712
      }
    ]
  }
}
```

---

### GET /search

Search for stock symbols by keyword.

**Query Parameters**

| Param | Type   | Required | Description       |
|-------|--------|----------|-------------------|
| q     | string | ✓        | Search keyword    |

**Example:** `GET /api/charts/search?q=apple`

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "type": "Equity",
      "region": "United States",
      "currency": "USD"
    }
  ]
}
```

---

### GET /crypto/:coinId

Get the current price and market data for a cryptocurrency.

**Path Parameters**

| Param  | Example | Description               |
|--------|---------|---------------------------|
| coinId | bitcoin | CoinGecko coin identifier |

**Query Parameters**

| Param    | Type   | Default | Description             |
|----------|--------|---------|-------------------------|
| currency | string | usd     | Quote currency          |

**Example:** `GET /api/charts/crypto/bitcoin?currency=usd`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "BTC",
    "price": 42350.00,
    "change24h": 2.35,
    "marketCap": 830000000000,
    "volume24h": 18500000000,
    "currency": "usd"
  }
}
```

---

### POST /save *(auth required)*

Save a chart configuration for the current user.

**Request Body**

```json
{
  "symbol": "AAPL",
  "chartType": "candlestick",
  "interval": "daily",
  "indicators": ["MA_20", "RSI_14"],
  "title": "My Apple Analysis",
  "notes": "Watching for breakout above 190"
}
```

**Response `201`**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "symbol": "AAPL",
    "chartType": "candlestick",
    "interval": "daily",
    "indicators": ["MA_20", "RSI_14"],
    "title": "My Apple Analysis",
    "notes": "Watching for breakout above 190",
    "createdAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### GET /my-charts *(auth required)*

List all charts saved by the authenticated user.

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "symbol": "AAPL",
      "chartType": "candlestick",
      "title": "My Apple Analysis",
      "createdAt": "2024-01-21T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Analysis Endpoints `/api/analysis`

---

### GET /technical/:symbol

Get technical analysis indicators for a symbol.

**Path Parameters**

| Param  | Example | Description   |
|--------|---------|---------------|
| symbol | AAPL    | Ticker symbol |

**Query Parameters**

| Param    | Type   | Default | Description                  |
|----------|--------|---------|------------------------------|
| interval | string | daily   | `daily`, `weekly`, `monthly` |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "interval": "daily",
    "indicators": {
      "movingAverages": {
        "MA_20": 185.40,
        "MA_50": 179.85,
        "MA_200": 168.20,
        "EMA_12": 187.10,
        "EMA_26": 183.55
      },
      "rsi": {
        "period": 14,
        "value": 62.5,
        "signal": "neutral"
      },
      "macd": {
        "macd": 3.55,
        "signal": 2.80,
        "histogram": 0.75,
        "trend": "bullish"
      },
      "bollingerBands": {
        "upper": 193.50,
        "middle": 185.40,
        "lower": 177.30,
        "bandwidth": 8.73
      },
      "stochastic": {
        "k": 72.4,
        "d": 68.1
      }
    },
    "summary": {
      "signal": "buy",
      "strength": "moderate",
      "buyCount": 7,
      "sellCount": 2,
      "neutralCount": 3
    }
  }
}
```

---

### GET /fundamental/:symbol

Get fundamental analysis data for a stock symbol.

**Path Parameters**

| Param  | Example | Description   |
|--------|---------|---------------|
| symbol | AAPL    | Ticker symbol |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "valuation": {
      "peRatio": 28.5,
      "pbRatio": 45.2,
      "psRatio": 7.8,
      "evToEbitda": 22.1,
      "priceToFreeCashFlow": 31.4
    },
    "financials": {
      "marketCap": 2950000000000,
      "revenue": 394330000000,
      "netIncome": 96995000000,
      "eps": 6.13,
      "dividendYield": 0.52,
      "debtToEquity": 1.76,
      "currentRatio": 0.99,
      "returnOnEquity": 1.60
    },
    "growth": {
      "revenueGrowthYoY": -2.8,
      "epsGrowthYoY": -1.3
    },
    "analystRating": {
      "consensus": "buy",
      "targetPrice": 205.00,
      "numberOfAnalysts": 38
    }
  }
}
```

---

### GET /opportunities

Scan for and return a list of current investment opportunities based on technical and fundamental screens.

**Query Parameters**

| Param  | Type   | Default | Description                           |
|--------|--------|---------|---------------------------------------|
| type   | string | all     | `oversold`, `breakout`, `value`, `all`|
| limit  | number | 10      | Max number of opportunities           |

**Example:** `GET /api/analysis/opportunities?type=oversold&limit=5`

**Response `200`**

```json
{
  "success": true,
  "data": [
    {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "price": 374.00,
      "signal": "oversold",
      "rsi": 28.5,
      "changePercent": -4.2,
      "reason": "RSI below 30 – potential oversold bounce",
      "confidence": "high"
    }
  ],
  "count": 1,
  "generatedAt": "2024-01-21T12:00:00.000Z"
}
```
