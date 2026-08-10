import bcrypt from "bcryptjs";

import { prisma } from "../config/db.js";
import { AUTH_COOKIE_NAME, authCookieOptions, sanitizeEmail, signAuthToken } from "../utils/auth.js";
import { badRequest } from "../utils/validation.js";

export const login = async (req, res, next) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      throw badRequest("Email and password are required.");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signAuthToken(user);
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions(), maxAge: 0 });
  res.status(204).send();
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
