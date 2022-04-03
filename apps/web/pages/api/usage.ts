import { PlayerModel } from 'models/Player'
import dbConnect from 'lib/dbConnect'
import { NextApiRequest, NextApiResponse } from 'next'
import { PipelineStage } from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const total = await PlayerModel.count({})

  let limit: number

  if (typeof req.query.limit === 'undefined') {
    limit = 25
  } else {
    limit = parseInt(req.query.limit as string)
  }
  
  const aggregate: PipelineStage[] = [{ $unwind: { path: '$items' } }]

  const match = {}

  if (typeof req.query.slot !== 'undefined') {
    match['items.slot'] = parseInt(req.query.slot as string)
  }

  if (typeof req.query.class !== 'undefined') {
    if (req.query.class === 'cosmetic' || req.query.class === 'taunt') {
      match['items.class'] = req.query.class
    } else {
      match['items.class'] = parseInt(req.query.class as string)
    }
  }

  if (typeof req.query.active !== 'undefined') {
    match['active'] = (req.query.active === 'true')
  }

  aggregate.push({ $match: match })
  aggregate.push({ $sortByCount: '$items.defindex' })

  if (limit > 0) {
    aggregate.push({ $limit: limit })
  }

  aggregate.push({ $set: { usage: { $divide: ["$count", total] } } })

  const result = await PlayerModel.aggregate(aggregate)

  res.status(200).json(result)
}