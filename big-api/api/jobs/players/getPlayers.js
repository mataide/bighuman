const axios = require('axios')

export const getPlayers = async () => {
  const url = `https://api.sleeper.app/v1/players/nfl`

  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
}
