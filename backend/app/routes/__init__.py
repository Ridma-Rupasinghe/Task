from fastapi import APIRouter

from .health_routes import router as health_router
from .invite_routes import router as invite_router
from .session_routes import router as session_router


def get_api_router() -> APIRouter:
    router = APIRouter()
    router.include_router(health_router)
    router.include_router(session_router)
    router.include_router(invite_router)
    return router
