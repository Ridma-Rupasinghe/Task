from __future__ import annotations

import ast
import json
from pathlib import Path
from typing import List

from app.config import AGENDA_PATH, KEYWORDS_PY, SESSIONS_PY
from app.core.agenda_parser import AgendaSession, parse_agenda
from app.services.keyword_service import KeywordService


class SessionService:
    def __init__(self, agenda_path: Path | None = None) -> None:
        self.agenda_path = agenda_path or AGENDA_PATH

    @staticmethod
    def _session_to_dict(session: AgendaSession) -> dict:
        return {
            "session_id": session.session_id,
            "time": session.time,
            "title": session.title,
            "speaker": session.speaker,
            "focus_keywords": session.focus_keywords,
            "description": session.description,
        }

    def _write_sessions_py(self, sessions: List[AgendaSession]) -> None:
        SESSIONS_PY.parent.mkdir(parents=True, exist_ok=True)
        rows = [self._session_to_dict(s) for s in sessions]
        content = (
            "# Auto-generated from agenda.txt. Do not edit manually.\n\n"
            f"SESSIONS = {json.dumps(rows, indent=2, ensure_ascii=False)}\n"
        )
        SESSIONS_PY.write_text(content, encoding="utf-8")

    def _write_keywords_py(self, keywords: List[str]) -> None:
        KEYWORDS_PY.parent.mkdir(parents=True, exist_ok=True)
        content = (
            "# Auto-generated from agenda.txt. Do not edit manually.\n\n"
            f"KEYWORDS = {json.dumps(keywords, indent=2, ensure_ascii=False)}\n"
        )
        KEYWORDS_PY.write_text(content, encoding="utf-8")

    def _needs_regeneration(self) -> bool:
        if not SESSIONS_PY.exists() or not KEYWORDS_PY.exists():
            return True
        agenda_mtime = self.agenda_path.stat().st_mtime
        return (
            agenda_mtime > SESSIONS_PY.stat().st_mtime
            or agenda_mtime > KEYWORDS_PY.stat().st_mtime
        )

    def initialize_data_files(self, *, force: bool = False) -> None:
        if not force and not self._needs_regeneration():
            return

        sessions = parse_agenda(self.agenda_path)
        self._write_sessions_py(sessions)

        keywords: list[str] = []
        for session in sessions:
            keywords.extend(KeywordService.generate_for_description(session.description))

        self._write_keywords_py(keywords)

    def ensure_data_files(self) -> None:
        self.initialize_data_files(force=False)

    @staticmethod
    def _load_py_list(path: Path, symbol: str) -> list:
        if not path.exists():
            return []
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in tree.body:
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == symbol:
                        return ast.literal_eval(node.value)
        return []

    def load_session_dicts(self) -> List[dict]:
        return self._load_py_list(SESSIONS_PY, "SESSIONS")

    def load_keywords(self) -> List[str]:
        return self._load_py_list(KEYWORDS_PY, "KEYWORDS")

    @staticmethod
    def dicts_to_sessions(rows: List[dict]) -> List[AgendaSession]:
        return [
            AgendaSession(
                session_id=row["session_id"],
                time=row["time"],
                title=row["title"],
                speaker=row["speaker"],
                focus_keywords=row["focus_keywords"],
                description=row["description"],
            )
            for row in rows
        ]

    def load_sessions_or_parse(self) -> List[AgendaSession]:
        rows = self.load_session_dicts()
        if rows:
            return self.dicts_to_sessions(rows)
        return parse_agenda(self.agenda_path)

    def get_all_sessions(self) -> List[AgendaSession]:
        return self.load_sessions_or_parse()

    def get_all_keywords(self) -> List[str]:
        return self.load_keywords()


# Module-level singleton for bootstrap script compatibility
_default_service = SessionService()


def ensure_session_files(agenda_path: Path) -> None:
    SessionService(agenda_path).ensure_data_files()
