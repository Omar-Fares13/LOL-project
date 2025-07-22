import axios from "axios";
import dotenv from "dotenv";
import { regionRouterMap } from "../regionMap.js";

dotenv.config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

export const getMatchIds = async (region, puuid, count = 20) => {

  const response = await axios.get(
    `https://${regionRouterMap[region]}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY },
      params: { start: 0, count }
    }
  );
  return response.data;
};
