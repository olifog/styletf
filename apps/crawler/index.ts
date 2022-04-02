import 'dotenv/config'
import fetch from 'node-fetch'
import { connectToDatabase, collections } from './db.js'

await connectToDatabase()

let queue = ["76561198339551457"]
const seen: string[] = []

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

while (true) {
  await delay(2000)
  const steamid = queue.shift()

  if (steamid === undefined) {
    break
  }
  
  if (steamid in seen) {
    continue
  }

  console.log(steamid)

  seen.push(steamid)

  fetch(`http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`).then(
    async (response) => {
      const items = await response.json()

      try {
        const equipped = items.result.items.reduce((out, item) => {
          if (typeof item.equipped !== 'undefined') {
            return [...out, {
              defindex: item.defindex,
              equipped: item.equipped
            }]
          } else {
            return out
          }
        }, [])
    
        await collections.players?.replaceOne({steamid: steamid}, {
          steamid: steamid,
          items: equipped
        }, {
          upsert: true
        })
        console.log('insert')

        response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
        const friends = await response.json()
      
        friends.friendslist.friends.forEach(friend => {
          if (!(friend.steamid in seen)) {
            queue.push(friend.steamid)
          }
        })
      } catch (TypeError) {
        return
      }
    }
  )
}