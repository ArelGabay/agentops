from types import TracebackType
from typing import Any, Self

from agentops.client import AgentOpsClient
from agentops.utils import latency_ms, to_iso, utc_now


class SpanTracker:
    def __init__(
        self,
        client: AgentOpsClient,
        trace_id: str,
        name: str,
        span_type: str,
        input_text: str | None = None,
    ) -> None:
        self.client = client
        self.trace_id = trace_id
        self.name = name
        self.span_type = span_type
        self.input_text = input_text
        self.output_text: str | None = None
        self.started_at = utc_now()
        self.ended_at = self.started_at
        self.response: dict[str, Any] | None = None

    def __enter__(self) -> Self:
        self.started_at = utc_now()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        self.ended_at = utc_now()
        status = "error" if exc_type else "success"

        self.response = self.client.create_span(
            trace_id=self.trace_id,
            name=self.name,
            span_type=self.span_type,
            status=status,
            input_text=self.input_text,
            output_text=self.output_text,
            latency_ms=latency_ms(self.started_at, self.ended_at),
            started_at=to_iso(self.started_at),
            ended_at=to_iso(self.ended_at),
        )

    def set_output(self, output_text: str) -> None:
        self.output_text = output_text

    @property
    def id(self) -> str | None:
        if self.response is None:
            return None
        return str(self.response["id"])
