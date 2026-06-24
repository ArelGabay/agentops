from datetime import UTC, datetime, timedelta
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Agent, Trace


def seed_agent(db_session: Session, agent_id: str, name: str) -> Agent:
    agent = Agent(
        id=agent_id,
        name=name,
        environment="test",
    )
    db_session.add(agent)
    db_session.commit()
    return agent


def seed_trace(
    db_session: Session,
    *,
    trace_id: str,
    agent_id: str,
    status: str,
    started_at: datetime,
    latency_ms: int | None,
    total_tokens: int | None,
    total_cost: Decimal | None,
) -> Trace:
    trace = Trace(
        id=trace_id,
        agent_id=agent_id,
        status=status,
        started_at=started_at,
        latency_ms=latency_ms,
        total_tokens=total_tokens,
        total_cost=total_cost,
    )
    db_session.add(trace)
    db_session.commit()
    return trace


def seed_dashboard_data(db_session: Session) -> None:
    now = datetime.now(UTC)

    seed_agent(db_session, "agent-alpha", "Agent Alpha")
    seed_agent(db_session, "agent-beta", "Agent Beta")

    seed_trace(
        db_session,
        trace_id="trace-success-1",
        agent_id="agent-alpha",
        status="success",
        started_at=now - timedelta(days=1),
        latency_ms=1000,
        total_tokens=100,
        total_cost=Decimal("0.10"),
    )
    seed_trace(
        db_session,
        trace_id="trace-error-1",
        agent_id="agent-alpha",
        status="error",
        started_at=now - timedelta(days=1),
        latency_ms=3000,
        total_tokens=200,
        total_cost=Decimal("0.20"),
    )
    seed_trace(
        db_session,
        trace_id="trace-timeout-1",
        agent_id="agent-beta",
        status="timeout",
        started_at=now - timedelta(days=2),
        latency_ms=None,
        total_tokens=300,
        total_cost=Decimal("0.30"),
    )
    seed_trace(
        db_session,
        trace_id="trace-old-1",
        agent_id="agent-beta",
        status="success",
        started_at=now - timedelta(days=10),
        latency_ms=9999,
        total_tokens=999,
        total_cost=Decimal("9.99"),
    )


def test_dashboard_summary_returns_expected_sections(
    client: TestClient,
) -> None:
    response = client.get("/dashboard/summary")

    assert response.status_code == 200
    data = response.json()

    assert set(data) == {
        "metrics",
        "status_counts",
        "top_agents",
        "recent_traces",
        "time_series",
    }
    assert set(data["metrics"]) == {
        "total_traces",
        "success_rate",
        "average_latency_ms",
        "total_tokens",
        "total_cost",
    }
    assert set(data["status_counts"]) == {
        "success",
        "error",
        "timeout",
        "canceled",
        "in_progress",
    }


def test_dashboard_summary_aggregates_last_7_days(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_dashboard_data(db_session)

    response = client.get("/dashboard/summary")

    assert response.status_code == 200
    data = response.json()

    assert data["metrics"]["total_traces"] == 3
    assert data["metrics"]["success_rate"] == pytest.approx(100 / 3)
    assert data["metrics"]["average_latency_ms"] == pytest.approx(2000)
    assert data["metrics"]["total_tokens"] == 600
    assert data["metrics"]["total_cost"] == "0.6000"

    assert data["status_counts"] == {
        "success": 1,
        "error": 1,
        "timeout": 1,
        "canceled": 0,
        "in_progress": 0,
    }

    assert data["top_agents"][0] == {
        "agent_id": "agent-alpha",
        "trace_count": 2,
    }

    recent_trace_ids = [trace["id"] for trace in data["recent_traces"]]
    assert "trace-old-1" not in recent_trace_ids
    assert len(data["recent_traces"]) == 3

    assert len(data["time_series"]) == 7
    assert sum(point["trace_count"] for point in data["time_series"]) == 3
    assert sum(point["error_count"] for point in data["time_series"]) == 1