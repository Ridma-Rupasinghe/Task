from __future__ import annotations

from fastapi import APIRouter

from app.controllers.health_controller import HealthController

router = APIRouter(tags=["health"])
_controller = HealthController()


@router.get("/health")
def health() -> dict:
    return _controller.check()
