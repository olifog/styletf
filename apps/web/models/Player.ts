import { Schema, model, models } from 'mongoose'

const EquippedItem = new Schema({
  defindex: { type: Number, required: true },
  class: { type: Number, required: true },
  slot: { type: String, required: true }
})

const Player = new Schema({
  steamid: { type: String, required: true },
  items: { type: [EquippedItem], required: true },
  active: Boolean
})

export const PlayerModel = models.Player || model('Player', Player)
