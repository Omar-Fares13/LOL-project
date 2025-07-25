import express from "express";
import { getMatchIdsController, getMatchDetailsController } from "../controllers/matchController.js";

const router = express.Router();

router.get("/match-ids/:region/:name/:tagline", getMatchIdsController);

router.get("/match-details/:region/:matchID", getMatchDetailsController)

export default router;