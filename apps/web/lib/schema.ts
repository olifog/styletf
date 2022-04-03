import fetch from 'node-fetch'

interface Item {
  name: string,
  defindex: number,
  image_url: string,
  used_by_classes: string[]
}

interface Schema {
  [defindex: number]: Item
}

interface GetSchemaItemsResponse {
  result: {
    status: 1,
    items: Item[],
    next?: number
  }
}

const schema: Schema = {}

const processNextResponse = async (start = 0): Promise<number | undefined> => {
  const response = await fetch(`https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key=${process.env.API_KEY}&start=${start}`)
  const responseItems = await response.json() as GetSchemaItemsResponse

  for (const item of responseItems.result.items) {
    schema[item.defindex] = item
  }

  return responseItems.result.next

}

const getSchema = async () => {
  if (Object.keys(schema).length === 0) {
    let next = await processNextResponse()

    while (next != undefined) {
      next = await processNextResponse(next)
    }
  }

  return schema
}

export default getSchema
