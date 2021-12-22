"""
server tests with user functions
"""

import json
import requests
from src.routes import port_num, mongo
from src.account import login

BASE_URL = "http://127.0.0.1:"+str(port_num)
sample_game = "sample_game_catan.json"
test_token = login("test2@gmail.com", "1234567", mongo.db.users_collection)[0]['token']

def test_routes_add_product():
    """
    Check that get user/cart successfully adds a product to user's cart
    """
    details = requests.post(
        f"{BASE_URL}/user/cart/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token, 'quantity': '1'}),
    )

    info = details.json()
    assert info == "Added product to cart"

def test_routes_load_all_products():
    """
    Check that get user/cart_list successfully loads the products in a user's cart
    """
    details = requests.get(
        f"{BASE_URL}/user/cart_list",
        headers = {'Accept': 'application/json', 'Authorization': "Bearer "+test_token},
    )

    info = details.json()
    assert info['products'][0]['handle'] == "catan"

def test_routes_edit_quantity():
    """
    Check that get user/cart successfully updates quantity of a product in user's cart
    """
    details = requests.patch(
        f"{BASE_URL}/user/cart/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token, 'quantity': '2'}),
    )

    info = details.json()
    assert info == "Updated quantity in cart to 2"

def test_routes_delete_product():
    """
    Check that get user/cart successfully deletes a product from user's cart
    """
    details = requests.delete(
        f"{BASE_URL}/user/cart/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token}),
    )

    info = details.json()
    assert info == "Removed product from cart"