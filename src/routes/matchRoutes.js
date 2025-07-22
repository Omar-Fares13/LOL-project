import express from "express";
import { getMatchIdsController } from "../controllers/matchController.js";

const router = express.Router();
router.get("/:region/:name/:tagline", getMatchIdsController);

export default router;