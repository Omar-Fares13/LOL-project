import os
import requests
import json
from dotenv import load_dotenv

import os
import requests
load_dotenv()
API_KEY = os.getenv("RIOT_API_KEY")
print(API_KEY)
HEADERS = {"X-Riot-Token": API_KEY}
REGION = "europe"

def get_match_ids(puuid, count=20):
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"
    resp = requests.get(url, headers=HEADERS, params={"start":0, "count":count})
    resp.raise_for_status()
    return resp.json()  # List[str]

def get_match_details(match_id):
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()  # Match info

if __name__ == "__main__":
    puuid = "pefsqVlakPAy-EQvMpq2W8Xe1w-Z5Id5UkgLMQMF7clXpVqC0ec8rxzPvMH4drwgiFjeN0YHoS6kog"
    ids = get_match_ids(puuid)
    #print("Last match IDs:", ids)
    if ids:
        detail = get_match_details(ids[0])
        #print(json.dumps(detail, indent=2))
        with open("match_detail.json", "w") as f:
            json.dump(detail, f, indent=2)

    print("Match detail saved to match_detail.json")

