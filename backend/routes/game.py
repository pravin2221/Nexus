from flask import Blueprint, request, jsonify
from middleware import strong_auth_required
from models import game_flags_collection, teams_collection, analytics_collection
from config import Config
from extensions import limiter
from datetime import datetime
import hashlib

game_bp = Blueprint("game", __name__)

def log_activity(team_name, activity_type, details=None):
    analytics_collection.insert_one({
        "team_name": team_name,
        "activity_type": activity_type,
        "timestamp": datetime.utcnow(),
        "details": details or {}
    })

@game_bp.route("/submit-flag", methods=["POST"])
@strong_auth_required
@limiter.limit("10 per minute")
def submit_flag():
    """
    Stage 1: Submit Flag -> Get Points -> Return Question
    """
    team = request.team
    data = request.get_json()
    flag = data.get("flag", "").strip()
    
    if not flag:
        return jsonify({"error": "Flag required"}), 400
        
    flag_hash = hashlib.sha256(flag.encode('utf-8')).hexdigest()
    
    # 1. Validate Flag
    game_flag = game_flags_collection.find_one({"flag_hash": flag_hash})
    if not game_flag:
        log_activity(team['team_name'], "FLAG_FAIL", {"flag_hash": flag_hash})
        return jsonify({"success": False, "message": "Incorrect Flag"}), 400
        
    avenger = game_flag['avenger']
    
    # 2. Check if already solved
    if avenger in team.get('solved_flags', []):
        return jsonify({"error": "Flag already submitted for this Avenger"}), 409
        
    # 3. Update Team (Award Flag Points)
    teams_collection.update_one(
        {"team_name": team['team_name']},
        {
            "$addToSet": {"solved_flags": avenger},
            "$inc": {"score": Config.POINTS_FLAG}
        }
    )
    
    log_activity(team['team_name'], "FLAG_SUCCESS", {"avenger": avenger, "points": Config.POINTS_FLAG})
    
    return jsonify({
        "success": True, 
        "message": "Flag Accepted! Answer the Question to get the Stone.",
        "question": game_flag['question'],
        "points_awarded": Config.POINTS_FLAG,
        "avenger": avenger
    }), 200

@game_bp.route("/submit-answer", methods=["POST"])
@strong_auth_required
@limiter.limit("10 per minute")
def submit_answer():
    """
    Stage 2: Submit Answer -> Get Stone + Bonus Points
    """
    team = request.team
    data = request.get_json()
    avenger = data.get("avenger", "").lower()
    answer = data.get("answer", "").strip().lower()
    
    if not avenger or not answer:
        return jsonify({"error": "Avenger and Answer required"}), 400
        
    # 1. Verify Flag was solved first
    if avenger not in team.get('solved_flags', []):
        return jsonify({"error": "You must find the Flag first!"}), 403
        
    # 2. Check if Stone already collected
    stone = Config.STONE_MAPPING[avenger]
    if stone in team.get('collected_stones', []):
        return jsonify({"error": "Stone already collected"}), 409
        
    # 3. Validate Answer
    game_flag = game_flags_collection.find_one({"avenger": avenger})
    answer_hash = hashlib.sha256(answer.encode('utf-8')).hexdigest()
    
    if answer_hash != game_flag['answer_hash']:
        log_activity(team['team_name'], "QUESTION_FAIL", {"avenger": avenger})
        return jsonify({"success": False, "message": "Incorrect Answer"}), 400
        
    # 4. Award Stone & Bonus Points
    teams_collection.update_one(
        {"team_name": team['team_name']},
        {
            "$addToSet": {
                "collected_stones": stone,
                "completed_avengers": avenger
            },
            "$inc": {"score": Config.POINTS_ANSWER}
        }
    )
    
    log_activity(team['team_name'], "STONE_ACQUIRED", {"avenger": avenger, "stone": stone})
    
    return jsonify({
        "success": True,
        "message": f"{stone.upper()} STONE ACQUIRED!",
        "stone": stone,
        "total_stones": len(team.get('collected_stones', [])) + 1,
        "points_awarded": Config.POINTS_ANSWER
    }), 200
