import API from "../api/api.js";
import { ROLES } from "../../constants/roles.js";

// Check if already logged in
const token = localStorage.getItem("token");
if (token) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  redirectToDashboard(user.role);
}

// Handle login form submission
const loginForm = document.querySelector("form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const submitButton = loginForm.querySelector('button[type="submit"]');

  // Validation
  if (!email || !password) {
    showError("Ange både email och lösenord");
    return;
  }

  // Disable button during login
  submitButton.disabled = true;
  submitButton.textContent = "Loggar in...";

  try {
    const data = await API.login(email, password);

    // Store token and user info in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    redirectToDashboard(data.user.role);
  } catch (error) {
    showError(error.message || "Inloggning misslyckades");
    submitButton.disabled = false;
    submitButton.textContent = "Logga in";
  }
});

/**
 * Redirect user to appropriate dashboard based on role
 */
function redirectToDashboard(role) {
  switch (role) {
    case ROLES.ADMIN:
      window.location.href = "/admin/";
      break;
    case ROLES.TEACHER:
      window.location.href = "/teacher/";
      break;
    case ROLES.STUDENT:
      window.location.href = "/student/";
      break;
    default:
      window.location.href = "/";
  }
}

/**
 * Show error message to user
 */
function showError(message) {
  // Check if error element exists, if not create it
  let errorElement = document.querySelector(".error-message");

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.cssText =
      "color: #d32f2f; background: #ffebee; padding: 12px; border-radius: 4px; margin-bottom: 16px; text-align: center;";
    loginForm.insertBefore(errorElement, loginForm.firstChild);
  }

  errorElement.textContent = message;
  errorElement.style.display = "block";

  // Hide error after 5 seconds
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 5000);
}
