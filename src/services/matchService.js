import pool from "../db.js";
import { getPlayerByPUUID, savePlayerToDB, getPlayerFromDB } from "./playerService.js";
import { getPlayerStats, getMatchIds, getPlayerPUUID, getMatchDetails } from "./riotService.js"

/**
 * Saves match data into 'matches' and 'match_players' tables
 * @param {object} matchData - Full API response from Riot match endpoint
 */
export async function saveMatchData(matchData) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { metadata, info } = matchData;
    const match_id = metadata.matchId;

    // Check if match already exists to prevent duplicates
    const existing = await client.query(
      "SELECT 1 FROM matches WHERE match_id = $1",
      [match_id]
    );
    if (existing.rows.length > 0) {
      console.log(`Match ${match_id} already exists, skipping insert.`);
      await client.query("ROLLBACK");
      return;
    }

    // Determine winning team ID
    const winningTeam = info.teams.find(team => team.win === true)?.teamId;

    // Insert into matches table
    await client.query(
      `INSERT INTO matches (
        match_id, game_mode, queue_id, platform_id, game_duration,
        game_creation, game_end, map_id, win_team, last_fetched
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`,
      [
        match_id,
        info.gameMode,
        info.queueId,
        info.platformId,
        info.gameDuration,
        info.gameCreation,
        info.gameEndTimestamp,
        info.mapId,
        winningTeam || null
      ]
    );

    // Insert each participant into match_players
    for (const participant of info.participants) {
      const {
        puuid,
        teamId,
        championName,
        champLevel,
        summoner1Id,
        summoner2Id,
        perks,
        item0,
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
        kills,
        deaths,
        assists,
        kda,
        totalMinionsKilled,
        neutralMinionsKilled,
        goldEarned,
        visionScore,
        totalDamageDealtToChampions,
        win,
        role,
        lane,
        summonerLevel,
        riotIdGameName,
        riotIdTagline
      } = participant;
      
      const player = await getPlayerByPUUID(puuid);
      let stats = null;
      if (!player) {
        stats = await getPlayerStats(info.platformId.toLowerCase(), puuid);
        if (stats) {
          await savePlayerToDB(puuid, info.platformId.toLowerCase(), riotIdGameName, riotIdTagline, stats);
        }
      }

      const summonerSpells = [summoner1Id, summoner2Id];
      const items = [item0, item1, item2, item3, item4, item5, item6];

      const runes_primary = perks?.styles?.find(s => s.description === "primaryStyle") || {};
      const runes_secondary = perks?.styles?.find(s => s.description === "subStyle") || {};

      await client.query(
        `INSERT INTO match_players (
          match_id, puuid, team_id, champion_name, champ_level,
          summoner_spells, runes_primary, runes_secondary, items,
          kills, deaths, assists, kda, cs,
          gold_earned, vision_score, damage_dealt, win, role, lane
        ) VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,
          $10,$11,$12,$13,$14,
          $15,$16,$17,$18,$19,$20
        )`,
        [
          match_id,
          puuid,
          teamId,
          championName,
          champLevel,
          summonerSpells,
          runes_primary,
          runes_secondary,
          items,
          kills,
          deaths,
          assists,
          kda || (deaths === 0 ? kills + assists : (kills + assists) / deaths),
          totalMinionsKilled + neutralMinionsKilled,
          goldEarned,
          visionScore,
          totalDamageDealtToChampions,
          win,
          role,
          lane
        ]
      );

      await client.query(
        `UPDATE players
        SET level = $1
        WHERE puuid = $2`,
        [summonerLevel, puuid]
      );

    }
    await client.query("COMMIT");
    console.log(`Match ${match_id} and players inserted successfully.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving match data:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

export async function getMatchesFromDB(region, name, tagline, count = 20, offset = 0) {
  const player = await getPlayerFromDB(region, name, tagline);
  if (!player) return null;

  const puuid = player.puuid;

  // Step 1: Get your player's matches
  const matchResults = await pool.query(
    `
    SELECT
      m.match_id,
      m.game_mode,
      m.queue_id,
      m.platform_id,
      m.game_duration,
      m.game_creation,
      m.game_end,
      m.map_id,
      m.win_team,
      m.last_fetched,
      mp.champion_name,
      mp.runes_primary,
      mp.runes_secondary,
      mp.summoner_spells,
      mp.items,
      mp.kills,
      mp.deaths,
      mp.assists,
      mp.kda,
      mp.cs,
      mp.gold_earned,
      mp.vision_score,
      mp.damage_dealt,
      mp.win,
      mp.role,
      mp.lane
    FROM match_players mp
    JOIN matches m ON mp.match_id = m.match_id
    WHERE mp.puuid = $1
    ORDER BY m.game_creation DESC
    LIMIT $2 OFFSET $3
    `,
    [puuid, count, offset]
  );

  const matches = matchResults.rows;

  if (matches.length === 0) return [];

  // Step 2: Get all other players in those matches
  const matchIds = matches.map(row => row.match_id);
  const placeholders = matchIds.map((_, idx) => `$${idx + 1}`).join(',');

  const playersResult = await pool.query(
    `
    SELECT mp.match_id, p.summoner_name, p.tagline, mp.champion_name
    FROM match_players mp
    JOIN players p ON mp.puuid = p.puuid
    WHERE mp.match_id IN (${placeholders}) AND mp.puuid <> $${matchIds.length + 1}
    `,
    [...matchIds, puuid]
  );

  // Group players by match_id
  const playersByMatch = {};
  for (const row of playersResult.rows) {
    if (!playersByMatch[row.match_id]) playersByMatch[row.match_id] = [];
    playersByMatch[row.match_id].push({
      name: row.summoner_name,
      tagline: row.tagline,
      champion_name: row.champion_name
    });
  }

  // Step 3: Merge
  const merged = matches.map(match => ({
    ...match,
    other_players: playersByMatch[match.match_id] || []
  }));

  return merged;
}



export async function getUpdatedMatches(region, name, tagline, count = 20, offset = 0) {
  // Get the player info (from DB or Riot API)
  const player = await getPlayerFromDB(region, name, tagline);
  let puuid = null;

  if (!player) {
    puuid = await getPlayerPUUID(region, name, tagline);
  } else {
    puuid = player.puuid;
  }

  // Get the latest match IDs from Riot (count + offset handles pagination)
  const matchIds = await getMatchIds(region, puuid, count, offset);

  // Get all cached match_ids (already saved in DB)
  const cached = await pool.query(`SELECT match_id FROM matches`);
  const cachedIds = cached.rows.map(row => row.match_id);

  // Get only the match IDs that are not in the DB
  const newIds = matchIds.filter(id => !cachedIds.includes(id));

  // Fetch and save the new matches
  for (const id of newIds) {
    const details = await getMatchDetails(region, id);
    await saveMatchData(details);
  }

  // Return the final match data (including extra info)
  const matches = await getMatchesFromDB(region, name, tagline, count, offset);
  return matches;
}
