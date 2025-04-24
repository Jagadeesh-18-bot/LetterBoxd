from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

USERS_FILE = 'users.json'
RATINGS_FILE = 'ratings.json'
WATCHLIST_FILE = 'watchlist.json'
FOLLOW_FILE = 'follows.json'
ADDEDMOVIES_FILE = 'addedmovies.json'  # New file for OMDb movies

# === File Init ===
for file in [USERS_FILE, RATINGS_FILE, WATCHLIST_FILE, FOLLOW_FILE, ADDEDMOVIES_FILE]:
    if not os.path.exists(file):
        with open(file, 'w') as f:
            json.dump([], f)

# === Generic File Functions ===
def load_json(file):
    with open(file, 'r') as f:
        return json.load(f)

def save_json(file, data):
    with open(file, 'w') as f:
        json.dump(data, f, indent=2)

# === USER AUTH & PROFILE ===
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    users = load_json(USERS_FILE)
    if any(u['email'] == email or u['username'] == username for u in users):
        return jsonify({'error': 'User already exists'}), 409

    users.append({
        "name": name,
        "email": email,
        "username": username,
        "password": password,
        "location": "",
        "bio": "",
        "avatar": "",
        "joined": str(datetime.today().date())
    })
    save_json(USERS_FILE, users)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    users = load_json(USERS_FILE)
    for user in users:
        if user['email'] == email and user['password'] == password:
            return jsonify({
                'message': 'Login successful',
                'username': user['username']
            }), 200
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    users = load_json(USERS_FILE)
    user = next((u for u in users if u['username'] == username), None)
    if user:
        user_copy = user.copy()
        del user_copy['password']
        return jsonify(user_copy), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/profile/<username>', methods=['PUT'])
def update_profile(username):
    data = request.get_json()
    users = load_json(USERS_FILE)
    for user in users:
        if user['username'] == username:
            user.update({
                'name': data.get('name', user.get('name')),
                'location': data.get('location', user.get('location')),
                'bio': data.get('bio', user.get('bio')),
                'avatar': data.get('avatar', user.get('avatar')),
            })
            save_json(USERS_FILE, users)
            return jsonify({'message': 'Profile updated'}), 200
    return jsonify({'error': 'User not found'}), 404

# === RATINGS ===
@app.route('/api/ratings', methods=['POST'])
def add_rating():
    data = request.get_json()
    title = data.get('movieTitle')
    rating = data.get('rating')
    username = data.get('username')

    if not title or not isinstance(rating, (int, float)) or not username:
        return jsonify({'error': 'Invalid rating data'}), 400

    ratings = load_json(RATINGS_FILE)

    for r in ratings:
        if r['movieTitle'] == title and r['username'] == username:
            r['rating'] = rating
            break
    else:
        ratings.append({'movieTitle': title, 'rating': rating, 'username': username})

    save_json(RATINGS_FILE, ratings)
    return jsonify({'message': 'Rating saved'}), 201

@app.route('/api/ratings/<username>', methods=['GET'])
def get_user_ratings(username):
    all_ratings = load_json(RATINGS_FILE)
    user_ratings = [r for r in all_ratings if r['username'] == username]
    return jsonify(user_ratings)

# === WATCHLIST ===
@app.route('/api/watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    title = data.get('movieTitle')
    username = data.get('username')

    if not title or not username:
        return jsonify({'error': 'Missing data'}), 400

    watchlist = load_json(WATCHLIST_FILE)
    if not any(w['movieTitle'] == title and w['username'] == username for w in watchlist):
        watchlist.append({'movieTitle': title, 'username': username})
        save_json(WATCHLIST_FILE, watchlist)
        return jsonify({'message': 'Movie added to watchlist'}), 201

    return jsonify({'message': 'Already exists'}), 200

@app.route('/api/watchlist/<username>', methods=['GET'])
def get_user_watchlist(username):
    watchlist = load_json(WATCHLIST_FILE)
    user_watchlist = [w['movieTitle'] for w in watchlist if w['username'] == username]
    return jsonify(user_watchlist)

@app.route('/api/watchlist/<username>', methods=['DELETE'])
def remove_from_watchlist(username):
    data = request.get_json()
    title = data.get('movieTitle')
    
    if not title:
        return jsonify({'error': 'Missing movieTitle'}), 400

    watchlist = load_json(WATCHLIST_FILE)
    new_watchlist = [w for w in watchlist if not (w['movieTitle'] == title and w['username'] == username)]
    
    save_json(WATCHLIST_FILE, new_watchlist)
    return jsonify({'message': 'Movie removed from watchlist'}), 200

# === USERS & FOLLOW ===
@app.route('/api/users', methods=['GET'])
def get_users():
    users = load_json(USERS_FILE)
    usernames = [user['username'] for user in users]
    return jsonify(usernames)

@app.route('/api/follow', methods=['POST'])
def follow_user():
    data = request.get_json()
    follower = data.get('follower')
    following = data.get('following')

    if not follower or not following:
        return jsonify({'error': 'Missing follower or following data'}), 400

    follows = load_json(FOLLOW_FILE)
    if not any(f['follower'] == follower and f['following'] == following for f in follows):
        follows.append({'follower': follower, 'following': following})
        save_json(FOLLOW_FILE, follows)
        return jsonify({'message': 'Followed successfully'}), 201
    return jsonify({'message': 'Already following'}), 200

@app.route('/api/following/<username>', methods=['GET'])
def get_following(username):
    follows = load_json(FOLLOW_FILE)
    user_following = [f['following'] for f in follows if f['follower'] == username]
    return jsonify(user_following)

@app.route('/api/followers/<username>', methods=['GET'])
def get_followers(username):
    follows = load_json(FOLLOW_FILE)
    user_followers = [f['follower'] for f in follows if f['following'] == username]
    return jsonify(user_followers)

@app.route('/api/follow/<username>', methods=['DELETE'])
def unfollow_user(username):
    data = request.get_json()
    following = data.get('following')

    if not following:
        return jsonify({'error': 'Missing following data'}), 400

    follows = load_json(FOLLOW_FILE)
    new_follows = [f for f in follows if not (f['follower'] == username and f['following'] == following)]
    save_json(FOLLOW_FILE, new_follows)
    return jsonify({'message': 'Unfollowed successfully'}), 200
# === NEW: Add OMDb Movies ===
@app.route('/api/addmovies', methods=['POST'])
def add_omdb_movies():
    data = request.get_json()
    movies = data.get('movies', [])
    
    if not movies:
        return jsonify({'error': 'No movies provided'}), 400

    added_movies = load_json(ADDEDMOVIES_FILE)
    for movie in movies:
        if not any(m['title'] == movie.get('title') for m in added_movies):
            added_movies.append({
                'title': movie.get('title'),
                'genre': movie.get('genre', 'Uncategorized'),
                'rating': movie.get('rating', 0),
                'image': movie.get('image', ''),
                'description': movie.get('description', ''),
                'link': movie.get('link', '')
            })
    save_json(ADDEDMOVIES_FILE, added_movies)
    return jsonify({'message': 'Movies added successfully'}), 201

# === Run App ===
if __name__ == '__main__':
    app.run(debug=True)