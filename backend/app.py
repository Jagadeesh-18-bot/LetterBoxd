from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

USERS_FILE = 'users.json'

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not all([name, email, username, password]):
        return jsonify({'error': 'Missing fields'}), 400

    users = load_users()
    if any(u['email'] == email or u['username'] == username for u in users):
        return jsonify({'error': 'User already exists'}), 409

    users.append({"name": name, "email": email, "username": username, "password": password})
    save_users(users)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing credentials'}), 400

    users = load_users()
    for user in users:
        if user['email'] == email and user['password'] == password:
            return jsonify({'message': 'Login successful', 'username': user['username']}), 200

    return jsonify({'error': 'Invalid email or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
