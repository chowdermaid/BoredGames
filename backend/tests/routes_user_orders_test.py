"""
server tests with user functions
"""

import json
import requests
from src.account import login
from src.routes import port_num, mongo

BASE_URL = "http://127.0.0.1:"+str(port_num)
sample_game = "sample_game_catan.json"
test_token = login("test2@gmail.com", "1234567", mongo.db.users_collection)[0]['token']

def test_routes_place_order():
    """
    Check that get user/order_place successfully purchases a product 
    """
    details = requests.post(
        f"{BASE_URL}/user/cart/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token, 'quantity': '1'}),
    )
    details = requests.post(
        f"{BASE_URL}/user/order_place",
        headers = {'Accept': 'application/json'},
        data = json.dumps({ 
            "token": test_token,
            "card_name": "Ms Grace Hopper",
            "card_number": "XXXX-XXXX-XXXX-XXXX",
            "card_expiry": "12/22",
            "card_cvc": "000",
            "shipping_name": "Grace Hopper",
            "shipping_address": "42 wallaby Way",
            "shipping_post_code": "2000",
            "shipping_city": "Sydney",
            "shipping_state": "NSW",
            "contact_number": "0412 345 678",
            "shipping_method": "Express",
            "gifting": "",
            "add_to_collection": "True"
        }),
    )

    transaction = details.json()
    assert round(transaction['total_cost'], 4) == 64.99
    assert transaction['delivery']['shipping_method'] == "Express"
    assert transaction['products'][0]['handle'] == "catan"

def test_routes_get_order():
    """
    Check that get user/order_place successfully purchases a product 
    """
    details = requests.post(
        f"{BASE_URL}/user/cart/catan",
        headers = {'Accept': 'application/json'},
        data = json.dumps({'token': test_token, 'quantity': '1'}),
    )
    details = requests.post(
        f"{BASE_URL}/user/order_place",
        headers = {'Accept': 'application/json'},
        data = json.dumps({ 
            "token": test_token,
            "card_name": "Ms Grace Hopper",
            "card_number": "XXXX-XXXX-XXXX-XXXX",
            "card_expiry": "12/22",
            "card_cvc": "000",
            "shipping_name": "Grace Hopper",
            "shipping_address": "42 wallaby Way",
            "shipping_post_code": "2000",
            "shipping_city": "Sydney",
            "shipping_state": "NSW",
            "contact_number": "0412 345 678",
            "shipping_method": "Express",
            "gifting": "",
            "add_to_collection": "True"
        }),
    )

    transaction = details.json()
    order_number = transaction['order_number']

    details = requests.get(
        f"{BASE_URL}/user/order/{order_number}",
        headers = {'Accept': 'application/json', 'Authorization': "Bearer "+test_token},
    )
    order = details.json()
    assert round(order['total_cost'], 4) == 64.99
    assert order['products'][0]['handle'] == "catan"

