import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  register, login, me, logout, requestPasswordReset, confirmPasswordReset
} from '../controllers/AuthController.js'
import requireAuth from '../middleware/requireAuth.js'

// routeja

const router = Router()

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Liikaa pyyntöjä, yritä myöhemmin uudelleen' }
})

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)
router.post('/logout', logout)
router.post('/password-reset/request', resetLimiter, requestPasswordReset)
router.post('/password-reset/confirm', resetLimiter, confirmPasswordReset)

export default router
