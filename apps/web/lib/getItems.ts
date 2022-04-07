import { dbConnect } from 'lib/dbConnect'
import { UsageModel } from '../models/Usage'

export interface QueryFilter {
  active: boolean | number,
  minutesThreshold: number,
  class: number,
  slot: number | 'cosmetic' | 'taunt'
} 

export const getItems = async (query: QueryFilter, {limit = 25, order = -1} = {}) => {
  await dbConnect()
  const items = await UsageModel.find(query).sort({"usage": order}).limit(limit)
  return items.map(item => ({
    defindex: item.defindex,
    usage: item.usage,
    name: item.name,
    imageUrl: item.imageUrl,
    usedByClasses: item.usedByClasses
  }))
}