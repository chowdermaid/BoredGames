"""
server tests with user functions
"""

import json
import requests
from src.account import login
from src.routes import port_num, mongo

BASE_URL = "http://127.0.0.1:"+str(port_num)
sample_game = "sample_game_catan.json"
test_token = login("test@gmail.com", "1234567", mongo.db.users_collection)[0]['token']

def test_routes_add_product():
    """
    Check that get user/my_collection successfully adds a product to user's collection
    """
    details = requests.post(
        f"{BASE_URL}/user/my_collection/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token}),
    )

    info = details.json()
    assert info == "Added product to my_collection"

def test_routes_load_all_products():
    """
    Check that get user/my_collection_list successfully loads the products in a user's collection
    """
    details = requests.get(
        f"{BASE_URL}/user/my_collection_list",
        headers = {'Accept': 'application/json', 'Authorization': "Bearer "+test_token},
    )

    info = details.json()
    assert info[0]['handle'] == "catan"

def test_routes_delete_product():
    """
    Check that get user/my_collection successfully deletes a product from user's collection
    """
    details = requests.delete(
        f"{BASE_URL}/user/my_collection/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token}),
    )

    info = details.json()
    assert info == "Removed product from my_collection"