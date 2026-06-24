// ─── User ────────────────────────────────────────────────
export type UserRole = 'employer' | 'seeker'

export interface IUser {
  id: number
  name: string
  email: string
  password_hash: string
  role: UserRole
  created_at: Date
}

export interface IUserPublic {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: Date
}

// ─── Job ─────────────────────────────────────────────────
export interface IJob {
  id: number
  title: string
  description: string
  salary_min: number
  salary_max: number
  city: string
  category: string
  employer_id: number
  employer_name?: string   // joined from users
  is_active: boolean
  created_at: Date
}

export interface IJobCreate {
  title: string
  description: string
  salary_min: number
  salary_max: number
  city: string
  category: string
}

// ─── Application ─────────────────────────────────────────
export type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted'

export interface IApplication {
  id: number
  job_id: number
  seeker_id: number
  cover_letter: string
  status: ApplicationStatus
  created_at: Date
  // joined fields
  job_title?: string
  seeker_name?: string
  seeker_email?: string
}

// ─── API helpers ─────────────────────────────────────────
export interface IApiResponse<T> {
  data: T
  message?: string
}

export interface IApiError {
  error: string
  details?: unknown
}

// ─── JWT Payload ─────────────────────────────────────────
export interface IJwtPayload {
  userId: number
  role: UserRole
}

// ─── Express augmentation ────────────────────────────────
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload
    }
  }
}
