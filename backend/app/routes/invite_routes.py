from __future__ import annotations

from fastapi import APIRouter

from app.controllers.invite_controller import InviteController
from app.schemas.models import GenerateInviteRequest, GenerateInviteResponse

router = APIRouter(tags=["invites"])
_controller = InviteController()


@router.post("/generate-invite", response_model=GenerateInviteResponse)
def generate_invite(payload: GenerateInviteRequest) -> GenerateInviteResponse:
    return _controller.generate_invite(payload)
