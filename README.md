This is a comprehensive, professional `README.md` template designed for a high-quality full-stack starter kit. It explains the "why" and the "how" of your Next.js + Nest.js + Better-Auth architecture.

---

# 🚀 Next-Nest-Better-Auth Starter Kit

A high-performance, type-safe, full-stack starter kit featuring **Next.js 15**, **Nest.js 11**, and **Better-Auth**. This kit implements a robust "Shared Database Session" architecture, allowing seamless authentication across a decoupled frontend and backend.

## 🏗️ Architecture Overview

Unlike traditional JWT-based architectures, this kit uses **Better-Auth** with a shared database strategy.

1. **Frontend (Next.js):** Handles user login, signup, and session management. It stores the session token in an `httpOnly` cookie.
2. **Proxying:** Next.js proxies API requests to Nest.js, ensuring cookies are sent automatically without CORS headaches.
3. **Backend (Nest.js):** Uses a custom `AuthGuard` that validates the session token directly against the shared database using the Better-Auth API.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), Tailwind CSS, Better-Auth Client.
* **Backend:** Nest.js 11, Better-Auth Node SDK.
* **Database:** PostgreSQL with **Prisma ORM**.
* **Validation:** Class-validator, Zod.

---

## 🚦 Getting Started

### 1. Environment Configuration

Create a `.env` file in both your frontend and backend directories.

**Backend (.env)**

```env
PORT=5000
API_PREFIX=api/v1
DATABASE_URL="postgresql://user:password@localhost:5432/db"
BETTER_AUTH_SECRET="your_shared_secret"

```

**Frontend (.env)**

```env
BACKEND_INTERNAL_URL="http://localhost:5000/api/v1"
BETTER_AUTH_SECRET="your_shared_secret" # MUST match Backend
BETTER_AUTH_URL="http://localhost:3000"

```

### 2. Next.js Proxy Setup

To handle cookies correctly, we use Next.js rewrites in `next.config.ts`:

```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL}/:path*`,
      },
    ];
  },
};

```

---

## 🔒 Authentication Implementation

### The Hybrid AuthGuard

The included `AuthGuard` in Nest.js supports both **Browser Cookies** and **Postman Bearer Tokens**.

```typescript
// Usage in Controllers
@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // Injected by the Guard
}

```

#### Detailed Logging

The Guard includes a detailed logger to track the authentication lifecycle:

* **Verbose:** Detects if the token came from a Cookie or Authorization Header.
* **Debug:** Tracks the session validation process with the database.
* **Error:** Logs specific reasons for failure (e.g., token exists but session expired).

---

## 🧪 Testing with Postman

This kit is optimized for API development. To test protected routes in Postman:

1. **Login:** Perform a login request via the frontend or the Better-Auth login endpoint.
2. **Extract Token:** Copy the `token` string from the JSON response.
3. **Authenticate:** * Set **Auth Type** to `Bearer Token`.
* Paste the token.
* The Guard will automatically map this to a virtual cookie for Better-Auth validation.



---

## 📡 Database Schema

The kit expects the standard Better-Auth Prisma schema. Ensure your `schema.prisma` includes:

* `User`
* `Session`
* `Account`
* `Verification`

Run the following to sync your database:

```bash
npx prisma generate
npx prisma db push

```

---

## 📝 Key Features Checklist

* [x] **Shared Session:** No need for JWT access/refresh token complexity.
* [x] **Decoupled yet Connected:** Nest.js and Next.js scale independently.
* [x] **SSR Compatible:** Authentication works in Next.js Server Components and Nest.js APIs.
* [x] **Secure:** `httpOnly`, `SameSite` cookies by default via Better-Auth.
* [x] **Developer Experience:** Detailed backend logging for auth debugging.

---

# Next-Nest-Better-Auth
