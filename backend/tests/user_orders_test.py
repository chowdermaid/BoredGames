"""
tests for user_orders.py
"""

import json
import pytest
from src import admin_product
from src import cart
from src import my_collection
from src import user_orders
from src.account import register
from src.routes import mongo

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"

@pytest.fixture
def setup():
    """
    empty the test product database, restock
    """
   
    # Empty the test_products_collections in mongoDB
    products_collection = mongo.db.test_products_collection
    categories_collection = mongo.db.categories_collection   
    mechanics_collection = mongo.db.mechanics_collection 
    products_collection.delete_many({})
    # Load two sample games into the db
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "10" 
    }
    admin_product.add_product(args, game, products_collection, categories_collection, mechanics_collection)
    with open(sample_game2) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    admin_product.add_product(args, game, products_collection, categories_collection, mechanics_collection)

    # Empty the test_users_collections in mongoDB
    users_collection = mongo.db.test_users_collection
    users_collection.delete_many({})
    # Load a sample user into the db
    username =  "test_user"
    email = "test2@gmail.com"
    password = "1234567"
    cpassword = "1234567"
    token = register(username, email, password, cpassword, users_collection)[0]['token']

    transactions_collection = mongo.db.test_transactions_collection

    credit_card = {
        'name': 'Grace Hopper',
        'number': 'XXXX-XXXX-XXXX-XXXX',
        'expiry': '12/22',
        'cvc': '000'
    }
    shipping_info = {
        'name': 'Grace Hopper',
        'address': '42 Wallaby Way',
        'city': 'Sydney',
        'state': 'NSW',
        'post_code': '2000',
        'contact_number': '0412 345 678',
        'shipping_method': 'Free'
    }  

    return users_collection, products_collection, transactions_collection, token, credit_card, shipping_info

def test_place_order1(setup):
    """
    Check that user_orders.place_order correctly updates the system'
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's collection
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)
    assert "test2@gmail.com" in resp['in_users_cart']
    
    handle2 = "azul"
    id2 = "i5Oqu5VZgP"
    cart.add_product(token, quantity, handle2, users_collection, products_collection)
    resp, code = admin_product.get_product(id2, products_collection)
    assert "test2@gmail.com" in resp['in_users_cart']

    gift_info = ""
    add_to_collection = "True"

    resp, code = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)
    assert code == 200
    assert resp['status'] == "pending"
    assert resp['user'] == "test2@gmail.com"
    
    resp = my_collection.load_all_products(token, products_collection, users_collection)[0]
    assert len(resp) == 2
    assert resp[0]['handle'] == handle1
    assert resp[1]['handle'] == handle2

    resp = cart.load_all_products(token, products_collection, users_collection)[0]
    assert resp['products'] == []

    resp = admin_product.get_product(id1, products_collection)[0]
    assert resp['quantity'] == 9
    resp = admin_product.get_product(id2, products_collection)[0]
    assert resp['quantity'] == 2

def test_place_order2(setup):
    """
    Check that user_orders.place_order correctly updates the system'
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's collection
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '3'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)
    assert "test2@gmail.com" in resp['in_users_cart']

    shipping_info['shipping_method'] = "Express"
    gift_info = ""
    add_to_collection = "True"

    resp, code = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)
    assert code == 200
    assert resp['status'] == "pending"
    assert resp['total_cost'] == 85
    assert resp['discount_cost'] == 85
    
    resp = my_collection.load_all_products(token, products_collection, users_collection)[0]
    assert len(resp) == 1
    assert resp[0]['handle'] == handle1

    resp = cart.load_all_products(token, products_collection, users_collection)[0]
    assert resp['products'] == []

    resp = admin_product.get_product(id1, products_collection)[0]
    assert resp['quantity'] == 7

def test_place_order_fail1(setup):
    """
    Check that user_orders.place_order fails without a valid user'
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    gift_email = ""
    add_to_collection = "True"
    resp, code = user_orders.place_order("invalid_token", credit_card, shipping_info, gift_email, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_place_order_fail2(setup):
    """
    Check that user_orders.place_order fails when there is nothing in the cart'
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    gift_email = ""
    add_to_collection = "True"
    resp, code = user_orders.place_order(token, credit_card, shipping_info, gift_email, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)

    assert resp == "Nothing in the cart to checkout"
    assert code == 400

def test_place_order_fail3(setup):
    """
    Check that user_orders.place_order only works if sufficient stock of products'
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's cart
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    
    handle2 = "azul"
    id2 = "i5Oqu5VZgP"
    cart.add_product(token, '3', handle2, users_collection, products_collection)
    args = {'quantity': '2', 'discount': '', 'price': '', 'description': '', 'description_preview': ''}
    admin_product.edit_product(args, id2, products_collection)

    gift_email = ""
    add_to_collection = "True"
    resp, code = user_orders.place_order(token, credit_card, shipping_info, gift_email, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)
    assert code == 400
    assert resp == "Azul is no longer available"

def test_get_order(setup):
    """
    Check that user_orders.get_order returns the correct order with correct inputs
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's cart
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)

    gift_info = ""
    add_to_collection = "True"
    resp = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    order_number = resp['order_number']
    resp2, code = user_orders.get_order(token, order_number, users_collection)
    assert resp2['total_cost'] == 25
    assert resp2['order_number'] == resp['order_number']
    assert code == 200

def test_get_order_fail1(setup):
    """
    Check that user_orders.get_order fails when given invalid token
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's cart
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)

    gift_info = ""
    add_to_collection = "True"
    resp = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    order_number = resp['order_number']
    resp2, code = user_orders.get_order("invalid_token", order_number, users_collection)
    assert resp2 == 'Not a valid user'
    assert code == 400


def test_get_order_fail2(setup):
    """
    Check that user_orders.get_order fails when given invalid order_number
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    
    resp2, code = user_orders.get_order(token, "invalid_order_number", users_collection)
    assert resp2 == "Order invalid_order_number not found"
    assert code == 404

def test_get_orders0(setup):
    """
    Check that user_orders.get_orders returns list of user's orders - empty
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
        
    resp, code = user_orders.load_all_orders(token, users_collection)
    assert resp == []
    assert code == 200

def test_get_orders1(setup):
    """
    Check that user_orders.get_orders returns list of user's orders
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's cart
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)

    gift_info = ""
    add_to_collection = "True"
    resp = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    resp2, code = user_orders.load_all_orders(token, users_collection)
    assert resp2[0]['total_cost'] == 25
    assert len(resp2) == 1
    assert code == 200

def test_get_orders_fail1(setup):
    """
    Check that user_orders.load_all_orders fails when given invalid token
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup
    # Add catan to test_user's cart
    handle1 = "catan"
    id1 = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    resp, code = admin_product.get_product(id1, products_collection)

    gift_info = ""
    add_to_collection = "True"
    user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)
    
    resp2, code = user_orders.load_all_orders("invalid_token", users_collection)
    assert resp2 == 'Not a valid user'
    assert code == 400