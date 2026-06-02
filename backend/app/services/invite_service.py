from __future__ import annotations

from app.schemas.models import GenerateInviteRequest, GenerateInviteResponse, MatchedSession
from app.services.llm_service import LlmService
from app.services.matcher_service import MatcherService
from app.services.mcp_service import McpService


class InviteService:
    def __init__(
        self,
        matcher_service: MatcherService | None = None,
        llm_service: LlmService | None = None,
        mcp_service: McpService | None = None,
    ) -> None:
        self._matcher = matcher_service or MatcherService()
        self._llm = llm_service or LlmService()
        self._mcp = mcp_service or McpService()

    def generate_invite(self, payload: GenerateInviteRequest) -> GenerateInviteResponse:
        match = self._matcher.match_focus(payload.focus)

        email_body = self._llm.generate_invitation_email(
            name=payload.name,
            recipient_email=str(payload.email),
            focus_text=payload.focus,
            session=match.session,
        )

        self._mcp.send_draft_via_mcp(str(payload.email), email_body)

        return GenerateInviteResponse(
            matched_session=MatchedSession(
                session_id=match.session.session_id,
                time=match.session.time,
                title=match.session.title,
                speaker=match.session.speaker,
                focus_keywords=match.session.focus_keywords,
                description=match.session.description,
                score=match.score,
            ),
            generated_email=email_body,
        )
