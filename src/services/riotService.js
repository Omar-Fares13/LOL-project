import axios from "axios";
import dotenv from "dotenv";
import { regionRouterMap } from "../regionMap.js";

dotenv.config();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

export const getPlayerStats = async (region, PUUID) => {
  try {

    const accountRegion = regionRouterMap[region];
    if (!accountRegion) throw new Error("Invalid region");

    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${PUUID}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );
    //console.log("Fetched stats:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching player stats:", error.message);
    return null;
  }
};

export const getPlayerPUUID = async (region, name, tagline) => {
  try{

    const accountRegion = regionRouterMap[region];
    if (!accountRegion) throw new Error("Invalid region");

    const response = await axios.get(
      `https://${accountRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );
    //console.log("fetched puuid data: " , response);
    return response.data.puuid;
  }catch (error){
    console.log("Error getting player PUUID:", error.message)
    return null;
  }
};
