from flask import Flask, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS

from config import Config
from models import init_db, seed_game_flags, cleanup_expired_sessions
from routes import avenger_bp, game_bp, nexus_bp


def create_app():
    """NEXUS Game Application Factory."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, supports_credentials=True)  # Enable credentials for cookies
    
    limiter = Limiter(
        key_func=get_remote_address,
        app=app,
        default_limits=[Config.RATELIMIT_DEFAULT],
        storage_uri=Config.RATELIMIT_STORAGE_URI
    )
    
    # Register NEXUS blueprints
    app.register_blueprint(avenger_bp, url_prefix="/api/avenger")
    app.register_blueprint(game_bp, url_prefix="/api")
    app.register_blueprint(nexus_bp, url_prefix="/api/nexus")
    
    # Health check endpoint
    @app.route("/api/health")
    def health_check():
        return jsonify({
            "status": "healthy",
            "message": "NEXUS Game Backend",
            "version": "2.0"
        })
    
    # Root endpoint
    @app.route("/")
    def root():
        return jsonify({
            "message": "NEXUS - Avengers Infinity Stone Quest",
            "endpoints": {
                "health": "/api/health",
                "avenger": "/api/avenger/*",
                "game": "/api/*",
                "nexus": "/api/nexus/*"
            }
        })
    
    # Initialize database and seed flags
    with app.app_context():
        init_db()
        seed_game_flags()
        cleanup_expired_sessions()
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500
    
    return app


if __name__ == "__main__":
    app = create_app()
    print("🚀 NEXUS Backend Starting...")
    print("📍 Endpoints:")
    print("   - Health: http://localhost:5000/api/health")
    print("   - Avenger: http://localhost:5000/api/avenger/*")
    print("   - Game: http://localhost:5000/api/*")
    print("   - Nexus: http://localhost:5000/api/nexus/*")
    app.run(debug=True, host="0.0.0.0", port=5000)
