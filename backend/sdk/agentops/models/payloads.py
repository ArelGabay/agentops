from typing import NotRequired, TypedDict


class TracePayload(TypedDict):
    agent_id: str
    status: str
    started_at: str
    input_text: NotRequired[str]
    output_text: NotRequired[str]
    latency_ms: NotRequired[int]
    total_tokens: NotRequired[int]
    total_cost: NotRequired[float]
    ended_at: NotRequired[str]


class SpanPayload(TypedDict):
    trace_id: str
    name: str
    span_type: str
    status: str
    started_at: str
    input_text: NotRequired[str]
    output_text: NotRequired[str]
    latency_ms: NotRequired[int]
    ended_at: NotRequired[str]