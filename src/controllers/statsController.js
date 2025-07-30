import { getPlayerPUUID, getMatchIds, getMatchDetails } from "../services/riotService.js";
import { logger } from "../logger.js";
import { getPlayerFromDB} from "../services/playerService.js";



export const getStats = async (req, res) => {
  const { region, name, tagline } = req.params;
  const count = req.query.count;
  try {

    res.json({
      test: "test"
    });
    
  } catch (error) {
    logger.error(`Error fetching match IDs: ${error.message}`);
    res.status(500).json({ error: "Could not fetch match IDs" });
  }
};