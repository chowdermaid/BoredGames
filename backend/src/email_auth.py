"""
manages emails
"""

import smtplib
from email.message import EmailMessage

def send_email(email):
    """
    Sends a email a email upon registration
    Args: 
        email <class 'str'>: email of user
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Welcome to Bored Games!'

    msg.set_content("""
    Hello!

    Welcome ABored~
    In celebration, here is a free coupon for you:

    NEW05

    On your next purchase use this coupon for a $5 off your order!
    We hope you enjoy your stay~

    Thanks,
    Bored Games
    """)

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def reset_password_email(email):
    """
    Sends email with a link to reset password
    Args: 
        email <class 'str'>: email of user
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Reset your password'

    msg.set_content("""
    Hi!

    Click the link below to reset your password!
    http://localhost:3000/resetpassword

    Thanks,
    Bored Games
    """)

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def place_order_email(email, orderNumber):
    """
    Sends a email after user places an order
    Args: 
        email <class 'str'>: email of user
        orderNumber <class 'str'>: order number
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Confirmation of product order'

    msg.set_content(f'''
    Hello,

    Thank you for ordering with us!
    Your order number is: {orderNumber}.
    Please give us 5-10 business days to get this delivered!

    Thanks,
    Bored Games
    ''')

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def update_status_email(status, email, orderNumber):
    """
    Sends an email after order status has been updated
    Args: 
        status <class 'str'>: status of user
        email <class 'str'>: email of user
        orderNumber <class 'str'>: order number
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email

    if (status == 'Shipped'):
        msg['Subject'] = 'Shipped product order'
        msg.set_content(f'''
        Hello,

        Your order for {orderNumber} has been shipped!
        It should be at your door soon!

        Thanks,
        Bored Games
        ''')
    elif (status == 'Delivered'):
        msg['Subject'] = 'Delivered product'
        msg.set_content(f'''
        Hello,

        Your order for {orderNumber} has been delivered!
        Let us know how you feel about the order on our website!

        Thanks,
        Bored Games
        ''')
    elif (status == 'Delayed'):
        msg['Subject'] = 'Delayed product'
        msg.set_content(f'''
        Hello,

        Your order for {orderNumber} has been delayed! D:
        Sorry for the inconvenience...

        Thanks,
        Bored Games
        ''')

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def gifting_email(email, name, message, orderNumber):
    """
    Sends a email to recipient after user places a gift
    Args: 
        email <class 'str'>: email of recipient
        name <class 'str'>: name of recipient
        message <class 'str'>: message to recipient
        orderNumber <class 'str'>: order number of recipient

    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Gift from Bored Games!'

    msg.set_content(f'''
    Hi {name},

    Someone has planned a gift for you!
    Prepare to receive it in a few days.
    You can track the order with the number below:
    {orderNumber}

    They included the message
    {message}

    Thanks,
    Bored Games
    ''')

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def coupon_email(email, coupon, discount):
    """
    Sends an email after coupon has been added
    Args: 
        email <class 'str'>: email of user
        coupon <class 'str'>: coupon
        discount <class 'str'>: discount code
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Claim a coupon!'

    msg.set_content(f'''
    Hello,

    We have a {discount} off coupon for you to use on your next checkout!

    {coupon}

    Thanks,
    Bored Games
    ''')

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()

def discount_email(email, discount, productName):
    """
    Sends an email after there is a discount on a item
    Args: 
        email <class 'str'>: email of user
        discount <class 'str'>: discount code
        productName <class 'str'>: product name
    """
    msg = EmailMessage()

    msg['From'] = "Bored Games"
    msg['To'] = email
    msg['Subject'] = 'Discount on a Bored Game!'

    percentage = float(discount)*100

    msg.set_content(f'''
    Hello,

    There is a discount on a Bored Games!
    {percentage}% off on {productName}. WOW!~

    Thanks,
    Bored Games
    ''')

    # Send the message via our own SMTP server.
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("boredgames.cs3900@gmail.com", "boredgames123")
    server.send_message(msg)
    server.quit()