# 🔹 RiotStats – League of Legends Player Stats API

A backend API built with Node.js and Express that fetches and caches League of Legends player data using the Riot Games API.  
Designed to be used by frontend apps (web/mobile) and supports intelligent caching to reduce API load and improve response time.

---

## ✅ Features

- 🔍 Get player stats (Solo/Duo + Flex) by Riot ID and region
- 🧠 Smart caching: stores player data in PostgreSQL and auto-refreshes if data is stale (older than 24 hours)
- 🔁 Manual force-refresh via query parameter `?force=true`
- 🧱 Modular structure: controllers, services, and database layers separated cleanly
- 🔜 In Development:
  - `/matches/:puuid`: Fetch last 20 match IDs for a player
  - `/match/:matchId`: Get full match details by match ID

---

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL
- Axios (for HTTP requests to Riot API)
- Dotenv (for environment variables)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/riotstats.git
cd riotstats
````

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
RIOT_API_KEY=your-riot-api-key-here
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

API will be live at `http://localhost:3000`

---

## 🧭 API Endpoints

### `GET /api/player/:region/:name/:tagline`

Fetches a player's **Solo/Duo** and **Flex** rank info.

#### 📌 Parameters

* `region` — Platform region (e.g. `euw1`, `na1`, `kr`)
* `name` — Summoner name (e.g. `Faker`)
* `tagline` — Riot tagline (e.g. `KR1`)

#### 🔄 Optional Query

* `?force=true` — Force-refreshes the data from Riot API and updates the database

#### ✅ Response

```json
{
  "solo_duo_rank": "I",
  "solo_duo_tier": "DIAMOND",
  "solo_duo_lp": 72,
  "flex_rank": "IV",
  "flex_tier": "PLATINUM",
  "flex_lp": 39,
  "cached": true
}
```

* `"cached": true` means data came from the database.
* `"cached": false` means data was freshly fetched from Riot.

---

## 🛠️ Planned Endpoints (In Progress)

### `GET /api/matches/:puuid`

Returns the last 20 match IDs played by the given player (by PUUID).

### `GET /api/match/:matchId`

Returns full match details for the given match ID, including participant stats.

---

## 📌 Notes

* This API uses the **Riot Developer Key**, which has strict rate limits (20 requests/sec). Caching is used to stay within those limits.
* The project is under active development.
* Future features include champion win rate tracking, matchup stats, item analysis, and ML-based build recommendations.

---

## 💻 Project Structure

```
/controllers     - Route logic
/services        - Riot API and DB logic
/routes          - Express route definitions
/db.js           - PostgreSQL connection
regionMap.js     - Region-to-routing map for Riot API
.env             - Riot API Key and environment config
server.js        - Entry point
```

---

## 🤝 Contributions

Contributions are welcome! If you'd like to help extend functionality (match parsing, leaderboard stats, etc.), feel free to open an issue or PR.

This project isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
