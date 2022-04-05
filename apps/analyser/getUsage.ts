import { PlayerModel, SchemaItemModel } from "styletf"
import { PipelineStage } from 'mongoose'

interface PlayerQuery {
  active?: boolean,
  minutesPlayed?: { $gt: number },
  "items.class"?: number,
  "items.slot"?: number | 'cosmetic' | 'taunt'
}


const itemAggregation = (preUnwindMatch: object, postUnwindMatch: object) => [
  {$match: preUnwindMatch},
  {$setWindowFields: {
    output: {
      total: {
        $count: {}
      }
    }
  }},
  {$unwind: {
    path: '$items'
  }},
  {$match: postUnwindMatch},
  {$group: {
    _id: '$items.defindex',
    count: {
      $count: {}
    },
    total: {
      $first: '$total'
    }
  }},
  {$lookup: {
    from: 'schemaitems',
    localField: '_id',
    foreignField: 'defindex',
    as: 'schemaitem'
  }},
  {$unwind: {
    path: '$schemaitem'
  }},
  {$project: {
    defindex: '$_id',
    _id: 0,
    usage: {
      $divide: [
        '$count',
        {
          $multiply: [
            '$total',
            {
              $size: "$schemaitem.usedByClasses"
            }
          ]
        }
      ]
    },
    name: "$schemaitem.name",
    imageUrl: "$schemaitem.imageUrl",
    usedByClasses: "$schemaitem.usedByClasses"
  }
}]


const getUsage = async (
  opts: {
    active?: boolean,
    minutesThreshold?: number,
    class?: number,
    slot?: number | 'cosmetic' | 'taunt'
  }
) => {
  const preMatch: PlayerQuery = {}
  const postMatch: PlayerQuery = {}

  if (typeof opts.active !== 'undefined') preMatch.active = true
  if (typeof opts.minutesThreshold !== 'undefined') preMatch.minutesPlayed = { $gt: opts.minutesThreshold }
  if (typeof opts.class !== 'undefined') postMatch["items.class"] = opts.class
  if (typeof opts.slot !== 'undefined') postMatch["items.slot"] = opts.slot

  const itemData = {
    active: -1,
    minutesThreshold: 0,
    class: -1,
    slot: -1,
    ...opts
  }

  // individual stats
  await PlayerModel.aggregate([
    ...itemAggregation(preMatch, postMatch),
    {$set: itemData},
    {$merge: {
      into: 'usages',
      on: ['defindex', 'active', 'minutesThreshold', 'class', 'slot'],
      whenMatched: "replace"
    }}
  ], { allowDiskUse: true })
}

export default getUsage