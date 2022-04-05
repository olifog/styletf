
import { dbConnect, PlayerModel } from 'styletf'
import getUsage from "./getUsage.js"
import updateSchema from './updateSchema.js'


// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript/43053803#43053803
const cartesian = (...a: any[]) => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())))


const optionCombinations = [
  [true, undefined],
  [120000, undefined],
  [undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [undefined, 0, 1, 2, 3, 4, 5, 6, 'taunt', 'cosmetic']
]

let prevCount = -9999

const nextAnalysis = async () => {
  const total = await PlayerModel.countDocuments({})

  if (Math.abs(total - prevCount) > process.env.THRESHOLD_UPDATE) {
    prevCount = total
    console.log('updating usage data')

    for (const combination of cartesian(...optionCombinations)) {
      const parameters: {
        active?: boolean,
        minutesThreshold?: number,
        class?: number,
        slot?: number | 'taunt' | 'cosmetic'
      } = {}

      if (typeof combination[0] !== 'undefined') parameters.active = combination[0]
      if (typeof combination[1] !== 'undefined') parameters.minutesThreshold = combination[1]
      if (typeof combination[2] !== 'undefined') parameters.class = combination[2]
      if (typeof combination[3] !== 'undefined') parameters.slot = combination[3]

      await getUsage(parameters)
    }
  }

  setTimeout(nextAnalysis, 100000)
}


console.log('connecting to DB...')
await dbConnect()
console.log('connected.')

if (process.env.UPDATE_SCHEMA === 'true') {
  console.log('updating schema...')
  await updateSchema()
  console.log('updated schema.')
}

await nextAnalysis()
