from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routes import get_api_router
from app.services.matcher_service import MatcherService


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Do not write data/*.py here — bootstrap via run_server.py to avoid reload loops.
    MatcherService().initialize()
    yield


def create_app() -> FastAPI:
    application = FastAPI(
        title="Accelalpha Oracle Invite Generator",
        version="1.0.0",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(get_api_router())
    return application


app = create_app()
