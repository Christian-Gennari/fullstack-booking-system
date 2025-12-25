// Get all rooms
import API from "../api/api.js";
import { ROLES } from "../../constants/roles.js";
import { requireRole } from "../js/guard.js";

// Auth guard: Only ADMIN allowed
requireRole(ROLES.ADMIN);

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

      <div class="room-actions">
        <button>Markera som upptaget</button>
        <button>Redigera</button>
        <button class="danger">Ta bort</button>
      </div>
    </div>
  `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", loadRooms);
