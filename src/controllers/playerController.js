import { getPlayerStats , getPlayerPUUID } from "../services/riotService.js";

export const fetchPlayer = async (req, res) => {
  const { name , tagline } = req.params;
  const PUUID = await getPlayerPUUID(name , tagline);
  const playerStats = await getPlayerStats(PUUID);

  if (!playerStats) return res.status(404).json({ error: "Player not found" });

  res.json(playerStats);
};
