import { getPlayerStats , getPlayerPUUID } from "../services/riotService.js";

export const fetchPlayer = async (req, res) => {
  const { name , tagline } = req.params;
  const PUUID = await getPlayerPUUID(name , tagline);
  const playerStats = await getPlayerStats(PUUID);

  if (!playerStats) return res.status(404).json({ error: "Player not found" });

  res.json({
    solo_duo_rank: `${playerStats[1].rank} `,
    solo_duo_tier: `${playerStats[1].tier}`,
    solo_duo_lp: `${playerStats[1].leaguePoints}`,
    flex_rank: `${playerStats[0].rank} `,
    flex_tier: `${playerStats[0].tier} `,
    flex_lp: `${playerStats[0].leaguePoints}`
  });
};
