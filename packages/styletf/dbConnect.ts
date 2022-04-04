import mongoose from 'mongoose'
import 'dotenv/config'

export const dbConnect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
}
