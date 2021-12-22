"""
server tests with user browsing functions
"""

import json
import requests
from src.routes import port_num

BASE_URL = "http://127.0.0.1:"+str(port_num)

def test_routes_filter_search():
    """
    Check that so filter search returns correct game(s)
    """
    details = requests.post(
        f"{BASE_URL}/user/filter_search",
        headers = {'Accept': 'application/json'},
        data = json.dumps({
            "search": "clank",
            "min_year": 2004,
            "max_year": 2012,
            "min_players": None,
            "max_players": 4,
            "min_playtime": 30,
            "max_playtime": 180,
            "min_age": 15,
            "mechanics": [
                
            ],
            "categories": [
                "Adventure", "Fantasy"
            ],
            "curve": None,
            "depth": None
        })
    )

    game = details.json()
    assert game[0]['name'] == "Clank! A Deck-Building Adventure"