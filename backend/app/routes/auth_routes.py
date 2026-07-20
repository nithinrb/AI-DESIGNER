from flask import Blueprint
from flask_restful import Api
from app.controllers.auth_controller import RegisterResource, LoginResource

auth_bp = Blueprint('auth', __name__)
api = Api(auth_bp)

api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
