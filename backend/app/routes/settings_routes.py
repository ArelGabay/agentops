from fastapi import APIRouter

from app.controllers import get_settings_summary_controller
from app.schemas import SettingsSummaryResponse


router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/summary", response_model=SettingsSummaryResponse)
def get_settings_summary() -> SettingsSummaryResponse:
    return get_settings_summary_controller()
