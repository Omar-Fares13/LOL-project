import express from "express";
import dotenv from "dotenv";
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js"

dotenv.config();
const app = express();

app.use("/player", playerRoutes);

app.use("/match", matchRoutes)

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));