import pool from "../db.js"; 

export const getPlayerFromDB = async (puuid) => {
  const { rows } = await pool.query("SELECT * FROM players WHERE puuid = $1", [puuid]);
  return rows[0] || null;
};

export const savePlayerToDB = async (puuid, name, tagline, stats) => {

  await pool.query(`
    INSERT INTO players (puuid, summoner_name, tagline, solo_tier, solo_rank, solo_lp, flex_tier, flex_rank, flex_lp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (puuid) DO UPDATE SET
      summoner_name = EXCLUDED.summoner_name,
      tagline = EXCLUDED.tagline,
      solo_tier = EXCLUDED.solo_tier,
      solo_rank = EXCLUDED.solo_rank,
      solo_lp = EXCLUDED.solo_lp,
      flex_tier = EXCLUDED.flex_tier,
      flex_rank = EXCLUDED.flex_rank,
      flex_lp = EXCLUDED.flex_lp;
  `, [
    puuid, name, tagline,
    stats[1].tier || null, stats[1].rank || null, stats[1].leaguePoints || null,
    stats[0].tier || null, stats[0].rank || null, stats[0].leaguePoints || null
  ]);
};
