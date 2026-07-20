from app.utils.db import db
from bson.objectid import ObjectId
import bcrypt

class User:
    @staticmethod
    def get_collection():
        return db.users

    @staticmethod
    def create(email, password, name):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_data = {
            'email': email,
            'password': hashed_password.decode('utf-8'),
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
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
