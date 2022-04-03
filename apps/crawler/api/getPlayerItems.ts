import fetch from 'node-fetch'

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


interface EquipData {
  class: number,
  slot: number
}

interface Item {
  defindex: number,
  equipped?: EquipData[]
}

export interface FilteredItem {
  defindex: number
  class: number
  slot: number | 'cosmetic' | 'taunt'
}

interface GetPlayerItemsResponse {
  result: {
    status: 1 | 8 | 15 | 18,
    items?: Item[]
  }
}

const getPlayerItems = async (steamid: string) => {
  const response = await fetch(`http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
  const items: GetPlayerItemsResponse = await response.json() as GetPlayerItemsResponse

  if (items.result.items == undefined) throw TypeError

  const equipped = items.result.items.reduce((out: FilteredItem[], item) => {
    if (item.equipped == undefined) {
      return out
    }

    const values: FilteredItem[] = []

    for (const equip of item.equipped) {
      if (equip.slot === 9) continue

      const slot = equip.slot < 7
        ? equip.slot
        : equip.slot < 11
          ? 'cosmetic'
          : 'taunt'
      
          values.push({
            defindex: item.defindex,
            class: equip.class,
            slot: slot
          })
    }

    return [...out, ...values]
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

export default getPlayerItems
