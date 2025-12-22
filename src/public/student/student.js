// Get all rooms 
import API from '../api/api.js';


async function loadRooms() {
  const rooms = await API.getRooms();
  renderStudentRooms(rooms);
}

function renderStudentRooms(rooms) {
  const container = document.getElementById("student-room-list");
  container.innerHTML = rooms.map(r => `
    <div class="room-card">
      <h3>${r.room_number}</h3>
    <p>Typ: ${r.type}</p>
    <p>Kapacitet: ${r.capacity}</p>
    <p>Plats: ${r.location}</p>
    <button>Boka</button>
  </div>
  `).join('');
}

window.addEventListener("DOMContentLoaded", loadRooms);
