"""
manages accounts
"""

import bcrypt
import re
import uuid
from email_auth import send_email, reset_password_email

def register(username, email, password, cpassword, users):
    """
    Registers a user into the database
    Args:
        username <class 'str'>: name of the user
        email <class 'str'>: email of the user
        password <class 'str'>: password of the user
        confirm password <class 'str'>: confirmation password of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        token <class 'str'>: Token for authentication
        code <class 'int'>: HTTP response status code
    """
    existing_user = users.find_one({'email' : email})

    # Check if email is valid
    if valid_email(email) == False:
        return ("Please use the format: name@email.com", 400)

    # Check if password is valid
    if valid_password(password, cpassword) == False:
        return (password_err_msg(password, cpassword), 400)

    # Insert user into db if no existing user is found
    if existing_user is None:
        hashedpass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # generate token
        token = str(uuid.uuid4())
        # if collection is empty, make admin
        if users.count() == 0:
            users.insert_one({'username' : username,'email' : email, 'password' : hashedpass, 'cur_token' : token, 'is_admin' : True, 'my_collection' : [], 'cart' : {}, 'transactions' : []})
        else:
            users.insert_one({'username' : username,'email' : email, 'password' : hashedpass, 'cur_token' : token, 'is_admin' : False, 'my_collection' : [], 'cart' : {}, 'transactions' : []})
        send_email(email)
        return ({'token' : token}, 200)

    # Else, user is already registered
    else:
        return (f"{email} is already registered", 404)

def login(email, password, users):
    """
    Login for user
    Args:
        email <class 'str'>: email of the user
        password <class 'str'>: password of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        token <class 'str'>: Token for authentication
        code <class 'int'>: HTTP response status code
    """
    user = users.find_one({'email' : email})
    # Check if user already logged in
    # if user and user['cur_token']:
    #     return("User already logged in elsewhere, please log out before logging in", 400)

    # Check if email is valid
    if valid_email(email) == False:
        return ("Please use the format: name@email.com", 400)

    # Check if user is already registered
    if user is None:
        return (f"{email} was not found", 404)
    else:
        # Check if password matches
        if bcrypt.hashpw(password.encode('utf-8'), user['password']) == user['password']:
            token = str(uuid.uuid4())
            users.update_one({'email' : email}, {'$set': {'cur_token': token}})
            return ({'token' : token}, 200)
        else:
            return ("Incorrect Password", 400)

def logout(token, users):
    """
    Logout for user
    Args:
        token <class 'str'>: token of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        response <class 'str'>: Details of authentication
        code <class 'int'>: HTTP response status code
    """

    # If email is already logged out
    user = users.find_one({'cur_token' : token})
    if not user:
        return (f"User is already logged out", 404)
    # Remove discount from cart before logging out
    cart = user['cart']
    if 'discount' in cart:
        cart.pop('discount')
    users.update_one({"cur_token": token}, {"$set":{"cart": cart}})
    # Set session to none and de auth token
    users.update_one({'cur_token' : token}, {'$set': {'cur_token': None}})

    return ("{}", 200)

def account_details(token, users):
    """
    Account details of user
    Args:
        token <class 'str'>: token of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        response <class 'str'>: Details of authentication
        code <class 'int'>: HTTP response status code
    """
    user = users.find_one({'cur_token' : token})

    if user is None:
        return (f"Cannot find user", 404)
    else:
        details = {
            'username': user['username'],
            'email' : user['email'],
            'is_admin' : user['is_admin'],
        }

    if 'quiz' in user:
        details['quiz'] = user['quiz']
    
    return (details, 200)

def forgot_password(email, users):
    """
    Send password reset email for user
    Args:
        email <class 'str'>: email of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        response <class 'str'>: Details of authentication
        code <class 'int'>: HTTP response status code
    """
    user = users.find_one({'email' : email})

    # Check if email is valid
    if valid_email(email) == False:
        return ("Please use the format: name@email.com", 400)

    # Check if user is already registered
    if user is None:
        return (f"{email} was not found", 404)
    else:
        reset_password_email(email)
        return ("{}", 200)

def reset_password(email, password, cpassword, users):
    """
    Resets password for user in the database
    Args:
        email <class 'str'>: email of the user
        password <class 'str'>: password of the user
        confirm password <class 'str'>: confirmation password of the user
        users <class 'flask_pymongo.wrappers.Collection'>: collection of users
    Returns:
        response <class 'str'>: Details of authentication
        code <class 'int'>: HTTP response status code
    """
    existing_user = users.find_one({'email' : email})

    # Check if email is valid
    if valid_email(email) == False:
        return ("Please use the format: name@email.com", 400)

    # Check if password is valid
    if valid_password(password, cpassword) == False:
        return (password_err_msg(password, cpassword), 400)

    # Else, user is already registered
    if existing_user is None:
        return (f"{email} is not registered", 404)

    # Insert user into db if no existing user is found
    else:
        hashedpass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users.update_one({'email' : email}, {"$set" : {'password' : hashedpass}})

        return ("Successfully reset password", 200)

########################
### Helper functions ###
########################

def valid_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

    if(re.fullmatch(regex, email)):
        return True
    else:
        return False

def valid_password(p1, p2):
    if len(p1) < 6 or p1 != p2:
        return False 
    else: 
        return True

def password_err_msg(p1, p2):
    err_msg = ""
    if len(p1) < 6:
        err_msg += "Password length needs to be more than 6 characters\n"
    if p1 != p2:
        err_msg += "Password does not match\n"
    return err_msg
