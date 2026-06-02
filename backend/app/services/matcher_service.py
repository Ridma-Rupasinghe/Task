from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

import numpy as np
from sentence_transformers import SentenceTransformer

from app.config import EMBEDDING_MODEL, SESSION_MATCH_THRESHOLD
from app.core.agenda_parser import AgendaSession
from app.services.session_service import SessionService


@dataclass(frozen=True)
class MatchResult:
    session: AgendaSession
    score: float


class AgendaMatcher:
    def __init__(self, sessions: List[AgendaSession], model_name: str = EMBEDDING_MODEL):
        self.sessions = sessions
        self.model = SentenceTransformer(model_name)
        self._session_texts = [s.as_search_text() for s in sessions]
        self._session_emb = self._normalize(self.model.encode(self._session_texts))

    @staticmethod
    def _normalize(x: np.ndarray) -> np.ndarray:
        x = np.asarray(x, dtype=np.float32)
        norms = np.linalg.norm(x, axis=1, keepdims=True) + 1e-12
        return x / norms

    def match(self, user_focus: str) -> MatchResult:
        q = self._normalize(self.model.encode([user_focus]))[0]
        scores = (self._session_emb @ q).astype(np.float32)
        best_idx = int(np.argmax(scores))
        return MatchResult(session=self.sessions[best_idx], score=float(scores[best_idx]))

    def search_by_description(
        self, query: str, threshold: float = SESSION_MATCH_THRESHOLD
    ) -> List[MatchResult]:
        descriptions = [s.description for s in self.sessions]
        desc_emb = self._normalize(self.model.encode(descriptions))
        q = self._normalize(self.model.encode([query]))[0]
        scores = (desc_emb @ q).astype(np.float32)
        results: list[MatchResult] = []
        for idx, score in enumerate(scores):
            if float(score) >= threshold:
                results.append(
                    MatchResult(session=self.sessions[idx], score=float(score))
                )
        results.sort(key=lambda r: r.score, reverse=True)
        return results


class MatcherService:
    _instance: Optional[AgendaMatcher] = None

    def __init__(self, session_service: SessionService | None = None) -> None:
        self._session_service = session_service or SessionService()

    def initialize(self) -> None:
        sessions = self._session_service.load_sessions_or_parse()
        MatcherService._instance = AgendaMatcher(sessions=sessions)

    @classmethod
    def get_matcher(cls) -> AgendaMatcher:
        if cls._instance is None:
            MatcherService().initialize()
        assert cls._instance is not None
        return cls._instance

    def match_focus(self, focus: str) -> MatchResult:
        return self.get_matcher().match(focus)

    def search_sessions(self, query: str, threshold: float | None = None) -> List[MatchResult]:
        thresh = threshold if threshold is not None else SESSION_MATCH_THRESHOLD
        return self.get_matcher().search_by_description(query, threshold=thresh)
