"""Optional Gemini analysis. A failed request leaves local model results usable."""
from __future__ import annotations

import base64
import json
import os
import re
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen


class CloudService:
    def __init__(self) -> None:
        self.key = os.environ.get("GEMINI_API_KEY", "").strip()
        self.model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash").strip()

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
        data = None
        for attempt in range(2):
            try:
                with urlopen(req, timeout=15) as response:
                    data = json.loads(response.read().decode("utf-8"))
                break
            except HTTPError as error:
                if attempt or error.code not in {429, 500, 502, 503, 504}:
                    raise
                delay = 0.35
                if error.code == 429:
                    try:
                        detail = json.loads(error.read().decode("utf-8"))
                        message = detail.get("error", {}).get("message", "")
                        match = re.search(r"retry in\s+(\d+(?:\.\d+)?)s", message, re.IGNORECASE)
                        if match:
                            delay = min(float(match.group(1)) + 0.5, 20)
                    except (ValueError, UnicodeDecodeError):
                        pass
                error.close()
                time.sleep(delay)
        if data is None:
            raise RuntimeError("Gemini returned no response")
        text = " ".join(
            part["text"]
            for candidate in data.get("candidates", [])
            for part in candidate.get("content", {}).get("parts", [])
            if part.get("text")
        ).strip()
        if not text:
            raise RuntimeError("Gemini returned no text")
        return text[:4000]
