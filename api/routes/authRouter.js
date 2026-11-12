import { Router } from 'express'
import { register, login, me, logout } from '../controllers/AuthController.js'
import requireAuth from '../middleware/requireAuth.js'

// routeja

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)
router.post('/logout', logout)

export default router
