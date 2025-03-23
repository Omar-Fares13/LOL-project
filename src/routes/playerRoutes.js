import express from "express";
import { fetchPlayer } from "../controllers/playerController.js";

const router = express.Router();
router.get("/:name/:tagline", fetchPlayer);

export default router;
