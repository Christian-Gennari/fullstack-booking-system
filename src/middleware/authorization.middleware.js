/**
 * 👮 AUTHORIZATION MIDDLEWARE
 * * PURPOSE:
 * Gates access to specific routes based on the user's role.
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // 1. If it's a browser request (HTML), redirect to 403 page
      if (req.accepts("html")) {
        return res.redirect("/403");
      }

      // 2. If it's an API request, send JSON error
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
