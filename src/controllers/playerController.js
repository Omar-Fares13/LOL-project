import { getPlayerFromDB, savePlayerToDB, getPlayerFromRiot } from "../services/playerService.js";

export const fetchPlayer = async (req, res) => {
  const { region, name, tagline} = req.params;
  const force = req.query.force === "true";

  try {

    if(!force){
      // Check DB first
      const cachedPlayer = await getPlayerFromDB(region, name, tagline);
      if (cachedPlayer) {

        const now = new Date();
        const lastUpdate = new Date(cachedPlayer.last_updated);
        const diff = (now - lastUpdate) / 86400000;
        console.log(diff);
        if(diff < 1){
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
      }
    }
      // fetch from Riot API
      const { puuid, stats} = await getPlayerFromRiot(region, name, tagline);
      if (!stats) return res.status(404).json({ error: "Could not fetch stats" });

      // Save to DB
      await savePlayerToDB(puuid, region, name, tagline, stats);

      res.json({
      solo_duo_rank: `${stats[1].rank}`,
      solo_duo_tier: `${stats[1].tier}`,
      solo_duo_lp: `${stats[1].leaguePoints}`,
      flex_rank: `${stats[0].rank}`,
      flex_tier: `${stats[0].tier}`,
      flex_lp: `${stats[0].leaguePoints}`,
      cached: false
      });

  } catch (error) {
    console.error("fetchPlayer error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
