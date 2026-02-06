from flask import Blueprint, request, jsonify
from middleware import session_required, update_session
from models import analytics_collection
from datetime import datetime

nexus_bp = Blueprint("nexus", __name__)


def log_analytics(session_id, event, data=None):
    """Log analytics event."""
    log_entry = {
        "sessionId": session_id,
        "event": event,
        "timestamp": datetime.utcnow(),
        "data": data or {}
    }
    analytics_collection.insert_one(log_entry)


@nexus_bp.route("/status", methods=["GET"])
@session_required
def check_nexus_status():
    """
    Check if final Nexus is unlocked.
    
    Returns: { "unlocked": true/false, "stones": 6, "message": "..." }
    """
    session = request.session
    stones = session.get("stones", [])
    completed_avengers = session.get("completedAvengers", [])
    
    # Check if all 6 stones collected
    all_stones_collected = len(stones) == 6
    all_avengers_completed = len(completed_avengers) == 6
    
    # Verify no cheating (basic check)
    legitimate = all_stones_collected and all_avengers_completed
    
    if legitimate:
        return jsonify({
            "unlocked": True,
            "stones": stones,
            "stoneCount": len(stones),
            "completedAvengers": completed_avengers,
            "message": "All Infinity Stones collected. The Nexus awaits.",
            "status": "WORTHY"
        }), 200
    else:
        return jsonify({
            "unlocked": False,
            "stones": stones,
            "stoneCount": len(stones),
            "completedAvengers": completed_avengers,
            "message": f"Collect all 6 Infinity Stones. Current: {len(stones)}/6",
            "status": "IN_PROGRESS"
        }), 200


@nexus_bp.route("/complete", methods=["POST"])
@session_required
def complete_nexus():
    """
    Record final Nexus completion.
    
    This is called when user reaches the final page.
    """
    session = request.session
    session_id = request.session_id
    stones = session.get("stones", [])
    
    # Validate 6 stones
    if len(stones) != 6:
        return jsonify({
            "error": "Cannot complete Nexus without all 6 stones",
            "currentStones": len(stones)
        }), 403
    
    # Check if already completed
    if session.get("nexusCompleted"):
        return jsonify({
            "message": "Nexus already completed",
            "completedAt": session.get("nexusCompletedAt")
        }), 200
    
    # Mark as completed
    completion_time = datetime.utcnow()
    total_time = (completion_time - session.get("createdAt")).total_seconds()
    
    update_session(session_id, {
        "nexusCompleted": True,
        "nexusCompletedAt": completion_time,
        "status": "WORTHY",
        "totalTimeTaken": total_time
    })
    
    # Log completion
    log_analytics(session_id, "nexus_completed", {
        "totalTime": total_time,
        "stones": stones,
        "completedAvengers": session.get("completedAvengers", [])
    })
    
    return jsonify({
        "success": True,
        "message": "NEXUS COMPLETE - YOU ARE WORTHY",
        "completedAt": completion_time,
        "totalTime": f"{int(total_time // 60)} minutes",
        "status": "WORTHY"
    }), 200


@nexus_bp.route("/analytics", methods=["GET"])
@session_required
def get_session_analytics():
    """Get analytics for current session."""
    session_id = request.session_id
    
    # Fetch all analytics for this session
    logs = list(analytics_collection.find(
        {"sessionId": session_id}
    ).sort("timestamp", 1))
    
    # Remove MongoDB _id for JSON serialization
    for log in logs:
        log.pop("_id", None)
    
    return jsonify({
        "sessionId": session_id,
        "events": logs,
        "totalEvents": len(logs)
    }), 200


@nexus_bp.route("/leaderboard", methods=["GET"])
@session_required
def get_leaderboard():
    """
    Get leaderboard of completed sessions (optional feature).
    
    Returns top sessions by completion time.
    """
    from models import sessions_collection
    
    # Find all completed sessions
    completed_sessions = list(sessions_collection.find(
        {"nexusCompleted": True}
    ).sort("totalTimeTaken", 1).limit(10))
    
    leaderboard = []
    for idx, session in enumerate(completed_sessions, 1):
        leaderboard.append({
            "rank": idx,
            "sessionId": session["sessionId"][:8] + "...",  # Partial ID for privacy
            "completedAt": session.get("nexusCompletedAt"),
            "totalTime": session.get("totalTimeTaken"),
            "stones": len(session.get("stones", []))
        })
    
    return jsonify({
        "leaderboard": leaderboard,
        "total": len(leaderboard)
    }), 200
