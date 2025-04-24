import json
import os

DATA_FILE = "users.json"

def load_users():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def save_users(users):
    with open(DATA_FILE, "w") as file:
        json.dump(users, file, indent=4)

def register_user(name, email, username, password):
    users = load_users()
    if any(user["email"] == email for user in users):
        return {"error": "Email already exists"}, 400
    new_user = {
        "name": name,
        "email": email,
        "username": username,
        "password": password
    }
    users.append(new_user)
    save_users(users)
    return {"message": "User registered successfully"}, 200

def login_user(email, password):
    users = load_users()
    for user in users:
        if user["email"] == email and user["password"] == password:
            return {"message": "Login successful", "username": user["username"]}, 200
    return {"error": "Invalid email or password"}, 401
