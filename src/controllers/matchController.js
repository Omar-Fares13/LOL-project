import { logger } from "../logger.js";
import { getMatchesFromDB, getUpdatedMatches } from "../services/matchService.js";

export const getMatches = async (req, res) => {
  const { region, name, tagline } = req.params;
  const count = parseInt(req.query.count) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const force = req.query.force === "true";

  try {
    logger.info(`Incoming request for matches of ${name}#${tagline} [${region}], force=${force}`);

    if (!force) {
      const cachedMatches = await getMatchesFromDB(region, name, tagline, count, offset);

      if (cachedMatches && cachedMatches.length > 0) {
        const now = new Date();
        const lastUpdate = new Date(cachedMatches[0].last_fetched || 0);
        const diff = (now - lastUpdate) / 86400000;

        if (diff < 3) {
          logger.info(`Cache HIT for ${name}#${tagline} [${region}], updated ${diff.toFixed(2)} days ago`);

          return res.json({
            cached: true,
            matches: cachedMatches
          });
        } else {
          logger.info(`Cache STALE for ${name}#${tagline} [${region}], updated ${diff.toFixed(2)} days ago`);
        }
      } else {
        logger.info(`Cache MISS for ${name}#${tagline} [${region}]`);
      }
    } else {
      logger.info(`Force refresh triggered for ${name}#${tagline} [${region}]`);
    }

    // Fetch and update data
    const matches = await getUpdatedMatches(region, name, tagline, count, offset);

    if (!matches || matches.length === 0) {
      logger.warn(`No matches found for ${name}#${tagline} [${region}]`);
      return res.status(404).json({ error: "Could not fetch matches" });
    }

    logger.info(`Fetched and saved ${matches.length} matches for ${name}#${tagline} [${region}]`);

    return res.json({
      cached: false,
      matches
    });

  } catch (error) {
    logger.error(`Error getting matches for ${name}#${tagline} [${region}]: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
