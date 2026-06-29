from typing import Any

import requests

from agentops.errors import AgentOpsAPIError, AgentOpsRequestError


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
        try:
            response = requests.post(
                f"{self.base_url}{path}",
                json=payload,
                timeout=10,
            )
        except requests.RequestException as error:
            raise AgentOpsRequestError(
                f"Unable to reach AgentOps at {self.base_url}{path}. "
                "Check that the backend is running and the base_url is correct. "
                f"Original error: {error}"
            ) from error

        if not response.ok:
            detail = self._extract_error_detail(response)
            raise AgentOpsAPIError(
                status_code=response.status_code,
                path=path,
                detail=detail,
            )

        return response.json()

    def _extract_error_detail(self, response: requests.Response) -> str:
        try:
            payload = response.json()
        except ValueError:
            text = response.text.strip()
            return text or f"HTTP {response.status_code}"

        if isinstance(payload, dict):
            detail = payload.get("detail")

            if isinstance(detail, str) and detail:
                return detail

            if detail is not None:
                return str(detail)

        return f"HTTP {response.status_code}"
