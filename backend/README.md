# FleetOps Backend

A production-structured **Node.js + Express + TypeScript + Prisma** backend for the FleetOps logistics management system. Features JWT-based multi-tenant authentication with role-based access control.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript 5 (`nodenext` modules) |
| ORM | Prisma 5 + PostgreSQL |
| Auth | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) |
| Validation | Zod 4 |
| Email | Nodemailer |
| Dev | `tsx watch`, `nodemon` |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # DB models
│   ├── seed.ts                # Seeds roles into DB
│   └── migrations/            # Auto-generated migration SQL
├── src/
│   ├── app.ts                 # Express app (routes wired here)
│   ├── server.ts              # DB connect + HTTP listen
│   ├── config/
│   │   ├── env.ts             # Zod-validated env vars
│   │   └── prisma.ts          # Prisma client singleton
│   ├── errors/
│   │   ├── BaseAppError.ts    # Abstract base error class
│   │   └── index.ts           # BadRequestError, NotFoundError, ConflictError,
│   │                          #   UnauthorizedError, ForbiddenError, etc.
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Verifies JWT, sets req.user
│   │   ├── authorize.middleware.ts  # RBAC guard — roleMiddleware(['ADMIN'])
│   │   ├── validate.middleware.ts   # Zod request validation
│   │   └── error.middleware.ts      # Global error handler + Prisma error mapping
│   ├── types/
│   │   └── express.d.ts       # Augments Express Request with req.user
│   ├── schemas/
│   │   ├── auth.schema.ts     # Zod schemas for auth endpoints
│   │   └── company.schema.ts  # Zod schemas for company endpoints
│   ├── repositories/
│   │   └── user.repository.ts # All Prisma user queries
│   ├── services/
│   │   ├── auth.service.ts    # Register, login, forgot/reset password logic
│   │   └── company.service.ts # Invite user, list users logic
│   ├── controllers/
│   │   ├── auth.controller.ts    # Thin handlers → delegate to service
│   │   └── company.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts        # /api/auth/*
│   │   └── company.routes.ts     # /api/company/*
│   └── utils/
│       ├── jwt.ts             # signToken / verifyToken
│       ├── hash.ts            # hashPassword / comparePassword (bcrypt)
│       ├── mailer.ts          # sendEmail + HTML email templates
│       └── logger.ts          # Console logger
├── .env                       # Environment variables (never commit this)
├── .env.example               # Template for env vars
├── docker-compose.yml         # PostgreSQL container
├── tsconfig.json
└── package.json
```

---

## Database Schema

```
Companies ──< Users >── Roles
                │
                └──< Driver >──< Trip >──< Expenses
                                    │
Vehicles ───────────────────────────┘
   │
   ├──< Fuel_Logs
   └──< Expenses
```

### Roles (seeded)

| ID | Role |
|---|---|
| 1 | ADMIN |
| 2 | DRIVER |
| 3 | FLEET_MANAGER |
| 4 | SAFETY_OFFICER |
| 5 | FINANCIAL_ANALYST |

---

## API Endpoints

### Auth — `/api/auth` (public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register-company` | Register a new company + ADMIN user |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password using token from email |

### Company — `/api/company` (JWT required)

| Method | Endpoint | Roles Allowed | Description |
|---|---|---|---|
| `POST` | `/api/company/users` | ADMIN | Invite a new user, sends email with temp password |
| `GET` | `/api/company/users` | ADMIN, FLEET_MANAGER | List all users in the company |

---

## Setup & Installation

### Prerequisites
- Node.js 20+
- pnpm
- Docker (for PostgreSQL)

### 1. Start the database

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
cd backend
pnpm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://admin:password@localhost:5433/logistics_db?schema=public"
JWT_SECRET="change-this-to-a-long-random-secret"
JWT_EXPIRES_IN="24h"

# Get free SMTP credentials from https://mailtrap.io
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="<your_mailtrap_user>"
SMTP_PASS="<your_mailtrap_pass>"
MAIL_FROM="FleetOps <no-reply@fleetops.com>"

APP_URL="http://localhost:3000"
```

### 4. Run migrations + seed

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

### 5. Start dev server

```bash
pnpm dev
```

Server starts at `http://localhost:3000`.

---

## Step-by-Step Testing Guide

> **Tool used:** `curl` (or Postman / Thunder Client)

---

### ✅ 1. Health Check

```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{ "success": true, "message": "Server is healthy" }
```

---

### ✅ 2. Register a Company (creates ADMIN user)

```bash
curl -X POST http://localhost:3000/api/auth/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Logistics",
    "name": "John Admin",
    "email": "admin@acme.com",
    "password": "secret123"
  }'
```

**Expected:** `201`
```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": { "id": 1, "name": "John Admin", "email": "admin@acme.com", "role": "ADMIN" }
  }
}
```

> **Save the token** — you'll use it as `$TOKEN` in all protected requests below.

---

### ✅ 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@acme.com", "password": "secret123" }'
```

**Expected:** `200` with a fresh JWT token.

---

### ✅ 4. Validation Error (bad email)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "not-an-email" }'
```

**Expected:** `400`
```json
{ "success": false, "message": "Validation failed" }
```

---

### ✅ 5. Duplicate Registration

```bash
# Run the register command again with the same email
```

**Expected:** `409`
```json
{ "success": false, "message": "A user with this email already exists" }
```

---

### ✅ 6. Invite a Driver (requires SMTP + ADMIN token)

#### Prerequisites
1. Sign up at **[mailtrap.io](https://mailtrap.io)** (free)
2. Go to: **Email Testing → Inboxes → your inbox → SMTP Settings → Nodemailer**
3. Copy the `user` and `pass` into your `.env` as `SMTP_USER` and `SMTP_PASS`

#### Find the DRIVER role ID

```bash
pnpm prisma studio
# Open in browser → Roles table → note the ID for DRIVER (usually 2)
```

#### Send the invite

```bash
export TOKEN="<your_admin_jwt_token>"

curl -X POST http://localhost:3000/api/company/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jane Driver",
    "email": "jane@acme.com",
    "roleId": 2
  }'
```

**Expected:** `201`
```json
{
  "success": true,
  "data": { "id": 2, "name": "Jane Driver", "email": "jane@acme.com", "role": "DRIVER", "company_id": 1 }
}
```

Check your **Mailtrap inbox** — you'll see the invite email with the temporary password.

---

### ✅ 7. Invited User Logs In

```bash
# Use the temp password from the Mailtrap email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "jane@acme.com", "password": "<temp_password_from_email>" }'
```

**Expected:** `200` with token and `role: "DRIVER"`.

---

### ✅ 8. List All Company Users

```bash
curl -X GET http://localhost:3000/api/company/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** `200` — array of all users in the company (no passwords returned).

---

### ✅ 9. Auth Guard — No Token (401)

```bash
curl -X POST http://localhost:3000/api/company/users \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test", "email": "test@x.com", "roleId": 2 }'
```

**Expected:** `401`
```json
{ "success": false, "message": "Authentication token missing" }
```

---

### ✅ 10. Role Guard — Driver Can't Invite (403)

Login as the driver (`jane@acme.com`), get the token, then try to invite:

```bash
export DRIVER_TOKEN="<driver_jwt_token>"

curl -X POST http://localhost:3000/api/company/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DRIVER_TOKEN" \
  -d '{ "name": "Another User", "email": "another@acme.com", "roleId": 2 }'
```

**Expected:** `403`
```json
{ "success": false, "message": "Insufficient permissions" }
```

---

### ✅ 11. Forgot Password Flow

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@acme.com" }'
```

**Expected:** `200` — always returns success (prevents email enumeration).

Check Mailtrap for the reset email. Copy the token from the link URL.

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<token_from_email_link>",
    "newPassword": "newpassword123"
  }'
```

**Expected:** `200`
```json
{ "success": true, "data": { "message": "Password has been reset successfully" } }
```

---

## Error Reference

| HTTP Code | Meaning |
|---|---|
| `400` | Bad request / validation failed / invalid reset token |
| `401` | Missing or invalid JWT |
| `403` | Valid JWT but insufficient role |
| `404` | Resource not found |
| `409` | Conflict — email already in use |
| `500` | Unhandled server error |

---

## Useful Commands

```bash
# Start dev server (hot reload)
pnpm dev

# Open Prisma visual DB browser
pnpm prisma studio

# Run migrations
pnpm prisma migrate dev

# Re-seed roles
pnpm prisma db seed

# Generate Prisma client after schema changes
pnpm prisma generate
```
