import { getMatchIds } from "../services/matchService.js";
import { getPlayerPUUID } from "../services/riotService.js";
import { logger } from "../logger.js";

export const getMatchIdsController = async (req, res) => {
  const { region, name, tagline } = req.params;
  try {
    const puuid = await getPlayerPUUID(region, name, tagline);
    const matchIds = await getMatchIds(region,puuid);
    logger.info(`Fetched match IDs for ${puuid}`);
    res.json(matchIds);
  } catch (error) {
    logger.error(`Error fetching match IDs: ${error.message}`);
    res.status(500).json({ error: "Could not fetch match IDs" });
  }
};
