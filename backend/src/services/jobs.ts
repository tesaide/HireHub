import { query } from '../db'
import { IJob, IJobCreate } from '../types'
import { AppError } from '../middleware/errorHandler'

// TODO День 12: написати SQL з JOIN самостійно, потім порівняти

interface JobFilters {
  city?: string
  category?: string
  minSalary?: number
}

export class JobsService {
  async getAll(filters: JobFilters): Promise<IJob[]> {
    // Динамічний WHERE через масив умов
    const conditions: string[] = ['j.is_active = TRUE']
    const params: unknown[] = []

    if (filters.city) {
      params.push(filters.city)
      conditions.push(`j.city ILIKE $${params.length}`)
    }
    if (filters.category) {
      params.push(filters.category)
      conditions.push(`j.category = $${params.length}`)
    }
    if (filters.minSalary) {
      params.push(filters.minSalary)
      conditions.push(`j.salary_max >= $${params.length}`)
    }

    const where = conditions.join(' AND ')

    // JOIN з users щоб отримати ім'я роботодавця
    // TODO День 12: зрозуміти цей запит
    const result = await query<IJob>(`
      SELECT j.*, u.name AS employer_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE ${where}
      ORDER BY j.created_at DESC
    `, params)

    return result.rows
  }

  async getById(id: number): Promise<IJob | null> {
    const result = await query<IJob>(`
      SELECT j.*, u.name AS employer_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE j.id = $1
    `, [id])
    return result.rows[0] ?? null
  }

  async create(data: IJobCreate, employerId: number): Promise<IJob> {
    const result = await query<IJob>(`
      INSERT INTO jobs (title, description, salary_min, salary_max, city, category, employer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [data.title, data.description, data.salary_min, data.salary_max, data.city, data.category, employerId])
    return result.rows[0]
  }

  async update(id: number, data: Partial<IJobCreate>, employerId: number): Promise<IJob> {
    // Перевіряємо що вакансія належить цьому employer
    const existing = await this.getById(id)
    if (!existing) throw new AppError('Job not found', 404)
    if (existing.employer_id !== employerId) throw new AppError('Forbidden', 403)

    // Будуємо динамічний SET
    const fields = Object.keys(data) as (keyof IJobCreate)[]
    const setClauses = fields.map((f, i) => `${f} = $${i + 1}`)
    const values = fields.map(f => data[f])

    const result = await query<IJob>(`
      UPDATE jobs SET ${setClauses.join(', ')}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `, [...values, id])

    return result.rows[0]
  }

  async remove(id: number, employerId: number): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) throw new AppError('Job not found', 404)
    if (existing.employer_id !== employerId) throw new AppError('Forbidden', 403)

    await query('DELETE FROM jobs WHERE id = $1', [id])
  }
}
