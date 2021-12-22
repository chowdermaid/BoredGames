"""
tests for admin_orders.py
"""

import json
import pytest
from src import admin_orders
from src import admin_product
from src import cart
from src import user_orders
from src.account import register
from src.routes import mongo

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"


@pytest.fixture
def setup():
    """empty the test coupon database"""
    collection = mongo.db.test_coupon_collection
    collection.delete_many({})
    return collection

@pytest.fixture
def setup2():
    """
    empty the test product database, restock, make a purchase
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
    transactions_collection.delete_many({})

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


def test_add_coupon(setup):
    """
    Check that admin_orders.add_coupon successfully adds a coupon'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "0.2"
    resp, code = admin_orders.add_coupon(code, voucher, collection)
    assert resp == "Successfully added 20% coupon"
    assert code == 200

def test_add_coupon2(setup):
    """
    Check that admin_orders.add_coupon successfully overwrites old coupon if same code added again'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "0.10"
    admin_orders.add_coupon(code, voucher, collection)
    voucher = "10"
    resp, resp_code = admin_orders.add_coupon(code, voucher, collection)
    assert resp == "Successfully added $10.00 coupon"
    assert resp_code == 200
    coupons = admin_orders.get_coupons(collection)
    assert coupons[0]['code'] == code
    assert coupons[0]['voucher'] == float(voucher)

def test_add_coupon_fail1(setup):
    """
    Check that admin_orders.add_coupon does not work if voucher empty or zero'
    """
    collection = setup
    code = "SPRING2021"
    voucher = ""
    resp, code = admin_orders.add_coupon(code, voucher, collection)
    assert resp == 'Voucher must be non-empty'
    assert code == 400

def test_add_coupon_fail2(setup):
    """
    Check that admin_orders.add_coupon does not work if voucher not a number'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "as"
    resp, code = admin_orders.add_coupon(code, voucher, collection)
    assert resp == 'Voucher must be a positive number'
    assert code == 400

def test_add_coupon_fail3(setup):
    """
    Check that admin_orders.add_coupon does not work if voucher negative'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "-10"
    resp, code = admin_orders.add_coupon(code, voucher, collection)
    assert resp == 'Voucher must be a positive number'
    assert code == 400

def test_get_coupons(setup):
    """
    Check that admin_orders.get_coupons works correctly - empty'
    """
    collection = setup
    coupons = admin_orders.get_coupons(collection)
    assert coupons == []

def test_get_coupons1(setup):
    """
    Check that admin_orders.get_coupons works correctly - one'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "0.05"
    admin_orders.add_coupon(code, voucher, collection)
    coupons = admin_orders.get_coupons(collection)
    assert coupons[0]['code'] == code
    assert coupons[0]['voucher'] == float(voucher)

def test_delete_coupon(setup):
    """
    Check that admin_orders.delete_coupons works correctly - one'
    """
    collection = setup
    code = "SPRING2021"
    voucher = "10"
    admin_orders.add_coupon(code, voucher, collection)
    resp, resp_code = admin_orders.delete_coupon(code, collection)
    assert resp == "Successfully removed coupon"
    assert resp_code == 200

def test_delete_coupon_fail1(setup):
    """
    Check that admin_orders.delete_coupons fails if invalid code'
    """
    collection = setup
    resp, resp_code = admin_orders.delete_coupon("invalid code", collection)
    assert resp == 'Not a valid coupon'
    assert resp_code == 404

def test_get_order(setup2):
    """
    Check that admin_orders.get_order returns the correct order with correct inputs
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
    # Add catan to test_user's cart
    handle1 = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)

    gift_info = {
        "email": "hi@gmail.com",
        "message": "happy birthday"
    }
    add_to_collection = "True"
    resp =  user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    order_number = resp['order_number']
    resp2, code = admin_orders.get_order(order_number, transactions_collection)
    assert resp2['total_cost'] == 25
    assert resp2['order_number'] == resp['order_number']
    assert code == 200

def test_get_order_fail1(setup2):
    """
    Check that  admin_orders.get_order fails when given invalid order_number
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
    
    resp2, code =  admin_orders.get_order("invalid_order_number", transactions_collection)
    assert resp2 == "Order invalid_order_number not found"
    assert code == 404

def test_get_orders0(setup2):
    """
    Check that  admin_orders.get_orders returns list of user's orders - empty
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
        
    resp, code =  admin_orders.load_all_orders(transactions_collection)
    assert resp == []
    assert code == 200

def test_get_orders1(setup2):
    """
    Check that  admin_orders.get_orders returns list of user's orders
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
    # Add catan to test_user's cart
    handle1 = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)

    gift_email = ""
    add_to_collection = "True"
    resp =  user_orders.place_order(token, credit_card, shipping_info, gift_email, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    resp2, code =  admin_orders.load_all_orders(transactions_collection)
    assert resp2[0]['total_cost'] == 25
    assert len(resp2) == 1
    assert code == 200

def test_update_order_status(setup2):
    """
    Check that admin_orders.update_order_status correctly updates order status
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
    handle1 = "catan"
    quantity = '1'
    cart.add_product(token, quantity, handle1, users_collection, products_collection)

    gift_email = ""
    add_to_collection = "True"
    resp =  user_orders.place_order(token, credit_card, shipping_info, gift_email, add_to_collection, 
                                                users_collection, products_collection, transactions_collection)[0]
    
    order_number = resp['order_number']
    resp, code = admin_orders.update_order_status(order_number, "shipped", transactions_collection, users_collection)
    assert resp == f"Order {order_number} status updated to shipped"
    assert code == 200
    
    resp2, code = admin_orders.get_order(order_number, transactions_collection)
    assert code == 200
    assert resp2['status'] == "shipped"
    resp = user_orders.get_order(token, order_number, users_collection)[0]
    assert resp['status'] == "shipped"

def test_update_order_status_fail1(setup2):
    """
    Check that  admin_orders.update_order_status fails when given invalid order_number
    """
    users_collection, products_collection, transactions_collection, token, credit_card, shipping_info = setup2
    
    resp2, code =  admin_orders.get_order("invalid_order_number", transactions_collection)
    assert resp2 == "Order invalid_order_number not found"
    assert code == 404