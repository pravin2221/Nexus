# 🌌 NEXUS: The Infinity Stone Quest

> **"Dread it. Run from it. Destiny arrives all the same."**

![NEXUS Banner](https://i.imgur.com/example_banner.png)

## 🚀 Mission Overview

**NEXUS** is an advanced, high-security CTF-style game engine designed for the ultimate Avengers-themed treasure hunt. Unlike traditional CTFs, NEXUS enforces a strict **2-Stage Game Mechanic** and **Military-Grade Authentication**.

Your mission: Authenticate with your team, traverse the MCU timeline, solve ancient riddles, and collect all **6 Infinity Stones** before the universe (or your session) expires.

---

## 🔐 Security Architecture (Military-Grade)

The system is fortified with multiple layers of defense to prevent unauthorized access and bypassing.

- **🛡️ Strong Authentication**: 
  - Teams must register with unique names and strong passwords (Bcrypt hashing).
  - No anonymous access allowed.

- **⏳ Time-Locked Sessions**: 
  - **Strict 3-Hour Limit**: Sessions are governed by a tamper-proof JWT architecture.
  - **Server-Side Enforcement**: Even if you modify the token, the backend rejects expired sessions instantly.

- **🕵️ Anti-Theft & Hijacking Protection**:
  - **User-Agent Binding**: Tokens are cryptographically bound to your specific browser/device.
  - **IP Fingerprinting**: Anomaly detection blocks suspicious location hops.

- **🚦 Rate Limiting**:
  - **Login Protection**: 10 attempts/minute to prevent brute-forcing.
  - **Game Integrity**: 10 submissions/minute to stop script-kiddies.

---

## 🎮 Game Logic: The 2-Stage Protocol

Mere flag submission is insufficient. You must prove your worthiness.

1.  **🚩 STAGE 1: The Flag**
    - Find the hidden flag in the frontend/assets.
    - **Submit**: `/api/game/submit-flag`
    - **Reward**: Base Points + **The Riddle**.

2.  **💎 STAGE 2: The Stone**
    - Solve the riddle revealed in Stage 1.
    - **Submit**: `/api/game/submit-answer`
    - **Reward**: **Infinity Stone** + Bonus Points.

---

## 🛠️ Tech Stack & Setup

### Requirements
- Python 3.10+
- MongoDB 6.0+

### 🚀 Quick Start

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/nexus/backend.git
    cd backend
    ```

2.  **Install Cyber-Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the Quantum Database**
    ```bash
    # Seeds the database with Avenger flags and cryptographic secrets
    python -c "from models import init_db, seed_game_flags; from app import create_app; app = create_app(); app.app_context().push(); init_db(); seed_game_flags()"
    ```

4.  **Ignite the Engine**
    ```bash
    python app.py
    ```

---

## 📡 API Reference

| Endpoint | Method | Rate Limit | Description |
|----------|--------|------------|-------------|
| `/api/auth/signup` | POST | 5/min | Recruit new team |
| `/api/auth/login` | POST | 10/min | Authenticate & Start Timer |
| `/api/game/submit-flag` | POST | 10/min | submit Flag (Stage 1) |
| `/api/game/submit-answer` | POST | 10/min | Claim Stone (Stage 2) |
| `/api/leaderboard` | GET | Unlimited | View Global Rankings |
| `/api/leaderboard/activity` | GET | Unlimited | View Team Flight Logs |

---

## ⚠️ Integrity Rules

1.  **One Stone Rule**: The universe permits only one of each stone per team.
2.  **Sequential Access**: You cannot answer a Riddle without first finding the Flag.
3.  **No Bypassing**: Direct API calls without valid JWTs are instantly rejected.

> **"I am Inevitable."** - Thanos
