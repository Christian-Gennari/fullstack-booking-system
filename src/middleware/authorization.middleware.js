/**
 * 👮 AUTHORIZATION MIDDLEWARE
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Use originalUrl here as well for consistency
      const isApiRequest = req.originalUrl.startsWith("/api/");

      if (req.accepts("html") && !isApiRequest) {
        return res.redirect("/403");
      }

      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
