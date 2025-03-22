import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

export const getPlayerStats = async (PUUID) => {
  try {
    const response = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${PUUID}`,
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
