"""
tests for admin_product.py
"""

import pytest
import json
from src.admin_product import import_product, add_product, load_all_products, get_product, edit_product, delete_product
from src.routes import mongo

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"


@pytest.fixture
def setup():
    """empty the test product database"""
    # print("setup")
    
    # Empty the test_products_collections in mongoDB
    collection = mongo.db.test_products_collection
    categories_collection = mongo.db.categories_collection   
    mechanics_collection = mongo.db.mechanics_collection   
    collection.delete_many({})
    return collection, categories_collection, mechanics_collection

def test_import_product(setup):
    """
    Check that import_product successfully imports a game with a valid name input
    """
    name = "catan"
    collection, categories_collection, mechanics_collection = setup
    resp, code = import_product(name, collection)
    assert code == 200
    assert resp["name"] == "Catan"
    assert resp["min_players"] == 3
    assert "msrp" not in resp.keys()

def test_import_product_fail1(setup):
    """
    Check that import_product returns the correct error message and code when no input name given
    """
    name = ""
    collection, categories_collection, mechanics_collection = setup
    resp, code = import_product(name, collection)
    assert code == 400
    assert resp == 'Please enter an input name'
    
def test_import_product_fail2(setup):
    """
    Check that import_product returns the correct error message and code when non-alphanumeric name given
    """
    name = "&&!!"
    collection, categories_collection, mechanics_collection = setup
    resp, code = import_product(name, collection)
    assert code == 400
    assert resp == 'Name must contain at least one alphamuneric character'

def test_add_product(setup):
    """
    Check that add_product successfully saves a game to the database with valid input
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    resp2, code2 = add_product(args, game, collection, categories_collection, mechanics_collection)
    assert code2 == 200
    assert resp2["name"] == "Catan"
    id = resp2["id"]
    resp3, code3 = get_product(id, collection)
    assert code3 == 200
    assert resp3["name"] == "Catan"
    assert resp3["price_au"] == 25
    assert resp3["price_text"] == "$25.00"
    assert resp3["quantity"] == 3

def test_add_product2(setup):
    """
    Check that add_product successfully saves a game to the database with valid input
    Checking the default values
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    resp2, code2 = add_product(args, game, collection, categories_collection, mechanics_collection)
    assert code2 == 200
    assert resp2["name"] == "Catan"
    id = resp2["id"]
    resp3, code3 = get_product(id, collection)
    assert code3 == 200
    assert resp3["name"] == "Catan"
    assert resp3["price_au"] == 25.00
    assert resp3["price_text"] == "$25.00"
    assert resp3["quantity"] == 1
    assert resp3["discount"] == 0

def test_add_product_fail1(setup):
    """
    Check that add_product returns the correct error message and code when no price given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "",
            'discount': "0.05",
            'quantity': "3" 
    }
    resp2, code2 = add_product(args, game, collection, categories_collection, mechanics_collection)
    assert code2 == 400
    assert resp2 == 'Please enter an input price'

def test_add_product_fail2(setup):
    """
    Check that add_product returns the correct error message and code when no price given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "3.s",
            'discount': "0.05",
            'quantity': "3" 
    }
    resp2, code2 = add_product(args, game, collection, categories_collection, mechanics_collection)
    assert code2 == 400
    assert resp2 == 'Price must be a number'

def test_add_product_fail3(setup):
    """
    Check that add_product returns the correct error message and code when a duplicate product is added
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    resp2, code2 = add_product(args, game, collection, categories_collection, mechanics_collection)
    assert code2 == 409
    assert resp2 == 'Product already exists, if you want to change details, go to edit_product'

def test_load_all_products0(setup):
    """
    Check that load_all_products returns all products - no products
    """
    collection, categories_collection, mechanics_collection = setup
    resp = load_all_products(collection)
    assert len(resp) == 0

def test_load_all_products1(setup):
    """
    Check that load_all_products returns all products - single product
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    resp3 = load_all_products(collection)
    assert len(resp3) == 1
    assert resp3[0]["name"] == 'Catan'

def test_load_all_products2(setup):
    """
    Check that load_all_products returns all products - two products
    """
    collection, categories_collection, mechanics_collection = setup
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    with open(sample_game1) as json_file:
        resp = json.load(json_file)
    add_product(args, resp, collection, categories_collection, mechanics_collection)
    with open(sample_game2) as json_file:
        resp2 = json.load(json_file)
    add_product(args, resp2, collection, categories_collection, mechanics_collection)
    resp3 = load_all_products(collection)
    assert len(resp3) == 2
    assert resp3[0]["name"] == 'Catan'
    assert resp3[1]["name"] == 'Azul'

def test_get_product(setup):
    """
    Check that get_product returns the correct product
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    resp2, code2 = get_product(game["id"], collection)
    assert code2 == 200
    assert resp2["id"] == game["id"]
    assert resp2["name"] == "Catan"
    assert resp2["min_players"] == 3

def test_get_product_fail1(setup):
    """
    Check that get_product returns the correct error message and code when no id given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        resp = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, resp, collection, categories_collection, mechanics_collection)
    resp2, code2 = get_product("", collection)
    assert code2 == 404
    assert resp2 == "Product  doesn't exist"


def test_get_product_fail2(setup):
    """
    Check that get_product returns the correct error message and code the game is not in db
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        resp = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, resp, collection, categories_collection, mechanics_collection)
    resp2, code2 = get_product("not_a_product", collection)
    assert code2 == 404
    assert resp2 == "Product not_a_product doesn't exist"


def test_edit_product(setup):
    """
    Check that edit_product returns the correct error message and code when no price given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    args = {'price': "35",
            'discount': "0.10",
            'quantity': "5" ,
            'description': "" ,
            'description_preview': "" 
    }
    resp2, code2 = edit_product(args, game['id'], collection)
    assert code2 == 200
    assert float(resp2['price_au']) == 35
    assert int(resp2["quantity"]) == 5
    assert float(resp2["discount"]) == 0.1
    resp3, code3 = get_product(game['id'], collection)
    assert code3 == 200
    assert resp3['price_au'] == 35
    assert resp3['price_text'] == "$35.00"
    assert resp3["quantity"] == 5
    assert resp3["discount"] == 0.1

def test_edit_product_fail1(setup):
    """
    Check that edit_product returns the correct error message and code when incorrect price given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    args = {'price': "3.er",
            'discount': "0.10",
            'quantity': "5" ,
            'description': "" ,
            'description_preview': "" 
    }
    resp2, code2 = edit_product(args, game['id'], collection)
    assert code2 == 400
    assert resp2== "Price must be a number"

def test_edit_product_fail2(setup):
    """
    Check that edit_product returns the correct error message and code when incorrect discount given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    args = {'price': "",
            'discount': "1.10",
            'quantity': "5" ,
            'description': "" ,
            'description_preview': "" 
    }
    resp2, code2 = edit_product(args, game['id'], collection)
    assert code2 == 400
    assert resp2== "Discount must be a percentage - between 0 and 1"

def test_edit_product_fail3(setup):
    """
    Check that edit_product returns the correct error message and code when incorrect discount given
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    args = {'price': "",
            'discount': "0.10",
            'quantity': "5.4" ,
            'description': "" ,
            'description_preview': "" 
    }
    resp2, code2 = edit_product(args, game['id'], collection)
    assert code2 == 400
    assert resp2== "Quantity must be an integer"

def test_edit_product_fail3(setup):
    """
    Check that edit_product returns the correct error message and code when product does not exist
    """
    collection, categories_collection, mechanics_collection = setup
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    args = {'price': "25",
            'discount': "0.05",
            'quantity': "3" 
    }
    add_product(args, game, collection, categories_collection, mechanics_collection)
    args = {'price': "",
            'discount': "0.10",
            'quantity': "" ,
            'description': "" ,
            'description_preview': "" 
    }
    resp2, code2 = edit_product(args, "not_a_product", collection)
    assert code2 == 404
    assert resp2== "Product not_a_product doesn't exist"

def test_delete_product(setup):
    """
    Check that delete_product deletes the correct game from the db
    """
    products_collection, categories_collection, mechanics_collection = setup
    users_collection = mongo.db.test_users_collection

    with open(sample_game1) as json_file:
        resp = json.load(json_file)
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    add_product(args, resp, products_collection, categories_collection, mechanics_collection)
    resp2, code2 = delete_product(resp["id"], products_collection, users_collection)
    assert code2 == 200
    assert resp2 == "Product successfully deleted"
    resp3, code3 = get_product(resp['id'], products_collection)
    assert code3 == 404
    assert resp3 == f"Product {resp['id']} doesn't exist"


def test_delete_product_fail1(setup):
    """
    Check that delete_product returns the correct error message and code when no game name given
    """
    products_collection, categories_collection, mechanics_collection = setup
    users_collection = mongo.db.test_users_collection
    resp2, code2 = delete_product("", products_collection, users_collection)
    assert code2 == 404
    assert resp2 == "Product  doesn't exist"


def test_delete_product_fail2(setup):
    """
    Check that delete_product returns the correct error message and code when game not in db
    """
    products_collection, categories_collection, mechanics_collection = setup
    users_collection = mongo.db.test_users_collection
    resp2, code2 = delete_product("not_a_product", products_collection, users_collection)
    assert code2 == 404
    assert resp2 == "Product not_a_product doesn't exist"