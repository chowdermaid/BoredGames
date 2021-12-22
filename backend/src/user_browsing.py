
def filter_all_products(
    search, min_price, max_price, min_year, max_year, min_players, 
    max_players, min_playtime, max_playtime, 
    min_age, mechanics, categories, 
    curve_start, curve_end, depth_start, depth_end, collection):
    """
    Access the games collection in the database, filters based on arguments and returns 
    this data as a python list.
        Args:
        search <class 'string'>: Search string
        min_price <class 'int'>: Minimum price
        max_price <class 'int'>: Maximum price
        min_year <class 'int'>: Minimum year 
        max_year <class 'int'>: Maximum year 
        min_players <class 'int'>: Minimum players 
        max_players <class 'int'>: Maximum players 
        min_playtime <class 'int'>: Minimum playtime
        max_playtime <class 'int'>: Maximum playtime
        min_age <class 'int'>: Minimum age
        mechanics <class 'list'>: List of mechanics
        categories <class 'list'>: List of categories
        curve_start <class 'int'>: Learning curve start
        curve_end <class 'int'>: Learning curve end
        depth_start <class 'int'>: Strategy depth start
        depth_end <class 'int'>: Strategy depth end
        collection <class 'flask_pymongo.wrappers.Collection'>: collection to add game to
    Returns:
        data <class 'list'>: List of all filtered games stored in database
    """
    data = []

    for item in collection.find():
        # hannahs magical code
        item['_id'] = str(item['_id'])
        item['last_updated'] = item['last_updated'].strftime('%Y-%m-%d-%H:%M:%S')
        
        # Search 0: Price range
        if item['price_au'] < min_price or item['price_au'] > max_price:
            continue

        # Search 1: Year published
        if item['year_published'] is None:
            pass
        elif item['year_published'] < min_year or item['year_published'] > max_year:
            continue
        
        # Search 2: Number of players
        if item['min_players'] is None:
            pass
        elif item['min_players'] < min_players:
            continue

        if item['max_players'] is None:
            pass
        elif item['max_players'] > max_players:
            continue
        
        # Search 3: Playtime 
        if item['min_playtime'] is None:
            pass
        elif item['min_playtime'] < min_playtime:
            continue

        if item['max_playtime'] is None:
            pass
        elif item['max_playtime'] > max_playtime:
            continue

        # Search 4: Minimum age
        if item['min_age'] is None:
            pass
        elif item['min_age'] > min_age:
            continue

        # Search 5: Mechanics
        if not (mechanics is None):
            tmpMechanics = mechanics.copy()
            for mech in item['mechanics']:
                if mech['name'] in tmpMechanics:
                    tmpMechanics.remove(mech['name'])
            if len(tmpMechanics) == 0:
                pass 
            else:
                continue

        # Search 6: Categories
        if not (categories is None):
            tmpCategories = categories.copy()
            for cat in item['categories']:
                if cat['name'] in tmpCategories:
                    tmpCategories.remove(cat['name'])
            if len(tmpCategories) == 0:
                pass 
            else:
                continue
        
        # Search 7: Learning curve
        if curve_start == 1:
            curve_start = 0

        if curve_start > item['average_learning_complexity'] or curve_end < item['average_learning_complexity']:
            continue

        # Search 8: Strategy depth 
        if depth_start == 1:
            depth_start = 0

        if depth_start > item['average_strategy_complexity'] or depth_end < item['average_strategy_complexity']:
            continue

        # Search 9: Search string
        if not (search is None):
            if search.lower() not in item['name'].lower():
                continue

        data.append(item)
    return (data, 200)

def collect_user_selected_tags(search, min_price, max_price, min_year, max_year, min_players, 
    max_players, min_playtime, max_playtime, 
    min_age, mechanics, categories, 
    curve_start, curve_end, depth_start, depth_end):
    """
    Checks if any of the tags has changed from default
        Args:
        search <class 'string'>: Search string
        min_price <class 'int'>: Minimum price
        max_price <class 'int'>: Maximum price
        min_year <class 'int'>: Minimum year 
        max_year <class 'int'>: Maximum year 
        min_players <class 'int'>: Minimum players 
        max_players <class 'int'>: Maximum players 
        min_playtime <class 'int'>: Minimum playtime
        max_playtime <class 'int'>: Maximum playtime
        min_age <class 'int'>: Minimum age
        mechanics <class 'list'>: List of mechanics
        categories <class 'list'>: List of categories
        curve_start <class 'int'>: Learning curve start
        curve_end <class 'int'>: Learning curve end
        depth_start <class 'int'>: Strategy depth start
        depth_end <class 'int'>: Strategy depth end
    Returns:
        data <class 'list'>: List of all browsing options user has modified in string
    """
    data = []

    if search != '':
        data.append({"tag": f"search: {search}", "type" : "search"})

    if min_price != 0 or max_price != 70:
        data.append({"tag": f"price: ${min_price*5} - ${max_price*5}", "type" : "price"})

    if min_year != 1 or max_year != 50:
        data.append({"tag": f"year: {min_year+1971} to {max_year+1971}", "type" : "year"})
    
    if min_players != 1 or max_players != 20:
        data.append({"tag": f"players: {min_players} to {max_players}", "type" : "players"})

    if min_age != 18:
        data.append({"tag": f"age : {min_age}+", "type" : "age"})
    
    if min_playtime != 0 or max_playtime != 100:
        data.append({"tag": f"playtime: {min_playtime*5} - {max_playtime*5}", "type" : "playtime"})

    if len(categories) != 0:
        for cat in categories:
            data.append({"tag": f"category: {cat}", "type" : "categories", "value": cat})

    if len(mechanics) != 0:
        for mec in mechanics:
            data.append({"tag": f"mechanic: {mec}", "type" : "mechanics", "value": mec})

    printDict = {
        1 : 'Beginner',
        2: 'Rookie',
        3: 'Standard',
        4: 'Expert',
        5: 'Master'
    }

    if curve_start != 1 or curve_end != 5:
        if curve_start == curve_end:
            data.append({"tag": f"curve : {printDict[curve_start]}", "type" : "curve"})
        else:
            data.append({"tag": f"curve : {printDict[curve_start]} - {printDict[curve_end]}", "type" : "curve"})

    if depth_start != 1 or depth_end != 5:
        if depth_start == depth_end:
            data.append({"tag": f"depth : {printDict[depth_start]}", "type" : "curve"})
        else:
            data.append({"tag": f"depth : {printDict[depth_start]} - {printDict[depth_end]}", "type" : "depth"})

    return (data, 200)
