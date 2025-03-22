import express from "express";
import { fetchPlayer } from "../controllers/playerController.js";

const router = express.Router();
router.get("/:PUUID", fetchPlayer);

export default router;
