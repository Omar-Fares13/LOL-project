import express from "express";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import playerRoutes from "./routes/playerRoutes.js";
import { logger } from "./logger.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js"; // adjust path if needed

dotenv.config();
const app = express();

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    ip,
    userAgent: req.headers["user-agent"]
  });
  next();
});

// Root route to serve README as HTML
app.get('/', (req, res) => {
  const readmePath = path.join(process.cwd(), 'README.md');

  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading README.md');
    }

    const html = marked.parse(data);

    res.send(`
      <html>
        <head>
          <title>RiotStats API</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; max-width: 800px; margin: auto; padding: 2rem; line-height: 1.6; }
            pre { background: #f0f0f0; padding: 1rem; overflow-x: auto; }
            code { font-family: monospace; }
            h1, h2, h3 { border-bottom: 1px solid #ddd; padding-bottom: 0.3em; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
  });
});

app.use("/player", playerRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));