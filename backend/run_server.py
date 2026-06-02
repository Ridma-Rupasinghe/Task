"""
Recommended dev entrypoint.

Bootstraps backend/data/sessions.py and keywords.py BEFORE uvicorn starts,
so --reload does not interrupt lifespan with CancelledError.
"""
from __future__ import annotations

from pathlib import Path
import os


import uvicorn

from app.services.session_service import ensure_session_files

BACKEND_ROOT = Path(__file__).resolve().parent
AGENDA_PATH = BACKEND_ROOT / "agenda.txt"
is_production = os.getenv("ENVIRONMENT") == "production"



def main() -> None:
    ensure_session_files(AGENDA_PATH)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0" if is_production else "127.0.0.1",        
        port=8000,
        reload=True,
        reload_dirs=["app"],
        reload_excludes=["data", "data/*"],
    )


if __name__ == "__main__":
    main()
