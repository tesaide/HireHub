import { Router } from 'express'
import { ApplicationsController } from '../controllers/applications'
import { authMiddleware, requireRole } from '../middleware/auth'

const router = Router()
const ctrl = new ApplicationsController()

// Seeker: відправити відгук
router.post('/',     authMiddleware, requireRole('seeker'),   ctrl.apply)

// Seeker: мої відгуки
router.get('/my',    authMiddleware, requireRole('seeker'),   ctrl.getMine)

// Employer: відгуки на свою вакансію
router.get('/job/:jobId', authMiddleware, requireRole('employer'), ctrl.getByJob)

// Employer: змінити статус відгуку
router.patch('/:id/status', authMiddleware, requireRole('employer'), ctrl.updateStatus)

export default router
