import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { signToken } from '../utils/jwt.js'

const router = Router()

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 chars'),
    body('name').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password, name } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hashed = await hashPassword(password)
    const user = await User.create({ email, password: hashed, name })

    const token = signToken({ sub: user._id, email: user.email })
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } })
  }
)

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await comparePassword(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken({ sub: user._id, email: user.email })
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  }
)

export default router
