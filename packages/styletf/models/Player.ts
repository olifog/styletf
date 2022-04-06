import mongoose from 'mongoose'

const EquippedItem = new mongoose.Schema({
  defindex: { type: Number, required: true },
  class: { type: Number, required: true },
  slot: { type: mongoose.Schema.Types.Mixed, required: true }
})

const Player = new mongoose.Schema({
  steamid: { type: String, required: true },
  items: { type: [EquippedItem], required: true },
  active: Boolean,
  minutesPlayed: Number
})

export const PlayerModel = mongoose.models.Player || mongoose.model('Player', Player)
