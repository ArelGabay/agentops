from dataclasses import dataclass
from sqlalchemy.orm import Session

from app.models import Agent, Evaluation, Span, Trace

@dataclass(frozen=True)
class DemoDataCounts:
    agents: int
    traces: int
    spans: int
    evaluations: int

def get_demo_data_counts(db: Session, agent_ids: list[str]) -> DemoDataCounts:
    trace_ids = [
        trace_id
        for (trace_id,) in db.query(Trace.id)
        .filter(Trace.agent_id.in_(agent_ids))
        .all()
    ]

    agent_count = db.query(Agent).filter(Agent.id.in_(agent_ids)).count()
    trace_count = len(trace_ids)

    if trace_ids:
        span_count = db.query(Span).filter(Span.trace_id.in_(trace_ids)).count()
        evaluation_count = (
            db.query(Evaluation).filter(Evaluation.trace_id.in_(trace_ids)).count()
        )
    else:
        span_count = 0
        evaluation_count = 0

    return DemoDataCounts(
        agents=agent_count,
        traces=trace_count,
        spans=span_count,
        evaluations=evaluation_count,
    )

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
