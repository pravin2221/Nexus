# Marvel Infinity Stones CTF — Backend

This folder contains a Flask backend skeleton for a CTF-style Infinity Stones web hunt using MongoDB Atlas.

Quick start:
1. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `FLASK_SECRET_KEY`.
2. Create a virtualenv and install dependencies:
   python -m venv .env && source .env/bin/activate
   pip install -r requirements.txt
3. Run the app:
   export FLASK_APP=app.py
   flask run

Notes:
- The `users`, `progress`, and `artifacts` collections are expected in the configured database.
- Templates are minimal placeholders. Customize to add your challenge UI and media in `static/`.
