from pymongo import MongoClient
from config import Config
from datetime import datetime

client = MongoClient(Config.MONGO_URI)
db = client[Config.MONGO_DB_NAME]

# NEXUS Game Collections
sessions_collection = db["sessions"]
game_flags_collection = db["game_flags"]
analytics_collection = db["analytics"]

# Create indexes for performance
def init_db():
    """Initialize database indexes for NEXUS game."""
    
    # Sessions collection indexes
    sessions_collection.create_index("sessionId", unique=True)
    sessions_collection.create_index("lastActivity")  # For expiry cleanup
    sessions_collection.create_index("fingerprint")
    
    # Game flags collection indexes
    game_flags_collection.create_index("avenger", unique=True)
    game_flags_collection.create_index("flag_hash", unique=True)
    
    # Analytics collection indexes
    analytics_collection.create_index("sessionId")
    analytics_collection.create_index("timestamp")
    analytics_collection.create_index([("sessionId", 1), ("event", 1)])
    
    print("✅ NEXUS database indexes initialized.")

def seed_game_flags():
    """Seed the game with Avenger flags (hashed)."""
    import hashlib
    
    # Default flags for testing (CHANGE THESE IN PRODUCTION)
    default_flags = {
        "ironman": "FLAG{ARC_REACTOR_CORE}",
        "thor": "FLAG{BIFROST_GUARDIAN}",
        "hulk": "FLAG{GAMMA_RADIATION}",
        "captainamerica": "FLAG{SUPER_SOLDIER}",
        "blackwidow": "FLAG{RED_ROOM_PROTOCOL}",
        "hawkeye": "FLAG{NEVER_MISS}"
    }
    
    for avenger, flag in default_flags.items():
        flag_hash = hashlib.sha256(flag.encode('utf-8')).hexdigest()
        
        # Upsert flag (update if exists, insert if not)
        game_flags_collection.update_one(
            {"avenger": avenger},
            {
                "$set": {
                    "avenger": avenger,
                    "flag_hash": flag_hash,
                    "stone": Config.STONE_MAPPING[avenger],
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
    
    print(f"✅ Seeded {len(default_flags)} Avenger flags.")

def cleanup_expired_sessions():
    """Remove sessions older than expiry time."""
    from datetime import timedelta
    
    expiry_threshold = datetime.utcnow() - timedelta(hours=Config.SESSION_EXPIRY_HOURS)
    result = sessions_collection.delete_many({"lastActivity": {"$lt": expiry_threshold}})
    
    if result.deleted_count > 0:
        print(f"🧹 Cleaned up {result.deleted_count} expired sessions.")
