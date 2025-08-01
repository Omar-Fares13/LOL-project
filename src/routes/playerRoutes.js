import express from "express";
import { fetchPlayer } from "../controllers/playerController.js";
import { getMatches } from "../controllers/matchController.js";
import { getStats } from "../controllers/statsController.js"

const router = express.Router();

/**
 * @swagger
 * /player/{region}/{name}/{tagline}:
 *   get:
 *     summary: Get player overview by name/tagline/region
 *     parameters:
 *       - in: path
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot region (e.g., euw1)
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot username
 *       - in: path
 *         name: tagline
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot tagline
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Force refresh from Riot API, bypassing cache
 *     responses:
 *       200:
 *         description: Player data fetched successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:region/:name/:tagline", fetchPlayer);

/**
 * @swagger
 * /player/{region}/{name}/{tagline}/matches:
 *   get:
 *     summary: Get recent match history for a player
 *     parameters:
 *       - in: path
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot region (e.g., euw1)
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot username
 *       - in: path
 *         name: tagline
 *         schema:
 *           type: string
 *         required: true
 *         description: Riot tagline
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Number of matches to fetch
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Number of matches to skip (for pagination)
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Force refresh from Riot API, bypassing cache
 *     responses:
 *       200:
 *         description: List of matches fetched successfully
 *       404:
 *         description: Matches not found
 *       500:
 *         description: Server error
 */
router.get("/:region/:name/:tagline/matches", getMatches);

// Leave this for later
router.get("/:region/:name/:tagline/stats", getStats);

export default router;
