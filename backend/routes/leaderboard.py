from flask import Blueprint, jsonify, request
from models import teams_collection, analytics_collection
from middleware import strong_auth_required

leaderboard_bp = Blueprint("leaderboard", __name__)

@leaderboard_bp.route("/", methods=["GET"])
def get_leaderboard():
    """Public Leaderboard: Top Teams by Score."""
    top_teams = list(teams_collection.find(
        {}, 
        {"team_name": 1, "score": 1, "collected_stones": 1, "_id": 0}
    ).sort("score", -1).limit(20))
    
    return jsonify({"leaderboard": top_teams}), 200

@leaderboard_bp.route("/activity", methods=["GET"])
@strong_auth_required
def get_team_activity():
    """Private Activity Log for Logged-In Team."""
    team_name = request.team['team_name']
    
    logs = list(analytics_collection.find(
        {"team_name": team_name},
        {"_id": 0}
    ).sort("timestamp", -1).limit(50))
    
    return jsonify({
        "team": team_name,
        "logs": logs
    }), 200
