import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
    }
    const client = postgres(url, { prepare: false });
    db = drizzle(client, { schema });
  }
  return db;
}
