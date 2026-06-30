from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.models import Agent, Evaluation, Span, Trace
from app.services import DemoSeedResetRequiredError, seed_demo_data


def test_seed_demo_data_creates_demo_rows_on_first_run(
    db_session: Session,
) -> None:
    summary = seed_demo_data(db_session)

    assert summary.agents == 5
    assert summary.traces == 12
    assert summary.spans == 28
    assert summary.evaluations == 7

    assert summary.existing_agents == 0
    assert summary.existing_traces == 0
    assert summary.existing_spans == 0
    assert summary.existing_evaluations == 0
    assert summary.found_existing_data is False
    assert summary.reset_performed is False
    assert summary.dry_run is False

    assert db_session.query(Agent).count() == 5
    assert db_session.query(Trace).count() == 12
    assert db_session.query(Span).count() == 28
    assert db_session.query(Evaluation).count() == 7


def test_seed_demo_data_requires_reset_when_demo_rows_exist(
    db_session: Session,
) -> None:
    seed_demo_data(db_session)

    try:
        seed_demo_data(db_session)
        assert False, "Expected DemoSeedResetRequiredError"
    except DemoSeedResetRequiredError as error:
        assert error.detail == "Demo data already exists. Rerun with --reset to replace it."


def test_seed_demo_data_dry_run_does_not_write_rows(
    db_session: Session,
) -> None:
    summary = seed_demo_data(db_session, dry_run=True)

    assert summary.agents == 5
    assert summary.traces == 12
    assert summary.spans == 28
    assert summary.evaluations == 7
    assert summary.dry_run is True
    assert summary.reset_performed is False
    assert summary.found_existing_data is False

    assert db_session.query(Agent).count() == 0
    assert db_session.query(Trace).count() == 0
    assert db_session.query(Span).count() == 0
    assert db_session.query(Evaluation).count() == 0



def test_seed_demo_data_reset_replaces_existing_demo_rows(
    db_session: Session,
) -> None:
    seed_demo_data(db_session)

    summary = seed_demo_data(db_session, reset=True)

    assert summary.agents == 5
    assert summary.traces == 12
    assert summary.spans == 28
    assert summary.evaluations == 7
    assert summary.found_existing_data is True
    assert summary.reset_performed is True
    assert summary.dry_run is False

    assert db_session.query(Agent).count() == 5
    assert db_session.query(Trace).count() == 12
    assert db_session.query(Span).count() == 28
    assert db_session.query(Evaluation).count() == 7


def test_seed_demo_data_trace_limit_filters_related_rows(
    db_session: Session,
) -> None:
    summary = seed_demo_data(db_session, trace_limit=3)

    assert summary.traces == 3
    assert summary.spans == 8
    assert summary.evaluations == 3

    trace_ids = {trace.id for trace in db_session.query(Trace).all()}
    span_trace_ids = {span.trace_id for span in db_session.query(Span).all()}
    evaluation_trace_ids = {
        evaluation.trace_id for evaluation in db_session.query(Evaluation).all()
    }

    assert len(trace_ids) == 3
    assert span_trace_ids.issubset(trace_ids)
    assert evaluation_trace_ids.issubset(trace_ids)


def test_seed_demo_data_uses_fixed_base_time(
    db_session: Session,
) -> None:
    base_time = datetime(2026, 7, 1, 12, 0, tzinfo=UTC)

    seed_demo_data(db_session, base_time=base_time)

    first_trace = (
        db_session.query(Trace)
        .filter(Trace.id == "trace-demo-support-001")
        .one()
    )

    assert first_trace.started_at == datetime(2026, 6, 30, 18, 0)


def test_seed_demo_data_reset_leaves_unrelated_rows_untouched(
    db_session: Session,
) -> None:
    db_session.add(
        Agent(
            id="agent-custom",
            name="Custom Agent",
            environment="test",
        )
    )
    db_session.commit()

    seed_demo_data(db_session)
    seed_demo_data(db_session, reset=True)

    custom_agent = (
        db_session.query(Agent)
        .filter(Agent.id == "agent-custom")
        .one_or_none()
    )

    assert custom_agent is not None