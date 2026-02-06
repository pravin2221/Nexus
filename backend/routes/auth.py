import bcrypt
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import teams_collection, analytics_collection
from config import Config

auth_bp = Blueprint("auth", __name__)

def log_activity(team_name, activity_type, details=None):
    analytics_collection.insert_one({
        "team_name": team_name,
        "activity_type": activity_type,
        "timestamp": datetime.utcnow(),
        "details": details or {}
    })

@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("5 per minute")
def signup():
    """Register a new Team."""
    data = request.get_json()
    team_name = data.get("team_name", "").strip()
    password = data.get("password", "").strip()
    
    if not team_name or not password:
        return jsonify({"error": "Team Name and Password Required"}), 400
        
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
        
    if teams_collection.find_one({"team_name": team_name}):
        return jsonify({"error": "Team Name already exists"}), 409
        
    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create Team
    teams_collection.insert_one({
        "team_name": team_name,
        "password_hash": password_hash,
        "score": 0,
        "created_at": datetime.utcnow(),
        "solved_flags": [],
        "collected_stones": [],
        "completed_avengers": []
    })
    
    log_activity(team_name, "SIGNUP")
    
    return jsonify({"message": "Team Registered Successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    """Login and get 3-Hour JWT."""
    data = request.get_json()
    team_name = data.get("team_name", "")
    password = data.get("password", "")
    current_ua = request.headers.get("User-Agent", "")
    
    team = teams_collection.find_one({"team_name": team_name})
    
    if not team or not bcrypt.checkpw(password.encode('utf-8'), team['password_hash']):
        return jsonify({"error": "Invalid Credentials"}), 401
        
    # Create JWT with strict 3-hour expiry AND UA Binding
    now_timestamp = datetime.utcnow().timestamp()
    access_token = create_access_token(
        identity=team_name,
        additional_claims={
            "login_time": str(now_timestamp),
            "ua": current_ua
        }
    )
    
    log_activity(team_name, "LOGIN", {"ua": current_ua})
    
    return jsonify({
        "message": "Login Successful",
        "access_token": access_token,
        "expires_in": "3 hours"
    }), 200
