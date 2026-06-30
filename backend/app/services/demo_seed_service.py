from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session

from app.models import Agent, Evaluation, Span, Trace
from app.repositories import (
    create_demo_agents,
    create_demo_evaluations,
    create_demo_spans,
    create_demo_traces,
    delete_demo_data,
    get_demo_data_counts,
)

from app.services.errors import DemoSeedResetRequiredError


DEMO_AGENT_IDS = [
    "agent-demo-1",
    "agent-support",
    "agent-research",
    "agent-code",
    "agent-data",
]


@dataclass(frozen=True)
class DemoSeedSummary:
    agents: int
    traces: int
    spans: int
    evaluations: int
    existing_agents: int
    existing_traces: int
    existing_spans: int
    existing_evaluations: int
    found_existing_data: bool
    reset_performed: bool
    dry_run: bool


def seed_demo_data(
    db: Session,
    *,
    reset: bool = False,
    dry_run: bool = False,
    trace_limit: int | None = None,
    base_time: datetime | None = None,
) -> DemoSeedSummary:
    now = base_time or datetime.now(UTC)

    existing = get_demo_data_counts(db, DEMO_AGENT_IDS)
    found_existing_data = any(
        [
            existing.agents,
            existing.traces,
            existing.spans,
            existing.evaluations,
        ]
    )

    if found_existing_data and not reset:
        raise DemoSeedResetRequiredError(
            "Demo data already exists. Rerun with --reset to replace it."
        )

    agents = _build_agents()
    traces = _build_traces(now)
    spans = _build_spans(now)
    evaluations = _build_evaluations(now)

    if trace_limit is not None:
        traces = traces[:trace_limit]
        trace_ids = {trace.id for trace in traces}
        spans = [span for span in spans if span.trace_id in trace_ids]
        evaluations = [
            evaluation
            for evaluation in evaluations
            if evaluation.trace_id in trace_ids
        ]

    if dry_run:
        return DemoSeedSummary(
            agents=len(agents),
            traces=len(traces),
            spans=len(spans),
            evaluations=len(evaluations),
            existing_agents=existing.agents,
            existing_traces=existing.traces,
            existing_spans=existing.spans,
            existing_evaluations=existing.evaluations,
            found_existing_data=found_existing_data,
            reset_performed=False,
            dry_run=True,
        )

    if found_existing_data and reset:
        delete_demo_data(db, DEMO_AGENT_IDS)

    create_demo_agents(db, agents)
    create_demo_traces(db, traces)
    create_demo_spans(db, spans)
    create_demo_evaluations(db, evaluations)

    return DemoSeedSummary(
        agents=len(agents),
        traces=len(traces),
        spans=len(spans),
        evaluations=len(evaluations),
        existing_agents=existing.agents,
        existing_traces=existing.traces,
        existing_spans=existing.spans,
        existing_evaluations=existing.evaluations,
        found_existing_data=found_existing_data,
        reset_performed=found_existing_data and reset,
        dry_run=False,
    )


def _build_agents() -> list[Agent]:
    return [
        Agent(id="agent-demo-1", name="Demo Support Agent", environment="development"),
        Agent(id="agent-support", name="Customer Support Agent", environment="production"),
        Agent(id="agent-research", name="Research Assistant", environment="production"),
        Agent(id="agent-code", name="Code Assistant", environment="staging"),
        Agent(id="agent-data", name="Data Analyst Agent", environment="production"),
    ]


def _build_traces(now: datetime) -> list[Trace]:
    trace_specs = [
        ("trace-demo-support-001", "agent-support", "success", 18, 842, 1180, Decimal("0.03")),
        ("trace-demo-support-002", "agent-support", "success", 16, 1260, 1565, Decimal("0.05")),
        ("trace-demo-research-001", "agent-research", "success", 14, 2310, 4210, Decimal("0.13")),
        ("trace-demo-data-001", "agent-data", "error", 12, 3890, 970, Decimal("0.02")),
        ("trace-demo-content-001", "agent-demo-1", "success", 10, 1650, 2890, Decimal("0.08")),
        ("trace-demo-code-001", "agent-code", "timeout", 8, 10000, 3120, Decimal("0.10")),
        ("trace-demo-research-002", "agent-research", "canceled", 6, None, None, None),
        ("trace-demo-support-003", "agent-support", "success", 4, 675, 890, Decimal("0.03")),
        ("trace-demo-data-002", "agent-data", "success", 3, 1990, 2450, Decimal("0.07")),
        ("trace-demo-content-002", "agent-demo-1", "error", 2, 1430, 760, Decimal("0.02")),
        ("trace-demo-code-002", "agent-code", "success", 1, 940, 1325, Decimal("0.04")),
        ("trace-demo-support-004", "agent-support", "success", 0, 1180, 1640, Decimal("0.05")),
    ]

    traces: list[Trace] = []

    for trace_id, agent_id, status, hours_ago, latency_ms, tokens, cost in trace_specs:
        started_at = now - timedelta(hours=hours_ago)
        ended_at = (
            started_at + timedelta(milliseconds=latency_ms)
            if latency_ms is not None
            else None
        )

        traces.append(
            Trace(
                id=trace_id,
                agent_id=agent_id,
                status=status,
                input_text=_trace_input(agent_id),
                output_text=_trace_output(status),
                latency_ms=latency_ms,
                total_tokens=tokens,
                total_cost=cost,
                started_at=started_at,
                ended_at=ended_at,
            )
        )

    return traces


def _build_spans(now: datetime) -> list[Span]:
    spans: list[Span] = []

    for index, trace_id in enumerate(
        [
            "trace-demo-support-001",
            "trace-demo-support-002",
            "trace-demo-research-001",
            "trace-demo-data-001",
            "trace-demo-content-001",
            "trace-demo-code-001",
            "trace-demo-support-003",
            "trace-demo-data-002",
            "trace-demo-content-002",
            "trace-demo-code-002",
            "trace-demo-support-004",
        ],
    ):
        started_at = now - timedelta(hours=18 - index)

        spans.extend(
            [
                Span(
                    id=f"{trace_id}-span-input",
                    trace_id=trace_id,
                    name="User Request",
                    span_type="input",
                    status="success",
                    input_text="User request received",
                    output_text="Request normalized",
                    latency_ms=120,
                    started_at=started_at,
                    ended_at=started_at + timedelta(milliseconds=120),
                ),
                Span(
                    id=f"{trace_id}-span-llm",
                    trace_id=trace_id,
                    name="LLM Response",
                    span_type="llm",
                    status="success",
                    input_text="Generate agent response",
                    output_text="Agent response generated",
                    latency_ms=720 + index * 35,
                    started_at=started_at + timedelta(milliseconds=140),
                    ended_at=started_at + timedelta(milliseconds=860 + index * 35),
                ),
            ]
        )

        if index % 2 == 0:
            spans.append(
                Span(
                    id=f"{trace_id}-span-tool",
                    trace_id=trace_id,
                    name="Tool Lookup",
                    span_type="tool",
                    status="success",
                    input_text="Lookup supporting context",
                    output_text="Context returned",
                    latency_ms=420,
                    started_at=started_at + timedelta(milliseconds=900),
                    ended_at=started_at + timedelta(milliseconds=1320),
                )
            )

    return spans


def _build_evaluations(now: datetime) -> list[Evaluation]:
    evaluation_specs = [
        ("trace-demo-support-001", "Answer Quality", Decimal("94.50"), "pass", Decimal("3.00")),
        ("trace-demo-support-002", "Answer Quality", Decimal("91.00"), "pass", Decimal("4.50")),
        ("trace-demo-research-001", "Groundedness", Decimal("88.00"), "pass", Decimal("7.00")),
        ("trace-demo-data-001", "Error Review", Decimal("42.00"), "fail", Decimal("22.00")),
        ("trace-demo-content-001", "Tone Review", Decimal("82.00"), "pass", Decimal("6.00")),
        ("trace-demo-data-002", "Data Accuracy", Decimal("90.00"), "pass", Decimal("5.00")),
        ("trace-demo-content-002", "Error Review", Decimal("58.00"), "fail", Decimal("18.00")),
    ]

    return [
        Evaluation(
            trace_id=trace_id,
            evaluator_name=evaluator_name,
            score=score,
            result=result,
            hallucination_score=hallucination_score,
            feedback=f"Demo evaluation for {trace_id}.",
            created_at=now - timedelta(minutes=index * 9),
        )
        for index, (trace_id, evaluator_name, score, result, hallucination_score)
        in enumerate(evaluation_specs)
    ]


def _trace_input(agent_id: str) -> str:
    return f"Demo request handled by {agent_id}."


def _trace_output(status: str) -> str | None:
    if status == "success":
        return "Demo agent completed the request successfully."

    if status == "error":
        return "Demo agent failed while processing the request."

    if status == "timeout":
        return "Demo agent timed out before completing the request."

    return None
