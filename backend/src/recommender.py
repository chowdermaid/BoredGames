"""
recommender functions
"""

import collections
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import linear_kernel
import time

num_to_return = 20

def save_games(products_collection):
    """
    Saves all of the games currently in the database to a csv for testing
        Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        NULL
    """
    games  = products_collection.find()
    games_df = pd.DataFrame(games)
    games_df.to_csv("games.csv", index= False)
    return

def save_users(users_collection):
    """
    Saves all of the users currently in the database to a csv for testing
        Args:
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        NULL
    """
    users  = users_collection.find()
    users_df = pd.DataFrame(users)
    users_df.to_csv("users.csv", index= False)
    return

def currently_popular(products_collection):
    """
    Returns the 10 most popular games
    Popularity is determined by which games are in the most users' collections
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        top_10_list <class 'list'>: list of the top 10 currently most popular games
        code <class 'int'>: HTTP response status code
    """
    start = time.perf_counter()

    games = products_collection.find({}, {'handle':1, 'in_users_collection':1, 
                                            'categories':1, 'mechanics':1, 'primary_publisher':1,
                                            'description':1,
                                            'average_user_rating':1, '_id':0})

    games_df = pd.DataFrame(games)

    # Sort by in most collections
    games_df['in_num_collections'] = games_df['in_users_collection'].map(len)
    
    games_df2 = games_df.sort_values(by=['in_num_collections', 'average_user_rating'], ascending = False)
    top_10 = games_df2['handle'].head(10)
    print(top_10)

    top_10_list = handles_to_games(list(top_10), products_collection)

    end = time.perf_counter()
    print(f"popular games executed in {end - start:0.4f} seconds")
    return top_10_list, 200

def content_based_recommender(handle, products_collection):
    """
    Return the 5 most popular games of the 10 games most similar to the one that I am viewing.
    Determine similarity by comparing the description, primary_publisher, mechanics and and categories.
    Popularity is determined by which games are in the most users' collections.
    Args:
        handle <class 'string'>: handle of the game that I am viewing
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        similar_games <class 'list'>: list of the 5 games most similar to the game I am currntly viewing
        code <class 'int'>: HTTP response status code
    """
    start = time.perf_counter()
    
    games = products_collection.find({}, {'handle':1, 'in_users_collection':1, 
                                            'categories':1, 'mechanics':1, 'primary_publisher':1,
                                            'description':1,
                                            'average_user_rating':1, '_id':0})
    games_df2 = pd.DataFrame(games)

    # Prep the games data frame
    games_df2 = game_data_wrangling(games_df2)

    # Call the function that computes the two cosine similarity matrices that we will use to recommend games
    cosine_sim, cosine_sim2, indices = game_similarity_prep(games_df2)

    # Call the get_recommendations function
    recs = content_based_similar_games(handle, cosine_sim, cosine_sim2, indices, games_df2)
    print(recs)
    similar_games = handles_to_games(list(recs['handle'])[:5], products_collection)
    end = time.perf_counter()
    print(f"similar_games executed in {end - start:0.4f} seconds")
    return similar_games, 200
    

def collab_and_content_recommender(token, products_collection, users_collection):
    """
    Returns the 20 games recommended for the user.
    It does this through a combination of collaborative and content based filtering.
    Args:
        token <class 'str'>: token of the user 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        top_20_list <class 'list'>: list of the top 20 games recommended for the user
        code <class 'int'>: HTTP response status code
    """
    start = time.perf_counter()
    
    # Check if the user exists in the database
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    email = user['email']
    
    # Retrieve the relevant game information from the database
    games = products_collection.find({}, {'handle':1, 'in_users_collection':1, 
                                            'categories':1, 'mechanics':1, 'primary_publisher':1,
                                            'description':1,
                                            'average_user_rating':1, '_id':0})
    games_df = pd.DataFrame(games)

    # Retrieve the relevant user information from the database
    users = users_collection.find({}, {'email':1, 'my_collection':1, 'quiz':1, '_id':0})
    users_df2 = pd.DataFrame(users)
    users_df2.fillna('', inplace=True)

    # Prep the users data frame
    users_df3 = user_data_wrangling(games_df, users_df2)

    # Create a collaborative similarity score
    X_user, indices = user_similarity_prep(users_df3)

    users_df4 = get_similar_users(email, X_user, indices, users_df2)
    this_user_games = user['my_collection']

    # Generate a dictionary containing the collaborative similarity score for each game
    # Collaborative similarity: sum of similarity scores of each user that has the game in that collection
    pop_games = {}
    users_df4.apply(lambda x: add_games_from_user(pop_games, this_user_games, x["my_collection"], x['sim_scores']),axis=1)

    mixed_df = games_df[['handle', 'average_user_rating']].copy()
    mixed_df['collab_sim_score'] = 0
    mixed_df['content_sim_score'] = 0
    mixed_df['collab_sim_score'] = mixed_df.apply(lambda x: apply_collab_sim_score(pop_games, x["handle"]), axis=1)

    # Start combining content-based similarity score with the collaborative similarity score
    # Prep the games data frame
    games_df2 = game_data_wrangling(games_df)
    
    # Call the function that computes the two cosine similarity matrices that we will use to recommend games
    cosine_sim, cosine_sim2, indices = game_similarity_prep(games_df2)

    # Add the similarity score of each game for each game that the user has in their collection
    for game in this_user_games:
        mixed_df['content_sim_score'] = mixed_df['content_sim_score'] + get_similarity_score_all_games(game, cosine_sim, cosine_sim2, indices)

    # Create overall similarity score by combining the collaborative and content-based similarity scores 
    mixed_df = mixed_df[~mixed_df['handle'].isin(this_user_games)]
    sim_score = mixed_df['collab_sim_score'] + mixed_df['content_sim_score']
    mixed_df['sim_score'] = sim_score

    # Extract the top 30 games based on ovreall similarity score
    top_30 = mixed_df.sort_values(by=['sim_score', 'average_user_rating'], ascending=False).head(30)
    top_30 = top_30.sort_values(by=['average_user_rating', 'sim_score'], ascending=False)
    # Take the top 20 from the top 30 list based on average_user_rating
    top_20_list = list(top_30['handle'])[:20]

    # Convert game handles to games
    similar_games = handles_to_games(top_20_list, products_collection)

    end = time.perf_counter()
    print(f"recommended_games executed in {end - start:0.4f} seconds")
    return similar_games, 200

def add_quiz_results(token, answers, users_collection):
    """
    Adds the quiz dictionary to the user object.
    Args:
        token <class 'str'>: token of the user 
        answers <class 'dict'>: dictionary of the user's quiz answers
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: Whether adding the user's quiz answers was successful
        code <class 'int'>: HTTP response status code
    """
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    email = user['email']
    
    # Add the quiz object to user
    users_collection.update_one({"email": email}, {"$set":{"quiz": answers}})
    
    return "Successfully added the user's quiz answers to the system", 200

def get_quiz_results(token, products_collection, users_collection):
    """
    Adds the quiz dictionary to the user object.
    Args:
        token <class 'str'>: token of the user 
        answers <class 'dict'>: dictionary of the user's quiz answers
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: Whether adding the user's quiz answers was successful
        code <class 'int'>: HTTP response status code
    """
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    
    resp, code = collab_and_content_recommender(token, products_collection, users_collection)
    if code == 200:
        return resp[:6], 200
    return "Successfully added the user's quiz answers to the system", 200

def top_categories(products_collection, users_collection):
    """
    Returns the categories that appear most often in all users' collections
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: List of categories
        code <class 'int'>: HTTP response status code
    """
    # Retrieve the relevant user information from the database
    users = users_collection.find({}, {'my_collection':1, '_id':0})
    users_df = pd.DataFrame(users)
    game_handles = [handle for sublist in list(users_df['my_collection']) for handle in sublist]
    dict_of_games = collections.Counter(game_handles)
    
    pop_cats = {}
    # Loop through all games in user's list 
    for key, value in dict_of_games.items():
        # Retrive the game from the database
        game = products_collection.find_one({'handle': key})
        if game:
            cats = game['categories']
            for cat in cats:
                if cat['name'] in pop_cats:
                    pop_cats[cat['name']] += value
                elif cat['name']:
                    pop_cats[cat['name']] = value

    pop_cats = dict(sorted(pop_cats.items(), key=lambda item: item[1], reverse=True))

    return list(pop_cats.keys())[:num_to_return], 200

def top_mechanics(products_collection, users_collection):
    """
    Returns the mechanics that appear most often in all users' collections
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: List of mechanics
        code <class 'int'>: HTTP response status code
    """
    # Retrieve the relevant user information from the database
    users = users_collection.find({}, {'my_collection':1, '_id':0})
    users_df = pd.DataFrame(users)
    game_handles = [handle for sublist in list(users_df['my_collection']) for handle in sublist]
    dict_of_games = collections.Counter(game_handles)
    
    pop_mechs = {}
    # Loop through all games in user's list 
    for key, value in dict_of_games.items():
        # Retrive the game from the database
        game = products_collection.find_one({'handle': key})
        if game:
            mechs = game['mechanics']
            for mech in mechs:
                if mech['name'] in pop_mechs:
                    pop_mechs[mech['name']] += value
                elif mech['name']:
                    pop_mechs[mech['name']] = value

    pop_mechs = dict(sorted(pop_mechs.items(), key=lambda item: item[1], reverse=True))

    return list(pop_mechs.keys())[:num_to_return], 200

def top_categories_user(token, products_collection, users_collection):
    """
    Returns the categories that appear most often in specific user's collections
    Args:
        token <class 'str'>: token of the user 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: List of categories
        code <class 'int'>: HTTP response status code
    """
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    game_handles = user['my_collection']
    
    pop_cats = {}

    # Loop through all games in user's list 
    for handle in game_handles:
        # cats = list(games_df2.loc[[key]]['categories'])[0]
        game = products_collection.find_one({'handle': handle})
        if game:
            cats = game['categories']
            for cat in cats:
                if cat['name'] in pop_cats:
                    pop_cats[cat['name']] += 1
                elif cat['name']:
                    pop_cats[cat['name']] = 1

    pop_cats = dict(sorted(pop_cats.items(), key=lambda item: item[1], reverse=True))

    list_cats = list(pop_cats.keys())[:num_to_return]
    if len(list_cats) < num_to_return:
        general = top_categories(products_collection, users_collection)[0]
        list_cats = list_cats + general[:num_to_return-len(list_cats)]

    return list_cats, 200

def top_mechanics_user(token, products_collection, users_collection):
    """
    Returns the mechanics that appear most often in specific user's collections
    Args:
        token <class 'str'>: token of the user 
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
        users_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all users
    Returns:
        resp <class 'str'>: List of mechanics
        code <class 'int'>: HTTP response status code
    """
    user = users_collection.find_one({'cur_token': token})
    if not user:
        return('Not a valid user', 400)
    game_handles = user['my_collection']
    
    pop_mechs = {}

    # Loop through all games in user's list 
    for handle in game_handles:
        # cats = list(games_df2.loc[[key]]['categories'])[0]
        game = products_collection.find_one({'handle': handle})
        if game:
            mechs = game['mechanics']
            for mech in mechs:
                if mech['name'] in pop_mechs:
                    pop_mechs[mech['name']] += 1
                elif mech['name']:
                    pop_mechs[mech['name']] = 1

    pop_mechs = dict(sorted(pop_mechs.items(), key=lambda item: item[1], reverse=True))

    list_mechs = list(pop_mechs.keys())[:num_to_return]
    if len(list_mechs) < num_to_return:
        general = top_categories(products_collection, users_collection)[0]
        list_mechs = list_mechs + general[:num_to_return-len(list_mechs)]
    
    return list_mechs, 200

def sale_items(products_collection):
    """
    Return all games on sale from the database
    Args:
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        resp <class 'str'>: List of games
        code <class 'int'>: HTTP response status code
    """
    data = []
    games = products_collection.find({"discount": { "$gt" : 0}})
    for product in games:
        # Stringify for JSON purposes
        product['_id'] = str(product['_id'])
        product['last_updated'] = product['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        data.append(product)
    
    return data, 200

########################
### Helper Functions ###
########################

def game_data_wrangling(games_df2):
    """
    Takes in the games_df and puts all of the necessary data in the right form.    
    """
    games_df2['in_num_collections'] = games_df2['in_users_collection'].str.len()

    features = ['categories', 'mechanics']
    for feature in features:
        games_df2[feature] = games_df2.apply(lambda x: get_name(x[feature]),axis=1)

    games_df2['primary_publisher'] = games_df2['primary_publisher'].apply(get_primary_publisher)

    #Replace NaN with an empty string
    games_df2['description'] = games_df2['description'].fillna('')

    games_df2['soup'] = games_df2.apply(create_soup, axis=1)
    return games_df2

def game_similarity_prep(games_df2):
    """
    Takes in a games_df and:
        - creates a TF-IDF matrix from the game description
        - computes the cosine similarity for all games using a linear kernel
        - creates a count matrix from the features of interest
        - computes the cosine similarity for all games using the cosine similarity formula and binary vectors
    Returns both cosine similarity matrices and a df of the indices of the games. 
    """
    # TF-IDF matrix from description
    #Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')

    #Construct the required TF-IDF matrix from game descriptions using fit_transform
    tfidf_matrix = tfidf.fit_transform(games_df2['description'])

    # Compute the cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Count matrix from soup (mechanics, categories, publisher)
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(games_df2['soup'])

    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

    # Reset index oand construct reverse mapping
    games_df2 = games_df2.reset_index()
    indices = pd.Series(games_df2.index, index=games_df2['handle']).drop_duplicates()
    
    return cosine_sim, cosine_sim2, indices

def content_based_similar_games(handle, cosine_sim, cosine_sim2, indices, games_df2):
    """
    Function that takes in game handle and returns the most similar games.
    Using the previously calculated similarity matrices, sorts the games by similarity and returns the top 10 most similar games
    """
    # Get the index of the game corresponding to the game handle
    idx = indices[handle]

    # Get the pairwise similarity scores of all games with that game
    sim_scores = list(enumerate(cosine_sim[idx]+cosine_sim2[idx]))
    
    # Sort the games based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 10 most similar games
    sim_scores = sim_scores[1:11]

    # Get the game indices
    game_indices = [i[0] for i in sim_scores]

    # Return a df of the top 10 most similar games
    similar_games_df = games_df2[['handle', 'average_user_rating', 'in_num_collections']].iloc[game_indices]
    similar_games_df = similar_games_df.sort_values(by=['in_num_collections', 'average_user_rating'], ascending=False)
    return similar_games_df

def get_similarity_score_all_games(handle, cosine_sim, cosine_sim2, indices):
    """
    Function that takes in game handle as input and outputs similarity score for all other games.
    """
    # Get the index of the game that matches the handle
    idx = indices[handle]

    # Get the pairwsie similarity scores of all games with that game
    sim_scores = 0.5*cosine_sim[idx]+0.5*cosine_sim2[idx]

    return sim_scores

def user_data_wrangling(games_df, users_df2):
    """
    Takes in the users_df and puts all of the necessary data in the right form.  
    This includes creating a binary vector for all users of their quiz answersand the games in their collections  
    """     
    answers = ['small','large','dice','card','strategy','puzzle','simple','complex','cooperative','simulation','drafting','memory','short','long']
    for answer in answers:
        users_df2[answer] = users_df2.apply(lambda x: check_quiz(x['quiz'], answer),axis=1)

    # game_handles = list(games_df['handle'])
    game_handles = [handle for sublist in list(users_df2['my_collection']) for handle in sublist]
    game_handles = list(dict.fromkeys(game_handles))
    for handle in game_handles:
        users_df2[handle] = 0
        users_df2[handle] = users_df2['my_collection'].apply(lambda x: 1 if handle in x else 0)

    users_df3 = users_df2.drop(columns=["my_collection", "quiz"])
    users_df3 = users_df3.set_index('email')
    return users_df3

def user_similarity_prep(users_df3):
    """
    Takes in a user_df and:
        - computes the cosine similarity for all games using the cosine similarity formula and binary vectors
    Returns the cosine similarity matrix for all users and a df of the indices of the games. 
    """
    # Compute the cosine similarity of each user with each other user
    X_user = cosine_similarity(users_df3, users_df3)

    # Reset index of your main DataFrame and construct reverse mapping as before
    users_df3 = users_df3.reset_index()
    indices = pd.Series(users_df3.index, index=users_df3['email']).drop_duplicates()
    return X_user, indices

def get_similar_users(email, cosine_sim, indices, users_df2):
    """
    Function that takes a user as input and outputs df of most similar users
    """
    # Get the index of the user that matches the email
    idx = indices[email]

    # Get the pairwsie similarity scores of all users with that user
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the users based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 20 most similar users
    sim_scores = sim_scores[1:21]

    # Get the user indices
    user_indices = [i[0] for i in sim_scores]
    scores = [i[1] for i in sim_scores]

    # Return the top 20 most similar users
    sim_users = users_df2[['email', 'my_collection']].iloc[user_indices]
    
    sim_users['sim_scores'] = scores
    return sim_users


def handles_to_games(product_list, products_collection):
    """
    Takes in a list of games handles and returns the equivalent list of games objects
    Args:
        product_list <class 'list'>: List of product handles
        products_collection <class 'flask_pymongo.wrappers.Collection'>: collection of all products
    Returns:
        games <class 'list'>: List of game objects
    """
    games = []
    for product_handle in product_list:
        product = products_collection.find_one({'handle': product_handle})
        # Stringify for JSON purposes
        product['_id'] = str(product['_id'])
        product['last_updated'] = product['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        games.append(product)
    return games

def get_name(lst):
    """
    Takes in a list of dictionaries and returns just the name of the feature
    """
    lst = [item['name'] for item in lst]
    lst2 = []
    for item in lst:
        if item:
            item = str.lower(item.replace(" ", ""))
            lst2.append(item)
    return lst2

def get_primary_publisher(item):
    """
    Takes in dictionary and returns name field in stripped lowercase 
    """
    if 'name' in item:
        return str.lower(item['name'].replace(" ", ""))
    return ''

def create_soup(x):
    """
    Joins 3 different firelds in the df to create a soup to use in a count matrix
    """
    return ' '.join(x['categories']) + ' ' + ' '.join(x['mechanics']) + ' ' + x['primary_publisher']

def check_quiz(quiz, answer):
    """
    Takes in dictionary and returns 1 if the answer is in the quiz dict and 0 if not
    Args:
        quiz <class 'dict'>: Dictionary of user's quiz answers
        answer <class 'string'>: Possible quiz answer 
    Returns:
        1 if answer is in quiz values, else 0  
    """
    if quiz:
        if answer in quiz.values():
            return 1
    return 0

def apply_collab_sim_score(pop_games, game_handle):
    """
    Applies the collab_sim_score to each game in df 
    Args:
        pop_games <class 'dict'>: Dictionary of popular games
        game_handle <class 'float'>: Handle of a single game
    Returns:
        The value pair for the game_handle if it is in pop_games, else 0 
    """
    if game_handle in pop_games:
        return pop_games[game_handle]
    return 0

def add_games_from_user(pop_games, this_user_games, collection, sim_score):
    """
    Takes in a user's collection and their similarity score and adds to the pop_games dict 
    Args:
        pop_games <class 'dict'>: Dictionary of popular games
        this_user_games <class 'list'>: List of this user's games
        collection <class 'list'>: List of other user's games
        sim_score <class 'float'>: Similarity score between two users
    Returns:
        NULL
    """
    # Only add games that the user does not already have
    new_list = list(set(collection).difference(this_user_games))
    for game in new_list:
        if game in pop_games:
             pop_games[game] += sim_score
        else:
             pop_games[game] = sim_score
    return
