import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// TODO День 11: підключення до реальної PostgreSQL
// Поки що це заготовка — pool не буде працювати без запущеної БД
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err)
})

export const query = <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> => {
  return pool.query(text, params)
}
