from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

APP_ROOT = Path(__file__).resolve().parent
BACKEND_ROOT = APP_ROOT.parent
AGENDA_PATH = (BACKEND_ROOT / "agenda.txt").resolve()
DATA_DIR = BACKEND_ROOT / "data"
SESSIONS_PY = DATA_DIR / "sessions.py"
KEYWORDS_PY = DATA_DIR / "keywords.py"

SESSION_MATCH_THRESHOLD = float(os.getenv("SESSION_MATCH_THRESHOLD", "0.35"))
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

frontend_url = os.getenv("FRONT_END_URL", "").strip()

if frontend_url:
    CORS_ORIGINS = [frontend_url]
else:
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

CORS_ORIGINS = ["*"]
