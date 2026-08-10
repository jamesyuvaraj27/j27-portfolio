import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "j27_admin_token";

export const signAuthToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const verifyAuthToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const parseCookieHeader = (header) =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      })
  );

export const sanitizeEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return isValid ? email : "";
};

export const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});
