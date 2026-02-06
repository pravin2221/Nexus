# NEXUS v2.0 API Documentation

## 🔐 Strong Authentication

### 1. Register Team
- **Endpoint**: `POST /api/auth/signup`
- **Rate Limit**: 5 per minute
- **Body**:
  ```json
  {
    "team_name": "Avengers",
    "password": "strongPassword123"
  }
  ```
- **Response**: `201 Created`

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Rate Limit**: 10 per minute
- **Body**:
  ```json
  {
    "team_name": "Avengers",
    "password": "strongPassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Login Successful",
    "access_token": "eyJhbG...",
    "expires_in": "3 hours"
  }
  ```
- **Security**: Token is bound to your IP and User-Agent. Valid for exactly 3 hours.

---

## 🎮 Game Mechanics (2-Stage Flow)

### Stage 1: The Flag
- **Endpoint**: `POST /api/game/submit-flag`
- **Rate Limit**: 10 per minute
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body**:
  ```json
  {
    "flag": "FLAG{...}"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Flag Accepted!",
    "question": "What is the capital of Asgard?",
    "points_awarded": 100
  }
  ```

### Stage 2: The Stone
- **Endpoint**: `POST /api/game/submit-answer`
- **Rate Limit**: 10 per minute
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body**:
  ```json
  {
    "avenger": "thor",
    "answer": "Answer here"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "SPACE STONE ACQUIRED!",
    "stone": "space",
    "points_awarded": 500
  }
  ```

---

## 🏆 Leaderboard

### Public Rankings
- **Endpoint**: `GET /api/leaderboard`
- **Response**: List of top teams and scores.

### Private Activity Log
- **Endpoint**: `GET /api/leaderboard/activity`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response**: Detailed flight recorder of your team's actions.
