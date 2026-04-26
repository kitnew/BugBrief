import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

// Створюємо пул з'єднань
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false // Важливо для підключення до RDS зовні
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
    console.log("✅ Схему успішно прочитано з файлу та застосовано до RDS");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Не вдалося завантажити схему з файлу:", errorMessage);
  }
};