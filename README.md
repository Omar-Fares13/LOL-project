---

⚠️ **Note about `500 Internal Server Error`**

If you encounter a `500 Internal Server Error` when trying any of the endpoints, it's likely because the Riot API key has expired. Riot’s development API keys expire every 24 hours, and while I do my best to update the key daily, there may occasionally be short periods of downtime if I forget or am unavailable. Thanks for your understanding!

---

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
  - `/match-details/:matchId`: Fetch full match data by ID

---

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL
- Axios (for Riot API requests)
- Dotenv (for environment configs)
- Hosted on [Render](https://render.com)

---

## 🧭 API Endpoints

### 📌 `GET /player/:region/:name/:tagline`

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
GET https://lol-project-rah3.onrender.com/player/euw1/astar/2372
GET https://lol-project-rah3.onrender.com/player/euw1/astar/2372?force=true
````

#### ✅ Example Response

```json
{
  "cached": true,
  "player": {
    "id": 1,
    "puuid": "pefsqVlakPAy-EQvMpq2W8Xe1w-Z5Id5UkgLMQMF7clXpVqC0ec8rxzPvMH4drwgiFjeN0YHoS6kog",
    "summoner_name": "astar",
    "tagline": "2372",
    "solo_tier": "BRONZE",
    "solo_rank": "I",
    "solo_lp": 39,
    "flex_tier": "BRONZE",
    "flex_rank": "II",
    "flex_lp": 91,
    "last_updated": "2025-07-29T22:27:59.992Z",
    "region": "euw1",
    "level": 473,
    "last_synced_match_id": null
  }
}
```

> `"cached": true` → served from database
> `"cached": false` → fetched fresh from Riot API

---

### 📌 `GET /player/:region/:name/:tagline/matches`

Fetches a player's matches summary.

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
| `count=20` | The number of matches to fetch defaults to 20 |
| `offset=0` | The offest to start fetching from defaults to 0 |

#### ✅ Example Request

```http
GET https://lol-project-rah3.onrender.com/player/euw1/astar/2372/matches?count=1&offset=0&force=true
````

#### ✅ Example Response

```json
{
  "cached": true,
  "matches": [
    {
      "match_id": "EUW1_7467501522",
      "game_mode": "CLASSIC",
      "queue_id": 700,
      "platform_id": "EUW1",
      "game_duration": 2709,
      "game_creation": "1753028499472",
      "game_end": "1753031284066",
      "map_id": 11,
      "win_team": 200,
      "last_fetched": "2025-07-29T22:44:28.772Z",
      "champion_name": "Leona",
      "runes_primary": {
        "style": 8400,
        "selections": [
          { "perk": 8439, "var1": 1382, "var2": 1352, "var3": 0 },
          { "perk": 8463, "var1": 1270, "var2": 0, "var3": 0 },
          { "perk": 8444, "var1": 1289, "var2": 0, "var3": 0 },
          { "perk": 8451, "var1": 226, "var2": 0, "var3": 0 }
        ],
        "description": "primaryStyle"
      },
      "runes_secondary": {
        "style": 8000,
        "selections": [
          { "perk": 9105, "var1": 36, "var2": 10, "var3": 0 },
          { "perk": 9111, "var1": 763, "var2": 220, "var3": 0 }
        ],
        "description": "subStyle"
      },
      "summoner_spells": ["4", "14"],
      "items": [3877, 3190, 1057, 3109, 3075, 3047, 3364],
      "kills": 1,
      "deaths": 11,
      "assists": 10,
      "kda": 1,
      "cs": 44,
      "gold_earned": 11316,
      "vision_score": 103,
      "damage_dealt": 13205,
      "win": false,
      "role": "SUPPORT",
      "lane": "BOTTOM",
      "other_players": [
        { "name": "berlin", "tagline": "9752", "champion_name": "Yunara" },
        { "name": "needmorebullets", "tagline": "8102", "champion_name": "Jhin" },
        { "name": "lotto606", "tagline": "euw", "champion_name": "Sylas" },
        { "name": "mokax02", "tagline": "euw", "champion_name": "Volibear" },
        { "name": "na adan atum", "tagline": "dgl", "champion_name": "Milio" },
        { "name": "azazel enjoyer", "tagline": "ecw", "champion_name": "Veigar" },
        { "name": "greg inside", "tagline": "hebs", "champion_name": "Lucian" },
        { "name": "paul muaddib", "tagline": "plp", "champion_name": "Amumu" },
        { "name": "nonoskaate", "tagline": "drkn", "champion_name": "DrMundo" }
      ]
    }
  ]
}

```

## 🛠️ Upcoming Endpoints (In Progress)

### `GET /player/stats/:puuid`

Returns data driven stats for the player.

---

## 🗃️ Database Schema

The backend uses **PostgreSQL** with three main tables designed to store League of Legends match and player data.

### 📍 Tables Overview

| Table Name      | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `players`       | Stores player profile, ranks, and metadata       |
| `matches`       | Stores match metadata for each game              |
| `match_players` | Stores per-player stats per match (many-to-many) |

---

### 🧑‍🎮 `players`

Stores basic player information and solo/flex rank data.

| Column                 | Type        | Description                             |
| ---------------------- | ----------- | --------------------------------------- |
| `id`                   | `SERIAL`    | Primary key                             |
| `puuid`                | `TEXT`      | Riot’s unique player ID (unique)        |
| `summoner_name`        | `TEXT`      | Player’s summoner name                  |
| `tagline`              | `TEXT`      | Player's tagline (e.g., `911`)          |
| `region`               | `TEXT`      | Region/server (e.g., `eun1`, `euw1`)    |
| `solo_tier`            | `TEXT`      | Solo queue tier (e.g., `GOLD`)          |
| `solo_rank`            | `TEXT`      | Solo queue rank (e.g., `IV`)            |
| `solo_lp`              | `INTEGER`   | Solo LP                                 |
| `flex_tier`            | `TEXT`      | Flex tier                               |
| `flex_rank`            | `TEXT`      | Flex rank                               |
| `flex_lp`              | `INTEGER`   | Flex LP                                 |
| `level`                | `INTEGER`   | Summoner level                          |
| `last_updated`         | `TIMESTAMP` | When player data was last updated       |
| `last_synced_match_id` | `TEXT`      | Last match synced to avoid reprocessing |

🔑 **Indexes & Constraints**

* Primary key: `id`
* Unique: `puuid`
* Indexed: `(region, summoner_name, tagline)`

---

### 🎮 `matches`

Stores metadata for each match retrieved.

| Column          | Type        | Description                               |
| --------------- | ----------- | ----------------------------------------- |
| `id`            | `SERIAL`    | Primary key                               |
| `match_id`      | `TEXT`      | Riot match ID (unique)                    |
| `game_mode`     | `TEXT`      | Game mode (e.g., `CLASSIC`, `ARAM`)       |
| `queue_id`      | `INTEGER`   | Riot queue ID (maps to ranked/normal/etc) |
| `platform_id`   | `TEXT`      | Region or server identifier               |
| `game_duration` | `INTEGER`   | Game length in seconds                    |
| `game_creation` | `BIGINT`    | Game creation timestamp                   |
| `game_end`      | `BIGINT`    | Game end timestamp                        |
| `map_id`        | `INTEGER`   | Map identifier                            |
| `win_team`      | `INTEGER`   | Team that won (100 or 200)                |
| `last_fetched`  | `TIMESTAMP` | When this match was last fetched          |

🔑 **Indexes & Constraints**

* Primary key: `id`
* Unique: `match_id`

---

### 🧾 `match_players`

Stores all stats for each player in a specific match.

| Column            | Type        | Description                         |
| ----------------- | ----------- | ----------------------------------- |
| `id`              | `SERIAL`    | Primary key                         |
| `match_id`        | `TEXT`      | Foreign key to `matches.match_id`   |
| `puuid`           | `TEXT`      | Foreign key to `players.puuid`      |
| `team_id`         | `INTEGER`   | 100 or 200 (blue/red team)          |
| `champion_name`   | `TEXT`      | Champion used                       |
| `champ_level`     | `INTEGER`   | Champion level at end               |
| `summoner_spells` | `TEXT[]`    | Two summoner spells                 |
| `runes_primary`   | `JSONB`     | Primary rune tree with selections   |
| `runes_secondary` | `JSONB`     | Secondary rune tree                 |
| `items`           | `INTEGER[]` | Item IDs carried (0–6)              |
| `kills`           | `INTEGER`   | Kills                               |
| `deaths`          | `INTEGER`   | Deaths                              |
| `assists`         | `INTEGER`   | Assists                             |
| `kda`             | `REAL`      | Computed KDA                        |
| `cs`              | `INTEGER`   | Creep score                         |
| `gold_earned`     | `INTEGER`   | Total gold earned                   |
| `vision_score`    | `INTEGER`   | Vision score                        |
| `damage_dealt`    | `INTEGER`   | Total damage dealt                  |
| `win`             | `BOOLEAN`   | Whether the player won              |
| `role`            | `TEXT`      | Assigned role (e.g., `SOLO`, `DUO`) |
| `lane`            | `TEXT`      | Assigned lane (e.g., `TOP`, `MID`)  |

🔗 **Foreign Keys**

* `match_id` → `matches.match_id`
* `puuid` → `players.puuid`

---

### 🔁 Relationships

* A **player** (`puuid`) can appear in **many matches** → `match_players`
* A **match** has 10 **match\_players** entries (one per player)
* `match_players` is the **join table** between `matches` and `players`

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
USER=omarf
HOST=localhost
DATABASE=user
DB_PORT=5432
DB_PASSWORD=password
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
