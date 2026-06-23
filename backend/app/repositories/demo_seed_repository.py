from sqlalchemy.orm import Session

from app.models import Agent, Evaluation, Span, Trace


def delete_demo_data(db: Session, agent_ids: list[str]) -> None:
    trace_ids = [
        trace_id
        for (trace_id,) in db.query(Trace.id)
        .filter(Trace.agent_id.in_(agent_ids))
        .all()
    ]

    if trace_ids:
        db.query(Evaluation).filter(Evaluation.trace_id.in_(trace_ids)).delete(
            synchronize_session=False,
        )
        db.query(Span).filter(Span.trace_id.in_(trace_ids)).delete(
            synchronize_session=False,
        )
        db.query(Trace).filter(Trace.id.in_(trace_ids)).delete(
            synchronize_session=False,
        )

    db.query(Agent).filter(Agent.id.in_(agent_ids)).delete(
        synchronize_session=False,
    )

    db.commit()


def create_demo_agents(db: Session, agents: list[Agent]) -> None:
    db.add_all(agents)
    db.commit()


def create_demo_traces(db: Session, traces: list[Trace]) -> None:
    db.add_all(traces)
    db.commit()


def create_demo_spans(db: Session, spans: list[Span]) -> None:
    db.add_all(spans)
    db.commit()


def create_demo_evaluations(db: Session, evaluations: list[Evaluation]) -> None:
    db.add_all(evaluations)
    db.commit()
