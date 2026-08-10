import "./config/env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";
import rateLimiter from "./middleware/rateLimiter.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.CORS_ORIGINS),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "J27 Portfolio CMS API", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`J27 Portfolio CMS API running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && process.env.NODE_ENV !== "production") {
      console.warn(`Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }
    console.error("Server startup error:", error);
    process.exit(1);
  });
};

connectDB()
  .then(() => {
    console.log("Database connected");
    startServer(Number(PORT));
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  });
