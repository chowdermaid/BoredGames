"""
manages cart functionalities
"""

def add_product(token, quantity, handle, users_collection, products_collection):
    """
    Adds a given product handle to cart
    Args:
        token <class 'str'>: token of the user 
        quantity <class 'str'>: quantity of product to be added to cart 
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

    # Check if the quantity value is valid
    if not quantity:
        quantity = 1
    elif not quantity.isdigit():
        return('Quantity must be an integer', 400)
    else:
        quantity = int(quantity)
    
    # Check that the product is in stock and enough to add to cart
    if product['quantity'] == 0:
        return('Out of stock :(', 400)
    if quantity > product['quantity']:
        return('Quantity must not be greater than quantity in store', 400)

    # Add the product handle to the user's my_collection
    cart = user['cart']
    if handle not in cart:
        cart[handle] = quantity
        users_collection.update_one({"cur_token": token}, {"$set":{"cart": cart}})
    else:
        return('Product already in cart', 400)

    # Add the username to the list of users that added this product to their collection
    prod_user_list = product['in_users_cart']
    prod_user_list.append(email)
    products_collection.update_one({"handle": handle}, {"$set":{"in_users_cart": prod_user_list}})

    return ("Added product to cart", 200)

def edit_quantity(token, quantity, handle, users_collection, products_collection):
    """
    Edits the quantity of a given product in cart
    Args:
        token <class 'str'>: token of the user 
        quantity <class 'str'>: quantity of product to be added to cart 
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

    # Check if the product exists 
    product = products_collection.find_one({'handle': handle})
    if not product:
        return('Not a valid product', 404)
    
    # Check that the product is in stock and enough to add to cart
    quantity = int(quantity)
    if product['quantity'] == 0:
        return('Out of stock :(', 400)
    if quantity > product['quantity']:
        return('Quantity must not be greater than quantity in store', 400)

    # Add the product handle to the user's my_collection
    cart = user['cart']
    if handle in cart:
        cart[handle] = quantity
        users_collection.update_one({"cur_token": token}, {"$set":{"cart": cart}})
    else:
        return('Cannot edit product not in cart', 400)

    return (f"Updated quantity in cart to {quantity}", 200)

def delete_product(token, handle, users_collection, products_collection):
    """
    Remove a certain product from cart if present, return 404 if not
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
    cart = user['cart']
    if handle in cart:
        cart.pop(handle)
        users_collection.update_one({"cur_token": token}, {"$set":{"cart": cart}})
    else:
        return('Product not in cart', 404)

    # Remove the email from the list of users that have this product to their collection
    prod_user_list = product['in_users_cart']
    prod_user_list.remove(email)
    products_collection.update_one({"handle": handle}, {"$set":{"in_users_cart": prod_user_list}})

    return ("Removed product from cart", 200)

def load_all_products(token, products_collection, users_collection):
    """
    Load all items in cart from the database, returns this data as a python list.
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
    cart = user['cart']
    total_cost = 0
    for p_handle, p_quantity in cart.items():
        product = products_collection.find_one({'handle': p_handle})
        if product:
            # Stringify for JSON purposes
            product['_id'] = str(product['_id'])
            product['last_updated'] = product['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
            product['quantity_in_cart'] = p_quantity
            data.append(product)
            total_cost = total_cost + int(p_quantity)*float(product['price_au'])*(1-float(product['discount']))

    discount_cost = total_cost
    if 'discount' in cart:
        voucher = cart['discount']
        if voucher < 1:
           discount_cost = total_cost*(1-voucher) 
        else:
            discount_cost = total_cost - voucher

    resp = {'total_cost': total_cost,
            'discount_cost': discount_cost,
            'products': data}
    return (resp, 200)

def empty_cart(token, users_collection, products_collection):
    """
    Empty entire cart
    Args:
        token <class 'str'>: token of the user 
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

    # If product in user list, remove
    cart = user['cart']
    if 'discount' in cart:
        cart.pop('discount')

    count = 0
    for p_name in list(cart):
        # Remove product from cart  and from product's 'in_users_cart'
        code = delete_product(token, p_name, users_collection, products_collection)[1]
        if code == 200:
            count += 1

    return (f"Emptied {count} products from cart", 200)

def apply_coupon(token, coupon_code, users_collection, coupon_collection):
    """
    Applies to coupon to the cart of a given customer
        Args:
        token <class 'str'>: token of the user 
        coupon_code <class 'str'>: coupon code
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of users
        coupon_collection <class 'flask_pymongo.wrappers.Collection'>: collection of coupons
    Returns:
        resp <class 'dict'>: Success or failure message
        code <class 'int'>: HTTP response status code
    """    
    # Check if the user exists and is logged in
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)

    # Check if the coupon exists 
    coupon = coupon_collection.find_one({'code': coupon_code})
    if not coupon:
        return('Not a valid coupon', 404)
    
    # Update the coupon applied to the cart
    cart = user['cart']
    cart['discount'] = coupon['voucher']
    users_collection.update_one({"cur_token": token}, {"$set":{"cart": cart}})

    # 
    voucher = coupon['voucher']
    if voucher < 1:
        discount = "{:.0f}%".format(voucher*100) 
    else:
        discount = "${:.2f}".format(voucher)

    return(f'{discount} discount applied', 200)