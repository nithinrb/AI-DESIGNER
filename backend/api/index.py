import os
import sys

# Add the parent directory to the Python path so it can find the app module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Vercel Serverless requires the application instance to be exported
# Often as 'app' or 'handler'
