from __future__ import annotations

from app.schemas.models import GenerateInviteRequest, GenerateInviteResponse
from app.services.invite_service import InviteService


class InviteController:
    def __init__(self, invite_service: InviteService | None = None) -> None:
        self._invite = invite_service or InviteService()

    def generate_invite(self, payload: GenerateInviteRequest) -> GenerateInviteResponse:
        return self._invite.generate_invite(payload)
