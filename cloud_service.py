"""Optional Gemini analysis. A failed request leaves local model results usable."""
from __future__ import annotations

import base64
import json
import os
from urllib.request import Request, urlopen


class CloudService:
    def __init__(self) -> None:
        self.key = os.environ.get("GEMINI_API_KEY", "").strip()
        self.model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()

    @property
    def configured(self) -> bool:
        return bool(self.key)

    def generate(self, prompt: str, image: bytes | None = None, mime: str = "image/jpeg") -> str:
        if not self.configured:
            raise RuntimeError("Gemini is not configured")
        parts: list[dict] = [{"text": prompt}]
        if image is not None:
            parts.insert(0, {"inline_data": {"mime_type": mime, "data": base64.b64encode(image).decode("ascii")}})
        payload = json.dumps({"contents": [{"parts": parts}]}).encode("utf-8")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        req = Request(url, data=payload, headers={"x-goog-api-key": self.key, "Content-Type": "application/json"}, method="POST")
        with urlopen(req, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
        text = " ".join(
            part["text"]
            for candidate in data.get("candidates", [])
            for part in candidate.get("content", {}).get("parts", [])
            if part.get("text")
        ).strip()
        if not text:
            raise RuntimeError("Gemini returned no text")
        return text[:4000]
