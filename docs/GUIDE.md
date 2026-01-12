# 🗺️ Project Map Cheat Sheet

## Backend (src/) — The Kitchen

**Purpose:** Server logic, data, rules.

- **modules/** 🏗️ **Vertical Slices:** Features are grouped by domain, not file type.
    - **bookings/**: 
        - `booking.controller.js`: The waiter. Coordinates logic.
        - `booking.dto.js`: **Data Transfer Object.** Validates input and preps data for DB.
        - `booking.repo.js`: The librarian. Talks to SQL.
        - `booking.routes.js`: Maps URLs to controller functions.
    - **auth/**, **rooms/**, **users/**: Follow the same pattern.

- **db/** 🔌 **Power Socket:** DB connection (`db.js`) and setup.
- **middleware/** 🛡️ **Security Staff:**
    - `cookieParser.middleware.js`: Transforms cookie strings into objects.
    - `authentication.middleware.js`: Checks `auth_token`. Handles JSON errors vs HTML redirects.
    - `authorization.middleware.js`: Checks `req.user.role`.

- **app.js** 📘 **Rulebook:** - Mounts Public Assets (`/css`, `/js`, `/components`).
    - Mounts Public Pages (`/login`, `/403`).
    - Mounts **Protected** Pages (`/student`, `/teacher`).
    - Mounts API Routes (`/api/bookings`, etc).

## Frontend (public/) — The Dining Room

**Purpose:** Browser-facing pages and scripts.

- **pages/** 🖼️ HTML views organized by role (login, student, teacher, admin).
- **api/api.js** 🌐 API Client: Uses `credentials: "include"` to send cookies automatically.
- **components/** 🧩 Reusable UI scripts (e.g., `booking.modal.js`).
- **utils/** 🧰 Helpers (formatters, toast notifications).

---

# 🧭 The Project Map Guide

## 📂 src/modules/bookings/ (The Feature)

The booking module is the most complex part of the app. It uses a 4-step process:

1.  **DTO (Data Transfer Object):** - When data comes in (`req.body`), we pass it to `new CreateBookingDTO()`.
    - This ensures `start_time`, `end_time`, and `room_id` exist and are valid types.
    
2.  **Controller (The Coordinator):**
    - Receives the DTO.
    - **Conflict Check:** Calls `repo.getOverlappingBookings()`.
    - If `overlaps.length > 0`, it immediately kills the request with `409 Conflict`.
    - If clear, it calls `repo.createBooking()`.

3.  **Repository (The SQL):**
    - Uses **Named Parameters** (e.g., `@start_time`) to safely insert data.
    - Performs the actual SQL query to find overlaps:
      ```sql
      SELECT * ... WHERE start < newEnd AND end > newStart
      ```

## 📂 src/middleware/authentication.middleware.js

This file decides how to reject you if you aren't logged in:
- **Is it an API call?** (e.g., fetch via JS) -> Return `401 Unauthorized` JSON.
- **Is it a Browser Navigation?** (e.g., typing `/student` in URL) -> **Redirect** to `/login`.

---

## 🚀 Key Logic Flows

### 1. Booking Creation (Preventing Double Bookings)
1.  **Frontend:** Sends POST to `/api/bookings`.
2.  **Controller:** Converts body to `CreateBookingDTO`.
3.  **Controller:** Asks Repo: *"Are there any bookings in this room between X and Y?"*
4.  **Repo:** Returns an array of conflicting bookings.
5.  **Controller:** - **If array has items:** Returns error `409` ("Room already booked").
    - **If array empty:** Saves the booking. Returns `201`.

### 2. Updating a Booking (PUT)
*Strategy: Fetch -> Merge -> Check -> Update*
1.  **Fetch:** Get the *existing* booking from DB (to keep old data like `user_id`).
2.  **Merge:** Overwrite old data with valid new fields from the DTO.
3.  **Check:** Run the **Overlap Check** again using the *new* times.
    - *Crucial:* We filter out the current booking ID so it doesn't conflict with itself.
4.  **Update:** Save the merged object back to DB.

### 3. Login & Session
1.  **User:** Submits email/password.
2.  **Auth Module:** Verifies hash. Creates a session UUID in DB.
3.  **Response:** Sends `Set-Cookie: auth_token=UUID; HttpOnly`.
4.  **Browser:** Stores cookie. **JS cannot see this cookie.**
5.  **Future Requests:** Browser attaches cookie automatically. Middleware validates UUID against DB.