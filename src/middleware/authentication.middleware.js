import { validateSession } from "../modules/auth/session.repo.js";
import { getUserById } from "../modules/users/user.repo.js";

/**
 * 🛡️ AUTHENTICATION MIDDLEWARE
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies ? req.cookies.auth_token : null;

    // Helper to determine if we should redirect or send JSON
    const handleUnauthorized = (message) => {
      // Use originalUrl to ensure we detect /api even inside sub-routers
      const isApiRequest = req.originalUrl.startsWith("/api/");
      const acceptsHtml = req.accepts("html");

      if (acceptsHtml && !isApiRequest) {
        return res.redirect("/login");
      }
      return res.status(401).json({ error: message });
    };

    if (!token) {
      return handleUnauthorized("Missing authentication token");
    }

    const session = validateSession(token);
    if (!session) {
      return handleUnauthorized("Invalid or expired token");
    }

    const user = getUserById(session.user_id);
    if (!user) {
      return handleUnauthorized("User not found");
    }

    const { password_hash, ...userWithoutPassword } = user;
    req.user = {
      ...userWithoutPassword,
      role: (user.role || "").toLowerCase(),
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
