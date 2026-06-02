from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List


@dataclass(frozen=True)
class AgendaSession:
    session_id: str
    time: str
    title: str
    speaker: str
    focus_keywords: str
    description: str

    def as_search_text(self) -> str:
        return "\n".join(
            [
                f"{self.session_id}",
                f"Time: {self.time}",
                f"Title: {self.title}",
                f"Speaker: {self.speaker}",
                f"Focus Keywords: {self.focus_keywords}",
                f"Description: {self.description}",
            ]
        )


_SESSION_HEADER_RE = re.compile(r"^\[(SESSION_\d+)\]\s*$", re.IGNORECASE)
_FIELD_RE = re.compile(r"^(Time|Title|Speaker|Focus Keywords|Description):\s*(.*)\s*$")


def _iter_blocks(lines: Iterable[str]) -> Iterable[list[str]]:
    block: list[str] = []
    for raw in lines:
        line = raw.rstrip("\n")
        if line.strip() == "":
            if block:
                yield block
                block = []
            continue
        block.append(line)
    if block:
        yield block


def parse_agenda(path: str | Path) -> List[AgendaSession]:
    p = Path(path)
    text = p.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()

    sessions: list[AgendaSession] = []
    current_id: str | None = None
    fields: dict[str, str] = {}

    def flush() -> None:
        nonlocal current_id, fields
        if not current_id:
            return
        sessions.append(
            AgendaSession(
                session_id=current_id,
                time=fields.get("Time", "").strip(),
                title=fields.get("Title", "").strip(),
                speaker=fields.get("Speaker", "").strip(),
                focus_keywords=fields.get("Focus Keywords", "").strip(),
                description=fields.get("Description", "").strip(),
            )
        )
        current_id = None
        fields = {}

    for block in _iter_blocks(lines):
        header_match = _SESSION_HEADER_RE.match(block[0])
        if not header_match:
            continue

        flush()
        current_id = header_match.group(1).upper()

        for line in block[1:]:
            m = _FIELD_RE.match(line)
            if not m:
                continue
            key, value = m.group(1), m.group(2)
            fields[key] = value

    flush()

    sessions = [
        s
        for s in sessions
        if s.session_id and s.title and s.description and s.time and s.speaker
    ]
    if not sessions:
        raise ValueError(f"No sessions parsed from agenda at {p}")
    return sessions
