import { getPlayerFromDB, savePlayerToDB, getPlayerFromRiot } from "../services/playerService.js";
import { logger } from "../logger.js";

export const fetchPlayer = async (req, res) => {
  const { region, name, tagline } = req.params;
  const force = req.query.force === "true";

  try {
    logger.info(`Incoming request for ${name}#${tagline} [${region}], force=${force}`);

    if (!force) {
      // Check DB first
      const cachedPlayer = await getPlayerFromDB(region, name, tagline);
      if (cachedPlayer) {
        const now = new Date();
        const lastUpdate = new Date(cachedPlayer.last_updated);
        const diff = (now - lastUpdate) / 86400000;

        if (diff < 1) {
          logger.info(`Cache HIT for ${name}#${tagline} [${region}], last updated ${diff.toFixed(2)} days ago`);

          return res.json({
            solo_duo_rank: cachedPlayer.solo_rank,
            solo_duo_tier: cachedPlayer.solo_tier,
            solo_duo_lp: cachedPlayer.solo_lp,
            flex_rank: cachedPlayer.flex_rank,
            flex_tier: cachedPlayer.flex_tier,
            flex_lp: cachedPlayer.flex_lp,
            cached: true
          });
        } else {
          logger.info(`Cache STALE for ${name}#${tagline} [${region}], last updated ${diff.toFixed(2)} days ago`);
        }
      } else {
        logger.info(`Cache MISS for ${name}#${tagline} [${region}]`);
      }
    } else {
      logger.info(`Force refresh triggered for ${name}#${tagline} [${region}]`);
    }

    // Fetch from Riot API
    const { puuid, stats } = await getPlayerFromRiot(region, name, tagline);

    if (!stats) {
      logger.warn(`No ranked stats found for ${name}#${tagline} [${region}]`);
      return res.status(404).json({ error: "Could not fetch stats" });
    }

    if (!puuid) {
      logger.warn(`PUUID not found for ${name}#${tagline} [${region}]`);
      return res.status(404).json({ error: "Could not fetch puuid" });
    }

    // Save to DB
    await savePlayerToDB(puuid, region, name, tagline, stats);
    logger.info(`Fetched and saved stats for ${name}#${tagline} [${region}]`);

    const soloQueue = stats.find(q => q.queueType === 'RANKED_SOLO_5x5');
    const flexQueue = stats.find(q => q.queueType === 'RANKED_FLEX_SR');

    res.json({
      solo_duo_rank: soloQueue?.rank || "UNRANKED",
      solo_duo_tier: soloQueue?.tier || "UNRANKED",
      solo_duo_lp: soloQueue?.leaguePoints ?? 0,

      flex_rank: flexQueue?.rank || "UNRANKED",
      flex_tier: flexQueue?.tier || "UNRANKED",
      flex_lp: flexQueue?.leaguePoints ?? 0,

      cached: false
    });

  } catch (error) {
    logger.error(`fetchPlayer error for ${name}#${tagline} [${region}]: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
