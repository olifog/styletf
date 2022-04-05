import { UsageModel } from '../../models/Usage'
import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../lib/dbConnect'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const queryFilter: {
    active: boolean | number,
    minutesThreshold: number,
    class: number,
    slot: number | 'cosmetic' | 'taunt'
  } = {
    active: -1,
    minutesThreshold: 0,
    class: -1,
    slot: -1
  }

  if (typeof req.query.active !== 'undefined' && req.query.active !== '-1') {
    queryFilter.active = (req.query.active === 'true')
  }
  if (typeof req.query.minutesThreshold === 'string') {
    queryFilter.minutesThreshold = parseInt(req.query.minutesThreshold)
  }
  if (typeof req.query.class === 'string' && req.query.class !== '-1') {
    queryFilter.class = parseInt(req.query.class)
  }
  if (typeof req.query.slot === 'string' && req.query.slot !== '-1') {
    if (req.query.slot === 'cosmetic' || req.query.slot === 'taunt') {
      queryFilter.slot = req.query.slot
    } else {
      queryFilter.slot = parseInt(req.query.slot)
    }
  }

  const order = (typeof req.query.order === 'string') ? parseInt(req.query.order) : -1
  const limit = (typeof req.query.limit === 'string') ? parseInt(req.query.limit) : 25
  
  const items = await UsageModel.find(queryFilter).sort({"usage": order}).limit(limit)

  res.status(200).json(items.map(item => ({
    defindex: item.defindex,
    usage: item.usage,
    name: item.name,
    imageUrl: item.imageUrl,
    usedByClasses: item.usedByClasses
  })))
}