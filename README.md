# 🔹 RiotStats – League of Legends Player Stats API

A backend API built with Node.js and Express that fetches and caches League of Legends player data using the Riot Games API.  
Designed to support frontend apps (web/mobile) and includes intelligent caching to reduce API load and improve performance.

---

## 🌐 Live Deployment

You can access and test the live API here:

📍 **Base URL:**  
[`https://lol-project-rah3.onrender.com/`](https://lol-project-rah3.onrender.com/)

---

## ✅ Features

- 🔍 Get player ranked stats (Solo/Duo + Flex) by Riot ID and region
- 🧠 Smart caching: stores data in PostgreSQL and refreshes if stale (older than 24h)
- 🔁 Manual force-refresh support via `?force=true`
- ⚡ Efficient DB fallback to reduce Riot API rate usage
- 🧱 Clean architecture: services, controllers, and DB layers separated
- 🔜 In Development:
  - `/matches/:puuid`: Fetch last 20 match IDs
  - `/match/:matchId`: Fetch full match data by ID

---

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL
- Axios (for Riot API requests)
- Dotenv (for environment configs)
- Hosted on [Render](https://render.com)

---

## 🧭 API Endpoints

### 📌 `GET /api/player/:region/:name/:tagline`

Fetches a player's current Solo/Duo and Flex ranks.

#### 🔧 Parameters

| Param    | Description                        | Example    |
|----------|------------------------------------|------------|
| `region` | Platform routing region            | `euw1`, `na1`, `kr` |
| `name`   | Riot ID name (summoner name)       | `astar`    |
| `tagline`| Riot tagline (region-specific tag) | `2372`      |

for more data to test you can refer to https://u.gg/lol/profile/euw1/astar-2372/overview

#### 🔄 Optional Query

| Query      | Description                           |
|------------|---------------------------------------|
| `force=true` | Force fetch from Riot API (ignore cache) |

#### ✅ Example Request

```http
GET https://lol-project-rah3.onrender.com/api/player/euw1/astar/2372
GET https://lol-project-rah3.onrender.com/api/player/euw1/astar/2372?force=true
````

#### ✅ Example Response

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

> `"cached": true` → served from database
> `"cached": false` → fetched fresh from Riot API

---

## 🛠️ Upcoming Endpoints (In Progress)

### `GET /api/matches/:puuid`

Returns the last 20 match IDs played by a player.

### `GET /api/match/:matchId`

Returns full details and stats for the given match ID.

---

## 🚀 Getting Started (Local Development)

### 1. Clone the project

```bash
git clone https://github.com/your-username/riotstats.git
cd riotstats
```

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

### 4. Start the server locally

```bash
node server.js
```

Local API will be available at: `http://localhost:3000/api`

---

## 📁 Project Structure

```
/controllers       - Route logic
/services          - Riot API + DB logic
/routes            - Express route definitions
/db.js             - PostgreSQL connection setup
/regionMap.js      - Riot API routing by region
/.env              - API Key and env config
server.js          - Entry point
```

---

## 📌 Notes

* This API uses the **Riot Developer Key**, which is rate-limited (20 req/sec).
* Smart caching ensures minimal Riot API calls and better scalability.
* Future roadmap includes:

  * Champion analytics
  * Counter stats
  * Live match detection
  * ML-based item/build suggestions

---

## 🤝 Contributions

Contributions are welcome!
To contribute: fork the repo, make changes, and open a pull request. Feature ideas, bug fixes, and feedback are always appreciated.

> This project is **not endorsed** by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.

---
