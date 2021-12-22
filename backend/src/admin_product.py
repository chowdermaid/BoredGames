"""
admin product management functionalities
"""

import datetime
import json
import os
import requests
import re

from email_auth import discount_email
from helper_functions import category_id_to_name, mechanic_id_to_name

temp_file = 'temp_game.json'

def import_product(name, collection):
    """
    Imports a single product with the given name from Board Game Atlas API
    Args:
        name <class 'str'>: name of board game to import 
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to add game to
    Returns:
        filtered_game <class 'dict'>: Details of the imported game
        code <class 'int'>: HTTP response status code
    """
    # Check that name has been input correctly
    if not name:
        return('Please enter an input name', 400)
    elif not re.search('[a-zA-Z0-9]', name):
        return('Name must contain at least one alphamuneric character', 400)
    
    # Make the call to tv-maze
    url = 'https://api.boardgameatlas.com/api/search'
    headers = {'Accept': 'application/json'}
    params = {'client_id': 'JLBr5npPhV',
                'name': name,
                'fuzzy_match': 'true',
                'limit': '10'}
    r = requests.get(url, headers=headers, params=params)
    games = r.json()['games']

    if games == []:
        return(404, "Name did not match any games in Board Game Atlas - not found.")
    game = games[0]
    
    keys_to_extract = ['id', 'handle', 'url', 'name', 'price_au', 'price_text', 'discount', 'year_published',
                       'min_players', 'max_players', 'min_playtime', 'max_playtime', 'min_age', 
                       'description', 'thumb_url', 'image_url', 'matches_specs', 'specs', 
                       'mechanics', 'categories', 'primary_publisher', 'rules_url', 'amazon_rank', 
                       'official_url', 'comment_count', 'num_user_ratings', 'average_user_rating', 'active', 
                       'num_user_complexity_votes', 'average_learning_complexity', 'average_strategy_complexity', 
                       'visits', 'lists', 'mentions', 'links', 'rank', 'type', 'upc', 'trending_rank', 
                       'listing_clicks', 'tags', 'images', 'description_preview']
    filtered_game = {key: game[key] for key in keys_to_extract if key in game}
    # print(filtered_game)
    print("game ID:", filtered_game["id"])
    print("game price", filtered_game["price_au"])

    # Save the game for data preservation purposes
    with open(temp_file, 'w') as json_file:
        json.dump(filtered_game, json_file)      

    return (filtered_game, 200)

def add_product(args, game, collection, categories_collection, mechanics_collection):
    """
    Inserts a given game (including all details) into the database
    Args:
        args <class 'dict'>: fields of the game to edit from the database 
        game <class 'dict'>: details of game to store in database 
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to add game to
        categories_collection <class 'flask_pymongo.wrappers.Collection'>: collection of categories
        mechanics_collection <class 'flask_pymongo.wrappers.Collection'>: collection of mechanics
    Returns:
        game <class 'dict'>: Details of the stored game
        code <class 'int'>: HTTP response status code
    """
    
    # Check that price has been input correctly
    price = args['price']
    if not price:
        return('Please enter an input price', 400)
    elif not price.replace('.', '').isdigit():
        return('Price must be a number', 400)
    # Update game with input values
    else:
        game['price_au'] = float(price)
        game['price_text'] = "${:.2f}".format(float(price))
    
    # Check that discount has been input correctly
    discount = args['discount']
    if not discount:
        game['discount'] = 0
    elif not (discount.replace('.', '').isdigit() and float(discount) >= 0 and float(discount) <= 1):
        return('Discount must be a percentage - between 0 and 1', 400)
    # Update game with input values
    else:
        game['discount'] = float(discount)

    # Check that quantity has been input correctly
    quantity = args['quantity']
    if not quantity:
        game['quantity'] = 1
    elif not quantity.isdigit():
        return('Quantity must be an integer', 400)
    # Update game with input values
    else:
        game['quantity'] = int(quantity)
    
    # Check if the game is already in the database
    existing = collection.find_one({'id': game['id']})
    if existing:
        return('Product already exists, if you want to change details, go to edit product', 409)
    
    # Add name field to category and mechanics lists
    for category in game['categories']:
        category['name'] = category_id_to_name(category['id'], categories_collection)
    for mechanic in game['mechanics']:
        mechanic['name'] = mechanic_id_to_name(mechanic['id'], mechanics_collection)

    # Add game to the db
    game['in_users_collection'] = []
    game['in_users_cart'] = []
    game['last_updated'] = datetime.datetime.today()
    # print(type(game['last_updated']), game['last_updated'])
    doc_id = collection.insert_one(game)

    # Need to convert last_updated to a string so that it can be serialised for JSON
    game['last_updated'] = game['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
    # Need to convert '_id' to string so that it can be serialised for JSON purposes
    game['_id'] = str(game['_id'])

    # id = str(doc_id.inserted_id)
    # print(id) #database id of newly inserted game
    
    return (game, 200)

def load_all_products(collection):
    """
    Access the games collection in the database, returns this data as a python list.
        Args:
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to add game to
    Returns:
        data <class 'list'>: List of all games stored in database
    """
    data = []
    for item in collection.find():
        # print(item)
        # Need to convert '_id' to string so that it can be serialised for JSON purposes
        item['_id'] = str(item['_id'])
        item['last_updated'] = item['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        data.append(item)
    return data

def get_product(id, collection):
    """
    Retrieve a certain game from the database if it exists, returns 404 if not
    Args:
        id <class 'str'>: id of the game to retrieve from the database 
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to retrieve game from
    Returns:
        item <class 'dict'>: Details of the stored game
        code <class 'int'>: HTTP response status code
    """
    item = collection.find_one({'id': id})

    if item:
        # Need to convert '_id' to string so that it can be serialised for JSON purposes
        item['_id'] = str(item['_id'])
        item['last_updated'] = item['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        return (item, 200)
    else:   
        return("Product {} doesn't exist".format(id), 404)

def delete_product(id, products_collection, users_collection):
    """
    Delete a certain game from the database if it exists, returns 404 if not
    Args:
        id <class 'str'>: id of the game to delete from the database 
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to delete game from
    Returns:
        code <class 'int'>: HTTP response status code
    """
    # Remove the product handle from each user who has it in their collection
    # Check if the product exists 
    product = products_collection.find_one({'id': id})
    if not product:
        return("Product {} doesn't exist".format(id), 404)
    for email in product['in_users_collection']:
        user = users_collection.find_one({'email': email})
        if user and product['handle'] in user['my_collection']:
            my_col = user['my_collection']
            my_col.remove(product['handle'])
            users_collection.update_one({"email": email}, {"$set":{"my_collection": my_col}})

    result = products_collection.delete_one({'id': id})

    if result.deleted_count:
        return ("Product successfully deleted", 200)
    else:
       return("Product {} doesn't exist".format(id), 404)

def edit_product(args, id, collection):
    """
    Edits a certain game from the database if it exists, returns 404 if not
    Args:
        args <class 'dict'>: fields of the game to edit from the database 
        id <class 'str'>: id of the game to edit from the database 
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to delete game from
    Returns:
        code <class 'int'>: HTTP response status code
    """
    # Check that price has been input correctly
    price = args['price']
    if price and not price.replace('.', '').isdigit():
        return('Price must be a number', 400)
    
    discount = args['discount']
    if discount and not (discount.replace('.', '').isdigit() and float(discount) >= 0 and float(discount) <= 1):
        return('Discount must be a percentage - between 0 and 1', 400)
    
    quantity = args['quantity']
    if quantity and not quantity.isdigit():
        return('Quantity must be an integer', 400)
    
    # Check if the game is already in the database
    existing = collection.find_one({'id': id})
    if not existing:
        return("Product {} doesn't exist".format(id), 404)
    
    description = args['description']
    description_preview = args['description_preview']
    resp = {}

    # Update game with input values
    updated = False
    if price:
        collection.update_one({"id": id}, {"$set":{"price_au": float(price)}})
        price_text = "${:.2f}".format(float(price))
        collection.update_one({"id": id}, {"$set":{"price_text": price_text}})
        updated = True
        resp['price_au'] = price
        resp['price_text'] = price_text
    if discount:
        collection.update_one({"id": id}, {"$set":{"discount": float(discount)}})
        updated = True
        if float(discount) != 0:
            discount_email('dominic.h.wong@student.unsw.edu.au', discount, existing['name'])
        resp['discount'] = discount
    if quantity:
        collection.update_one({"id": id}, {"$set":{"quantity": int(quantity)}})
        updated = True
        resp['quantity'] = quantity
    if description:
        collection.update_one({"id": id}, {"$set":{"description": description}})
        updated = True
        resp['description'] = description
    if description_preview:
        collection.update_one({"id": id}, {"$set":{"description_preview": description_preview}})
        updated = True
        resp['description_preview'] = description_preview
    
    if updated:
        time = datetime.datetime.today()
        collection.update_one({"id": id}, {"$set":{"last_updated": time}})
        resp['last_updated'] = time.strftime('%Y-%m-%d-%H:%M:%S')

    resp['message'] = "Product successfully updated"
    return (resp, 200)

def remove_all(collection):
    clear = collection.delete_many({})
    return(f"{clear.deleted_count} products deleted", 200)

def populate(collection, categories_collection, mechanics_collection):
    keys_to_extract = ['id', 'handle', 'url', 'name', 'price_au', 'price_text', 'discount', 'year_published',
                       'min_players', 'max_players', 'min_playtime', 'max_playtime', 'min_age', 
                       'description', 'thumb_url', 'image_url', 'matches_specs', 'specs', 
                       'mechanics', 'categories', 'primary_publisher', 'rules_url', 'amazon_rank', 
                       'official_url', 'comment_count', 'num_user_ratings', 'average_user_rating', 'active', 
                       'num_user_complexity_votes', 'average_learning_complexity', 'average_strategy_complexity', 
                       'visits', 'lists', 'mentions', 'links', 'rank', 'type', 'upc', 'trending_rank', 
                       'listing_clicks', 'tags', 'images', 'description_preview']
    
    # Make call to board game atlas API
    url = 'https://api.boardgameatlas.com/api/search'
    headers = {'Accept': 'application/json'}
    count = 0
    for i in range(5):
        params = {'client_id': 'JLBr5npPhV',
                    'limit': '100',
                    'skip': str(i*100)}
        r = requests.get(url, headers=headers, params=params)
        games = r.json()['games']
        for game in games:
            filtered_game = {key: game[key] for key in keys_to_extract if key in game}
            
            price = "35"
            if "price_au" in filtered_game and float(filtered_game['price_au']) != 0:
                price = filtered_game['price_au']
            elif "price" in game and float(game['price']) != 0:
                price = game['price']

            args = {'price': price,
                'discount': "",
                'quantity': "10" 
            }
            code = add_product(args, filtered_game, collection, categories_collection, mechanics_collection)[1]
            if code == 200:
                count += 1
    return(f"Added {count} games to the database", 200)

########################
### Helper functions ###
########################

def load_temp_game():
    if not os.path.exists(temp_file):
        return
    with open(temp_file) as json_file:
        game = json.load(json_file)
    return game