/**
 * 🤖 FRONTEND CONTROLLER (THE BRAIN)
 * * PURPOSE:
 * This is the ONLY JavaScript file the browser runs. It connects the HTML to the Backend.
 * * * SCOPE:
 * 1. "The Wristband Check" (Run immediately):
 * - Check localStorage for 'session_token'. If found, verify it is still valid.
 * - If valid, hide "Log In" button, show "Log Out".
 * * 2. "The Waiter" (Fetching Data):
 * - Function loadRooms(): Asks backend 'GET /api/rooms', receives JSON, and creates HTML cards.
 * - (Crucial: Must include 'Authorization: token' in headers for protected requests).
 * * 3. "The Event Listeners" (Interactivity):
 * - Listen for 'click' on "Book" buttons -> Send 'POST /api/bookings' with Authorization header.
 * - Listen for 'submit' on Login Form -> Send 'POST /api/login', then save the received 'session_token'.
 * - Listen for 'click' on "Log Out" -> Remove 'session_token' and refresh.
 * * * RELATION:
 * - This file talks to ALL your Backend Routes (/api/rooms, /api/auth).
 * - This file manipulates the HTML in index.html.
 */
