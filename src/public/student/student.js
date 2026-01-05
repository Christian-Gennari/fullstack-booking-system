import API from "../api/api.js";
import { showError, showSuccess } from "../utils/toast.js";
import { loadUser, setupLogout } from "../components/auth.manager.js";
import { formatDateTime } from "../utils/formatters.utils.js";

// --- Global State ---
let allBookings = [];
let cachedRooms = [];
let currentTab = "upcoming";

// --- Initialization Logic ---
// 1. Check Auth immediately
const currentUser = loadUser();

// 2. If logged in, set up the page immediately (No DOMContentLoaded needed since we use modules and defer the script in html)
if (currentUser) {
  setupLogout("logout-btn"); // Attach logout logic, default button ID is "logout-btn", but nonetheless writing it out explicitly for clarity.
  loadRooms();
  loadBookings();
}
// (If not logged in, loadUser() has already redirected the user away at this point)

// --- Tab Switching Logic ---
const tabUpcoming = document.getElementById("tab-upcoming");
const tabHistory = document.getElementById("tab-history");

if (tabUpcoming && tabHistory) {
  tabUpcoming.addEventListener("click", () => switchTab("upcoming"));
  tabHistory.addEventListener("click", () => switchTab("history"));
}

function switchTab(tab) {
  currentTab = tab;

  if (tab === "upcoming") {
    tabUpcoming.classList.add("active");
    tabHistory.classList.remove("active");
  } else {
    tabUpcoming.classList.remove("active");
    tabHistory.classList.add("active");
  }

  renderBookings();
}

// --- Room Logic ---
async function loadRooms() {
  try {
    cachedRooms = await API.getRooms(true);
    renderStudentRooms(cachedRooms);
  } catch (error) {
    console.error("Could not load rooms", error);
  }
}

function renderStudentRooms(rooms) {
  const container = document.getElementById("student-room-list");
  if (!container) return;

  container.innerHTML = rooms
    .map((r) => {
      const assets = (r.assets || [])
        .map((a) => `<span class="asset-chip">${a.asset}</span>`)
        .join("");
      return `
      <div class="room-card">
        <h3># ${r.room_number} - ${r.location}</h3>
        <p>${r.display_type}</p>
        <p>Antal platser: ${r.capacity}</p>
        <div class="asset-chips">${assets}</div>
        <button class="book-btn" data-room-id="${r.id}">Boka</button>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll(".book-btn").forEach((bookButton) => {
    bookButton.addEventListener("click", () =>
      onclickBookRoom(bookButton.dataset.roomId)
    );
  });
}

// --- Modal Logic ---
const modal = document.getElementById("booking-modal");
const closeModalButton = document.getElementById("modal-close");
const modalRoomLabel = document.getElementById("modal-room-label");
const bookingForm = document.getElementById("booking-form");
const modalContent = modal?.querySelector(".modal-content");

modalContent?.addEventListener("click", (e) => {
  e.stopPropagation();
});

let selectedRoomId = null;

function openbookingModal(room) {
  selectedRoomId = room.id;
  if (modalRoomLabel) {
    modalRoomLabel.textContent = `Rum ${room.room_number} - ${room.location}`;
  }
  if (!modal) return;
  modal.removeAttribute("hidden");
  modal.classList.add("open");

  if (modalContent) {
    modalContent.classList.remove("pop-in");
    void modalContent.offsetWidth;
    modalContent.classList.add("pop-in");
    setTimeout(() => modalContent.classList.remove("pop-in"), 350);
  }
}

function closebookingModal() {
  if (!modal) return;
  modal.setAttribute("hidden", "");
  modal.classList.remove("open");
  bookingForm?.reset();
  selectedRoomId = null;
}

modal?.addEventListener("click", (event) => {
  if (event.target !== modal) return;
  if (!modalContent) return;

  modalContent.classList.remove("nudge");
  void modalContent.offsetWidth;
  modalContent.classList.add("nudge");
  setTimeout(() => modalContent.classList.remove("nudge"), 300);
});

closeModalButton?.addEventListener("click", closebookingModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal && !modal.hidden) closebookingModal();
  }
});

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedRoomId) return;

  if (!currentUser || !currentUser.id) {
    showError("Användare inte inloggad.");
    return;
  }

  const formData = new FormData(bookingForm);
  const bookingTime = {
    room_id: selectedRoomId,
    user_id: currentUser.id,
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    notes: formData.get("notes"),
  };

  if (!bookingTime.start_time || !bookingTime.end_time) {
    showError("Vänligen fyll i både start- och sluttid för bokningen.", {
      title: "Felaktigt tidsintervall",
    });
    return;
  }

  try {
    await API.createBooking(bookingTime);
    showSuccess("Du har bokat rum # " + bookingTime.room_id, {
      title: "Bokningen har skapats!",
    });
    await loadBookings();
  } catch (err) {
    console.error("Booking failed:", err);
    showError(err.message, { title: "Bokning misslyckades" });
  }
  closebookingModal();
});

function onclickBookRoom(room_id) {
  const room = cachedRooms.find((r) => String(r.id) === String(room_id));
  if (room) {
    openbookingModal(room);
  }
}

// --- Render Bookings ---
function renderBookings() {
  const roomContainer = document.querySelector(".booking-scroll");
  if (!roomContainer) return;

  const now = new Date();

  // 1. Filter
  const filteredBookings = allBookings.filter((booking) => {
    const endTime = new Date(booking.end_time);
    return currentTab === "upcoming" ? endTime >= now : endTime < now;
  });

  // 2. Sort
  filteredBookings.sort((a, b) => {
    const timeA = new Date(a.start_time).getTime();
    const timeB = new Date(b.start_time).getTime();
    return currentTab === "upcoming" ? timeA - timeB : timeB - timeA;
  });

  // 3. Empty State
  if (!filteredBookings.length) {
    roomContainer.innerHTML = `<p>Inga ${
      currentTab === "upcoming" ? "kommande" : "tidigare"
    } bokningar hittades.</p>`;
    return;
  }

  // 4. Render
  roomContainer.innerHTML = filteredBookings
    .map((booking) => {
      const startTime = formatDateTime(booking.start_time);
      const endTime = formatDateTime(booking.end_time);
      const rawStatus = (booking.status || "väntar").toLowerCase();

      let statusSwe = "AKTIV";
      let statusClass = "active";
      let style = "";

      if (rawStatus === "cancelled") {
        statusSwe = "AVBOKAD";
        statusClass = "cancelled";
        style = "opacity: 0.7;";
      } else if (currentTab === "history") {
        statusSwe = "AVSLUTAD";
        statusClass = "done";
        style = "opacity: 0.8; filter: grayscale(100%);";
      }

      const showUnbookBtn =
        currentTab === "upcoming" && rawStatus !== "cancelled";

      const actionButton = showUnbookBtn
        ? `<button class="unbook" data-booking-id="${booking.id}">Avboka</button>`
        : "";

      return `
    <article class="booking-card" style="${style}">
      <div class="card-header">
        <h3># ${booking.room_number} - ${booking.room_location}</h3>
        <span class="status ${statusClass}">${statusSwe}</span>
      </div>
      <p><strong>Start:</strong> ${startTime}</p>
      <p><strong>Slut:</strong> ${endTime}</p>
      <p class="note"><strong>Anteckning:</strong><em> ${
        booking.notes || "-"
      }</em></p>
      ${actionButton}
    </article>
    `;
    })
    .join("");

  roomContainer.querySelectorAll(".unbook").forEach((btn) => {
    btn.addEventListener("click", () => onclickUnBook(btn.dataset.bookingId));
  });
}

async function onclickUnBook(bookingId) {
  if (!bookingId) return;
  if (!confirm("Vill du avboka bokningen?")) return;

  try {
    await API.updateBooking(bookingId, { status: "cancelled" });
    await loadBookings();
    showSuccess("Bokningen har avbokats.");
  } catch (err) {
    console.error("Failed to unbook:", err);
    showError("Försök igen.", { title: "Avbokning misslyckades" });
  }
}

async function loadBookings() {
  try {
    if (currentUser && currentUser.id) {
      allBookings = await API.getBookingsByUser(currentUser.id);
    } else {
      allBookings = await API.getBookings();
    }
    renderBookings();
  } catch (err) {
    console.error("Failed to load bookings:", err);
    showError(err.message, { title: "Failed to load bookings:" });
  }
}
