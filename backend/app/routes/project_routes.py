from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.utils.db import db
from bson import json_util
import json

project_bp = Blueprint('project', __name__)

@project_bp.route('/history', methods=['GET'])
@jwt_required()
def get_project_history():
    user_id = get_jwt_identity()
    # Fetch projects for the logged in user, sort by newest
    projects_cursor = db.projects.find({'user_id': user_id}).sort('_id', -1)
    projects = json.loads(json_util.dumps(projects_cursor))
    
    # Format IDs nicely for the frontend
    for p in projects:
        if '_id' in p:
            p['id'] = p['_id']['$oid']
            
    return jsonify({"projects": projects}), 200

@project_bp.route('/history', methods=['POST'])
@jwt_required()
def save_project():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_project = {
        "user_id": user_id,
        "name": f"New {data.get('style', 'Design').capitalize()} Project",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "style": data.get('style', 'Modern').capitalize(),
        "budget": data.get('budget', 'Medium').capitalize(),
        "image_url": data.get('output_image_url', ''),
        "score": data.get('layout_score', 80),
        "shop_items": data.get('shop_items', [])
    }
    
    result = db.projects.insert_one(new_project)
    
    return jsonify({"message": "Project saved successfully", "id": str(result.inserted_id)}), 201

@project_bp.route('/budget/<project_id>', methods=['GET'])
@jwt_required()
def get_project_budget(project_id):
    # Mock budget breakdown data
    mock_budget = {
        "total_estimated": 1250,
        "breakdown": [
            {"category": "Furniture", "amount": 800, "color": "#8b5cf6"},
            {"category": "Decor", "amount": 250, "color": "#ec4899"},
            {"category": "Lighting", "amount": 150, "color": "#3b82f6"},
            {"category": "Paint/Materials", "amount": 50, "color": "#10b981"}
        ]
    }
    return jsonify({"budget": mock_budget}), 200
