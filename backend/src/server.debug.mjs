console.log("1: start");
import "./config/env.js";
console.log("2: env loaded");

import cookieParser from "cookie-parser";
console.log("3: cookie-parser imported");
import cors from "cors";
console.log("4: cors imported");
import express from "express";
console.log("5: express imported");

import { connectDB } from "./config/db.js";
console.log("6: db config imported");
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";
console.log("7: errorHandlers imported");
import rateLimiter from "./middleware/rateLimiter.js";
console.log("8: rateLimiter imported");

import authRoutes from "./routes/authRoutes.js";
console.log("9: authRoutes imported");
import publicRoutes from "./routes/publicRoutes.js";
console.log("10: publicRoutes imported");
import adminRoutes from "./routes/adminRoutes.js";
console.log("11: adminRoutes imported");

console.log("12: all imports done, building app");

const app = express();
app.get("/x", (req, res) => res.send("ok"));
app.listen(5999, () => console.log("13: LISTENING on 5999"));
