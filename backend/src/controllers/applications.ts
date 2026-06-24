import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ApplicationsService } from '../services/applications'

const applySchema = z.object({
  job_id:       z.number().positive(),
  cover_letter: z.string().min(10),
})

const statusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'rejected', 'accepted']),
})

export class ApplicationsController {
  private service = new ApplicationsService()

  apply = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = applySchema.parse(req.body)
      const app = await this.service.apply(data, req.user!.userId)
      res.status(201).json({ data: app, message: 'Application sent' })
    } catch (err) {
      next(err)
    }
  }

  getMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const apps = await this.service.getBySeeker(req.user!.userId)
      res.json({ data: apps })
    } catch (err) {
      next(err)
    }
  }

  getByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const apps = await this.service.getByJob(Number(req.params.jobId), req.user!.userId)
      res.json({ data: apps })
    } catch (err) {
      next(err)
    }
  }

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = statusSchema.parse(req.body)
      const app = await this.service.updateStatus(Number(req.params.id), status, req.user!.userId)
      res.json({ data: app, message: 'Status updated' })
    } catch (err) {
      next(err)
    }
  }
}
