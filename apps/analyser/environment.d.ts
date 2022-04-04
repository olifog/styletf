declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string,
      MONGODB_URI: string,
      DB_NAME: string,
      PLAYERS_COLLECTION_NAME: string,
      START_STEAMID: string
    }
  }
}

export {}