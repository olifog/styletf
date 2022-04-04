import mongoose from 'mongoose'

const SchemaItem = new mongoose.Schema({
  defindex: {type: Number, required: true},
  name: {type: String, required: true},
  usedByClasses: {type: [String], required: true},
  imageUrl: {type: String, required: true},
  equipRegion: [String]
})

export const SchemaItemModel = mongoose.models.SchemaItem || mongoose.model('SchemaItem', SchemaItem)
