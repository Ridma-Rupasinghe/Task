from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class GenerateInviteRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    focus: str = Field(min_length=8, max_length=2000)


class MatchedSession(BaseModel):
    session_id: str
    time: str
    title: str
    speaker: str
    focus_keywords: str
    description: str
    score: float


class GenerateInviteResponse(BaseModel):
    matched_session: MatchedSession
    generated_email: str


class SessionOut(BaseModel):
    session_id: str
    time: str
    title: str
    speaker: str
    focus_keywords: str
    description: str
