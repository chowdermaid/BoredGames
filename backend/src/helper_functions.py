import requests
# from routes import mongo

# def populate():
#     """
#     Function to populate mechanics/categories collection - no need to re-run
#     """
#     # Make call to board game atlas API
#     url = 'https://api.boardgameatlas.com/api/game/categories'
#     headers = {'Accept': 'application/json'}
#     params = {'client_id': 'JLBr5npPhV',
#               'pretty': 'true'}
#     r = requests.get(url, headers=headers, params=params)
#     mech = r.json()['categories']
#     categories_collection = mongo.db.categories_collection
#     categories_collection.insert_many(mech)
#     return

def category_id_to_name(id, categories_collection):
    """
    Takes a given ID and returns the equivalent category name if it exists
    Args:
        id <class 'str'>: category ID 
        categories_collection <class 'flask_pymongo.wrappers.Collection'>: collection of categories
    Returns:
        name <class 'str'>: category name
    """
    # categories_collection = mongo.db.categories_collection   
    product = categories_collection.find_one({'id': id})
    if product:
        return product['name']
    return

def mechanic_id_to_name(id, mechanics_collection):
    """
    Takes a given ID and returns the equivalent mechanic name if it exists
    Args:
        id <class 'str'>: mechanic ID
        mechanics_collection <class 'flask_pymongo.wrappers.Collection'>: collection of mechanics 
    Returns:
        name <class 'str'>: mechanic name
    """
    # mechanics_collection = mongo.db.mechanics_collection   
    mechanic = mechanics_collection.find_one({'id': id})
    if mechanic:
        return mechanic['name']
    return
