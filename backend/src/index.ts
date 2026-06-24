import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import { config } from './config'
import { requestLogger, errorHandler } from './middleware/errorHandler'

// Routes
import authRoutes         from './routes/auth'
import jobsRoutes         from './routes/jobs'
import applicationsRoutes from './routes/applications'

const app = express()
const httpServer = createServer(app)

// ─── WebSocket (TODO День 14) ─────────────────────────────
export const io = new SocketServer(httpServer, {
  cors: { origin: '*' }
})

// Map userId → socketId для адресних сповіщень
const userSockets = new Map<number, string>()

io.on('connection', (socket) => {
  console.log('[WS] connected:', socket.id)

  // Клієнт надсилає свій userId після логіну
  socket.on('register', (userId: number) => {
    userSockets.set(userId, socket.id)
    console.log(`[WS] user ${userId} registered`)
  })

  socket.on('disconnect', () => {
    userSockets.forEach((sid, uid) => {
      if (sid === socket.id) userSockets.delete(uid)
    })
  })
})

// Хелпер: надіслати сповіщення конкретному юзеру
export const notifyUser = (userId: number, event: string, data: unknown): void => {
  const socketId = userSockets.get(userId)
  if (socketId) {
    io.to(socketId).emit(event, data)
  }
}

// ─── Express middleware ───────────────────────────────────
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/jobs',         jobsRoutes)
app.use('/api/applications', applicationsRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler — завжди останнім
app.use(errorHandler)

// ─── Start ───────────────────────────────────────────────
httpServer.listen(config.port, () => {
  console.log(`✅ HireHub API running on http://localhost:${config.port}`)
  console.log(`📡 WebSocket ready`)
  console.log(`🌍 Environment: ${config.nodeEnv}`)
})
