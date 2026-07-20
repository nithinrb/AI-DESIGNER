from app.utils.db import db
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    @staticmethod
    def get_collection():
        return db.users

    @staticmethod
    def create(email, password, name):
        hashed_password = generate_password_hash(password)
        user_data = {
            'email': email,
            'password': hashed_password,
            'name': name
        }
        result = User.get_collection().insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        return User.get_collection().find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        return User.get_collection().find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def verify_password(password, hashed_password):
        return check_password_hash(hashed_password, password)
