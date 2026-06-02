from __future__ import annotations

import logging
import sys
from datetime import datetime, timezone


class McpService:
    @staticmethod
    def send_draft_via_mcp(email_address: str, email_body: str) -> None:
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        logger = logging.getLogger("mcp")
        logger.setLevel(logging.INFO)

        if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
            handler = logging.StreamHandler(sys.stdout)
            handler.setLevel(logging.INFO)
            handler.setFormatter(logging.Formatter("%(message)s"))
            logger.addHandler(handler)
            logger.propagate = False

        block = "\n".join(
            [
                f"[{timestamp}]",
                "",
                "Recipient:",
                email_address,
                "",
                "Email Body:",
                email_body,
                "",
            ]
        )

        logger.info(block)
