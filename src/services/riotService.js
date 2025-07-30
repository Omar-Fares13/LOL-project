import axios from "axios";
import dotenv from "dotenv";
import { regionRouterMap } from "../regionMap.js";
import { logger } from "../logger.js";

dotenv.config();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

export const getPlayerStats = async (region, PUUID) => {
  try {
    const regionLower = region.toLowerCase();
    const accountRegion = regionRouterMap[regionLower];
    if (!accountRegion) throw new Error("Invalid region");

    const response = await axios.get(
      `https://${regionLower}.api.riotgames.com/lol/league/v4/entries/by-puuid/${PUUID}`,
      {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      }
    );

    return response.data;
  } catch (error) {
    logger.error("Error fetching player stats:", error.message);
    return null;
  }
};


export const getPlayerPUUID = async (region, name, tagline) => {
  try{

    const regionLower = region.toLowerCase();
    const accountRegion = regionRouterMap[regionLower];
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
    logger.log("Error getting player PUUID:", error.message)
    return null;
  }
};


export const getMatchIds = async (region, puuid, count = 20, offset = 0) => {
  try{
    const regionLower = region.toLowerCase();
    const accountRegion = regionRouterMap[regionLower];
    if (!accountRegion) throw new Error("Invalid region");

    const response = await axios.get(
    `https://${accountRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY },
      params: { start: offset, count }
    }
  );
  return response.data;
  }catch(error){
    logger.error("Error getting match ids: " , error.message)
    return null;
  }
};

export const getMatchDetails = async (region, matchID) => {
  try{
    const regionLower = region.toLowerCase();
    const accountRegion = regionRouterMap[regionLower];
    if (!accountRegion) throw new Error("Invalid region");

    const response = await axios.get(
    `https://${accountRegion}.api.riotgames.com/lol/match/v5/matches/${matchID}`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    }
  );
  return response.data;
  }catch(error){
    logger.error("Error gitting match details: ", error.message);
    return null;
  }
  
};