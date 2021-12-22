"""
tests for my_collection.py
"""

import json
import pytest
from src import admin_product
from src import my_collection
from src.routes import mongo
from src.account import register

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"


@pytest.fixture
def setup():
    """empty the test product database"""
   
    # Empty the test_products_collections in mongoDB
    products_collection = mongo.db.test_products_collection
    categories_collection = mongo.db.categories_collection   
    mechanics_collection = mongo.db.mechanics_collection   

    products_collection.delete_many({})
    # Load two sample games into the db
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
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

def test_add_my_collection(setup):
    """
    Check that my_collection.add_product successfully adds a product to user's 'my_collection'
    """
    products_collection, users_collection, token = setup
    # print(products_collection, users_collection, token, name)
    # Add catan to test_user's collection
    handle = "catan"
    id = "OIXt3DmJU0"
    my_collection.add_product(token, handle, users_collection, products_collection)
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" in resp['in_users_collection']
    assert "test3@gmail.com" not in resp['in_users_collection']

    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle in user['my_collection']
    assert code == 200

def test_add_my_collection_fail1(setup):
    """
    Check that my_collection.add_product does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = my_collection.add_product("invalid_token", handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_add_my_collection_fail2(setup):
    """
    Check that my_collection.add_product does not work with an invalid product
    """
    products_collection, users_collection, token = setup
    resp, code = my_collection.add_product(token, "invalid_handle", users_collection, products_collection)

    assert resp == 'Not a valid product'
    assert code == 404

def test_add_my_collection_fail3(setup):
    """
    Check that my_collection.add_product does not work with a product already in the collection
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    id = "OIXt3DmJU0"
    my_collection.add_product(token, handle, users_collection, products_collection)
    resp, code = my_collection.add_product(token, handle, users_collection, products_collection)
    assert resp == "Product already in collection"
    assert code == 400

def test_delete_my_collection(setup):
    """
    Check that my_collection.delete_product successfully removes a product to user's 'my_collection'
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    handle = "catan"
    id = "OIXt3DmJU0"
    my_collection.add_product(token, handle, users_collection, products_collection)
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" in resp['in_users_collection']
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle in user['my_collection']
    resp, code = my_collection.delete_product(token, handle, users_collection, products_collection)
    assert resp == "Removed product from my_collection"
    assert code == 200
    
    resp, code = admin_product.get_product(id, products_collection)
    assert "test2@gmail.com" not in resp['in_users_collection']
    user = users_collection.find_one({'email': "test2@gmail.com"})
    assert handle not in user['my_collection']

def test_delete_my_collection_fail1(setup):
    """
    Check that my_collection.delete_product does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = my_collection.delete_product("invalid_token", handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400

def test_delete_my_collection_fail2(setup):
    """
    Check that my_collection.delete_product does not work with an invalid product
    """
    products_collection, users_collection, token = setup
    resp, code = my_collection.delete_product(token, "invalid_handle", users_collection, products_collection)

    assert resp == 'Not a valid product'
    assert code == 404

def test_delete_my_collection_fail3(setup):
    """
    Check that my_collection.delete_product does not work with a product not in the collection
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = my_collection.delete_product(token, handle, users_collection, products_collection)
    assert resp == "Product not in my_collection"
    assert code == 404

def test_load_my_collection0(setup):
    """
    Check that my_collection.load_all_products successfully returns products from 'my_collection', empty collection
    """
    products_collection, users_collection, token = setup
    # Add catan to test_user's collection
    resp, code = my_collection.load_all_products(token, products_collection, users_collection)
    assert resp == []
    assert code == 200

def test_load_my_collection1(setup):
    """
    Check that my_collection.load_all_products successfully returns products from 'my_collection', one product
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    my_collection.add_product(token, handle, users_collection, products_collection)
    resp, code = my_collection.load_all_products(token, products_collection, users_collection)
    assert handle == resp[0]['handle']
    assert len(resp) == 1
    assert code == 200

def test_load_my_collection2(setup):
    """
    Check that my_collection.load_all_products successfully returns products from 'my_collection', two products
    """
    products_collection, users_collection, token = setup
    handle1 = "catan"
    my_collection.add_product(token, handle1, users_collection, products_collection)
    handle2 = "azul"
    my_collection.add_product(token, handle2, users_collection, products_collection)
    resp, code = my_collection.load_all_products(token, products_collection, users_collection)
    assert handle1 == resp[0]['handle']
    assert handle2 == resp[1]['handle']
    assert len(resp) == 2
    assert code == 200

def test_load_my_collection_fail1(setup):
    """
    Check that my_collection.load_all_products does not work with an invalid token
    """
    products_collection, users_collection, token = setup
    handle = "catan"
    resp, code = my_collection.delete_product("invalid_token", handle, users_collection, products_collection)

    assert resp == 'Not a valid user'
    assert code == 400
