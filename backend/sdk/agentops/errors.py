class AgentOpsError(Exception):
    """Base exception for SDK errors."""


class AgentOpsRequestError(AgentOpsError):
    """Raised when the SDK cannot reach the AgentOps backend."""


class AgentOpsAPIError(AgentOpsError):
    """Raised when the AgentOps backend returns a non-success response."""

    def __init__(
        self,
        *,
        status_code: int,
        path: str,
        detail: str,
    ) -> None:
        self.status_code = status_code
        self.path = path
        self.detail = detail
        super().__init__(f"POST {path} failed with {status_code}: {detail}")
