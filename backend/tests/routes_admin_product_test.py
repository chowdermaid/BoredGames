"""
server tests with user functions
"""

import requests
import json
from src.routes import port_num

BASE_URL = "http://127.0.0.1:"+str(port_num)
sample_game = "sample_game_catan.json"

def test_routes_add_product():
    """
    Check that get add_product successfully imports a product from Board Game Atlas with a matching name
    """
    name = "Tortuga 1667"
    details = requests.get(
        f"{BASE_URL}/admin/add_product",
        headers = {'Accept': 'application/json'},
        params = {'name': name}
    )

    game = details.json()
    assert game['name'] == name

def test_routes_add_product2():
    """
    Check that post add_product successfully stores a game in the db with all of the details
    """
    details = requests.post(
        f"{BASE_URL}/admin/add_product",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'price': "25",
                  'discount': "0.05",
                  'quantity': "3" 
        })
    )
    assert details.status_code == 200
    game = details.json()
    assert game["name"] == "Tortuga 1667"
    assert game["price_au"] == 25
    assert game["quantity"] == 3
    assert "_id" in game.keys()

def test_routes_list_products():
    """
    Check that list_products successfully returns all games in the db
    """
    details = requests.get(
        f"{BASE_URL}/admin/list_products"
    )

    games = details.json()
    assert isinstance(games, list)

def test_routes_get_product():
    """
    Check that get_product successfully returns the correct game from the db
    """
    id = "fmWQ3QFFfm"
    details = requests.get(
        f"{BASE_URL}/admin/product/{id}"
    )
    assert details.status_code == 200
    game = details.json()
    assert game["name"] == "Tortuga 1667"

    details = requests.get(
        f"{BASE_URL}/admin/product/not_a_product"
    )
    assert details.status_code == 404
    game = details.json()
    assert game == "Product not_a_product doesn't exist"


def test_routes_get_product():
    """
    Check that get_product successfully returns the correct game from the db
    """
    id = "fmWQ3QFFfm"
    details = requests.patch(
        f"{BASE_URL}/admin/product/{id}",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'price': "35",
                  'discount': "0.5",
                  'quantity': "6",
                  'description': "",
                  'description_preview': "" 
        })
    )
    assert details.status_code == 200
    game = details.json()
    assert int(game["price_au"]) == 35
    assert float(game["discount"]) == 0.5
    assert float(game["quantity"]) == 6

    details = requests.get(
        f"{BASE_URL}/admin/product/{id}"
    )
    assert details.status_code == 200
    game = details.json()
    assert int(game["price_au"]) == 35
    assert float(game["discount"]) == 0.5
    assert float(game["quantity"]) == 6

def test_routes_delete_product():
    """
    Check that delete_product successfully deletes the correct game from the db
    """
    id = "fmWQ3QFFfm"
    details = requests.delete(
        f"{BASE_URL}/admin/product/{id}"
    )
    assert details.status_code == 200
    game = details.json()
    assert game == "Product successfully deleted"

def test_routes_delete_product2():
    """
    Check that delete_product can't delete a product that doesn't exist
    """
    details = requests.delete(
        f"{BASE_URL}/admin/product/not_a_product"
    )
    assert details.status_code == 404
    game = details.json()
    assert game == "Product not_a_product doesn't exist"