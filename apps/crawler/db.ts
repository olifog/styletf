import { Collection, MongoClient, Db } from "mongodb";
import 'dotenv/config'

export const collections: { players?: Collection } = {}

export async function connectToDatabase () {
  const client: MongoClient = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db: Db = client.db(process.env.DB_NAME)
  const playersCollection: Collection = db.collection(process.env.PLAYERS_COLLECTION_NAME)

  collections.players = playersCollection
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${playersCollection.collectionName}`)
}
