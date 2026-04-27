import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initSchema = async () => {
  try {
    // Вказуємо шлях до твого SQL файлу
    const sqlFilePath = path.join(process.cwd(), 'database', 'schema.sql');

    // Читаємо вміст файлу
    const schemaSql = fs.readFileSync(sqlFilePath, 'utf8');

    // Виконуємо запит до AWS RDS
    await query(schemaSql);
    console.log("Database schema successfully read from file and applied to RDS");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("Failed to load schema from file:", errorMessage);
  }
};