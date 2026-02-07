from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import jwt, limiter
from models import init_db, seed_game_flags
from routes import auth_bp, game_bp, leaderboard_bp

def create_app():
    """NEXUS Game v2.0 Application Factory (Team Auth)."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Extensions
    CORS(app)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(game_bp, url_prefix="/api/game")
    app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")
    
    # Root Endpoint
    @app.route("/")
    def root():
        return jsonify({
            "message": "NEXUS v2.0 - Team Authentication System",
            "version": "2.0.0",
            "status": "ONLINE"
        })
        
    # Database Init
    with app.app_context():
        try:
            init_db()
            seed_game_flags()
        except Exception as e:
            print(f"⚠️ WARNING: Database initialization failed: {e}")
            print("⚠️ The application will start, but database features may not work until connection is established.")
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
