import datetime
import random
import string

import cart
from email_auth import place_order_email, gifting_email
import my_collection

def place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
                        users_collection, products_collection, transactions_collection):
    """
    Takes in a token and order info and if possible, places the order for the customer
        Args:
        token <class 'str'>: user token for identification
        credit_card <class 'dict'>: dictionary containing all customer credit card info
        shipping_info <class 'dict'>: dictionary containing all customer shipping info
        gift_email <class 'str'>: the email address of the friend to gist the item to
        add_to_collection <class 'boolean'>: boolean to determine whether to add the product to user's collection
        users_collection <class 'flask_pymongo.wrappers.Collection'>: user collection
        products_collection <class 'flask_pymongo.wrappers.Collection'>: products collection
        transactions_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all transactions
    Returns:
        resp <class 'dict'>: The dictionary containing the order if successful, an error message if not
        code <class 'int'>: HTTP response status code
    """     
    # TODO more error checking needed?

    # Check if the user exists in the database
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    
    transaction, code = cart.load_all_products(token, products_collection, users_collection)
    if code != 200:
        print('whoops')
    # Check if cart is empty
    if transaction['products'] == []:
        return("Nothing in the cart to checkout", 400)
    
    # Check if any items have become out of stock since they were added to cart
    for product in transaction['products']:
        quantity_in_cart = product['quantity_in_cart']
        quantity_in_db = products_collection.find_one({'handle': product['handle']})['quantity']
        quantity = quantity_in_db - quantity_in_cart
        if quantity < 0:
            return(f"{product['name']} is no longer available", 400)
    
    # add all of the transaction details
    transaction['payment'] = credit_card
    transaction['delivery'] = shipping_info
    transaction['user'] = user['email']
    transaction['status'] = 'pending'
    transaction['date_purchased'] = datetime.datetime.today()
    
    # Apply the shipping cost
    if shipping_info['shipping_method'] != 'Free':
        transaction['total_cost'] = transaction['total_cost'] + 10
        transaction['discount_cost'] = transaction['discount_cost'] + 10

    # Generate a unique order number
    transaction['order_number'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    other = transactions_collection.find_one({'order_number': transaction['order_number']})
    while other:
        other = transactions_collection.find_one({'order_number': transaction['order_number']})

    # Add to user's transaction list
    tran_list = user['transactions']
    tran_list.append(transaction)
    users_collection.update_one({"cur_token": token}, {"$set":{"transactions": tran_list}})

    # Add to transaction collection
    transactions_collection.insert_one(transaction)

    # Update the stock of each item
    for product in transaction['products']:
        quantity_in_cart = product['quantity_in_cart']
        quantity_in_db = products_collection.find_one({'handle': product['handle']})['quantity']
        quantity = quantity_in_db - quantity_in_cart
        products_collection.update_one({"handle": product['handle']}, {"$set":{"quantity": quantity}})

    # If add_to_collection, add each item to user's collection
    if add_to_collection == "True":
        for product in transaction['products']:
            my_collection.add_product(token, product['handle'], users_collection, products_collection)
    
    # Empty cart
    cart.empty_cart(token, users_collection, products_collection)

    # Stringify for JSON purposes
    transaction['_id'] = str(transaction['_id'])
    transaction['date_purchased'] = transaction['date_purchased'].strftime('%Y-%m-%d-%H:%M:%S')

    # Manage gift sending
    if gift_info:
        gifting_email(gift_info['email'], gift_info['name'], gift_info['message'], transaction['order_number'])
    place_order_email(user['email'], transaction['order_number'])

    return transaction, 200

def get_order(token, order_number, users_collection):
    """
    Takes in a token and order_number and returns the order if it exists in the user's orders
        Args:
        token <class 'str'>: user token for identification
        order_number <class 'str'>: unique order to identify order
        users_collection <class 'flask_pymongo.wrappers.Collection'>: user collection
    Returns:
        resp <class 'dict'>: The dictionary containing the order if successful, an error message if not
        code <class 'int'>: HTTP response status code
    """     
    # Check if the user exists in the database
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    
    transactions = user['transactions']
    for t in transactions:
        if t['order_number'] == order_number:
            t['date_purchased'] = t['date_purchased'].strftime('%Y-%m-%d-%H:%M:%S')
            return t, 200
    
    return f"Order {order_number} not found", 404

def load_all_orders(token, users_collection):
    """
    Takes in a token all orders made by that user if they exist
        Args:
        token <class 'str'>: user token for identification
        users_collection <class 'flask_pymongo.wrappers.Collection'>: user collection
    Returns:
        resp <class 'dict'>: A list of all orders made by that user
        code <class 'int'>: HTTP response status code
    """
    # Check if the user exists in the database
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    
    orders = user['transactions']
    orders.reverse()
    for order in orders:
        order['date_purchased'] = order['date_purchased'].strftime('%Y-%m-%d-%H:%M:%S')
    
    return orders, 200
