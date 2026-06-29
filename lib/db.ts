import { neon } from "@neondatabase/serverless";

// Neon Postgres client. Usage: await sql`SELECT ...`
export const sql = neon(process.env.DATABASE_URL!);
