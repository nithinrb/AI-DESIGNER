from flask import request
from flask_restful import Resource
from app.models.user import User
from flask_jwt_extended import create_access_token
from datetime import timedelta

class RegisterResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password or not name:
            return {'message': 'Missing fields'}, 400

        if User.find_by_email(email):
            return {'message': 'User already exists'}, 400

        user_id = User.create(email, password, name)
        access_token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))
        return {'message': 'User created', 'token': access_token, 'user': {'id': user_id, 'name': name, 'email': email}}, 201

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.find_by_email(email)
        if not user or not User.verify_password(password, user['password']):
            return {'message': 'Invalid credentials'}, 401

        access_token = create_access_token(identity=str(user['_id']), expires_delta=timedelta(days=7))
        return {'message': 'Login successful', 'token': access_token, 'user': {'id': str(user['_id']), 'name': user['name'], 'email': user['email']}}, 200
