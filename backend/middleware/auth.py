from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from models import teams_collection
from datetime import datetime, timedelta

def strong_auth_required(f):
    """
    Strong Authentication Decorator
    - Verifies JWT presence and validity
    - Enforces Strict 3-Hour Expiry (Server-Side Check)
    - Verifies Team existence in DB
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # 1. Verify standard JWT signature
            verify_jwt_in_request()
            
            # 2. Get Claims & Identity
            claims = get_jwt()
            team_name = get_jwt_identity()
            
            # 3. Server-Side Expiry Check (Double Validation)
            # Although JWT has 'exp', we check login_time claim vs current time
            login_time_str = claims.get("login_time")
            if login_time_str:
                login_timestamp = float(login_time_str)
                login_dt = datetime.fromtimestamp(login_timestamp)
                
                # STRICT 3-HOUR LIMIT
                if datetime.utcnow() > login_dt + timedelta(hours=3):
                    return jsonify({"error": "Session Expired (3 Hours Limit). Please Login Again."}), 401

            # 4. User-Agent Binding (Anti-Theft)
            original_ua = claims.get("ua")
            current_ua = request.headers.get("User-Agent", "")
            if original_ua and original_ua != current_ua:
                # Token being used on different browser/device -> ALARM
                return jsonify({"error": "Security Violation: Session Bound to Original Device"}), 403

            # 5. Verify Team Still Exists (Security)
            team = teams_collection.find_one({"team_name": team_name})
            if not team:
                return jsonify({"error": "Team not found or banned"}), 401
                
            # Attach team to request for use in route
            request.team = team
            
        except Exception as e:
            return jsonify({"error": f"Authentication Failed: {str(e)}"}), 401
            
        return f(*args, **kwargs)
        
    return decorated_function
