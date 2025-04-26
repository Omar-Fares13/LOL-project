# 🔹 RiotStats – League of Legends Player Stats API

A work-in-progress backend API built with Node.js and Express that fetches League of Legends player data using the Riot Games API.  
Designed for use with mobile or web frontends like Android apps.

## ✅ Current Features

- 🔍 Get player stats by Riot ID (`/player/:name/:tagline`)
- 📄 Fetch ranked solo queue rank (Tier + Division)
- ♻️ Caches player data to reduce Riot API usage (coming soon)

## ⚙️ Technologies

- Node.js + Express
- Dotenv for environment config
- Riot Games REST API
- Planned: PostgreSQL for persistent data

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/riotstats.git
cd riotstats
```

### 2. Set up environment variables

Create a `.env` file in the root folder:

```env
PORT=3000
RIOT_API_KEY=your-api-key-here
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the server

```bash
npm run dev
# or if not using nodemon:
node server.js
```

API will be live at `http://localhost:3000`

## 🛣️ Planned Routes

- `/player/:name/:tagline` → Player rank & info  
- `/matches/:puuid` → Last 20 matches (in development)  
- `/champion/:championName` → Build stats, win rates (planned)

## 📌 Notes

This project is under active development and limited by the Riot Developer API key rate.  
Data caching and match analysis features are coming soon.
