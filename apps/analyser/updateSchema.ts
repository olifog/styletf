
import { SchemaItemModel } from 'styletf'
import getWebSchema from "./getWebSchema.js"
import * as VDF from 'vdf-parser'
import fetch from 'node-fetch'


interface ClientSchema {
  items_game: {
    items: {
      [defindex: string]: {
        equip_region?: string | object,
        prefab?: string,
        craft_class: string
      }
    }
  }
}

const allClasses = ['Scout', 'Soldier', 'Pyro', 'Demoman', 'Heavy', 'Engineer', 'Medic', 'Sniper', 'Spy']

const parseName = (name: string) => name

const parseClasses = (classes: string[], name: string) => {
  if (typeof classes == 'undefined') {
    return allClasses
  }
  return classes
}

const parseEquipRegion = (equipRegion: string | object | undefined, prefab: string | undefined, craftClass: string) => {
  if (typeof equipRegion === 'undefined') {
    if (craftClass === 'weapon' || typeof prefab === 'undefined' || prefab.includes('weapon')) {
      return ['melee']
    } else {
      return prefab.split(' ').filter(e => e !== 'valve')
    }
  }
  if (typeof equipRegion === 'string') return [equipRegion]

  return Object.keys(equipRegion)
}


const updateSchema = async () => {
  const [schema, clientSchemaUrl] = await getWebSchema()

  const response = await fetch(clientSchemaUrl)
  const vdfData = await response.text()

  const clientSchema = VDF.parse(vdfData) as ClientSchema

  for (const defindex in schema) {
    const newDoc = {
      defindex: defindex,
      name: parseName(schema[defindex].name),
      imageUrl: schema[defindex].image_url,
      equipRegion: parseEquipRegion(clientSchema.items_game.items[defindex].equip_region, clientSchema.items_game.items[defindex].prefab, clientSchema.items_game.items[defindex].craft_class),
      usedByClasses: parseClasses(schema[defindex].used_by_classes, schema[defindex].name)
    }

    await SchemaItemModel.findOneAndUpdate({ defindex: defindex }, newDoc, { upsert: true })
  }
}

export default updateSchema
