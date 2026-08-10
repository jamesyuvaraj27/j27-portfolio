import { prisma } from "../config/db.js";
import { AUTH_COOKIE_NAME, parseCookieHeader, verifyAuthToken } from "../utils/auth.js";

const getTokenFromRequest = (req) => {
  const authorizationHeader = req.headers.authorization || "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length);
  }

  const cookies = parseCookieHeader(req.headers.cookie || "");
  return cookies[AUTH_COOKIE_NAME] || null;
};

export const requireAdmin = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Admin session is invalid." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Admin session is invalid or expired." });
  }
};
