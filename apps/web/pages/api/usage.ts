import { PlayerModel } from 'styletf'
import { NextApiRequest, NextApiResponse } from 'next'
import { PipelineStage } from 'mongoose'
import { dbConnect } from 'styletf'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  const schema = {}

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

  const result = await PlayerModel.aggregate(aggregate)

  const sanitised = result.map(item => {
    let classes: number
    const schemaItem = schema[item._id]
    if (schemaItem.used_by_classes == undefined) {
      classes = 9
    } else {
      classes = schemaItem.used_by_classes.length
    }

    return {
      defindex: item._id,
      count: item.count,
      name: schema[item._id].name,
      usage: item.count / (total * classes)  
    }
  })

  res.status(200).json(sanitised)
}