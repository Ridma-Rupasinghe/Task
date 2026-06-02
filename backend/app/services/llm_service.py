from __future__ import annotations

import os
from dataclasses import dataclass

from openai import OpenAI

from app.core.agenda_parser import AgendaSession


@dataclass(frozen=True)
class LlmConfig:
    model: str = "llama-3.1-8b-instant"


class LlmService:
    def __init__(self, config: LlmConfig | None = None) -> None:
        self.config = config or LlmConfig()

    @staticmethod
    def _grounded_prompt(
        *,
        name: str,
        recipient_email: str,
        focus_text: str,
        session: AgendaSession,
    ) -> str:
        session_block = "\n".join(
            [
                f"Session ID: {session.session_id}",
                f"Time: {session.time}",
                f"Title: {session.title}",
                f"Speaker: {session.speaker}",
                f"Focus Keywords: {session.focus_keywords}",
                f"Description: {session.description}",
            ]
        )

        return f"""You are drafting a professional B2B invitation email for an executive event.

CRITICAL RULES (MUST FOLLOW):
- Use ONLY the facts provided in the SESSION FACTS block below.
- DO NOT invent, guess, or hallucinate any topics, speakers, company names, session timings, venue details, pricing, or agenda items.
- If any detail is missing from SESSION FACTS, omit it (do not fabricate).
- Do not mention sessions other than the one in SESSION FACTS.
- The email must be concise, polished, and business-appropriate.
- Do NOT include placeholders like [Date], [Time], [Venue], or bracketed text.
- Do NOT include a subject line.

RECIPIENT:
- Name: {name}
- Email: {recipient_email}

VISITOR'S PROFESSIONAL FOCUS (for personalization tone only; do not add new facts about agenda):
{focus_text}

SESSION FACTS (the only event facts you may reference):
{session_block}

OUTPUT FORMAT:
- Return only the email body (no subject line).
"""

    @staticmethod
    def _deterministic_fallback_email(
        *,
        name: str,
        focus_text: str,
        session: AgendaSession,
    ) -> str:
        return "\n".join(
            [
                f"Dear {name},",
                "",
                "Thank you for sharing your professional focus.",
                "",
                "Based on what you mentioned, we believe the following session would be especially relevant:",
                "",
                f"{session.title}",
                f"Time: {session.time}",
                f"Speaker: {session.speaker}",
                f"Session ID: {session.session_id}",
                "",
                "Session overview:",
                session.description,
                "",
                "If you're attending, we'd be glad to welcome you to this session and the broader discussions throughout the event.",
                "",
                "Kind regards,",
                "Event Team",
            ]
        )

    def generate_invitation_email(
        self,
        *,
        name: str,
        recipient_email: str,
        focus_text: str,
        session: AgendaSession,
    ) -> str:
        groq_key = os.getenv("GROQ_API_KEY", "").strip()
        openai_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not groq_key and not openai_key:
            return self._deterministic_fallback_email(
                name=name, focus_text=focus_text, session=session
            )

        if groq_key:
            client = OpenAI(api_key=groq_key, base_url="https://api.groq.com/openai/v1")
        else:
            client = OpenAI(api_key=openai_key)

        prompt = self._grounded_prompt(
            name=name,
            recipient_email=recipient_email,
            focus_text=focus_text,
            session=session,
        )

        resp = client.chat.completions.create(
            model=self.config.model,
            messages=[
                {"role": "system", "content": "You write accurate, strictly grounded business emails."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )

        content = (resp.choices[0].message.content or "").strip()
        lowered = content.lower()
        if (
            not content
            or "subject:" in lowered
            or "[" in content
            or "]" in content
            or "venue" in lowered
            or "registration" in lowered and session.title.lower() not in lowered
        ):
            return self._deterministic_fallback_email(
                name=name, focus_text=focus_text, session=session
            )

        return content
