import { Router } from 'express'
import { JobsController } from '../controllers/jobs'
import { authMiddleware, requireRole } from '../middleware/auth'

const router = Router()
const ctrl = new JobsController()

// Публічні роути
router.get('/',     ctrl.getAll)   // GET /api/jobs?city=Kyiv&minSalary=1000
router.get('/:id',  ctrl.getById)  // GET /api/jobs/1

// Тільки employer
router.post('/',         authMiddleware, requireRole('employer'), ctrl.create)
router.put('/:id',       authMiddleware, requireRole('employer'), ctrl.update)
router.delete('/:id',    authMiddleware, requireRole('employer'), ctrl.remove)

export default router
