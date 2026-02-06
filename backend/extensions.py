from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from config import Config

# Initialize Extensions
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=Config.RATELIMIT_STORAGE_URI,
    default_limits=[Config.RATELIMIT_DEFAULT]
)
