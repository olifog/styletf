import 'dotenv/config'
import { connectToDatabase, collections } from './db.js'
import getPlayerItems, { FilteredItem } from './api/getPlayerItems.js'
import getActivity from './api/getActivity.js'
import getFriendList from './api/getFriendList.js'


await connectToDatabase()


const queue = [process.env.START_STEAMID]
const seen: string[] = []

const updateQueue = async (steamid: string): Promise<void>=> {
  const friends = await getFriendList(steamid)

  friends.forEach(friend => {
    if (!(seen.includes(friend.steamid))) {
      queue.push(friend.steamid)
    }
  })
}


interface PlayerSchema {
  steamid: string,
  items: FilteredItem[],
  active?: boolean,
  minutesPlayed?: number
}


const nextSteamID = async () => {
  let steamid: string
  do {
    if (queue.length === 0) return
    steamid = queue.shift() as string
  } while (seen.includes(steamid))
  
  seen.push(steamid)
  console.log(steamid)

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
    const newDoc: PlayerSchema = {
      steamid: steamid,
      items: equipped
    }

    if (active != undefined) newDoc.active = active
    if (minutesPlayed != undefined) newDoc.minutesPlayed = minutesPlayed
    
    await collections.players?.replaceOne({ steamid: steamid }, newDoc, { upsert: true })
    console.log('insert')

    // now populate friends queue
    ratelimitAdjustment += 1000
    await updateQueue(steamid)
  } catch (TypeError) {}

  let elapsed = Date.now() - start
  setTimeout(nextSteamID, Math.max(ratelimitAdjustment - elapsed, 0))
}

await nextSteamID()
