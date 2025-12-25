This guide reflects the current Token-based Sessions + Role-based Authorization implementation, including logout functionality.

---

# 🗺️ Project Map Cheat Sheet

## Backend (src/) — The Kitchen

Purpose: Server logic, data, rules.

- db/ 🔌 Power Socket: DB connection and helpers.
- repositories/ 📚 Librarian: All SQL lives here.
- controllers/ 🤵 Waiter: Accepts requests, returns JSON.
- middleware/ 🛡️ Security Staff:
  - authentication.middleware.js: Verifies Bearer token, attaches req.user.
  - authorization.middleware.js: Checks `req.user.role` against allowed roles.
- constants/ 🔖 Shared Truths: roles.js with ROLES.
- utils/ 🧰 Tool Belt: hashing, token generation, etc.
- routes/ 📜 Menu: Maps URLs to controllers.
- app.js 📘 Rulebook: Registers middleware and routes.
- server.js ▶️ Start Button: Boots the server.

## Frontend (public/) — The Dining Room

Purpose: Browser-facing pages and scripts.

- HTML 🖼️ Structure per page (login, student, teacher, admin)
- css/ 🎨 Styles
- api/api.js 🌐 API layer: attaches Authorization header automatically
- login/login.js 🔑 Handles login, stores token+user, role-based redirect

## Data Flow

Browser → Route → authentication.middleware → authorization.middleware → Controller → Repository → DB → Controller → Browser

---

# 🧭 The Project Map Guide

Our codebase is split into two worlds: The Kitchen (Backend) and The Dining Room (Frontend).

## 📂 src/

### db/ 🔌

Opens the SQLite database and provides helpers.

### repositories/ 📚

Only SQL. No HTTP, no auth logic. Example: users, sessions, rooms, bookings.

### middleware/ 🛡️

- authentication.middleware.js (the Bouncer):
  - Reads Authorization: Bearer <token>
  - validateSession(token) against sessions table
  - Loads user by user_id, assigns `req.user` (without password)
  - Sends 401 if missing/invalid/expired
- authorization.middleware.js (the Gatekeeper):
  - `authorize(...roles)` allows only if `req.user.role` is in roles
  - Sends 403 if role not permitted

### constants/ 🔖

roles.js exports ROLES = { STUDENT: 'student', TEACHER: 'teacher', ADMIN: 'admin' } for both backend and frontend.

### controllers/ 🤵

Pure request/response orchestration. Call repositories, return JSON.

### routes/ 📜

Wires URLs to controllers and applies middlewares. Examples:

- Bookings: All authenticated users
- Rooms: Create/Update = Teacher/Admin, Delete = Admin
- Users: Admin only

---

## 📂 public/

### api/api.js 🌐

`apiFetch()` attaches Authorization header when token exists; handles 401 (clear+redirect) and 403 (access denied).

### login/login.js 🔑

Submits credentials, stores `{ token, user }` in localStorage, redirects by role to /admin, /teacher, or /student.

---

## 🚀 Flows

### Login

1. POST /api/auth/login with email/password
2. Server verifies password, creates session (token, user_id, expiresAt)
3. Returns `{ token, user }` (no password)
4. Frontend stores token+user, redirects based on `user.role`

### Authenticated request

1. apiFetch adds `Authorization: Bearer <token>`
2. authentication.middleware validates session and attaches `req.user`
3. authorization.middleware optionally checks roles; 403 if not allowed
4. Controller executes and returns JSON

### Logout

DELETE /api/auth/logout removes the session; frontend clears storage on 401 automatically.

---

## 🔐 Semantics

- 401 Unauthorized: Not logged in / token invalid/expired (authentication)
- 403 Forbidden: Logged in but not allowed (authorization)

---

## 🧪 Quick Tests (PowerShell)

Login

```powershell
curl -X POST http://localhost:80/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","password":"secret"}'
```

Authenticated request

```powershell
curl http://localhost:80/api/rooms `
  -H "Authorization: Bearer <TOKEN>"
```

Admin-only

```powershell
curl -X DELETE http://localhost:80/api/rooms/123 `
  -H "Authorization: Bearer <TOKEN>"
```

Logout

```powershell
curl -X DELETE http://localhost:80/api/auth/logout `
  -H "Authorization: Bearer <TOKEN>"
```

---

## ⚠️ Notes for the Team

- Dates: Use ISO 8601 `YYYY-MM-DD HH:MM:SS` with SQLite text columns
- Don’t hardcode roles; always import from ROLES
- Protect mutating routes consistently with `auth → authorize`
