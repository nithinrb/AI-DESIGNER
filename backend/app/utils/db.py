import os
from pymongo import MongoClient
from werkzeug.local import LocalProxy

def get_db():
    uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017')
    client = MongoClient(uri)
    return client.get_database('ai_interior_designer')

db = LocalProxy(get_db)
