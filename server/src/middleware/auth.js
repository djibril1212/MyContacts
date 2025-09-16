import { verifyToken } from '../utils/jwt.js'

export function requireAuth (req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}