"""
analytics
"""

import pandas as pd

def out_of_stock_items(products_collection):
    """
    Return all games out of stock in the database
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        resp <class 'str'>: List of games
        code <class 'int'>: HTTP response status code
    """
    data = []
    games = products_collection.find({"quantity": { "$eq" : 0}})
    for product in games:
        # Stringify for JSON purposes
        product['_id'] = str(product['_id'])
        product['last_updated'] = product['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        data.append(product)
    
    resp = {
        "message": f"There are {len(data)} items out of stock",
        "products": data
    }
    return resp, 200

def analytics(products_collection, users_collection, trans_collection):
    """
    Returns a variety of summary statistics with which to create a dashboard
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
        trans_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all transactions
    Returns:
        resp <class 'str'>: Dict containing summary stats and data to make graphs
        code <class 'int'>: HTTP response status code
    """
    # Return number of users
    num_users = users_collection.find().count()
    print("num_usrs:", num_users)

    # Total sales
    sales = trans_collection.find({})
    sales_df = pd.DataFrame(sales)
    total_sales = sum(sales_df['discount_cost'])
    print("total sales:", "${:.2f}".format(total_sales))

    num_sales = sales_df.shape[0]
    print("num sales:", num_sales)

    # Average sale value
    avg_sale_value = total_sales/num_sales
    print("avg sales value:", "${:.2f}".format(avg_sale_value))

    # Find most popular games
    games = products_collection.find({}, {'handle':1, 'in_users_collection':1, 'in_users_cart':1, 
                                            'categories':1, 'mechanics':1, 'primary_publisher':1,
                                            'description':1,
                                            'average_user_rating':1, '_id':0})

    games_df = pd.DataFrame(games)

    # Sort by in most collections
    games_df['in_num_collections'] = games_df['in_users_collection'].map(len)
    games_df2 = games_df.sort_values(by=['in_num_collections', 'average_user_rating'], ascending = False)
    top_10_collections = games_df2.head(10)

    # Games in most carts
    games_df['in_num_carts'] = games_df['in_users_cart'].map(len)
    games_df3 = games_df[games_df['in_num_carts'] > 0]
    games_df3 = games_df3.sort_values(by=['in_num_carts', 'average_user_rating'], ascending = False)
    top_10_carts = games_df3.head(10)
    
    # Recent transactions summary
    trans = trans_collection.find({})
    trans_df = pd.DataFrame(trans)
    trans_df['date'] = trans_df['date_purchased'].dt.date
    daily_sales = trans_df.groupby('date').agg({"discount_cost": ["count", "sum"]}).reset_index()
    daily_sales.columns = ["date", "count", "sum"]
    daily_sales = daily_sales.round(2)
    daily_sales['date'] = daily_sales['date'].apply(lambda x: x.strftime('%Y-%m-%d'))
    print(daily_sales)
    # daily_sales = daily_sales.set_index('date')

    # Most popularly bought games
    pop_games = {}

    trans_df.apply(lambda x: add_games_from_transactions(pop_games, x["products"]),axis=1)
    pop_games = dict(sorted(pop_games.items(), key=lambda item: item[1], reverse=True))
    pop_games_df = pd.DataFrame.from_dict(pop_games, orient='index').reset_index()
    pop_games_df.columns=["handle", "quantity"]
    pop_games_df = pop_games_df.head(10)

    resp = {
        "number_users": num_users,
        "number_sales": num_sales,
        "total_sales": "${:.2f}".format(total_sales),
        "average_sale_value": "${:.2f}".format(avg_sale_value),
        "top_games_collection_graph" : {"game_handles": list(top_10_collections['handle']), "num_collections": list(top_10_collections['in_num_collections'])},
        "top_games_cart_graph" : {"game_handles": list(top_10_carts['handle']), "num_carts": list(top_10_carts['in_num_carts'])},
        "top_games_bought_graph" : {"game_handles": list(pop_games_df['handle']), "num_carts": list(pop_games_df['quantity'])},
        "daily_sales_graph" : {"day": list(daily_sales['date']), "total_daily_sales": list(daily_sales['count'])},
        "daily_sales_value_graph" : {"day": list(daily_sales['date']), "total_daily_sales_value": list(daily_sales['sum'])}
    }

    return resp, 200
    

def add_games_from_transactions(pop_games, list_games):
    """
    Takes in transaction collection and adds games purchased to the pop_games dict 
    """
    for game in list_games:
        if game['handle'] in pop_games:
             pop_games[game['handle']] += game['quantity_in_cart']
        elif game['handle']:
             pop_games[game['handle']] = game['quantity_in_cart']
    return
