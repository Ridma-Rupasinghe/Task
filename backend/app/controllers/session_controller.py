from __future__ import annotations

from typing import List

from app.core.agenda_parser import AgendaSession
from app.schemas.models import SessionOut
from app.services.matcher_service import MatcherService
from app.services.session_service import SessionService


class SessionController:
    def __init__(
        self,
        session_service: SessionService | None = None,
        matcher_service: MatcherService | None = None,
    ) -> None:
        self._sessions = session_service or SessionService()
        self._matcher = matcher_service or MatcherService()

    @staticmethod
    def _to_session_out(session: AgendaSession) -> SessionOut:
        return SessionOut(
            session_id=session.session_id,
            time=session.time,
            title=session.title,
            speaker=session.speaker,
            focus_keywords=session.focus_keywords,
            description=session.description,
        )

    def get_all_sessions(self) -> List[SessionOut]:
        sessions = self._sessions.get_all_sessions()
        return [self._to_session_out(s) for s in sessions]

    def get_all_keywords(self) -> List[str]:
        return self._sessions.get_all_keywords()

    def search_sessions(self, query: str) -> List[SessionOut]:
        results = self._matcher.search_sessions(query.strip())
        return [self._to_session_out(r.session) for r in results]
