import fetch from 'node-fetch'

interface Friend {
  steamid: string,
  relationship: string,
  friend_since: number
}

interface GetFriendListResponse {
  friendslist: {
    friends: Friend[]
  }
}

const getFriendList = async (steamid: string): Promise<Friend[]> => {
  const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.API_KEY}&steamid=${steamid}`)
  const responseJson = await response.json() as GetFriendListResponse
  return responseJson.friendslist.friends
}

export default getFriendList
