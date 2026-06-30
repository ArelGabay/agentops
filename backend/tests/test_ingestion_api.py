from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Agent, Trace


STARTED_AT_DATETIME = datetime.now(UTC) - timedelta(days=1)
STARTED_AT = STARTED_AT_DATETIME.isoformat()


def seed_agent(db_session: Session, agent_id: str = "agent-test") -> Agent:
    agent = Agent(
        id=agent_id,
        name="Test Agent",
        environment="test",
    )
    db_session.add(agent)
    db_session.commit()
    return agent


def seed_trace(
    db_session: Session,
    trace_id: str = "trace-test",
    agent_id: str = "agent-test",
) -> Trace:
    seed_agent(db_session, agent_id=agent_id)

    trace = Trace(
        id=trace_id,
        agent_id=agent_id,
        status="success",
        started_at=STARTED_AT_DATETIME,
    )
    db_session.add(trace)
    db_session.commit()
    return trace


def test_create_trace_returns_201_when_agent_exists(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_agent(db_session)

    response = client.post(
        "/traces",
        json={
            "agent_id": "agent-test",
            "status": "success",
            "started_at": STARTED_AT,
            "latency_ms": 1200,
            "total_tokens": 500,
            "total_cost": "0.05",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["agent_id"] == "agent-test"
    assert data["status"] == "success"
    assert data["latency_ms"] == 1200
    assert data["total_tokens"] == 500
    assert data["total_cost"] == "0.0500"


def test_create_trace_normalizes_status_variants(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_agent(db_session)

    response = client.post(
        "/traces",
        json={
            "agent_id": "agent-test",
            "status": "In Progress",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "in-progress"


def test_create_trace_returns_422_for_unknown_status(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_agent(db_session)

    response = client.post(
        "/traces",
        json={
            "agent_id": "agent-test",
            "status": "pending",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 422


def test_create_trace_returns_404_when_agent_is_missing(
    client: TestClient,
) -> None:
    response = client.post(
        "/traces",
        json={
            "agent_id": "missing-agent",
            "status": "success",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Agent not found"}


def test_create_span_returns_201_when_trace_exists(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_trace(db_session)

    response = client.post(
        "/spans",
        json={
            "trace_id": "trace-test",
            "name": "Test Span",
            "span_type": "chain",
            "status": "success",
            "started_at": STARTED_AT,
            "latency_ms": 250,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["trace_id"] == "trace-test"
    assert data["name"] == "Test Span"
    assert data["span_type"] == "chain"
    assert data["status"] == "success"
    assert data["latency_ms"] == 250


def test_create_span_normalizes_status_variants(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_trace(db_session)

    response = client.post(
        "/spans",
        json={
            "trace_id": "trace-test",
            "name": "Test Span",
            "span_type": "chain",
            "status": "in_progress",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "in-progress"


def test_create_span_returns_422_for_unknown_status(
    client: TestClient,
) -> None:
    response = client.post(
        "/spans",
        json={
            "trace_id": "missing-trace",
            "name": "Test Span",
            "span_type": "chain",
            "status": "pending",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 422


def test_create_span_returns_404_when_trace_is_missing(
    client: TestClient,
) -> None:
    response = client.post(
        "/spans",
        json={
            "trace_id": "missing-trace",
            "name": "Test Span",
            "span_type": "chain",
            "status": "success",
            "started_at": STARTED_AT,
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Trace not found"}


def test_create_evaluation_returns_201_when_trace_exists(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_trace(db_session)

    response = client.post(
        "/evaluations",
        json={
            "trace_id": "trace-test",
            "evaluator_name": "quality",
            "score": 90,
            "result": "pass",
            "hallucination_score": 5,
            "feedback": "Looks good.",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["trace_id"] == "trace-test"
    assert data["evaluator_name"] == "quality"
    assert data["score"] == "90.00"
    assert data["result"] == "pass"
    assert data["hallucination_score"] == "5.00"
    assert data["feedback"] == "Looks good."


def test_create_evaluation_normalizes_result_variants(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_trace(db_session)

    response = client.post(
        "/evaluations",
        json={
            "trace_id": "trace-test",
            "evaluator_name": "quality",
            "score": 90,
            "result": "FAIL",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["result"] == "fail"


def test_create_evaluation_returns_422_for_unknown_result(
    client: TestClient,
    db_session: Session,
) -> None:
    seed_trace(db_session)

    response = client.post(
        "/evaluations",
        json={
            "trace_id": "trace-test",
            "evaluator_name": "quality",
            "score": 90,
            "result": "good",
        },
    )

    assert response.status_code == 422


def test_create_evaluation_returns_404_when_trace_is_missing(
    client: TestClient,
) -> None:
    response = client.post(
        "/evaluations",
        json={
            "trace_id": "missing-trace",
            "evaluator_name": "quality",
            "score": 90,
            "result": "pass",
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Trace not found"}