import API from "../api/api.js";
import { ROLES } from "../../constants/roles.js";

const loginForm = document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput =
      document.getElementById("username") || document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (!emailInput.value || !passwordInput.value) {
      showError("Ange både email och lösenord");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Loggar in...";

    try {
      // 1. Backend sets the cookie automatically
      const data = await API.login(
        emailInput.value.trim(),
        passwordInput.value
      );

      // 2. Clear old garbage from localStorage just in case
      localStorage.removeItem("token");
      localStorage.setItem("user", JSON.stringify(data.user));

      // 3. Redirect
      redirectToDashboard(data.user.role);
    } catch (error) {
      // This is where "Fel email eller lösenord" will show up now
      showError(error.message);
      submitButton.disabled = false;
      submitButton.textContent = "Logga in";
    }
  });
}

function redirectToDashboard(role) {
  const routes = {
    [ROLES.ADMIN]: "/admin/",
    [ROLES.TEACHER]: "/teacher/",
    [ROLES.STUDENT]: "/student/",
  };
  window.location.href = routes[role] || "/";
}

function showError(message) {
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
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 5000);
}
