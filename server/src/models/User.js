import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, trim: true }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
