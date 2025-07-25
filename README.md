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

### 📌 `GET /match/match-ids/:region/:name/:tagline`

Fetches a player's last 20 matchs.

#### 🔧 Parameters

| Param    | Description                        | Example    |
|----------|------------------------------------|------------|
| `region` | Platform routing region            | `euw1`, `na1`, `kr` |
| `name`   | Riot ID name (summoner name)       | `astar`    |
| `tagline`| Riot tagline (region-specific tag) | `2372`      |

for more data to test you can refer to https://u.gg/lol/profile/euw1/astar-2372/overview

#### ✅ Example Request

```http
GET https://lol-project-rah3.onrender.com/match/match-ids/euw1/astar/2372
````

#### ✅ Example Response

```json
{
0	"EUW1_7467501522"
1	"EUW1_7467436848"
2	"EUW1_7466527033"
3	"EUW1_7466481381"
4	"EUW1_7466427257"
5	"EUW1_7460824772"
6	"EUW1_7460804691"
7	"EUW1_7460778870"
8	"EUW1_7452199300"
9	"EUW1_7452194993"
10	"EUW1_7447879787"
11	"EUW1_7447841679"
12	"EUW1_7447801449"
13	"EUW1_7447716596"
14	"EUW1_7447710814"
15	"EUW1_7447678802"
16	"EUW1_7447451254"
17	"EUW1_7447428267"
18	"EUW1_7447392083"
19	"EUW1_7447359967"
}
```

---
### 📌 `GET /match/match-details/:region/:matchID`

Fetches all the match details.

#### 🔧 Parameters

| Param    | Description                        | Example    |
|----------|------------------------------------|------------|
| `region` | Platform routing region            | `euw1`, `na1`, `kr` |
| `matchID`| match id can be obtained from the prev end point       | `EUW1_7467501522`    |


#### ✅ Example Request

```http
GET https://lol-project-rah3.onrender.com/match/match-details/euw1/EUW1_7467501522
````

#### ✅ Example Response

```json
metadata	
dataVersion	"2"
matchId	"EUW1_7470780676"
participants	
0	"uNQ9g2kaHgbj8rhlXw_UkLKdHDCdblFlfDsbr6NX4QweRJkDhcU6qQBwUUSMOHeUiZp7c48O4yuF0w"
1	"YPzo9aNcxdtPTi9XZ7-j6EWTo3KpeOvJfGU1iDHy4Ko1KmdQPeZSJreG2Qgo1fIg03UX_sJ1Uq4B9A"
2	"jBhIjgdS9uoYaI8ZGKm1yAdp5p4AfibyOGIF2iVCz1TgdIWWpnJCH0nPREOKhVYObzaZrA3Y7GRY1g"
3	"bRaJ5nuafpqocgZkGEPQEufncX2PZ3hhtMILUyIzuJDT3lN-mgfFHFuamimBlabi-xNeepN-DLZByQ"
4	"1vNaU2PEbdry4E9KKiORXxAn8ELNkmdHTWt_56RNOheORIF46Rs0wA48Q5X27i2iem3tBY3i9MyglQ"
5	"8q5Ls60F4SjwTkzmrjzMzoTv3JgsFAbUrtaznQLXObFUoy0AGMSTBdzl9_f4mA9bN6Lirsbaao0nyA"
6	"w6yCXPBkBOZwY83rCFBUuoi3pXnOpPwp0y-NH3RDAtWIo72H7_BoLHKA3wHuzje2zEhjy9GUCHy3UQ"
7	"LdmyhzhufH2VPNwd2ovlkdvHxQ0a7nC_bj9fkKhC0lh3tWKCSXj9rMU5EY2EPUjMyM2ZKUanSp5txg"
8	"AW_uVo_G8fMi8u5UCUTlOjjqoMb8Z984CH6eLvY7Fy6NP_7-t0afnEVM6uCQxuPPtRgZrsmHjHGevg"
9	"zBzfkI6vt0RX9mp5g5nyrLyB5KkCJT_kriUfpg_BGM8Vd-Gs3UgXRYN7yOKQnkDQ0Wy_2Yv4lhYbuw"
info	
endOfGameResult	"GameComplete"
gameCreation	1753300698251
gameDuration	2554
gameEndTimestamp	1753303324138
gameId	7470780676
gameMode	"CLASSIC"
gameName	"teambuilder-match-7470780676"
gameStartTimestamp	1753300769814
gameType	"MATCHED_GAME"
gameVersion	"15.14.697.2104"
mapId	11
participants	(10)[ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…} ]
platformId	"EUW1"
queueId	420
teams	[ {…}, {…} ]
tournamentCode	""
```
---

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
