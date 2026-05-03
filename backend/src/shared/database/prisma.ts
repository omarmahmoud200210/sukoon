import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import logger from "../utils/logger.js";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({
  connectionString,
  max: parseInt(process.env.DB_POOL_SIZE || "10"),
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
  maxLifetimeSeconds: 30,
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export default prisma;
