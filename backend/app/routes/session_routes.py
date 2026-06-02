from __future__ import annotations

from typing import List

from fastapi import APIRouter, Query

from app.controllers.session_controller import SessionController
from app.schemas.models import SessionOut

router = APIRouter(tags=["sessions"])
_controller = SessionController()


@router.get("/get-all-sessions", response_model=List[SessionOut])
def get_all_sessions() -> List[SessionOut]:
    return _controller.get_all_sessions()


@router.get("/get-all-keywords", response_model=List[str])
def get_all_keywords() -> List[str]:
    return _controller.get_all_keywords()


@router.get("/sessions", response_model=List[SessionOut])
def search_sessions(
    query: str = Query(
        ...,
        min_length=1,
        description="Keyword to match against session descriptions",
    ),
) -> List[SessionOut]:
    return _controller.search_sessions(query)
