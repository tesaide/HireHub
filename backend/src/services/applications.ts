import { query } from '../db'
import { IApplication, ApplicationStatus } from '../types'
import { AppError } from '../middleware/errorHandler'

export class ApplicationsService {
  async apply(data: { job_id: number; cover_letter: string }, seekerId: number): Promise<IApplication> {
    // Перевірити що вакансія існує
    const jobCheck = await query('SELECT id FROM jobs WHERE id = $1 AND is_active = TRUE', [data.job_id])
    if (jobCheck.rows.length === 0) throw new AppError('Job not found or inactive', 404)

    try {
      const result = await query<IApplication>(`
        INSERT INTO applications (job_id, seeker_id, cover_letter)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [data.job_id, seekerId, data.cover_letter])

      return result.rows[0]
    } catch (err: unknown) {
      // Порушення UNIQUE (вже відгукнувся)
      if ((err as { code?: string }).code === '23505') {
        throw new AppError('Already applied to this job', 409)
      }
      throw err
    }
  }

  async getBySeeker(seekerId: number): Promise<IApplication[]> {
    const result = await query<IApplication>(`
      SELECT a.*, j.title AS job_title, j.city, j.salary_min, j.salary_max
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.seeker_id = $1
      ORDER BY a.created_at DESC
    `, [seekerId])
    return result.rows
  }

  async getByJob(jobId: number, employerId: number): Promise<IApplication[]> {
    // Перевірити що вакансія належить employer
    const jobCheck = await query('SELECT employer_id FROM jobs WHERE id = $1', [jobId])
    if (jobCheck.rows.length === 0) throw new AppError('Job not found', 404)
    if ((jobCheck.rows[0] as { employer_id: number }).employer_id !== employerId) {
      throw new AppError('Forbidden', 403)
    }

    const result = await query<IApplication>(`
      SELECT a.*, u.name AS seeker_name, u.email AS seeker_email
      FROM applications a
      JOIN users u ON a.seeker_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `, [jobId])
    return result.rows
  }

  async updateStatus(id: number, status: ApplicationStatus, employerId: number): Promise<IApplication> {
    // Перевірити що employer власник вакансії
    const check = await query<{ employer_id: number }>(`
      SELECT j.employer_id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
    `, [id])

    if (check.rows.length === 0) throw new AppError('Application not found', 404)
    if (check.rows[0].employer_id !== employerId) throw new AppError('Forbidden', 403)

    const result = await query<IApplication>(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    return result.rows[0]
  }
}
