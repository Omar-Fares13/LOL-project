import { getPlayerStats , getPlayerPUUID } from "../services/riotService.js";

export const fetchPlayer = async (req, res) => {
  const { name , tagline } = req.params;
  const PUUID = await getPlayerPUUID(name , tagline);
  const playerStats = await getPlayerStats(PUUID);

  if (!playerStats) return res.status(404).json({ error: "Player not found" });

  res.json({
    solo_duo_rank: `${playerStats[1].tier} ${playerStats[1].rank}`,
    flex_rank: `${playerStats[0].tier} ${playerStats[0].rank}`,
  });
};
