import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'MyContacts API', version: '1.0.0' })
})

app.use('/api/auth', authRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

export default app
