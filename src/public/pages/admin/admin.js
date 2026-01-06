import API from "../api/api.js";
import { createRoomCard } from "../components/room.renderer.js";
import { renderBookings } from "../components/booking.renderer.js";
import { renderUsers } from "../components/user.renderer.js";
import { UserModal } from "../components/user.modal.js";
import { loadUser, setupLogout } from "../components/auth.manager.js";
import { showError, showSuccess } from "../utils/toast.js";

// --- State ---
let allRooms = [];
let allBookings = [];
let currentTab = "upcoming";
let showCancelled = false;

// --- Components ---
// Passes loadUsers as the callback so the list refreshes after create/edit
const userModal = new UserModal("createUserModal", "createUserForm", loadUsers);

// --- Initialization ---
const currentUser = loadUser();

if (currentUser) {
  // Setup UI
  const roleEl = document.getElementById("user-role");
  if (roleEl) roleEl.className = `user-role ${currentUser.role}`;
  
  // Listeners
  setupLogout("logout-btn");
  setupTabs();

  // Create User Button
  const createUserBtn = document.getElementById('createUserBtn');
  if (createUserBtn) {
    createUserBtn.addEventListener('click', () => userModal.openForCreate());
  }

  // Load Data
  loadRooms();
  loadBookings();
  loadUsers();
}

// --- User Management ---
async function loadUsers() {
  try {
    const users = await API.getUsers();
    const container = document.getElementById('userList');
    
    renderUsers(
      users, 
      container, 
      (id) => userModal.openForEdit(id), // On Edit
      (id) => deleteUser(id)             // On Delete
    );
  } catch (error) {
    console.error('Failed to load users:', error);
    document.getElementById('userList').innerHTML = '<p class="error">Kunde inte ladda användare</p>';
  }
}

async function deleteUser(userId) {
  if (!confirm('⚠️ Är du säker på att du vill ta bort denna användare?')) return;
  try {
    await API.deleteUser(userId);
    showSuccess('Användare borttagen');
    loadUsers();
  } catch (error) {
    showError(`Kunde inte ta bort: ${error.message}`);
  }
}

// --- Room Management ---
async function loadRooms() {
  try {
    allRooms = await API.getRooms(true);
    renderAdminRooms(allRooms);
    updateDashboardStats();
  } catch (error) {
    console.error("Failed to load rooms", error);
    showError("Kunde inte ladda rum");
  }
}

// Custom renderer for Admin Rooms (since it needs specific buttons)
function renderAdminRooms(rooms) {
  const container = document.getElementById("student-room-list");
  if (!container) return;

  container.innerHTML = rooms.map((room) => {
    const actionButtons = `
      <button class="btn-action btn-edit-room" data-id="${room.id}" style="background:var(--color-warning);">Redigera</button>
      <button class="btn-action btn-delete-room" data-id="${room.id}" style="background:var(--color-danger); color:white;">Ta bort</button>
    `;
    return createRoomCard(room, actionButtons);
  }).join("");

  // Simple delegation for room buttons (placeholders for now)
  container.onclick = (e) => {
    if (e.target.classList.contains('btn-delete-room')) showError("Ta bort rum: Ej implementerat");
    if (e.target.classList.contains('btn-edit-room')) showError("Redigera rum: Ej implementerat");
  };
}

// --- Booking Management ---
async function loadBookings() {
  try {
    allBookings = await API.getBookings();
    updateBookingList(); 
    updateDashboardStats();
  } catch (error) {
    console.error("Failed to load bookings", error);
  }
}

function updateBookingList() {
  const container = document.getElementById("admin-booking-list");
  const now = new Date();

  const filtered = allBookings.filter((b) => {
    const end = new Date(b.end_time);
    const isCancelled = b.status === "cancelled";
    if (!showCancelled && isCancelled) return false;
    return currentTab === "upcoming" ? end >= now : end < now;
  }).sort((a, b) => {
    const tA = new Date(a.start_time).getTime();
    const tB = new Date(b.start_time).getTime();
    return currentTab === "upcoming" ? tA - tB : tB - tA;
  });

  renderBookings(filtered, container, handleAdminUnbook);
}

async function handleAdminUnbook(bookingId) {
  if (!confirm("Vill du verkligen avboka denna tid?")) return;
  try {
    await API.updateBooking(bookingId, { status: "cancelled" });
    showSuccess("Bokningen avbokad");
    loadBookings();
  } catch (err) {
    showError("Kunde inte avboka: " + err.message);
  }
}

// --- Tabs & Stats ---
function setupTabs() {
  const tUp = document.getElementById("tab-upcoming");
  const tHist = document.getElementById("tab-history");
  const chk = document.getElementById("show-cancelled");

  if (tUp && tHist) {
    tUp.onclick = () => { currentTab = "upcoming"; tUp.classList.add("active"); tHist.classList.remove("active"); updateBookingList(); };
    tHist.onclick = () => { currentTab = "history"; tHist.classList.add("active"); tUp.classList.remove("active"); updateBookingList(); };
  }
  if (chk) {
    chk.onchange = (e) => { showCancelled = e.target.checked; updateBookingList(); };
  }
}

function updateDashboardStats() {
  const now = new Date();
  
  // Calculate active bookings
  const activeCount = allBookings.filter(b => b.status !== 'cancelled' && new Date(b.end_time) >= now).length;
  
  // Calculate busy rooms
  const busyRooms = new Set(allBookings.filter(b => {
      const s = new Date(b.start_time), e = new Date(b.end_time);
      return b.status !== 'cancelled' && s <= now && e >= now;
  }).map(b => b.room_id));

  setText("summary-total-rooms", allRooms.length);
  setText("summary-available-rooms", allRooms.length - busyRooms.size);
  setText("summary-active-bookings", activeCount);
  setText("summary-total-bookings", allBookings.length);
}

function setText(id, txt) {
  const el = document.getElementById(id);
  if(el) el.textContent = txt;
}