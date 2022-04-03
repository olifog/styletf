import fetch from 'node-fetch'

interface Game {
  appid: number,
  playtime_forever: number,
  playtime_2weeks?: number,
  playtime_windows_forever: number,
  playtime_mac_forever: number,
  playtime_linux_forever: number
}

interface GetOwnedGamesResponse {
  response: {
    game_count?: number,
    games?: Game[]
  }
}

const getActivity = async (steamid: string): Promise<[boolean, number]> => {
  const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.API_KEY}&steamid=${steamid}&include_played_free_games=true`)
  const games: GetOwnedGamesResponse = await response.json() as GetOwnedGamesResponse

  if (games.response.games == undefined) throw TypeError

  const filteredGames = games.response.games.map(x => x.appid)
  const ind = filteredGames.indexOf(440)
  const tf2 = games.response.games[ind]

  return [
    (tf2.playtime_2weeks != undefined && tf2.playtime_2weeks > 0),
    tf2.playtime_forever
  ]
}

export default getActivity
