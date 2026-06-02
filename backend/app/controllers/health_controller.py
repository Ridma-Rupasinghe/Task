from __future__ import annotations


class HealthController:
    @staticmethod
    def check() -> dict:
        return {"ok": True}
