import express from "express";
import dotenv from "dotenv";
import playerRoutes from "./routes/playerRoutes.js";

dotenv.config();
const app = express();

app.use("/player", playerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));