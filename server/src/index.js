import dotenv from 'dotenv'
import app from './server.js'
import { connectDB } from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 4000

async function bootstrap () {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`Swagger UI at http://localhost:${PORT}/api-docs`)
  })
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err)
  process.exit(1)
})
