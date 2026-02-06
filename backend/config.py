import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "nexus-secret-key-change-in-production")
    
    # JWT Configuration (Strong Auth)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "nexus-jwt-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)  # STRICT 3-hour session
    JWT_TOKEN_LOCATION = ["headers"]
    
    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "nexus_game")
    
    # Game Mechanics
    POINTS_FLAG = 100
    POINTS_ANSWER = 500  # Bonus for solving Question -> Stone
    
    AVENGERS = ["ironman", "thor", "hulk", "captainamerica", "blackwidow", "hawkeye"]
    
    # Stone Mapping
    STONE_MAPPING = {
        "ironman": "power",
        "thor": "space",
        "hulk": "mind",
        "captainamerica": "time",
        "blackwidow": "soul",
        "hawkeye": "reality"
    }
    
    # Anti-Cheat Configuration
    MAX_ATTEMPTS_FLAG = 5
    MAX_ATTEMPTS_QUESTION = 3
    COOLDOWN_MINUTES = 10
    
    # Rate Limiting
    RATELIMIT_DEFAULT = "100 per hour"
    RATELIMIT_STORAGE_URI = "memory://"
