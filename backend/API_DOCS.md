# NEXUS Backend - API Documentation

## 🎮 Game Flow

1. User opens frontend → Backend creates session (cookie)
2. User selects Avenger → `POST /api/avenger/start`
3. User solves puzzles → `POST /api/avenger/sequence` (if applicable)
4. User submits flag → `POST /api/submit-flag`
5. Backend awards stone → Updates session
6. Repeat for all 6 Avengers
7. User accesses final page → `GET /api/nexus/status` (checks unlock)
8. User completes game → `POST /api/nexus/complete`

---

## 📡 API Endpoints

### Session Management (Automatic)
All endpoints use `@session_required` decorator which:
- Creates session on first request
- Sets HTTP-only cookie
- Validates and updates session on each request

### Avenger Pathflow

#### `POST /api/avenger/start`
Start an Avenger path.

**Request:**
```json
{
  "avenger": "thor"
}
```

**Response (200):**
```json
{
  "message": "THOR path activated",
  "avenger": "thor",
  "nextStep": "/asgard"
}
```

**Errors:**
- `400`: Invalid avenger
- `409`: Avenger already completed or another path active

---

#### `POST /api/avenger/sequence`
Validate puzzle sequences (e.g., Thor runes).

**Request:**
```json
{
  "avenger": "thor",
  "sequence": [4, 1, 8, 3]
}
```

**Response (200) - Success:**
```json
{
  "success": true,
  "message": "Bifrost unlocked!",
  "nextStep": "/bifrost"
}
```

**Response (200) - Failure:**
```json
{
  "success": false,
  "message": "Wrong rune sequence. Try again.",
  "redirect": "/struck"
}
```

---

#### `GET /api/avenger/status`
Get current game status.

**Response (200):**
```json
{
  "activePath": "thor",
  "completedAvengers": ["ironman"],
  "stones": ["power"],
  "attempts": {"hulk": 2},
  "totalStones": 1,
  "progress": "1/6"
}
```

---

### Flag Submission

#### `POST /api/submit-flag`
Submit flag for active Avenger.

**Request:**
```json
{
  "avenger": "ironman",
  "flag": "FLAG{ARC_REACTOR_CORE}"
}
```

**Response (200) - Correct:**
```json
{
  "success": true,
  "message": "POWER STONE ACQUIRED!",
  "stone": "power",
  "avenger": "ironman",
  "totalStones": 1
}
```

**Response (200) - Wrong:**
```json
{
  "success": false,
  "message": "Incorrect flag",
  "attempts": 1,
  "maxAttempts": 5,
  "remainingAttempts": 4
}
```

**Response (429) - Cooldown:**
```json
{
  "error": "Too many attempts. Cooldown active for 5 minutes.",
  "cooldownRemaining": 300
}
```

**Errors:**
- `400`: Missing avenger or flag
- `403`: Path not active
- `409`: Avenger already completed

---

#### `GET /api/stones`
Get collected stones.

**Response (200):**
```json
{
  "stones": ["power", "space"],
  "count": 2,
  "details": [
    {
      "avenger": "ironman",
      "stone": "power",
      "completedAt": "2026-02-06T12:00:00"
    }
  ]
}
```

---

### Final Nexus

#### `GET /api/nexus/status`
Check if final Nexus unlocked.

**Response (200) - Unlocked:**
```json
{
  "unlocked": true,
  "stones": ["power", "space", "mind", "time", "soul", "reality"],
  "stoneCount": 6,
  "completedAvengers": ["ironman", "thor", "hulk", "captainamerica", "blackwidow", "hawkeye"],
  "message": "All Infinity Stones collected. The Nexus awaits.",
  "status": "WORTHY"
}
```

**Response (200) - Locked:**
```json
{
  "unlocked": false,
  "stones": ["power"],
  "stoneCount": 1,
  "completedAvengers": ["ironman"],
  "message": "Collect all 6 Infinity Stones. Current: 1/6",
  "status": "IN_PROGRESS"
}
```

---

#### `POST /api/nexus/complete`
Record final completion.

**Response (200):**
```json
{
  "success": true,
  "message": "NEXUS COMPLETE - YOU ARE WORTHY",
  "completedAt": "2026-02-06T12:30:00",
  "totalTime": "45 minutes",
  "status": "WORTHY"
}
```

**Errors:**
- `403`: Not all 6 stones collected

---

#### `GET /api/nexus/analytics`
Get session analytics.

**Response (200):**
```json
{
  "sessionId": "abc-123",
  "events": [
    {
      "event": "path_started",
      "timestamp": "2026-02-06T12:00:00",
      "data": {"avenger": "ironman"}
    }
  ],
  "totalEvents": 15
}
```

---

#### `GET /api/nexus/leaderboard`
Get top completed sessions.

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "sessionId": "abc-123...",
      "completedAt": "2026-02-06T12:30:00",
      "totalTime": 2700,
      "stones": 6
    }
  ],
  "total": 10
}
```

---

## 🔐 Anti-Cheat Features

1. **Rate Limiting**: 10 flag submissions per minute
2. **Attempt Tracking**: Max 5 wrong attempts per Avenger
3. **Cooldown**: 5-minute cooldown after max attempts
4. **Session Binding**: Soft fingerprint validation
5. **Sequence Validation**: Prevents API replay attacks
6. **Atomic Operations**: Stone awarding uses MongoDB atomic updates

---

## 📊 Analytics Logged

- `path_started`: When Avenger path activated
- `sequence_completed`: When puzzle sequence solved
- `sequence_failed`: When puzzle sequence failed
- `flag_correct`: When correct flag submitted
- `flag_wrong`: When wrong flag submitted
- `nexus_completed`: When final Nexus completed

---

## 🚀 Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python seed_nexus.py

# Start server
python app.py
```

Server runs on `http://localhost:5000`

---

## 🎯 Default Test Flags

**⚠️ CHANGE THESE IN PRODUCTION!**

- Iron Man: `FLAG{ARC_REACTOR_CORE}`
- Thor: `FLAG{BIFROST_GUARDIAN}`
- Hulk: `FLAG{GAMMA_RADIATION}`
- Captain America: `FLAG{SUPER_SOLDIER}`
- Black Widow: `FLAG{RED_ROOM_PROTOCOL}`
- Hawkeye: `FLAG{NEVER_MISS}`

---

## 📝 Environment Variables

Create `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=nexus_game
SECRET_KEY=your-secret-key-here
```
