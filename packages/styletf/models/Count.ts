import mongoose from 'mongoose'


const ItemWithUsage = new mongoose.Schema({
  defindex: Number,
  usage: Number,
  name: String,
  usedByClasses: [String],
  imageUrl: String
})

const Count = new mongoose.Schema({
  active: Boolean,
  minutesThreshold: Number,
  class: Number,
  slot: mongoose.Schema.Types.Mixed,
  items: [ItemWithUsage]
})

export const CountModel = mongoose.models.Count || mongoose.model('Count', Count)
