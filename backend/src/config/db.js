import { PrismaClient } from "../generated/prisma-client/index.js";

// Reuse a single PrismaClient instance across hot-reloads / serverless invocations
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  await prisma.$connect();
};
