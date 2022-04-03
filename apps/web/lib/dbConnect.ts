import mongoose from 'mongoose'

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
}

export default dbConnect
