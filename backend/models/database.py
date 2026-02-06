from pymongo import MongoClient
from config import Config
from datetime import datetime

client = MongoClient(Config.MONGO_URI)
db = client[Config.MONGO_DB_NAME]

# NEXUS Game Collections
teams_collection = db["teams"]
game_flags_collection = db["game_flags"]
analytics_collection = db["analytics"]

def init_db():
    """Initialize database indexes for NEXUS game."""
    
    # Teams collection indexes
    teams_collection.create_index("team_name", unique=True)
    teams_collection.create_index("score")  # For leaderboard
    
    # Game flags collection indexes
    game_flags_collection.create_index("avenger", unique=True)
    game_flags_collection.create_index("flag_hash", unique=True)
    
    # Analytics collection indexes
    analytics_collection.create_index("team_name")
    analytics_collection.create_index("timestamp")
    analytics_collection.create_index([("team_name", 1), ("activity_type", 1)])
    
    print("✅ NEXUS database indexes initialized.")

def seed_game_flags():
    """Seed game with Flags AND Questions (Part of 2-Stage Flow)."""
    import hashlib
    
    default_flags = {
        "ironman": {
            "flag": "FLAG{ARC_REACTOR_CORE}", 
            "stone": "power",
            "question": "What element did Tony Stark synthesize to replace Palladium?",
            "answer": "vibranium"
        },
        "thor": {
            "flag": "FLAG{BIFROST_GUARDIAN}", 
            "stone": "space",
            "question": "What is the name of Thor's hammer?",
            "answer": "mjolnir"
        },
        "hulk": {
            "flag": "FLAG{GAMMA_RADIATION}", 
            "stone": "mind",
            "question": "Who created Ultron?",
            "answer": "tony stark"
        },
        "captainamerica": {
            "flag": "FLAG{SUPER_SOLDIER}", 
            "stone": "time",
            "question": "What is Captain Americ's shield made of?",
            "answer": "vibranium"
        },
        "blackwidow": {
            "flag": "FLAG{RED_ROOM_PROTOCOL}", 
            "stone": "soul",
            "question": "What is Black Widow's real name?",
            "answer": "natasha romanoff"
        },
        "hawkeye": {
            "flag": "FLAG{NEVER_MISS}", 
            "stone": "reality",
            "question": "What happened to Hawkeye's family?",
            "answer": "snapped"
        }
    }
    
    for avenger, data in default_flags.items():
        flag_hash = hashlib.sha256(data['flag'].encode('utf-8')).hexdigest()
        answer_hash = hashlib.sha256(data['answer'].lower().encode('utf-8')).hexdigest()
        
        game_flags_collection.update_one(
            {"avenger": avenger},
            {
                "$set": {
                    "avenger": avenger,
                    "flag_hash": flag_hash,
                    "stone": data['stone'],
                    "question": data['question'],
                    "answer_hash": answer_hash,
                    "points_flag": Config.POINTS_FLAG,
                    "points_stone": Config.POINTS_ANSWER,
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
    
    print(f"✅ Seeded {len(default_flags)} Avenger Flags & Questions.")
