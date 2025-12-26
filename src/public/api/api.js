// api.js – frontend API layer

/**
 * Helper to make authenticated API calls.
 * Browser automatically sends the 'auth_token' cookie.
 */
async function apiFetch(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Ensure cookies are sent no matter domain differences
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or missing (Cookie is dead)
      // Just redirect. No need to clear localStorage since we don't store tokens there anymore.
      window.location.href = "/login/";
      throw new Error("Session expired. Please login again.");
    }
    if (response.status === 403) {
      throw new Error("Access denied. Insufficient permissions.");
    }

    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));

    throw new Error(error.error || "Request failed");
  }

  // Some endpoints (like logout) might not return JSON content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const API = {
  // Auth
  async login(email, password) {
    // The backend sets the HTTP-Only cookie automatically on success.
    // We just return the user object.
    return await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    // The backend clears the cookie automatically.
    return await apiFetch("/api/auth/logout", {
      method: "DELETE",
    });
  },

  // Rooms
  async getRooms() {
    return await apiFetch("/api/rooms");
  },

  // TODO: Implement getRoom(id) - GET /api/rooms/:id
  // TODO: Implement createRoom(roomData) - POST /api/rooms
  // TODO: Implement updateRoom(id, roomData) - PUT /api/rooms/:id
  // TODO: Implement deleteRoom(id) - DELETE /api/rooms/:id

  // Bookings
  // TODO: Implement getBookings() - GET /api/bookings
  // TODO: Implement createBooking(bookingData) - POST /api/bookings
  // TODO: Implement updateBooking(id, bookingData) - PUT /api/bookings/:id
  // TODO: Implement deleteBooking(id) - DELETE /api/bookings/:id

  // Users
  // TODO: Implement getUsers() - GET /api/users
  // TODO: Implement getUser(id) - GET /api/users/:id
  // TODO: Implement createUser(userData) - POST /api/users
};

export default API;
