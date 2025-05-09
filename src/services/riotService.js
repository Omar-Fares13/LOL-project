import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

export const getPlayerStats = async (PUUID) => {
  try {
    const response = await axios.get(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${PUUID}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching player stats:", error.message);
    return null;
  }
};

export const getPlayerPUUID = async (name, tagline) => {
  try{
    const response = await axios.get(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );
    return response.data.puuid;
  }catch (error){
    console.log("Error getting player PUUID:", error.message)
    return null;
  }
};
