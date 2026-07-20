import os
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.services.ai_service import ai_service

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')
try:
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
except OSError:
    pass

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/room', methods=['POST'])
@jwt_required()
def upload_room():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected image"}), 400
        
    if file and allowed_file(file.filename):
        # Get optional preferences from form
        style = request.form.get('style', 'modern')
        budget = request.form.get('budget', 'medium')
        
        # Read file into memory for Vercel serverless processing
        image_bytes = file.read()
        
        # Perform AI Analysis directly on bytes
        try:
            analysis_results = ai_service.analyze_room(image_bytes, style, budget)
            
            return jsonify({
                "message": "Room analyzed successfully",
                "image_url": analysis_results['output_image_url'], # This is now a Base64 string!
                "analysis": analysis_results
            }), 200
        except Exception as e:
            return jsonify({"error": f"AI analysis failed: {str(e)}"}), 500
            
    return jsonify({"error": "File type not allowed"}), 400
