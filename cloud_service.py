"""Optional Gemini analysis. A failed request leaves local model results usable."""
from __future__ import annotations

import json
import os
import re
import time
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class CloudResult:
    text: str
    model: str


class CloudError(Exception):
    def __init__(self, kind: str, message: str):
        super().__init__(message)
        self.kind = kind


class CloudService:
    def __init__(self) -> None:
        self.key = os.environ.get("GEMINI_API_KEY", "").strip()
        self.model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash").strip()

    @property
    def configured(self) -> bool:
        return bool(self.key)

    def generate(self, prompt: str) -> str:
        return self.generate_result(prompt).text

    def generate_result(self, prompt: str) -> CloudResult:
        if not self.configured:
            raise CloudError("not_configured", "Gemini is not configured for online text guidance.")
        parts: list[dict] = [{"text": prompt}]
        payload = json.dumps({"contents": [{"parts": parts}]}).encode("utf-8")
        models = [self.model]
        failures: list[CloudError] = []
        for index, model in enumerate(models):
            try:
                return CloudResult(self._request(model, payload, retry=index == len(models) - 1), model)
            except CloudError as error:
                failures.append(error)
                if error.kind not in {"rate_limit", "server", "timeout", "model_unavailable"}:
                    raise
        raise failures[-1]

    def _request(self, model: str, payload: bytes, retry: bool) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        req = Request(url, data=payload, headers={"x-goog-api-key": self.key, "Content-Type": "application/json"}, method="POST")
        for attempt in range(2 if retry else 1):
            try:
                with urlopen(req, timeout=15) as response:
                    data = json.loads(response.read().decode("utf-8"))
                text = " ".join(
                    part["text"]
                    for candidate in data.get("candidates", [])
                    for part in candidate.get("content", {}).get("parts", [])
                    if part.get("text")
                ).strip()
                if not text:
                    raise CloudError("empty", "Gemini returned no text. Try again shortly.")
                return text[:4000]
            except HTTPError as error:
                detail = error.read().decode("utf-8", errors="replace")
                error.close()
                if error.code == 429:
                    failure = CloudError("rate_limit", "Gemini request limit reached. Try again later or use a model with available quota.")
                elif error.code in {401, 403}:
                    failure = CloudError("auth", "Gemini rejected the API key. Check GEMINI_API_KEY and model access.")
                elif error.code == 404:
                    failure = CloudError("model_unavailable", "The configured Gemini model is unavailable for this API key.")
                elif error.code in {500, 502, 503, 504}:
                    failure = CloudError("server", "Gemini is temporarily unavailable. Try again shortly.")
                else:
                    failure = CloudError("request", "Gemini could not generate text. Check the model settings.")
                if attempt == 0 and retry and error.code in {429, 500, 502, 503, 504}:
                    delay = 0.35
                    if error.code == 429:
                        try:
                            message = json.loads(detail).get("error", {}).get("message", "")
                            match = re.search(r"retry in\s+(\d+(?:\.\d+)?)s", message, re.IGNORECASE)
                            if match:
                                delay = min(float(match.group(1)) + 0.5, 20)
                        except ValueError:
                            pass
                    time.sleep(delay)
                    continue
                raise failure from error
            except (TimeoutError, URLError) as error:
                raise CloudError("timeout", "Gemini did not respond in time. Check the connection and try again.") from error
        raise CloudError("unavailable", "Gemini did not return an analysis.")
