/**
 * 🛡️ Auth Guard
 * Checks if the user has one of the required roles. If not, redirects to login.
 * 
 * @function requireRole
 * @param {...string} requiredRoles - The roles required to view this page (e.g., 'admin', 'teacher')
 * @returns {boolean} Returns true if user is authenticated and has required role, false otherwise
 * @throws {void} Does not throw errors, but performs redirect to login page if authentication fails
 * 
 * @example
 * // Check if user has admin role
 * if (requireRole('admin')) {
 *   console.log('User is admin');
 * }
 * 
 * @example
 * // Check if user has one of multiple roles
 * if (requireRole('admin', 'teacher')) {
 *   console.log('User is admin or teacher');
 * }
 * 
 * @description
 * - Retrieves token and user object from localStorage
 * - If no token exists or user role is not in requiredRoles array, redirects to /login/
 * - Prevents redirect loops by checking current pathname
 */
export function requireRole(...requiredRoles) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If not logged in OR role is not in the allowed list
  if (!token || !requiredRoles.includes(user.role)) {
    // Prevent redirect loop
    if (!window.location.pathname.includes("/login")) {
      window.location.replace("/login/");
    }
    return false;
  }
  return true;
}
