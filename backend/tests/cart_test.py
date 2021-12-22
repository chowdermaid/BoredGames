"""
tests for cart.py
"""

import json
import pytest
from src import account
from src import admin_orders
from src import admin_product
from src import cart
from src.account import register
from src.routes import mongo

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"


@pytest.fixture
def setup():
    """
    empty the test product database and restock
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

    return products_collection, users_collection, token

def test_add_cart(setup):
    """
    Check that cart.add_product successfully adds a product to user's cart'
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    handle = "catan"
    id = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle, users_collection, products_collection)
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" in resp['in_users_cart']
    assert "test3@gmail.com" not in resp['in_users_cart']

    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle in user['cart']
    assert code == 200

def test_add_cart_fail1(setup):
    """
    Check that cart.add_product does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    quantity = '1'
    resp, code = cart.add_product("invalid_token", quantity, handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_add_cart_fail2(setup):
    """
    Check that cart.add_product does not work with an invalid product
    """
    products_collection, users_collection, token = setup
    quantity = '1'
    resp, code = cart.add_product(token, quantity, "invalid_handle", users_collection, products_collection)

    assert resp == 'Not a valid product'
    assert code == 404

def test_add_cart_fail3(setup):
    """
    Check that cart.add_product does not work with a product already in the collection
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    id = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle, users_collection, products_collection)
    resp, code = cart.add_product(token, quantity, handle, users_collection, products_collection)
    assert resp == "Product already in cart"
    assert code == 400

def test_add_cart_fail4(setup):
    """
    Check that cart.add_product does not work if quantity greater than existing quantity of product
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    quantity = '1000'
    resp, code = cart.add_product(token, quantity, handle, users_collection, products_collection)
    assert resp == "Quantity must not be greater than quantity in store"
    assert code == 400

def test_delete_cart(setup):
    """
    Check that cart.delete_product successfully removes a product to user's cart
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    handle = "catan"
    id = "OIXt3DmJU0"
    quantity = '1'
    cart.add_product(token, quantity, handle, users_collection, products_collection)
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" in resp['in_users_cart']
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle in user['cart']
    resp, code = cart.delete_product(token, handle, users_collection, products_collection)
    assert resp == "Removed product from cart"
    assert code == 200
    
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" not in resp['in_users_cart']
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle not in user['cart']

def test_delete_cart_fail1(setup):
    """
    Check that cart.delete_product does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = cart.delete_product("invalid_token", handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_delete_cart_fail2(setup):
    """
    Check that cart.delete_product does not work with an invalid product
    """
    products_collection, users_collection, token = setup
    resp, code = cart.delete_product(token, "invalid_handle", users_collection, products_collection)

    assert resp == 'Not a valid product'
    assert code == 404

def test_delete_cart_fail3(setup):
    """
    Check that cart.delete_product does not work with a product not in the collection
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = cart.delete_product(token, handle, users_collection, products_collection)
    assert resp == "Product not in cart"
    assert code == 404

def test_edit_quanity(setup):
    """
    Check that cart.edit_quantity successfully updates quantity in user's cart'
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    handle = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle, users_collection, products_collection)
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert user['cart'][handle] == 1

    resp, code = cart.edit_quantity(token, 5, handle, users_collection, products_collection)
    assert '5' in resp
    assert code == 200

    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle in user['cart']
    assert user['cart'][handle] == 5

def test_edit_quanity_fail1(setup):
    """
    Check that cart.edit_quantity does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    quantity = '1'
    resp, code = cart.edit_quantity("invalid_token", quantity, handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_edit_quanity_fail2(setup):
    """
    Check that cart.edit_quantity does not work with an invalid product
    """
    products_collection, users_collection, token = setup
    quantity = '1'
    resp, code = cart.edit_quantity(token, quantity, "invalid_handle", users_collection, products_collection)

    assert resp == 'Not a valid product'
    assert code == 404

def test_edit_quanity_fail3(setup):
    """
    Check that cart.edit_quantity does not work if quantity greater than existing quantity of product
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    quantity = 1000
    resp, code = cart.edit_quantity(token, quantity, handle, users_collection, products_collection)
    assert resp == "Quantity must not be greater than quantity in store"
    assert code == 400

def test_load_cart0(setup):
    """
    Check that cart.load_all_products successfully returns products from 'cart', empty collection
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    resp, code = cart.load_all_products(token, products_collection, users_collection)
    assert resp['total_cost'] == 0
    assert resp['products'] == []
    assert code == 200

def test_load_cart1(setup):
    """
    Check that cart.load_all_products successfully returns products from 'cart', one product
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    quantity = '3'
    cart.add_product(token, quantity, handle, users_collection, products_collection)
    resp, code = cart.load_all_products(token, products_collection, users_collection)
    assert resp['total_cost'] == 75
    assert handle == resp['products'][0]['handle']
    assert int(quantity) == resp['products'][0]['quantity_in_cart']
    assert len(resp['products']) == 1
    assert code == 200

def test_load_cart2(setup):
    """
    Check that cart.load_all_products successfully returns products from 'cart', two products
    """
    products_collection, users_collection, token = setup
    handle1 = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    handle2 = "azul"
    cart.add_product(token, quantity, handle2, users_collection, products_collection)
    resp, code = cart.load_all_products(token, products_collection, users_collection)
    assert handle1 == resp['products'][0]['handle']
    assert handle2 == resp['products'][1]['handle']
    assert resp['total_cost'] == 48.75 #accounts for discounted Azul
    assert len(resp['products']) == 2
    assert code == 200

def test_load_cart_with_coupon(setup):
    """
    Check that cart.load_all_products successfully returns correct total price with coupon applied
    """
    products_collection, users_collection, token = setup
    handle1 = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)
    handle2 = "azul"
    cart.add_product(token, quantity, handle2, users_collection, products_collection)
    
    coupon_collection = mongo.db.test_coupon_collection
    coupon_code = "SPRING2021"
    voucher = "5"
    admin_orders.add_coupon(coupon_code, voucher, coupon_collection)
    cart.apply_coupon(token, coupon_code, users_collection, coupon_collection)
    resp, code = cart.load_all_products(token, products_collection, users_collection)
    
    assert resp['total_cost'] == 48.75 #accounts for discounted Azul
    assert resp['discount_cost'] == 43.75 # Accounts for applied discount code
    assert len(resp['products']) == 2
    assert code == 200

def test_load_cart_fail1(setup):
    """
    Check that cart.load_all_products does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = cart.delete_product("invalid_token", handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_empty_cart(setup):
    """
    Check that cart.empty_cart successfully empties a user's cart user's cart'
    """
    products_collection, users_collection, token = setup
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
    
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle1 in user['cart']
    assert handle2 in user['cart']
    assert code == 200

    resp, code = cart.empty_cart(token, users_collection, products_collection)
    assert resp == "Emptied 2 products from cart"
    assert code == 200

    resp, code = admin_product.get_product(id1, products_collection)
    assert "test2@gmail.com" not in resp['in_users_cart']
    resp, code = admin_product.get_product(id2, products_collection)
    assert "test2@gmail.com" not in resp['in_users_cart']

    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert user['cart'] == {}

def test_empty_cart_fail1(setup):
    """
    Check that cart.empty_cart does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    resp, code = cart.empty_cart("invalid_token", users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_apply_coupon(setup):
    """
    Check that cart.apply_coupon successfully applies a % coupon'
    """
    products_collection, users_collection, token = setup
    coupon_collection = mongo.db.test_coupon_collection
    cart.add_product(token, '1', 'catan', users_collection, products_collection)

    coupon_code = "SPRING2021"
    voucher = "0.2"
    resp, code = admin_orders.add_coupon(coupon_code, voucher, coupon_collection)
    assert resp == "Successfully added 20% coupon"
    assert code == 200

    resp, code = cart.apply_coupon(token, coupon_code, users_collection, coupon_collection)
    assert resp == "20% discount applied"
    assert code == 200

    resp, code = cart.load_all_products(token, products_collection, users_collection)
    assert resp['total_cost'] == 25
    assert resp['discount_cost'] == 20

def test_apply_coupon2(setup):
    """
    Check that cart.apply_coupon successfully applies a $ coupon'
    """
    products_collection, users_collection, token = setup
    coupon_collection = mongo.db.test_coupon_collection
    cart.add_product(token, '1', 'catan', users_collection, products_collection)

    coupon_code = "EOFY2021"
    voucher = "10.5"
    admin_orders.add_coupon(coupon_code, voucher, coupon_collection)

    resp, code = cart.apply_coupon(token, coupon_code, users_collection, coupon_collection)
    assert resp == "$10.50 discount applied"
    assert code == 200

    resp, code = cart.load_all_products(token, products_collection, users_collection)
    assert resp['total_cost'] == 25
    assert resp['discount_cost'] == 14.5

def test_apply_coupon_fail1(setup):
    """
    Check that cart.apply_coupon fails without valid token
    """
    products_collection, users_collection, token = setup
    coupon_collection = mongo.db.test_coupon_collection
    
    coupon_code = "SPRING2021"
    voucher = "0.2"
    admin_orders.add_coupon(coupon_code, voucher, coupon_collection)

    resp, code = cart.apply_coupon("invalid_token", coupon_code, users_collection, coupon_collection)
    assert resp == 'Not a valid user'
    assert code == 400

def test_apply_coupon_fail2(setup):
    """
    Check that cart.apply_coupon fails without valid coupon code
    """
    products_collection, users_collection, token = setup
    coupon_collection = mongo.db.test_coupon_collection

    resp, code = cart.apply_coupon(token, "invalid_coupon_code", users_collection, coupon_collection)
    assert resp == 'Not a valid coupon'
    assert code == 404