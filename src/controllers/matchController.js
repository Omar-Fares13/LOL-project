import { getMatchIds, getMatchDetails } from "../services/matchService.js";
import { getPlayerPUUID } from "../services/riotService.js";
import { logger } from "../logger.js";
import { getPlayerFromDB} from "../services/playerService.js";



export const getMatchIdsController = async (req, res) => {
  const { region, name, tagline } = req.params;
  try {

    const player = await getPlayerFromDB(region,name, tagline);
    var puuid = null;
    if(player){
      puuid = player.puuid;
      logger.info(`puuid: ${puuid} served from data base for match ids`)
    }else{
          puuid = await getPlayerPUUID(region, name, tagline);
          logger.info(`puuid: ${puuid} served from Riot API for match ids`)
    }
    const matchIds = await getMatchIds(region,puuid);
    logger.info(`Fetched match IDs for ${puuid}`);
    res.json(matchIds);
  } catch (error) {
    logger.error(`Error fetching match IDs: ${error.message}`);
    res.status(500).json({ error: "Could not fetch match IDs" });
  }
};

export const getMatchDetailsController = async (req, res) => {
  const { region, matchID } = req.params;

  try{

    const matchDetails = await getMatchDetails(region, matchID);
    logger.info(`Fetched match Details for ${matchID}`);
    res.json(matchDetails);

  }catch(error){
    logger.error(`Error fetching match Details: ${error.message}`);
    res.status(500).json({ error: "Could not fetch match Details" });
  }

};