import { getPlayerStats } from "../services/riotService.js";

export const fetchPlayer = async (req, res) => {
  const { PUUID } = req.params;
  const playerStats = await getPlayerStats(PUUID);

  if (!playerStats) return res.status(404).json({ error: "Player not found" });

  res.json({
    id: playerStats.id,
    name: playerStats.name,
    level: playerStats.summonerLevel,
  });
};
