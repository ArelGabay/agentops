from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import get_dashboard_summary_controller
from app.database import get_db_session
from app.schemas import DashboardSummaryResponse


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Session = Depends(get_db_session),
) -> DashboardSummaryResponse:
    return get_dashboard_summary_controller(db)