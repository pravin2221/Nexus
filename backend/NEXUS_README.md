# NEXUS Backend - Avengers Infinity Stone Quest

## 🎮 Overview

The **NEXUS Backend** is a secure, server-controlled game system for the Avengers Infinity Stone Quest. It implements strict pathflow enforcement, anonymous session management, anti-cheat mechanisms, and comprehensive analytics.

## ✨ Features

### 🔐 Session Management (Job 1)
- Anonymous session creation with UUID
- HTTP-only cookies (secure, no JavaScript access)
- Browser fingerprinting for soft validation
- Auto-expiry after 2 hours of inactivity
- Session restoration on page refresh

### 🎯 Pathflow Enforcement (Job 2)
- Strict Avenger path activation
- Puzzle sequence validation (e.g., Thor runes: 4→1→8→3)
- Prevents URL jumping and skipping
- Server-controlled navigation flow

### 💎 Flag & Stone Validation (Job 3)
- SHA-256 flag hashing (never stored in plaintext)
- Atomic stone awarding (MongoDB `$addToSet`)
- Duplicate submission prevention
- One stone per Avenger (6 total)

### 🛡️ Anti-Cheat & Analytics (Job 4)
- Rate limiting: 10 submissions per minute
- Max 5 wrong attempts per Avenger
- 5-minute cooldown after max attempts
- Comprehensive event logging
- Time-based anomaly detection

### 🏆 Final Nexus Control (Job 5)
- 6-stone verification for unlock
- Completion timestamp tracking
- Analytics retrieval
- Optional leaderboard

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
python seed_nexus.py
```

### 3. Start Server

```bash
python app.py
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/avenger/start` | POST | Start Avenger path |
| `/api/avenger/sequence` | POST | Validate puzzle sequence |
| `/api/avenger/status` | GET | Get game status |
| `/api/submit-flag` | POST | Submit flag for Avenger |
| `/api/stones` | GET | Get collected stones |
| `/api/nexus/status` | GET | Check if Nexus unlocked |
| `/api/nexus/complete` | POST | Record completion |
| `/api/nexus/analytics` | GET | Get session analytics |

**Full API Documentation**: See [`API_DOCS.md`](./API_DOCS.md)

---

## 🎯 Default Test Flags

**⚠️ FOR TESTING ONLY - CHANGE IN PRODUCTION!**

```
Iron Man:        FLAG{ARC_REACTOR_CORE}
Thor:            FLAG{BIFROST_GUARDIAN}
Hulk:            FLAG{GAMMA_RADIATION}
Captain America: FLAG{SUPER_SOLDIER}
Black Widow:     FLAG{RED_ROOM_PROTOCOL}
Hawkeye:         FLAG{NEVER_MISS}
```

---

## 🗂️ Project Structure

```
backend/
├── app.py                  # Main application
├── config.py              # Configuration
├── requirements.txt       # Dependencies
├── seed_nexus.py         # Database initialization
├── API_DOCS.md           # API documentation
├── models/
│   ├── database.py       # MongoDB collections
│   └── __init__.py
├── middleware/
│   ├── session.py        # Session management
│   └── __init__.py
└── routes/
    ├── avenger.py        # Pathflow control
    ├── game.py           # Flag submission
    ├── nexus.py          # Final unlock
    └── __init__.py
```

---

## 🔧 Configuration

Edit `config.py` or create `.env`:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=nexus_game
SECRET_KEY=your-secret-key-here
```

**Game Settings**:
- Session expiry: 2 hours
- Max attempts: 5 per Avenger
- Cooldown: 5 minutes
- Rate limit: 10 submissions/minute

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Start Path
```bash
curl -X POST http://localhost:5000/api/avenger/start \
  -H "Content-Type: application/json" \
  -d '{"avenger": "ironman"}' \
  -c cookies.txt
```

### Submit Flag
```bash
curl -X POST http://localhost:5000/api/submit-flag \
  -H "Content-Type: application/json" \
  -d '{"avenger": "ironman", "flag": "FLAG{ARC_REACTOR_CORE}"}' \
  -b cookies.txt
```

---

## 🔗 Frontend Integration

**CRITICAL**: Always include `credentials: 'include'` in fetch requests:

```javascript
const response = await fetch('http://localhost:5000/api/avenger/start', {
  method: 'POST',
  credentials: 'include',  // Required for cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ avenger: 'ironman' })
});
```

---

## 📊 Database Collections

- **sessions**: Player game state
- **game_flags**: Hashed Avenger flags
- **analytics**: Event logs

---

## 🚨 Production Checklist

- [ ] Change default flags in `models/database.py`
- [ ] Set `SESSION_COOKIE_SECURE = True`
- [ ] Update `SECRET_KEY` in `.env`
- [ ] Configure MongoDB authentication
- [ ] Set up HTTPS
- [ ] Test all 6 Avenger paths
- [ ] Verify anti-cheat mechanisms

---

## 📝 License

Built for NEXUS - Avengers Infinity Stone Quest

---

## 🎯 Summary

**"The NEXUS backend securely manages anonymous player sessions, enforces strict puzzle pathflows, validates all flags and sequences server-side, awards Infinity Stones atomically, prevents cheating through rate-limiting and state validation, tracks detailed analytics, and unlocks the final Nexus only when all six Avengers are legitimately completed."**
