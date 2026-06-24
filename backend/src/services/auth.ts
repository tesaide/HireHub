import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db'
import { config } from '../config'
import { IUser, IUserPublic, IJwtPayload, UserRole } from '../types'
import { AppError } from '../middleware/errorHandler'

// TODO День 13: вивчити bcrypt та JWT, потім повторити цей файл самостійно

interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
}

interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: IUserPublic; token: string }> {
    // Перевіряємо чи email вже існує
    const existing = await query<IUser>(
      'SELECT id FROM users WHERE email = $1',
      [input.email]
    )
    if (existing.rows.length > 0) {
      throw new AppError('Email already registered', 409)
    }

    // Хешуємо пароль (salt rounds = 10)
    const password_hash = await bcrypt.hash(input.password, 10)

    const result = await query<IUser>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [input.name, input.email, password_hash, input.role]
    )

    const user = result.rows[0] as unknown as IUserPublic
    const token = this.signToken({ userId: user.id, role: user.role })

    return { user, token }
  }

  async login(input: LoginInput): Promise<{ user: IUserPublic; token: string }> {
    const result = await query<IUser>(
      'SELECT * FROM users WHERE email = $1',
      [input.email]
    )

    const user = result.rows[0]
    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    const isValid = await bcrypt.compare(input.password, user.password_hash)
    if (!isValid) {
      throw new AppError('Invalid credentials', 401)
    }

    const { password_hash, ...userPublic } = user
    const token = this.signToken({ userId: user.id, role: user.role })

    return { user: userPublic as IUserPublic, token }
  }

  async getById(id: number): Promise<IUserPublic | null> {
    const result = await query<IUserPublic>(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] ?? null
  }

  private signToken(payload: IJwtPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    })
  }
}
