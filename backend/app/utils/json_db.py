import os
import json

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'projects_db.json')

def load_projects():
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_projects(projects):
    with open(DB_FILE, 'w') as f:
        json.dump(projects, f, indent=4)
