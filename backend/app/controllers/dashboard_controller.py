from sqlalchemy.orm import Session

from app.schemas import DashboardSummaryResponse
from app.services import get_dashboard_summary


def get_dashboard_summary_controller(db: Session) -> DashboardSummaryResponse:
    return get_dashboard_summary(db)