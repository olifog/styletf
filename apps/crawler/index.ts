import 'dotenv/config'
import fetch from 'node-fetch'
import { connectToDatabase, collections } from './db.js'

await connectToDatabase()

let queue = [process.env.START_STEAMID]
const seen: string[] = []


// default defindex values for stock items, since they do not show up in backpack
// (class number from WebAPI - 1) is the index of the class
// 7 slots, '-1' for N/A, since engineer/spy have extra slots
const stockItems = [
  [13, 23, 0, -1, -1, -1, -1], // scout
  [14, 16, 3, -1, -1, -1, -1], // sniper
  [18, 10, 6, -1, -1, -1, -1], // soldier
  [19, 20, 1, -1, -1, -1, -1], // demoman
  [17, 29, 8, -1, -1, -1, -1], // medic
  [15, 11, 5, -1, -1, -1, -1], // heavy
  [21, 12, 2, -1, -1, -1, -1], // pyro
  [-1, 24, 4, 27, 735, -1, 30], // spy
  [9, 22, 7, 25, 26, 28, -1], // engineer
]


const getPlayerItems = async (steamid) => {
  const response = await fetch(`http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
  const items = await response.json()

  const equipped = items.result.items.reduce((out, item) => {
    if (typeof item.equipped !== 'undefined') {
      return [...out, 
        ...item.equipped.reduce((final, i) => {
          if (i.slot === 9) { return final }

          const slot = i.slot < 7
            ? i.slot
            : i.slot < 11
              ? 'cosmetic'
              : 'taunt'
          
          return [...final, {
            defindex: item.defindex,
            class: i.class,
            slot: slot
          }]
        }, [])
      ]
    } else {
      return out
    }
  }, [])

  // add stock weapons
  for (let classNum = 0; classNum < 9; classNum++) {
    for (let slotNum=0; slotNum < 7; slotNum++) {
      if (equipped.filter(e => e.class === classNum + 1 && e.slot === slotNum).length === 0 && !(stockItems[classNum][slotNum] === -1)) {
        equipped.push({
          defindex: stockItems[classNum][slotNum],
          class: classNum + 1,
          slot: slotNum
        })
      }
    }
  }

  return equipped
}

const getActive = async (steamid) => {
  const response = await fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
  const games = await response.json()

  const filteredGames = games.response.games.map(x => x.appid)

  return filteredGames.includes(440)
}

const updateQueue = async (steamid) => {
  const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
  const friends = await response.json()

  friends.friendslist.friends.forEach(friend => {
    if (!(seen.includes(friend.steamid))) {
      queue.push(friend.steamid)
    }
  })
}


const nextSteamID = async () => {
  if (queue.length === 0) return

  let steamid = queue.shift()
  while (seen.includes(steamid)) {
    steamid = queue.shift()
  }
  
  seen.push(steamid)
  console.log(steamid)

  let ratelimitAdjustment = 1000
  let start = Date.now()

  try {
    // item equip data
    const equipped = await getPlayerItems(steamid)

    // player active?
    let active = false
    ratelimitAdjustment += 1000
    try {
      active = await getActive(steamid)
    } catch (Error) {}

    // add to database
    await collections.players?.replaceOne({steamid: steamid}, {
      steamid: steamid,
      active: active,
      items: equipped
    }, {
      upsert: true
    })
    console.log('insert')

    // now populate friends queue
    ratelimitAdjustment += 1000
    await updateQueue(steamid)
  } catch (TypeError) {}

  let elapsed = Date.now() - start
  setTimeout(nextSteamID, Math.max(ratelimitAdjustment - elapsed, 0))
}

await nextSteamID()
