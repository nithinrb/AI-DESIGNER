from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

shop_bp = Blueprint('shop', __name__)

from app.utils.db import db
from app.services.ai_service import ai_service
from flask_jwt_extended import get_jwt_identity

@shop_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    style = request.args.get('style', 'modern')
    user_id = get_jwt_identity()
    
    # Check if the user has any saved projects matching this style to get their specific injected items
    injected_items = []
    
    # Fetch latest project for this user matching the style
    latest_proj = db.projects.find_one({'user_id': user_id, 'style': style.capitalize()}, sort=[('_id', -1)])
    
    if latest_proj and 'shop_items' in latest_proj:
        injected_items = latest_proj['shop_items']
            
    # Get the full catalog for this style
    full_catalog = ai_service.get_full_catalog(style)
    
    # Create the final list: Injected items FIRST, then the rest of the catalog (avoiding duplicates)
    final_items = []
    injected_ids = set()
    
    for item in injected_items:
        final_items.append(item)
        injected_ids.add(item['id'])
        
    for item in full_catalog:
        if item['id'] not in injected_ids:
            final_items.append(item)
            
    return jsonify({"products": final_items}), 200
