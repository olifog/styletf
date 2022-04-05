import 'dotenv/config'
import getPlayerItems from './api/getPlayerItems.js'
import getActivity from './api/getActivity.js'
import getFriendList from './api/getFriendList.js'
import { dbConnect, PlayerModel } from 'styletf'
import { UpdateQuery } from 'mongoose'


await dbConnect()

let queue: string[] = []
const seen: string[] = []

const updateQueue = async (steamid: string): Promise<void>=> {
  const friends = await getFriendList(steamid)

  friends.forEach(friend => {
    if (!(seen.includes(friend.steamid))) {
      queue.push(friend.steamid)
      if (queue.length > 10000) {
        queue.shift()
      }
    }
  })
}


const nextSteamID = async () => {
  let steamid: string
  do {
    if (queue.length === 0) queue = [process.env.START_STEAMID]
    steamid = queue.shift() as string
  } while (seen.includes(steamid))
  
  seen.push(steamid)
  console.log(steamid)

  if (seen.length > 10000) {
    seen.shift()
  }

  let ratelimitAdjustment = 1000
  let start = Date.now()

  try {
    // item equip data
    const equipped = await getPlayerItems(steamid)

    // player activity
    let active: boolean | undefined = undefined
    let minutesPlayed: number | undefined = undefined
    ratelimitAdjustment += 1000
    try {
      [active, minutesPlayed] = await getActivity(steamid)
    } catch (TypeError) {}

    // add to database
    const newDoc: UpdateQuery<any> = {
      steamid: steamid,
      items: equipped
    }

    if (active != undefined) newDoc.active = active
    if (minutesPlayed != undefined) newDoc.minutesPlayed = minutesPlayed

    await PlayerModel.findOneAndUpdate({ steamid: steamid },
      newDoc,
      { upsert: true}
    )

    // now populate friends queue
    ratelimitAdjustment += 1000
    await updateQueue(steamid)
  } catch (err) {}

  let elapsed = Date.now() - start
  setTimeout(nextSteamID, Math.max(ratelimitAdjustment - elapsed, 0))
}

await nextSteamID()
