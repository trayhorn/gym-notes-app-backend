import express from 'express'
import { ctrl } from '../controllers/authController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { validateJoi } from '../middlewares/validateJoi.js'
import { authSchema, resetPasswordSchema } from '../models/User.js'

const router = express.Router()

router.post('/register', validateJoi(authSchema), ctrl.register)

router.post('/login', ctrl.login)

router.post('/logout', authenticate, ctrl.logout)

router.get('/current', authenticate, ctrl.current)

router.post('/verify-email', ctrl.verifyEmail)

router.post('/request-password-reset', ctrl.requestPasswordReset)

router.patch(
  '/reset-password',
  validateJoi(resetPasswordSchema),
  ctrl.resetPassword
)

export default router
