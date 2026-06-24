import dotenv from 'dotenv'
dotenv.config()

// TODO День 8: зрозуміти як process.env та dotenv працюють разом
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required env variable: ${key}`)
  return value
}

export const config = {
  port:       parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret:  requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  nodeEnv:    process.env.NODE_ENV ?? 'development',
  isDev:      process.env.NODE_ENV !== 'production',
} as const
