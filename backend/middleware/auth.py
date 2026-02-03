from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from bson import ObjectId
from models import users_collection


def admin_required():
    """
    Decorator to require admin privileges.
    Must be used after @jwt_required().
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if not user.get("is_admin", False):
                return jsonify({"error": "Admin access required"}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def get_current_user():
    """Get current user document from JWT identity."""
    user_id = get_jwt_identity()
    if not user_id:
        return None
    
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        return user
    except Exception:
        return None
