// Get all rooms
import API from "../api/api.js";

// --- Hämta inloggad användare ---
async function loadUser() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("Not logged in");

    const data = await res.json();
    const user = data.user;

    // Visa display_name (fallback till email/username)
    document.getElementById("username").textContent =
      user.Display_name || user.username || user.email;

    // Visa roll
    const roleEl = document.getElementById("user-role");
    roleEl.textContent = capitalize(user.role);
    roleEl.className = `user-role ${user.role}`;
  } catch (err) {
    console.error(err);
    window.location.href = "/login/";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Hämta rum ---
async function loadRooms() {
  const rooms = await API.getRooms();
  renderStudentRooms(rooms);
}

function renderStudentRooms(rooms) {
  const container = document.getElementById("student-room-list");
  container.innerHTML = rooms
    .map(
      (r) => `
    <div class="room-card">
      <h3>Nr ${r.room_number} - ${r.location}</h3>
    <p>Typ: ${r.type}</p>
    <p>Antal platser: ${r.capacity}</p>
    <button>Boka</button>
  </div>
  `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadRooms();

  });

