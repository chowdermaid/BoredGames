"""
manages orders for admin
"""
from email_auth import coupon_email

def add_coupon(code, voucher, collection):
    """
    Adds a coupon to the collection of coupons
        Args:
        code <class 'str'>: coupon code
        voucher <class 'str'>: percentage discount/x dollars off the order
        collection <class 'flask_pymongo.wrappers.Collection'>: collection of coupons
    Returns:
        resp <class 'dict'>: Success or failure message
        code <class 'int'>: HTTP response status code
    """     
    # Check that voucher has been input correctly
    if not voucher:
        return('Voucher must be non-empty', 400)
    elif not voucher.replace('.', '').isdigit() or float(voucher) <= 0:
        return('Voucher must be a positive number', 400)
    else:
        voucher = float(voucher)

    coupon = collection.find_one({'code': code})
    if coupon:
        collection.delete_one({'code': code})
    
    if voucher < 1:
        voucher_text = "{:.0f}%".format(float(voucher)*100)
    else:
        voucher_text = "${:.2f}".format(float(voucher))

    coupon = {
        'code': code,
        'voucher': voucher,
        'voucher_text': voucher_text
    }
    collection.insert_one(coupon)
    coupon_email('dominic.h.wong@student.unsw.edu.au', coupon['code'], coupon['voucher_text'])

    return(f"Successfully added {voucher_text} coupon", 200)

def get_coupons(collection):
    """
    Return all coupons
        Args:
        collection <class 'flask_pymongo.wrappers.Collection'>: collection of coupons
    Returns:
        coupons <class 'list'>: List of all coupons stored in database
    """
    coupons = []
    for item in collection.find():
        item['_id'] = str(item['_id'])
        coupons.append(item)
    return coupons

def delete_coupon(code, collection):
    """
    Adds a coupon to the collection of coupons
        Args:
        code <class 'str'>: coupon code
        collection <class 'flask_pymongo.wrappers.Collection'>: collection of coupons
    Returns:
        resp <class 'dict'>: Success or failure message
        code <class 'int'>: HTTP response status code
    """    
    # Check if the product exists 
    coupon = collection.find_one({'code': code})
    if not coupon:
        return('Not a valid coupon', 404)
    collection.delete_one({'code': code})
    return("Successfully removed coupon", 200)

def get_order(order_number, transaction_collection):
    """
    Takes in a token and order_number and returns the order if it exists in the user's orders
        Args:
        order_number <class 'str'>: unique order to identify order
        transaction_collection <class 'flask_pymongo.wrappers.Collection'>: transaction collection
    Returns:
        resp <class 'dict'>: The dictionary containing the order if successful, an error message if not
        code <class 'int'>: HTTP response status code
    """     
    order = transaction_collection.find_one({'order_number': order_number})
    if order:
        order['_id'] = str(order['_id'])
        order['date_purchased'] = order['date_purchased'].strftime('%Y-%m-%d-%H:%M:%S')
        return order, 200
    
    return f"Order {order_number} not found", 404

def load_all_orders(transaction_collection):
    """
    Takes in a token all orders made by that user if they exist
        Args:
        transaction_collection <class 'flask_pymongo.wrappers.Collection'>: transaction collection
    Returns:
        resp <class 'dict'>: A list of all orders
        code <class 'int'>: HTTP response status code
    """
    orders = []
    for order in transaction_collection.find().sort("date_purchased", -1):
        for product in order['products']:
            product['_id'] = str(product['_id'])
        order['_id'] = str(order['_id'])
        order['date_purchased'] = order['date_purchased'].strftime('%Y-%m-%d-%H:%M:%S')
        orders.append(order)
    
    return orders, 200

def update_order_status(order_number, order_status, transaction_collection, users_collection):
    """
    Takes in a token and order_number and returns the order if it exists in the user's orders
        Args:
        order_number <class 'str'>: unique order to identify order
        order_status <class 'str'>: the new status to update the order to
        transaction_collection <class 'flask_pymongo.wrappers.Collection'>: transaction collection
        users_collection <class 'flask_pymongo.wrappers.Collection'>: users collection
    Returns:
        resp <class 'dict'>: The dictionary containing the order if successful, an error message if not
        code <class 'int'>: HTTP response status code
    """     
    order = transaction_collection.find_one({'order_number': order_number})
    user_email = order['user']
    user = users_collection.find_one({'email': user_email})
    if order and user:
        # Update the status of the copy of the order stored in the user's document in users_collection
        for t in user['transactions']:
            if t['order_number'] == order_number:
                t['status'] = order_status
        users_collection.update_one({"email": user_email}, {"$set":{"transactions": user['transactions']}})
        # Update te status of the copy of the order in the transaction_collection
        transaction_collection.update_one({"order_number": order_number}, {"$set":{"status": order_status}})
        return f"Order {order_number} status updated to {order_status}", 200
    
    return f"Order {order_number} not found", 404