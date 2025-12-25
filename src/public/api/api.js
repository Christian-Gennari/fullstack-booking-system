// api.js – frontend API layer

/**
 * Helper to get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem("token");
}

/**
 * Helper to make authenticated API calls
 */
async function apiFetch(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

  return response.json();
}

const API = {
  // Auth
  async login(email, password) {
    return await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
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
