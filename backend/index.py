import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_bp
from app.routes.upload_routes import upload_bp
from app.routes.project_routes import project_bp
from app.routes.shop_routes import shop_bp
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(project_bp, url_prefix='/api/project')
app.register_blueprint(shop_bp, url_prefix='/api/shop')

from flask import send_from_directory

@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'success', 'message': 'AI Interior Designer Backend is running.'}

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
