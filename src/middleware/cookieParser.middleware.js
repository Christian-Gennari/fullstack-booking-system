/**
 * 🍪 CUSTOM COOKIE PARSER
 * PURPOSE:
 * Parses the "Cookie" header string into an object at req.cookies.
 * Example: "auth_token=123; theme=dark" -> { auth_token: "123", theme: "dark" }
 */
export const cookieParser = (req, res, next) => {
  const list = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      // Split by the first "=" found
      let [name, ...rest] = cookie.split("=");
      
      name = name?.trim();
      if (!name) return;

      const value = rest.join("=").trim();
      if (!value) return;

      try {
        // Decode the value (handles %20 spaces, @ symbols, etc)
        list[name] = decodeURIComponent(value);
      } catch (e) {
        // Fallback to raw value if decoding fails
        list[name] = value;
      }
    });
  }

  // Assign the parsed object to the request
  req.cookies = list;

  // Proceed to the next middleware or route handler
  next();
};