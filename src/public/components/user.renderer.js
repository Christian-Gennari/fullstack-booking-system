import { capitalize } from "../utils/formatters.utils.js";

/**
 * Renders a list of users into a container.
 * @param {Array} users - Array of user objects.
 * @param {HTMLElement} container - The DOM element to render into.
 * @param {Function} onEdit - Callback(userId) for edit button.
 * @param {Function} onDelete - Callback(userId) for delete button.
 */
export function renderUsers(users, container, onEdit, onDelete) {
  if (!container) return;

  if (!users || users.length === 0) {
    container.innerHTML = '<p class="no-data">Inga användare hittades.</p>';
    return;
  }

  container.innerHTML = users
    .map(
      (user) => `
    <div class="user-card" data-user-id="${user.id}">
      <div class="user-info">
        <h4>${user.display_name || user.name}</h4>
        <p>📧 ${user.email}</p>
        <span class="role-badge role-${user.role}">${capitalize(
        user.role
      )}</span>
      </div>
      <div class="user-actions">
        <button class="btn-edit" data-id="${user.id}">✏️ Redigera</button>
        <button class="btn-delete" data-id="${user.id}">🗑️ Ta bort</button>
      </div>
    </div>
  `
    )
    .join("");

  // Attach Event Listeners
  container.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => onEdit(btn.dataset.id));
  });

  container.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => onDelete(btn.dataset.id));
  });
}
