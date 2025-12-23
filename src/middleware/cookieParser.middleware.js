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
      let [name, ...rest] = cookie.split("=");
      name = name?.trim();
      if (!name) return;

      const value = rest.join("=").trim();
      if (!value) return;

      // Decode the value (handles %20 spaces etc)
      list[name] = decodeURIComponent(value);
    });
  }

  req.cookies = list;
  next();
};
