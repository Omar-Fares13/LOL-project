import { getPlayerStats, getPlayerPUUID } from "../services/riotService.js";
import { getPlayerFromDB, savePlayerToDB } from "../services/playerService.js";

export const fetchPlayer = async (req, res) => {
  const { name, tagline } = req.params;

  try {
    const puuid = await getPlayerPUUID(name, tagline);
    if (!puuid) return res.status(404).json({ error: "Player not found" });

    // Check DB first
    const cachedPlayer = await getPlayerFromDB(puuid);
    if (cachedPlayer) {
      return res.json({
        solo_duo_rank: cachedPlayer.solo_rank,
        solo_duo_tier: cachedPlayer.solo_tier,
        solo_duo_lp: cachedPlayer.solo_lp,
        flex_rank: cachedPlayer.flex_rank,
        flex_tier: cachedPlayer.flex_tier,
        flex_lp: cachedPlayer.flex_lp,
        cached: true
      });
    }

    // Not in DB, fetch from Riot API
    const stats = await getPlayerStats(puuid);
    if (!stats) return res.status(404).json({ error: "Could not fetch stats" });

    // Save to DB
    await savePlayerToDB(puuid, name, tagline, stats);
    res.json({
    solo_duo_rank: `${stats[1].rank} `,
    solo_duo_tier: `${stats[1].tier}`,
    solo_duo_lp: `${stats[1].leaguePoints}`,
    flex_rank: `${stats[0].rank} `,
    flex_tier: `${stats[0].tier} `,
    flex_lp: `${stats[0].leaguePoints}`,
    cached: false
    });

  } catch (error) {
    console.error("fetchPlayer error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
