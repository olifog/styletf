import mongoose from 'mongoose'

const Usage = new mongoose.Schema({
  defindex: Number,
  name: String,
  usedByClasses: [String],
  imageUrl: String,
  usage: Number,
  active: mongoose.Schema.Types.Mixed,
  minutesThreshold: Number,
  class: Number,
  slot: mongoose.Schema.Types.Mixed
})

export const UsageModel = mongoose.models.Usage || mongoose.model('Usage', Usage)
