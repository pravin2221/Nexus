# backend/app.py
"""Flask backend skeleton for Marvel Infinity Stones CTF (MongoDB Atlas)

- Uses pymongo to connect to MongoDB Atlas (set MONGODB_URI)
- Implements auth routes, stone routes, leaderboard, and artifacts metadata
- Session keys: session["user_id"], session["current_stone"], session["chosen_path"]

Note: This is a skeleton only. No challenge data included.
"""
import os
from datetime import datetime
from functools import wraps

from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId

# --- App config ---
app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key")  # override in production

# MongoDB Atlas connection (set MONGODB_URI in environment or .env)
MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("Set MONGODB_URI environment variable to your MongoDB Atlas connection string.")

MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "infinity_ctf")
client = MongoClient(MONGODB_URI)
db = client[MONGO_DBNAME]

# Collections
users_col = db["users"]
progress_col = db["progress"]
artifacts_col = db["artifacts"]

# --- Placeholder flags (no real challenges included) ---
PLACEHOLDER_FLAGS = {
    "space": "FLAG_SPACE_PLACEHOLDER",
    "mind": "FLAG_MIND_PLACEHOLDER",
    "reality": "FLAG_REALITY_PLACEHOLDER",
    "time": "FLAG_TIME_PLACEHOLDER",
    "power": "FLAG_POWER_PLACEHOLDER",
    "soul": "FLAG_SOUL_PLACEHOLDER",
}

# Example path orders (customize as desired)
PATH_ORDERS = {
    "standard": ["space", "mind", "reality", "time", "power", "soul"],
    "chaos": ["mind", "space", "time", "reality", "soul", "power"],
}

# --- Helpers ---
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


def get_user(user_id):
    return users_col.find_one({"_id": ObjectId(user_id)})


def record_progress(user_id, stone):
    """Record progress in both users and progress collections (idempotent)."""
    now = datetime.utcnow()
    # Add to progress collection if not already recorded
    exists = progress_col.find_one({"user_id": ObjectId(user_id), "stone": stone})
    if not exists:
        progress_col.insert_one({"user_id": ObjectId(user_id), "stone": stone, "time_reached": now})
    # Update users collection: add stone to list and add timestamps map
    users_col.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$addToSet": {"stones_completed": stone},
            "$set": {f"timestamps.{stone}": now},
        }
    )


def next_stone_for_user(user_doc):
    path = user_doc.get("chosen_path", "standard")
    order = PATH_ORDERS.get(path, PATH_ORDERS["standard"])
    completed = set(user_doc.get("stones_completed", []))
    for stone in order:
        if stone not in completed:
            return stone
    return None

# --- Auth routes ---
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        chosen_path = request.form.get("chosen_path", "standard")
        if not username or not password:
            return "Missing username or password", 400

        if users_col.find_one({"username": username}):
            return "Username already exists", 400

        user = {
            "username": username,
            "password_hash": generate_password_hash(password),
            "chosen_path": chosen_path,
            "stones_completed": [],
            "timestamps": {},
            "registered_at": datetime.utcnow(),
        }
        res = users_col.insert_one(user)
        session["user_id"] = str(res.inserted_id)
        session["chosen_path"] = chosen_path
        session["current_stone"] = next_stone_for_user(user) or "done"
        # Redirect to the first stone (or a dashboard page if you prefer)
        return redirect(url_for("space"))
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        user = users_col.find_one({"username": username})
        if not user or not check_password_hash(user["password_hash"], password):
            return "Invalid credentials", 401
        session["user_id"] = str(user["_id"])
        session["chosen_path"] = user.get("chosen_path", "standard")
        session["current_stone"] = next_stone_for_user(user) or "done"
        return redirect(url_for("space"))
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# --- Generic stone handler ---

def handle_stone(stone_name):
    """Render stone page, accept flag POST, validate placeholder, update DB, redirect to next stone."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    user = get_user(user_id)
    if not user:
        session.clear()
        return redirect(url_for("login"))

    if request.method == "GET":
        return render_template("stone.html", stone=stone_name, user=user)

    flag = request.form.get("flag", "").strip()
    expected_flag = PLACEHOLDER_FLAGS.get(stone_name)
    if not flag:
        return "No flag provided", 400

    if flag != expected_flag:
        return render_template("stone.html", stone=stone_name, user=user, error="Incorrect flag.")

    # Correct flag — record progress
    record_progress(user_id, stone_name)

    user = get_user(user_id)
    next_stone = next_stone_for_user(user)
    session["current_stone"] = next_stone or "done"

    if next_stone:
        return redirect(url_for(next_stone))
    else:
        return redirect(url_for("leaderboard"))

# --- Stone routes ---
@app.route("/space", methods=["GET", "POST"])
@login_required
def space():
    return handle_stone("space")

@app.route("/mind", methods=["GET", "POST"])
@login_required
def mind():
    return handle_stone("mind")

@app.route("/reality", methods=["GET", "POST"])
@login_required
def reality():
    return handle_stone("reality")

@app.route("/time", methods=["GET", "POST"])
@login_required
def time():
    return handle_stone("time")

@app.route("/power", methods=["GET", "POST"])
@login_required
def power():
    return handle_stone("power")

@app.route("/soul", methods=["GET", "POST"])
@login_required
def soul():
    return handle_stone("soul")

# --- Leaderboard ---
@app.route("/leaderboard")
@login_required
def leaderboard():
    """Compute leaderboard dynamically from users collection."""
    users = list(users_col.find({}))

    def sort_key(u):
        completed = u.get("stones_completed", [])
        timestamps = u.get("timestamps", {})
        first_complete = min(timestamps.values()) if timestamps else datetime.max
        return (-len(completed), first_complete)

    users.sort(key=sort_key)

    board = [
        {
            "username": u["username"],
            "completed": len(u.get("stones_completed", [])),
            "timestamps": u.get("timestamps", {}),
        }
        for u in users
    ]
    return render_template("leaderboard.html", leaderboard=board)

# --- Artifacts metadata route ---
@app.route("/artifacts")
@login_required
def artifacts():
    items = list(artifacts_col.find({}))
    return render_template("artifacts.html", artifacts=items)

# --- Run ---
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
