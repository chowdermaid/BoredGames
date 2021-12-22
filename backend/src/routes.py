# external imports
from flask import Flask, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_restx import fields
from flask_restx import reqparse
from flask_restx import Resource, Api

# our imports
from account import register, login, logout, account_details, forgot_password, reset_password
from email_auth import update_status_email
import analytics
import admin_orders
import admin_product
import cart
import my_collection
import user_browsing
import user_orders
import recommender

app = Flask(__name__)
port_num = 9099

app.config['MONGO_URI'] = 'mongodb+srv://user2:comp3900@cluster0.o9wlc.mongodb.net/COMP3900-NotLikeTheOtherGroups?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true'

api = Api(app)
mongo = PyMongo(app)
CORS(app)

parser = reqparse.RequestParser()
parser.add_argument('Authorization', type=str, help='token of user', location='headers')

account = api.namespace('account', description='Authentication Services')
@account.route('/register')
class Register(Resource):
    @api.doc(
        description="Register a user",
        responses={
            200: 'Successfully registered a user.',
            404: 'This user is already registered.',
            400: 'Incorrect input.'
        }
    )
    @api.expect(
        api.model('register_details', {
            'username': fields.String(required=True, example='darwiniscool'),
            'email': fields.String(required=True, example='darwin69@gmail.com'),
            'password': fields.String(required=True, example='1234567'),
            'confirm_password': fields.String(required=True, example='1234567')
        })
    )
    def post(self):
        j = request.get_json(force=True)

        username = j['username']
        email = j['email']
        password = j['password']
        cpassword = j['confirm_password']

        users = mongo.db.users_collection

        resp, code = register(username, email, password, cpassword, users)

        return resp, code

@account.route('/login')
class Login(Resource):
    @api.doc(
        description="Login a user",
        responses={
            200: 'Successfully logged in.',
            404: 'Can not find user.',
            400: 'Incorrect input.'
        }
    )
    @api.expect(
        api.model('login_details', {
            'email': fields.String(required=True, example='hello60@hotmail.com'),
            'password': fields.String(required=True, example='1234567')
        })
    )
    def post(self):
        j = request.get_json(force=True)
        email = j['email']
        password = j['password']

        users = mongo.db.users_collection

        resp, code = login(email, password, users)
        print(resp)

        return resp, code

@account.route('/logout')
class Logout(Resource):
    @api.doc(
        description="Logout a user",
        responses={
            200: 'Successfully logged out.',
            404: 'User already logged out',
        }
    )
    @api.expect(
        api.model('token_details', {
            'token': fields.String(required=True)
        })
    )
    def post(self):
        j = request.get_json(force=True)
        token = j['token']

        users = mongo.db.users_collection

        resp, code = logout(token, users)

        return resp, code


@account.route('/details')
class AccountDetails(Resource):
    @api.doc(
        description="Details of a user",
        responses={
            200: 'Successfully found account.',
            404: 'Account not found.',
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        print(token)
        token = token.split(" ")[-1]

        users = mongo.db.users_collection

        resp, code = account_details(token, users)

        return resp, code

@account.route('/forgotpassword')
class ForgotPassword(Resource):
    @api.doc(
        description="Send Email request, Reset password for user",
        responses={
            200: 'Successfully sent an email to user.',
            404: 'This user is not registered.',
            400: 'Incorrect input.'
        }
    )
    @api.expect(
        api.model('register_details', {
            'email': fields.String(required=True, example='darwin69@gmail.com'),
        })
    )
    def post(self):
        j = request.get_json(force=True)

        email = j['email']

        users = mongo.db.users_collection

        resp, code = forgot_password(email, users)

        return resp, code

@account.route('/resetpassword')
class ResetPassword(Resource):
    @api.doc(
        description="Reset password for user",
        responses={
            200: 'Successfully reset password for user.',
            404: 'This user is not registered.',
            400: 'Incorrect input.'
        }
    )
    @api.expect(
        api.model('register_details', {
            'email': fields.String(required=True, example='darwin69@gmail.com'),
            'password': fields.String(required=True, example='1234567'),
            'confirm_password': fields.String(required=True, example='1234567')
        })
    )
    def post(self):
        j = request.get_json(force=True)

        email = j['email']
        password = j['password']
        cpassword = j['confirm_password']

        users = mongo.db.users_collection

        resp, code = reset_password(email, password, cpassword, users)

        return resp, code

admin = api.namespace('admin', description='Admin Services')
@admin.route('/add_product')
class AdminAddProduct(Resource):
    @api.doc(
        description="Get a product from Board Game Atlas",
        responses={
            200: 'Successfully retrieved a boardgame from Board Game Atlas.',
            404: 'Name did not match any games in Board Game Atlas - not found.',
            400: 'Incorrect input.'
        }
    )
    @api.param('name', 'The name of the product to add')
    def get(self):
        name = request.args['name']

        collection = mongo.db.products_collection
        resp, code = admin_product.import_product(name, collection)
        if code != 200:
            api.abort(code, resp)  

        return resp, code
    
    @api.doc(
        description="Add a product to the database",
        responses={
            200: 'Successfully added a product to the database.',
            400: 'Incorrect input.'
        }
    )
    @api.expect(
        api.model('add_product_details', {
            'quantity': fields.String(required=True, example='33'),
            'discount': fields.String(required=True, example='0.2'),
            'price': fields.String(required=True, example='50'),
        })
    )
    def post(self):
        # connection to the collection we want to add to
        args = {}
        j = request.get_json(force=True)
        args['quantity'] = j['quantity']
        args['discount'] = j['discount']
        args['price']= j['price']

        collection = mongo.db.products_collection
        categories_collection = mongo.db.categories_collection   
        mechanics_collection = mongo.db.mechanics_collection   

        game = admin_product.load_temp_game()

        resp, code = admin_product.add_product(args, game, collection, categories_collection, mechanics_collection)
        if code != 200:
            api.abort(code, resp)

        return resp, code


@admin.route('/list_products')
class AdminListProducts(Resource):
    @api.doc(
        description="List products",
        responses={
            200: 'Returned all products',
        }
    )
    def get(self):     
        # Get current list of products
        collection = mongo.db.products_collection
        products = admin_product.load_all_products(collection)
        return products, 200


@admin.route('/product/<string:id>')
class AdminProduct(Resource):
    @api.doc(
        description="GET details of product corresponding to a given id",
        responses={
            200: 'Successfully located and returned the product corresponding to a given id.',
            404: 'id did not match any products in database - not found.'
        }
    )
    def get(self, id):
        id = request.view_args['id']
        collection = mongo.db.products_collection
        resp, code = admin_product.get_product(id, collection)
        return resp, code

    @api.doc(
        description="PATCH/EDIT product corresponding to a given id",
        responses={
            200: 'Successfully located and edited the product corresponding to a given id in the database.',
            404: 'id did not match any product in the database - not found.'
        }
    )
    @api.expect(
        api.model('patch_product_details', {
            'quantity': fields.String(required=True, example='4'),
            'discount': fields.String(required=True, example='0.5'),
            'price': fields.String(required=True, example='99'),
            'description': fields.String(required=True, example='actually a bad game'),
            'description_preview': fields.String(required=True, example='good game pls buy'),
        })
    )
    def patch(self, id):
        args = {}
        j = request.get_json(force=True)
        args['description_preview'] = j['description_preview']
        args['description'] = j['description']
        args['quantity'] = j['quantity']
        args['discount'] = j['discount']
        args['price'] = j['price']

        collection = mongo.db.products_collection
        resp, code = admin_product.edit_product(args, id, collection)
        return resp, code

    @api.doc(
        description="DELETE product corresponding to a given id",
        responses={
            200: 'Successfully located and deleted the product corresponding to a given id in the database.',
            404: 'id did not match any product in the database - not found.'
        }
    )
    def delete(self, id):
        id = request.view_args['id']
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = admin_product.delete_product(id, products_collection, users_collection)
        return resp, code

@admin.route('/order/<string:order_number>')
class AdminOrder(Resource):    
    @api.doc(
        description="GET specific transaction",
        responses={
            200: 'Successfully returned the order corresponding to the order number.',
            404: 'Order not found.',
        }
    )
    def get(self, order_number):
        transactions_collection = mongo.db.transactions_collection
        resp, code = admin_orders.get_order(order_number, transactions_collection)
        return resp, code
    @api.doc(
        description="PATCH specific transaction",
        responses={
            200: 'Successfully returned the order corresponding to the order number.',
            404: 'Order not found.',
        }
    )
    @api.expect(
        api.model('patch_order_status', {
            'status': fields.String(required=True, example='shipped'),
        })
    )
    def patch(self, order_number):
        j = request.get_json(force=True)
        order_status = j['status']
        transactions_collection = mongo.db.transactions_collection
        users_collection = mongo.db.users_collection
        resp, code = admin_orders.update_order_status(order_number, order_status, transactions_collection, users_collection)
        order = admin_orders.get_order(order_number, transactions_collection)
        email = order[0]['user']
        update_status_email(order_status, email, order_number)
        return resp, code

@admin.route('/orders')
class AdminOrders(Resource):    
    @api.doc(
        description="GET all orders",
        responses={
            200: 'Successfully returned all products in cart.',
        }
    )
    def get(self):
        transactions_collection = mongo.db.transactions_collection
        resp, code = admin_orders.load_all_orders(transactions_collection)
        return resp, code
    


@admin.route('/reset')
class AdminReset(Resource):
    @api.doc(
        description="DELETE all products in products_collection",
        responses={
            200: 'Successfully located and returned the product corresponding to a given id.',
        }
    )
    def delete(self):
        collection = mongo.db.products_collection
        resp, code = admin_product.remove_all(collection)
        return resp, code
    
    @api.doc(
        description="POST 200 starting products into products_collection",
        responses={
            200: 'Successfully populated the products_collection.',
        }
    )
    def post(self):
        # collection = mongo.db.test_products_collection2
        collection = mongo.db.products_collection
        categories_collection = mongo.db.categories_collection
        mechanics_collection = mongo.db.mechanics_collection
        resp, code = admin_product.populate(collection, categories_collection, mechanics_collection)
        return resp, code

@admin.route('/coupon')
class Coupon(Resource):
    @api.doc(
        description="POST a new coupon",
        responses={
            200: 'Successfully added a new coupon.',
            400: 'Incorrect inputs, could not add coupon.'
        }
    )
    @api.expect(
        api.model('coupon', {
            'code': fields.String(required=True, example='SPRING2021'),
            'voucher': fields.String(required=False, example='5'),
        })
    )
    def post(self):
        j = request.get_json(force=True)
        code = j['code']
        voucher = j['voucher']
        collection = mongo.db.coupon_collection
        resp, code = admin_orders.add_coupon(code, voucher, collection)
        return resp, code
    
    @api.doc(
        description="GET all active coupons",
        responses={
            200: 'Successfully collected all of the active coupons.',
        }
    )
    def get(self):
        collection = mongo.db.coupon_collection
        resp = admin_orders.get_coupons(collection)
        return resp

    @api.doc(
        description="DELETE coupon according to coupon code",
        responses={
            200: 'Successfully located and deleted the coupon corresponding to a given id in the database.',
            404: 'coupon code did not match any coupon in the database - not found.'
        }
    )
    @api.expect(
        api.model('coupon1', {
            'code': fields.String(required=True, example='SPRING2021'),
        })
    )
    def delete(self):
        j = request.get_json(force=True)
        code = j['code']
        collection = mongo.db.coupon_collection
        resp, code = admin_orders.delete_coupon(code, collection)
        return resp, code



user = api.namespace('user', description='User Services')
@user.route('/my_collection_list')
class GetMyCollection(Resource):    
    @api.doc(
        description="GET all products from my_collection",
        responses={
            200: 'Successfully returned all products in my_collection.',
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = my_collection.load_all_products(token, products_collection, users_collection)
        return resp, code
    
@user.route('/my_collection/<string:handle>')
class MyCollection(Resource):    
    @api.doc(
        description="POST selected product into my_collection",
        responses={
            200: 'Successfully added product the products_collection.',
            400: 'Incorrect inputs, could not add product.'
        }
    )
    @api.expect(
        api.model('my_collection', {
            'token': fields.String(required=True, example='dabcd'),
        })
    )
    def post(self, handle):
        j = request.get_json(force=True)
        token = j['token']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        resp, code = my_collection.add_product(token, handle, users_collection, products_collection)
        return resp, code
    
    @api.doc(
        description="DELETE selected product from my_collection",
        responses={
            200: 'Successfully removed product from my_collection.',
            400: 'Incorrect inputs, could not remove item from collection.',
            404: 'Product not found in my_collection.'
        }
    )
    @api.expect(
            api.model('my_collection', {
                'token': fields.String(required=True, example='dabcd'),
            })
        )    
    def delete(self, handle):
        j = request.get_json(force=True)
        token = j['token']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        resp, code = my_collection.delete_product(token, handle, users_collection, products_collection)
        return resp, code

@user.route('/cart_list')
class GetCart(Resource):    
    @api.doc(
        description="GET all products from cart",
        responses={
            200: 'Successfully returned all products in cart.',
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = cart.load_all_products(token, products_collection, users_collection)
        return resp, code
    
@user.route('/cart/<string:handle>')
class Cart(Resource):    
    @api.doc(
        description="POST selected product into cart",
        responses={
            200: 'Successfully populated the cart.',
            400: 'Incorrect inputs, could not add product to cart.'
        }
    )
    @api.expect(
        api.model('cart1', {
            'token': fields.String(required=True, example='dabcd'),
            'quantity': fields.String(required=True, example='1'),
        })
    )
    def post(self, handle):
        j = request.get_json(force=True)
        token = j['token']
        quantity = j['quantity']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        resp, code = cart.add_product(token, quantity, handle, users_collection, products_collection)
        return resp, code
    
    @api.doc(
        description="POST selected product into cart",
        responses={
            200: 'Successfully populated the cart.',
            400: 'Incorrect inputs, could not update product in the cart.'
        }
    )
    @api.expect(
        api.model('cart1', {
            'token': fields.String(required=True, example='dabcd'),
            'quantity': fields.String(required=True, example='1'),
        })
    )
    def patch(self, handle):
        j = request.get_json(force=True)
        token = j['token']
        quantity = j['quantity']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        resp, code = cart.edit_quantity(token, quantity, handle, users_collection, products_collection)
        return resp, code
    
    @api.doc(
        description="DELETE selected product from my cart",
        responses={
            200: 'Successfully removed product from cart.',
            400: 'Incorrect inputs, could not remove product from the cart.',
            404: 'Product not found in cart.'
        }
    )
    @api.expect(
            api.model('cart2', {
                'token': fields.String(required=True, example='dabcd'),
            })
        )    
    def delete(self, handle):
        j = request.get_json(force=True)
        token = j['token']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        resp, code = cart.delete_product(token, handle, users_collection, products_collection)
        return resp, code

@user.route('/filter_search')
class FilterSearch(Resource):    
    @api.doc(
        description="POST all products from filtered tags, you can leave the params as null if you want to search all products of that query",
        responses={
            200: 'Successfully returned all filtered products.',
        }
    )
    @api.expect(
        api.model('search_details', {
            'search': fields.String(example="root"),
            'min_price': fields.Integer(example="0"),
            'max_price': fields.Integer(example="300"),
            'min_year': fields.Integer(example="2008"),
            'max_year': fields.Integer(example="2020"),
            'min_players': fields.Integer(example="1"),
            'max_players': fields.Integer(example="10"),
            'min_playtime': fields.Integer(example="50"),
            'max_playtime': fields.Integer(example="180"),
            'min_age': fields.Integer(example="15"),
            'mechanics': fields.List(fields.String(example="Dice Rolling")),
            'categories': fields.List(fields.String(example="Adventure")),
            'curve_start': fields.Integer(example="1"),
            'curve_end': fields.Integer(example="5"),
            'depth_start': fields.Integer(example="1"),
            'depth_end': fields.Integer(example="5"),
        })
    )
    def post(self):
        j = request.get_json(force=True)
        search = j['search']
        min_price = j['min_price']
        max_price = j['max_price']
        min_year = j['min_year']
        max_year = j['max_year']
        min_players = j['min_players']
        max_players = j['max_players']
        min_playtime = j['min_playtime']
        max_playtime = j['max_playtime']
        min_age = j['min_age']
        mechanics = j['mechanics']
        categories = j['categories']
        curve_start = j['curve_start']
        curve_end = j['curve_end']
        depth_start = j['depth_start']
        depth_end = j['depth_end']

        products_collection = mongo.db.products_collection

        resp, code = user_browsing.filter_all_products(search, min_price, max_price, min_year, max_year, min_players, 
        max_players, min_playtime, max_playtime, 
        min_age, mechanics, categories, 
        curve_start, curve_end, depth_start, depth_end, products_collection)

        return resp, code

@user.route('/collect_user_selected_tags')
class UserSelectedTags(Resource):    
    @api.doc(
        description="POST all tags that have been selected by user in browsing menu ",
        responses={
            200: 'Successfully returned all selected tags',
        }
    )
    @api.expect(
        api.model('collected_details', {
            'search': fields.String(example="hi"),
            'min_price': fields.Integer(example="0"),
            'max_price': fields.Integer(example="70"),
            'min_year': fields.Integer(example="1"),
            'max_year': fields.Integer(example="50"),
            'min_players': fields.Integer(example="1"),
            'max_players': fields.Integer(example="10"),
            'min_playtime': fields.Integer(example="0"),
            'max_playtime': fields.Integer(example="100"),
            'min_age': fields.Integer(example="15"),
            'mechanics': fields.List(fields.String(example="Dice Rolling")),
            'categories': fields.List(fields.String(example="Adventure")),
            'curve_start': fields.Integer(example="1"),
            'curve_end': fields.Integer(example="5"),
            'depth_start': fields.Integer(example="1"),
            'depth_end': fields.Integer(example="4"),
        })
    )
    def post(self):
        j = request.get_json(force=True)
        search = j['search']
        min_price = j['min_price']
        max_price = j['max_price']
        min_year = j['min_year']
        max_year = j['max_year']
        min_players = j['min_players']
        max_players = j['max_players']
        min_playtime = j['min_playtime']
        max_playtime = j['max_playtime']
        min_age = j['min_age']
        mechanics = j['mechanics']
        categories = j['categories']
        curve_start = j['curve_start']
        curve_end = j['curve_end']
        depth_start = j['depth_start']
        depth_end = j['depth_end']

        resp, code = user_browsing.collect_user_selected_tags(search, min_price, max_price, min_year, max_year, min_players, 
        max_players, min_playtime, max_playtime, 
        min_age, mechanics, categories, 
        curve_start, curve_end, depth_start, depth_end)

        return resp, code
    
@user.route('/cart_apply_coupon')
class CartApplyCoupon(Resource):    
    @api.doc(
        description="POST selected coupon in cart",
        responses={
            200: 'Successfully applied the coupon to the cart.',
            400: 'Incorrect inputs, could not apply coupon to the cart coupon.',
            404: 'Coupon not found.',
        }
    )
    @api.expect(
        api.model('apply_coupon', {
            'token': fields.String(required=True, example='dabcd'),
            'coupon_code': fields.String(required=True, example='SPRING2021'),
        })
    )
    def post(self):
        j = request.get_json(force=True)
        token = j['token']
        coupon_code = j['coupon_code']
        users_collection = mongo.db.users_collection
        coupon_collection = mongo.db.coupon_collection
        resp, code = cart.apply_coupon(token, coupon_code, users_collection, coupon_collection)
        return resp, code

@user.route('/order_place')
class PlaceOrder(Resource):    
    @api.doc(
        description="POST transaction",
        responses={
            200: 'Successfully completed the transaction.',
            400: 'Incorrect inputs, could not complete the transaction.'
        }
    )
    @api.expect(
        api.model('payment', {
            'token': fields.String(required=True, example='dabcd'),
            'card_name': fields.String(required=True, example='Ms Grace Hopper'),
            'card_number': fields.String(required=True, example='XXXX-XXXX-XXXX-XXXX'),
            'card_expiry': fields.String(required=True, example='12/22'),
            'card_cvc': fields.String(required=True, example='000'),
            'shipping_name': fields.String(required=True, example='Grace Hopper'),
            'shipping_address': fields.String(required=True, example='42 wallaby Way'),
            'shipping_post_code': fields.String(required=True, example='2000'),
            'shipping_city': fields.String(required=True, example='Sydney'),
            'shipping_state': fields.String(required=True, example='NSW'),
            'contact_number': fields.String(required=True, example='0412 345 678'),
            'shipping_method': fields.String(required=True, example='Free'),
            'gifting': fields.Boolean(example='True'),
            'gifting_email': fields.String(example='myBestFriend@gmail.com'),
            'gifting_name': fields.String(example='My Best Friend'),
            'gifting_message': fields.String(example='Happy Birthday! Love, your best friend ever'),
            'add_to_collection': fields.Boolean(required=True, example='True'),
        })
    )
    def post(self):
        j = request.get_json(force=True)
        token = j['token']
        
        credit_card = {
            'name': j['card_name'],
            'number': j['card_number'],
            'expiry': j['card_expiry'],
            'cvc': j['card_cvc']
        }
        shipping_info = {
            'name': j['shipping_name'],
            'address': j['shipping_address'],
            'city': j['shipping_city'],
            'state': j['shipping_state'],
            'post_code': j['shipping_post_code'],
            'contact_number': j['contact_number'],
            'shipping_method': j['shipping_method']
        }    
        if j['gifting']:
            gift_info = {
                'email': j['gifting_email'],
                'name': j['gifting_name'],
                'message': j['gifting_message']
            }
        else:
            gift_info = ''
        add_to_collection = j['add_to_collection']
        users_collection = mongo.db.users_collection
        products_collection = mongo.db.products_collection
        transactions_collection = mongo.db.transactions_collection
        
        resp, code = user_orders.place_order(token, credit_card, shipping_info, gift_info, add_to_collection, 
        users_collection, products_collection, transactions_collection)
        return resp, code

@user.route('/order/<string:order_number>')
class Order(Resource):    
    @api.doc(
        description="GET specific transaction",
        responses={
            200: 'Successfully returned all products in cart.',
            400: 'Incorrect inputs, could not return the order.',
            404: 'Order not found.',
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self, order_number):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        users_collection = mongo.db.users_collection
        resp, code = user_orders.get_order(token, order_number, users_collection)
        return resp, code

@user.route('/orders')
class Orders(Resource):    
    @api.doc(
        description="GET all transactions",
        responses={
            200: 'Successfully returned all products in cart.',
            400: 'Incorrect inputs, could not return the orders.',
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        users_collection = mongo.db.users_collection
        resp, code = user_orders.load_all_orders(token, users_collection)
        return resp, code
    
recommend = api.namespace('recommender', description='All of the recommender functions')
@recommend.route('/currently_popular')
class CurrentlyPopular(Resource):
    @api.doc(
        description="GET top 10 popular games at the moment",
        responses={
            200: 'Successfully returned all products in cart.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        resp, code = recommender.currently_popular(products_collection)
        return resp, code

@recommend.route('/you_might_also_like/<string:handle>')
class CurrentlyPopular(Resource):
    @api.doc(
        description="GET 5 games similar to current game",
        responses={
            200: 'Successfully returned 5 most similar games to current games.',
        }
    )
    def get(self, handle):
        products_collection = mongo.db.products_collection
        resp, code = recommender.content_based_recommender(handle, products_collection)
        return resp, code

@recommend.route('/recommended_for_you')
class CurrentlyPopular(Resource):
    @api.doc(
        description="GET 20 games specifically recommended for a user",
        responses={
            200: 'Successfully returned games recommended for a user.',
            400: 'Incorrect inputs, could not return the order.'
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.collab_and_content_recommender(token, products_collection, users_collection)
        return resp, code

@recommend.route('/completed_quiz')
class CurrentlyPopular(Resource):
    @api.doc(
        description="POST quiz answers to the database",
        responses={
            200: 'Successfully returned games recommended for a user.',
            400: 'Incorrect inputs, could not return the order.'
        }
    )
    @api.expect(
        api.model('quiz', {
            'Q1': fields.String(required=True, example='small'),
            'Q2': fields.String(required=True, example='dice'),
            'Q3': fields.String(required=True, example='simple'),
            'Q4': fields.String(required=True, example='memory'),
            'Q5': fields.String(required=True, example='short'),
        })
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def post(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]

        j = request.get_json(force=True)
        answers = {
            'q1': j['Q1'],
            'q2': j['Q2'],
            'q3': j['Q3'],
            'q4': j['Q4'],
            'q5': j['Q5']
        }
        users_collection = mongo.db.users_collection
        resp, code = recommender.add_quiz_results(token, answers, users_collection)
        return resp, code
    
    @api.doc(
        description="GET recommended games following completion of quiz",
        responses={
            200: 'Successfully returned all products in my_collection.',
            400: 'Incorrect inputs, could not return the order.'
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.get_quiz_results(token, products_collection, users_collection)
        return resp, code

@recommend.route('/top_categories')
class TopCategories(Resource):
    @api.doc(
        description="GET categories that appear most often in all users' collections",
        responses={
            200: 'Successfully returned top categories.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.top_categories(products_collection, users_collection)
        return resp, code

@recommend.route('/top_mechanics')
class TopMechanics(Resource):
    @api.doc(
        description="GET mechanics that appear most often in all users' collections",
        responses={
            200: 'Successfully returned top mechanics.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.top_mechanics(products_collection, users_collection)
        return resp, code

@recommend.route('/categories_for_you')
class YourCategories(Resource):
    @api.doc(
        description="GET 6 categories that appear most often in specific user's collections",
        responses={
            200: 'Successfully returned categories recommended for a user.',
            400: 'Incorrect inputs, could not return the order.'
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.top_categories_user(token, products_collection, users_collection)
        return resp, code

@recommend.route('/mechanics_for_you')
class YourMechanics(Resource):
    @api.doc(
        description="GET mechanics that appear most often in specific user's collections",
        responses={
            200: 'Successfully returned mechanics recommended for a user.',
            400: 'Incorrect inputs, could not return the order.'
        }
    )
    @api.doc(params={'Authorization': {'in': 'header', 'description': 'An authorization token'}})
    def get(self):
        token = request.headers.get('Authorization')
        token = token.split(" ")[-1]
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        resp, code = recommender.top_mechanics_user(token, products_collection, users_collection)
        return resp, code

@recommend.route('/sale_items')
class Sale(Resource):
    @api.doc(
        description="GET all items on sale",
        responses={
            200: 'Successfully returned all sale items.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        resp, code = recommender.sale_items(products_collection)
        return resp, code

analytic = api.namespace('analytics', description='All of the analytics endpoints')

@analytic.route('/out_of_stock_items')
class OutOfStock(Resource):
    @api.doc(
        description="GET all items out of stock",
        responses={
            200: 'Successfully returned all out of stock items.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        resp, code = analytics.out_of_stock_items(products_collection)
        return resp, code

@analytic.route('/analytics')
class Analytics(Resource):
    @api.doc(
        description="GET summary stats for the shop",
        responses={
            200: 'Successfully returned summary stats.',
        }
    )
    def get(self):
        products_collection = mongo.db.products_collection
        users_collection = mongo.db.users_collection
        trans_collection = mongo.db.transactions_collection
        resp, code = analytics.analytics(products_collection, users_collection, trans_collection)
        return resp, code

if __name__ == '__main__':
    # setup()

    app.secret_key = 'i wanted to do harry potter wands'

    # run the application
    app.config['ERROR_404_HELP'] = False
    app.run(debug=True, port=port_num)
