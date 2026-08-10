import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envFilePath });

const required = ["DATABASE_URL", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(
    `⚠️  Missing required env vars: ${missing.join(", ")}. The server will start but auth/DB calls will fail until backend/.env is filled in (copy backend/.env.example).`
  );
}
