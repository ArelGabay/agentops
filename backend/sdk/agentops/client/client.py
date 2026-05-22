from typing import Any

import requests


class AgentOpsClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8000") -> None:
        self.base_url = base_url.rstrip("/")

    def create_trace(self, **payload: Any) -> dict[str, Any]:
        return self._post("/traces", payload)

    def create_span(self, **payload: Any) -> dict[str, Any]:
        return self._post("/spans", payload)

    def create_evaluation(self, **payload: Any) -> dict[str, Any]:
        return self._post("/evaluations", payload)

    def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(f"{self.base_url}{path}", json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
