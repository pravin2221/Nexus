import hashlib
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from models import flags_collection, users_collection, submissions_collection
from middleware.auth import admin_required

admin_bp = Blueprint("admin", __name__)


def hash_flag(flag: str) -> str:
    """Hash flag using SHA-256."""
    return hashlib.sha256(flag.strip().encode("utf-8")).hexdigest()


@admin_bp.route("/flags", methods=["POST"])
@admin_required()
def create_flag():
    """
    Create a new flag/challenge.
    
    Body:
    {
        "flag": "CTF{the_actual_flag}",
        "challenge_name": "Challenge Name",
        "category": "Web/Crypto/Forensics/Misc/Pwn/Rev",
        "points": 100,
        "description": "Challenge description (optional)"
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    
    flag = data.get("flag", "").strip()
    challenge_name = data.get("challenge_name", "").strip()
    category = data.get("category", "General").strip()
    points = data.get("points", 100)
    description = data.get("description", "").strip()
    
    if not flag:
        return jsonify({"error": "Flag is required"}), 400
    
    if not challenge_name:
        return jsonify({"error": "Challenge name is required"}), 400
    
    if not isinstance(points, int) or points < 0:
        return jsonify({"error": "Points must be a positive integer"}), 400
    
    flag_hash = hash_flag(flag)
    
    # Check if flag already exists
    existing = flags_collection.find_one({"flag_hash": flag_hash})
    if existing:
        return jsonify({"error": "This flag already exists"}), 409
    
    flag_doc = {
        "flag_hash": flag_hash,
        "challenge_name": challenge_name,
        "category": category,
        "points": points,
        "description": description,
        "created_at": datetime.utcnow()
    }
    
    result = flags_collection.insert_one(flag_doc)
    
    return jsonify({
        "message": "Flag created successfully",
        "flag_id": str(result.inserted_id),
        "challenge_name": challenge_name,
        "points": points
    }), 201


@admin_bp.route("/flags", methods=["GET"])
@admin_required()
def list_flags():
    """
    List all flags/challenges.
    """
    flags = list(flags_collection.find().sort("created_at", -1))
    
    result = []
    for f in flags:
        # Count submissions for this flag
        submission_count = submissions_collection.count_documents({"flag_hash": f["flag_hash"]})
        
        result.append({
            "flag_id": str(f["_id"]),
            "challenge_name": f.get("challenge_name", "Unknown"),
            "category": f.get("category", "General"),
            "points": f.get("points", 0),
            "description": f.get("description", ""),
            "solves": submission_count,
            "created_at": f.get("created_at").isoformat() if f.get("created_at") else None
        })
    
    return jsonify({
        "flags": result,
        "total": len(result)
    }), 200


@admin_bp.route("/flags/<flag_id>", methods=["DELETE"])
@admin_required()
def delete_flag(flag_id):
    """
    Delete a flag/challenge.
    """
    try:
        result = flags_collection.delete_one({"_id": ObjectId(flag_id)})
    except Exception:
        return jsonify({"error": "Invalid flag ID"}), 400
    
    if result.deleted_count == 0:
        return jsonify({"error": "Flag not found"}), 404
    
    return jsonify({"message": "Flag deleted successfully"}), 200


@admin_bp.route("/flags/<flag_id>", methods=["PUT"])
@admin_required()
def update_flag(flag_id):
    """
    Update a flag/challenge.
    
    Body (all fields optional):
    {
        "flag": "new_flag (will be re-hashed)",
        "challenge_name": "New Name",
        "category": "New Category",
        "points": 200,
        "description": "New description"
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    
    try:
        existing = flags_collection.find_one({"_id": ObjectId(flag_id)})
    except Exception:
        return jsonify({"error": "Invalid flag ID"}), 400
    
    if not existing:
        return jsonify({"error": "Flag not found"}), 404
    
    update_fields = {}
    
    if "flag" in data and data["flag"].strip():
        update_fields["flag_hash"] = hash_flag(data["flag"])
    
    if "challenge_name" in data and data["challenge_name"].strip():
        update_fields["challenge_name"] = data["challenge_name"].strip()
    
    if "category" in data:
        update_fields["category"] = data["category"].strip()
    
    if "points" in data:
        if not isinstance(data["points"], int) or data["points"] < 0:
            return jsonify({"error": "Points must be a positive integer"}), 400
        update_fields["points"] = data["points"]
    
    if "description" in data:
        update_fields["description"] = data["description"].strip()
    
    if not update_fields:
        return jsonify({"error": "No valid fields to update"}), 400
    
    update_fields["updated_at"] = datetime.utcnow()
    
    flags_collection.update_one(
        {"_id": ObjectId(flag_id)},
        {"$set": update_fields}
    )
    
    return jsonify({"message": "Flag updated successfully"}), 200


@admin_bp.route("/users", methods=["GET"])
@admin_required()
def list_users():
    """
    List all users with their scores.
    """
    users = list(users_collection.find().sort("score", -1))
    
    result = []
    for u in users:
        submission_count = submissions_collection.count_documents({"user_id": str(u["_id"])})
        
        result.append({
            "user_id": str(u["_id"]),
            "email": u.get("email", ""),
            "score": u.get("score", 0),
            "is_admin": u.get("is_admin", False),
            "submissions": submission_count,
            "created_at": u.get("created_at").isoformat() if u.get("created_at") else None
        })
    
    return jsonify({
        "users": result,
        "total": len(result)
    }), 200


@admin_bp.route("/users/<user_id>/admin", methods=["POST"])
@admin_required()
def make_admin(user_id):
    """
    Grant admin privileges to a user.
    """
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_admin": True}}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400
    
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User granted admin privileges"}), 200


@admin_bp.route("/users/<user_id>/admin", methods=["DELETE"])
@admin_required()
def remove_admin(user_id):
    """
    Remove admin privileges from a user.
    """
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_admin": False}}
        )
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400
    
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "Admin privileges removed"}), 200


@admin_bp.route("/reset", methods=["POST"])
@admin_required()
def reset_scores():
    """
    Reset all user scores and clear submissions.
    USE WITH CAUTION!
    
    Body:
    {
        "confirm": "RESET_ALL_DATA"
    }
    """
    data = request.get_json()
    
    if not data or data.get("confirm") != "RESET_ALL_DATA":
        return jsonify({
            "error": "Confirmation required. Send {\"confirm\": \"RESET_ALL_DATA\"}"
        }), 400
    
    # Reset all user scores
    users_collection.update_many({}, {"$set": {"score": 0}})
    
    # Clear all submissions
    submissions_collection.delete_many({})
    
    return jsonify({
        "message": "All scores reset and submissions cleared"
    }), 200
