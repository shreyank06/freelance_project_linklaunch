import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;
let initialized = false;

function initializeDb() {
  if (initialized) return;
  initialized = true;

  try {
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) {
      console.log("Initializing database connection...");
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
      db = drizzle({ client: pool, schema });
    } else {
      console.log("No DATABASE_URL set, using in-memory storage");
    }
  } catch (error: any) {
    console.warn("Database initialization failed, will use in-memory storage:", error.message);
    pool = null;
    db = null;
  }
}

export { pool, db, initializeDb };
