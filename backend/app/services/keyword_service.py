from __future__ import annotations

import re
from typing import List

_STOPWORDS = {
    "a", "an", "the", "and", "or", "to", "of", "in", "on", "for", "with", "by", "at",
    "from", "as", "is", "are", "was", "were", "be", "been", "being", "this", "that",
    "these", "those", "it", "its", "their", "they", "we", "you", "your", "our", "how",
    "what", "when", "where", "who", "which", "will", "can", "may", "into", "over",
    "through", "during", "before", "after", "about", "up", "out", "all", "any", "both",
    "each", "more", "most", "other", "some", "such", "than", "too", "very", "not", "no",
    "nor", "only", "own", "same", "so", "just", "also",
}

_MODEL = None


class KeywordService:
    @staticmethod
    def _fallback_keywords(description: str) -> List[str]:
        words = re.findall(r"[A-Za-z][A-Za-z0-9-]{2,}", description.lower())
        scored: dict[str, int] = {}
        for w in words:
            if w in _STOPWORDS:
                continue
            scored[w] = scored.get(w, 0) + 1

        ranked = sorted(scored.items(), key=lambda x: (-x[1], -len(x[0])))
        picks = [w for w, _ in ranked[:2]]
        if len(picks) < 2:
            for w, _ in ranked:
                if w not in picks:
                    picks.append(w)
                if len(picks) == 2:
                    break
        while len(picks) < 2:
            picks.append("supply chain")
        return picks[:2]

    @classmethod
    def _get_model(cls):
        global _MODEL
        if _MODEL is None:
            from sentence_transformers import SentenceTransformer

            _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
        return _MODEL

    @classmethod
    def generate_for_description(cls, description: str) -> List[str]:
        try:
            import numpy as np

            model = cls._get_model()
            text = description.strip()
            tokens = re.findall(r"[A-Za-z][A-Za-z0-9-]{2,}", text)
            candidates: list[str] = []
            for t in tokens:
                tl = t.lower()
                if tl not in _STOPWORDS and tl not in candidates:
                    candidates.append(tl)
            for i in range(len(tokens) - 1):
                a, b = tokens[i].lower(), tokens[i + 1].lower()
                if a in _STOPWORDS or b in _STOPWORDS:
                    continue
                phrase = f"{a} {b}"
                if phrase not in candidates:
                    candidates.append(phrase)

            if len(candidates) < 2:
                return cls._fallback_keywords(description)

            desc_emb = model.encode([text])[0]
            cand_emb = model.encode(candidates)
            desc_emb = desc_emb / (np.linalg.norm(desc_emb) + 1e-12)
            cand_emb = cand_emb / (np.linalg.norm(cand_emb, axis=1, keepdims=True) + 1e-12)
            scores = cand_emb @ desc_emb
            top_idx = np.argsort(-scores)[:2]
            return [candidates[int(i)] for i in top_idx]
        except Exception:
            return cls._fallback_keywords(description)
