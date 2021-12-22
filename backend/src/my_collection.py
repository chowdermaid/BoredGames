"""
manages 'my collection' functionalities
"""


def add_product(token, handle, users_collection, products_collection):
    """
    Adds a given product handle to my_collection
    Args:
        token <class 'str'>: token of the user 
        handle <class 'str'>: details of game to store in database 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: products collection
        users_collection <class 'flask_pymongo.wrappers.Collection'>: users collection
    Returns:
        resp <class 'str'>: Whether adding the game was successful
        code <class 'int'>: HTTP response status code
    """
    
    # Check if the user exists and is logged in
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    email = user['email']

    # Check if the product exists 
    product = products_collection.find_one({'handle': handle})
    if not product:
        return('Not a valid product', 404)
    
    # Add the product handle to the user's my_collection
    my_col = user['my_collection']
    if handle not in my_col:
        my_col.append(handle)
        users_collection.update_one({"cur_token": token}, {"$set":{"my_collection": my_col}})
    else:
        return('Product already in collection', 400)

    # Add the username to the list of users that added this product to their collection
    prod_user_list = product['in_users_collection']
    if email not in prod_user_list:
        prod_user_list.append(email)
        products_collection.update_one({"handle": handle}, {"$set":{"in_users_collection": prod_user_list}})

    return ("Added product to my_collection", 200)


def delete_product(token, handle, users_collection, products_collection):
    """
    Remove a certain product from my_collection if present, return 404 if not
    Args:
        token <class 'str'>: token of the user 
        handle <class 'str'>: details of game to store in database 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: products collection
        users_collection <class 'flask_pymongo.wrappers.Collection'>: users collection
    Returns:
        resp <class 'str'>: Whether deletion was successful or not
        code <class 'int'>: HTTP response status code
    """
    # Check if the user exists and is logged in
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    email = user['email']

    # Check if the product exists 
    product = products_collection.find_one({'handle': handle})
    if not product:
        return('Not a valid product', 404)
    
    # If product in user list, remove
    my_col = user['my_collection']
    if handle in my_col:
        my_col.remove(handle)
        users_collection.update_one({"cur_token": token}, {"$set":{"my_collection": my_col}})
    else:
        return('Product not in my_collection', 404)

    # Remove the email from the list of users that have this product from their collection
    prod_user_list = product['in_users_collection']
    if email in prod_user_list:
        prod_user_list.remove(email)
        products_collection.update_one({"handle": handle}, {"$set":{"in_users_collection": prod_user_list}})

    return ("Removed product from my_collection", 200)


def load_all_products(token, products_collection, users_collection):
    """
    Access the games collection in the database, returns this data as a python list.
        Args:
        token <class 'str'>: token of the user 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: products collection
        users_collection <class 'flask_pymongo.wrappers.Collection'>: users collection
    Returns:
        data <class 'list'>: List of all games in my_collection
    """
    data = []

    # Check if the user exists in the database
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    
    # print(user)
    if "my_collection" in user:
        my_col = user["my_collection"]
    
        for p_handle in my_col:
            product = products_collection.find_one({'handle': p_handle})
            if product:
                # Stringify for JSON purposes
                product['_id'] = str(product['_id'])
                product['last_updated'] = product['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
                data.append(product)
    return (data, 200)
