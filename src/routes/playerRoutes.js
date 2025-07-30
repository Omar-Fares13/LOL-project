import express from "express";
import { fetchPlayer } from "../controllers/playerController.js";
import { getMatches } from "../controllers/matchController.js";
import { getStats } from "../controllers/statsController.js"

const router = express.Router();

router.get("/:region/:name/:tagline", fetchPlayer);

router.get("/:region/:name/:tagline/matches", getMatches);

router.get("/:region/:name/:tagline/stats", getStats);

export default router;
