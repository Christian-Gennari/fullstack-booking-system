import { validateSession } from "../repositories/session.repo.js";
import { getUserById } from "../repositories/user.repo.js";

/**
 * 🛡️ AUTHENTICATION MIDDLEWARE
 *
 * * PURPOSE:
 * Verifies the identity of the user for protected routes.
 *
 * * HYBRID AUTH STRATEGY (Cookie + Header):
 * 1. 🍪 Cookies (Priority): Checks for 'auth_token' in HTTP-Only cookies first.
 * - Why? Best for Browsers. It renders the app immune to XSS attacks because
 * JavaScript cannot read the token. It also simplifies the frontend code, which is the real reason we want this.
 *
 * 2. 🔑 Headers (Fallback): Checks for 'Authorization: Bearer <token>' second.
 * - Why? Because cookies are not handled automatically by API clients like Postman or cURL. This fallback allows us developers to test the API easily by
 * manually setting the Authorization header.
 */
export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // 1. Browser Check (Secure & Automatic)
    if (req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    // 2. Tooling Check (Manual Fallback for Postman/Devs)
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Block if no token found in either place
    if (!token) {
      return res.status(401).json({ error: "Missing authentication token" });
    }

    // Validate token in sessions table
    const session = validateSession(token);

    if (!session) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Find user by session's user_id
    const user = getUserById(session.user_id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request (exclude password_hash for security)
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
