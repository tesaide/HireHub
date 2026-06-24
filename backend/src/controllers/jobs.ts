import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { JobsService } from '../services/jobs'

const createJobSchema = z.object({
  title:       z.string().min(3).max(200),
  description: z.string().min(10),
  salary_min:  z.number().positive(),
  salary_max:  z.number().positive(),
  city:        z.string().min(2),
  category:    z.string().min(2),
}).refine(d => d.salary_max >= d.salary_min, {
  message: 'salary_max must be >= salary_min',
  path: ['salary_max'],
})

export class JobsController {
  private service = new JobsService()

  // GET /api/jobs?city=...&minSalary=...&category=...
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        city:      req.query.city as string | undefined,
        category:  req.query.category as string | undefined,
        minSalary: req.query.minSalary ? Number(req.query.minSalary) : undefined,
      }
      const jobs = await this.service.getAll(filters)
      res.json({ data: jobs })
    } catch (err) {
      next(err)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await this.service.getById(Number(req.params.id))
      if (!job) {
        res.status(404).json({ error: 'Job not found' })
        return
      }
      res.json({ data: job })
    } catch (err) {
      next(err)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createJobSchema.parse(req.body)
      const job = await this.service.create(data, req.user!.userId)
      res.status(201).json({ data: job, message: 'Job created' })
    } catch (err) {
      next(err)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createJobSchema.partial().parse(req.body)
      const job = await this.service.update(Number(req.params.id), data, req.user!.userId)
      res.json({ data: job, message: 'Job updated' })
    } catch (err) {
      next(err)
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.remove(Number(req.params.id), req.user!.userId)
      res.json({ message: 'Job deleted' })
    } catch (err) {
      next(err)
    }
  }
}
