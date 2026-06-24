import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth'
import { authMiddleware } from '../middleware/auth'

// TODO День 10: Zod схеми — навчитись писати самостійно
const registerSchema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(6),
  role:     z.enum(['employer', 'seeker']),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export class AuthController {
  private service = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body)
      const result = await this.service.register(data)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body)
      const result = await this.service.login(data)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  // TODO День 13: використати authMiddleware тут або в роуті
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // authMiddleware виконується в роуті — тут вже є req.user
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }
      const user = await this.service.getById(req.user.userId)
      res.json({ data: user })
    } catch (err) {
      next(err)
    }
  }
}
