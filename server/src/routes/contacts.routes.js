import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import Contact from '../models/Contact.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

function handleValidation (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
}

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user.sub }).sort({ createdAt: -1 })
    res.json({ items: contacts })
  } catch (e) { next(e) }
})

router.post(
  '/',
  [
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('phone').isString().isLength({ min: 10, max: 20 })
  ],
  async (req, res, next) => {
    try {
      const bad = handleValidation(req, res); if (bad) return
      const { firstName, lastName, phone } = req.body
      const contact = await Contact.create({ user: req.user.sub, firstName, lastName, phone })
      res.status(201).json(contact)
    } catch (e) { next(e) }
  }
)

router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('firstName').optional().isString().trim().notEmpty(),
    body('lastName').optional().isString().trim().notEmpty(),
    body('phone').optional().isString().isLength({ min: 10, max: 20 })
  ],
  async (req, res, next) => {
    try {
      const bad = handleValidation(req, res); if (bad) return
      const update = {}
      for (const k of ['firstName', 'lastName', 'phone']) if (k in req.body) update[k] = req.body[k]
      const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id, user: req.user.sub },
        { $set: update },
        { new: true, runValidators: true }
      )
      if (!contact) return res.status(404).json({ message: 'Contact not found' })
      res.json(contact)
    } catch (e) { next(e) }
  }
)

router.delete(
  '/:id',
  [param('id').isMongoId()],
  async (req, res, next) => {
    try {
      const bad = handleValidation(req, res); if (bad) return
      const result = await Contact.deleteOne({ _id: req.params.id, user: req.user.sub })
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Contact not found' })
      res.status(204).send()
    } catch (e) { next(e) }
  }
)

export default router
