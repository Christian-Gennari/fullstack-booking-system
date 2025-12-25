/**
 * Role constants for the application
 * Usage: import { ROLES } from './constants/roles.js'
 * Example: if (user.role === ROLES.ADMIN) { ... }
 */

export const ROLES = Object.freeze({
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
});

// Helper to check if a role is valid
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

// Helper to get all roles as an array
export function getAllRoles() {
  return Object.values(ROLES);
}
