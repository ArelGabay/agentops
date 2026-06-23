from sqlalchemy.orm import Session

from app.models import Agent


def get_agent_by_id(db: Session, agent_id: str) -> Agent | None:
    return db.query(Agent).filter(Agent.id == agent_id).first()