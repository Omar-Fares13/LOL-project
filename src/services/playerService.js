import pool from "../db.js"; 
import { getPlayerPUUID, getPlayerStats } from "./riotService.js";
export const getPlayerFromDB = async (region, name, tagline) => {
  const { rows } = await pool.query("SELECT * FROM players WHERE region = $1 AND summoner_name = $2 AND tagline = $3", [region, name, tagline]);
  return rows[0] || null;
};

export const savePlayerToDB = async (puuid, region, name, tagline, stats) => {

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
    puuid, region, name, tagline,
    stats[1].tier || null, stats[1].rank || null, stats[1].leaguePoints || null,
    stats[0].tier || null, stats[0].rank || null, stats[0].leaguePoints || null
  ]);
};

export const getPlayerFromRiot = async (region, name, tagline) => {

      const puuid = await getPlayerPUUID(region, name, tagline);
      if (!puuid) return res.status(404).json({ error: "Player not found" });

      // fetch from Riot API
      const stats = await getPlayerStats(region, puuid);
      if (!stats) return res.status(404).json({ error: "Could not fetch stats" });

      return {puuid, stats};
};