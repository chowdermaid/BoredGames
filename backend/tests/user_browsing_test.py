"""
tests for user_browsing.py
"""

import json
import pytest
from src.admin_product import add_product
from src.user_browsing import filter_all_products, collect_user_selected_tags
from src.routes import mongo

sample_game1 = "sample_game_catan.json"
sample_game2 = "sample_game_azul.json"

@pytest.fixture
def setup():
    """empty the test product database"""
    
    # Empty the test_products_collections in mongoDB
    collection = mongo.db.test_products_collection
    categories_collection = mongo.db.categories_collection   
    mechanics_collection = mongo.db.mechanics_collection   
    collection.delete_many({})
    return collection, categories_collection, mechanics_collection

def test_filter_all_products1(setup):
    """
    Check that filter_all_products successfully returns the correct game
    """
    collection, categories_collection, mechanics_collection = setup 
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    add_product(args, game, collection, categories_collection, mechanics_collection)
    resp, code = filter_all_products(None, 0, 300, 1990, 2000, 3, 8, 40, 90, 18, ["Dice Rolling"], [], 1, 5, 1, 5, collection)
    assert code == 200 
    assert len(resp) == 1
    assert resp[0]['name'] == "Catan"

def test_filter_all_products2(setup):
    """
    Check that filter_all_products successfully returns the correct games
    """
    collection, categories_collection, mechanics_collection = setup
    args = {'price': "25",
            'discount': "",
            'quantity': "" 
    }
    with open(sample_game1) as json_file:
        game = json.load(json_file)
    add_product(args, game, collection, categories_collection, mechanics_collection)
    with open(sample_game2) as json_file:
        game2 = json.load(json_file)
    add_product(args, game2, collection, categories_collection, mechanics_collection)
    resp, code = filter_all_products(None, 0, 300, 1990, 2020, 2, 4, 30, 90, 13, ["Trading"], ["Family Game", "Negotiation"], 1, 5, 1, 5, collection)
    assert code == 200 
    print(len(resp))
    assert len(resp) == 2
    assert resp[0]['name'] == "Catan"
    assert resp[1]['name'] == "Azul"

def test_collect_user_selected_tags(setup):
    """
    Check that collect_user_selected_tags successfully returns the correct tags
    """
    resp, code = collect_user_selected_tags("hi", 0, 70, 1, 50, 1, 10, 0, 100, 15, ["Dice Rolling"], ["Adventure"], 1, 5, 1, 4)
    assert code == 200 
    assert resp[0]['tag'] == 'search: hi'
    assert resp[3]['value'] == 'Adventure'