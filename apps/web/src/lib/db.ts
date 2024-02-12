import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import 'dotenv/config';

console.log(process.env['PGHOST']);

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT ?? '3306'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.POSTGRES_DB,
});

export const db = drizzle(pool);
