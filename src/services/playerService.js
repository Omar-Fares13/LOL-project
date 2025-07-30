import pool from "../db.js"; 
import { getPlayerPUUID, getPlayerStats } from "./riotService.js";




export const getPlayerFromDB = async (region, name, tagline) => {
  const { rows } = await pool.query("SELECT * FROM players WHERE region = $1 AND summoner_name = $2 AND tagline = $3", [region.toLowerCase(), name.toLowerCase(), tagline.toLowerCase()]);
  return rows[0] || null;
};


export const getPlayerByPUUID = async (puuid) => {
  const { rows } = await pool.query(
    "SELECT * FROM players WHERE puuid = $1",
    [puuid]
  );
  return rows[0] || null;
};



export const savePlayerToDB = async (puuid, region, name, tagline, stats) => {
  // Safely extract the queues using `.find()`
  const soloQueue = stats.find(q => q.queueType === "RANKED_SOLO_5x5");
  const flexQueue = stats.find(q => q.queueType === "RANKED_FLEX_SR");

  await pool.query(`
    INSERT INTO players (puuid, region, summoner_name, tagline, solo_tier, solo_rank, solo_lp, flex_tier, flex_rank, flex_lp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (puuid) DO UPDATE SET
      region = EXCLUDED.region,
      summoner_name = EXCLUDED.summoner_name,
      tagline = EXCLUDED.tagline,
      solo_tier = EXCLUDED.solo_tier,
      solo_rank = EXCLUDED.solo_rank,
      solo_lp = EXCLUDED.solo_lp,
      flex_tier = EXCLUDED.flex_tier,
      flex_rank = EXCLUDED.flex_rank,
      flex_lp = EXCLUDED.flex_lp,
      last_updated = NOW();
  `, [
    puuid, region.toLowerCase(), name.toLowerCase(), tagline.toLowerCase(),
    soloQueue?.tier || null, soloQueue?.rank || null, soloQueue?.leaguePoints || null,
    flexQueue?.tier || null, flexQueue?.rank || null, flexQueue?.leaguePoints || null
  ]);
};


export const getPlayerFromRiot = async (region, name, tagline) => {

      const player = await getPlayerFromDB(region, name, tagline);
      var puuid = null;
      if (!player) {
        puuid = getPlayerPUUID(region,name,tagline);
      }
      puuid = player.puuid;
      // fetch from Riot API
      const stats = await getPlayerStats(region, puuid);
      if (!stats) return null;

      return {puuid, stats};
};