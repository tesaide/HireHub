import { Router } from 'express'
import { AuthController } from '../controllers/auth'

const router = Router()
const ctrl = new AuthController()

// POST /api/auth/register
router.post('/register', ctrl.register)

// POST /api/auth/login
router.post('/login', ctrl.login)

// GET /api/auth/me  (захищений роут)
router.get('/me', ctrl.me)

export default router
