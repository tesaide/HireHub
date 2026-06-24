import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

// TODO День 9: зрозуміти чому error handler приймає 4 аргументи
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    })
    return
  }

  // Custom app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  // Unknown errors
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Логування запитів — TODO День 9: написати самостійно
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
}
