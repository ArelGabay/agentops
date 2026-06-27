from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import (
    get_settings_summary_controller,
    update_settings_preferences_controller,
)
from app.database import get_db_session
from app.schemas import (
    SettingsPreferencesResponse,
    SettingsPreferencesUpdate,
    SettingsSummaryResponse,
)


router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/summary", response_model=SettingsSummaryResponse)
def get_settings_summary(
    db: Session = Depends(get_db_session),
) -> SettingsSummaryResponse:
    return get_settings_summary_controller(db)



@router.put("/preferences", response_model=SettingsPreferencesResponse)
def update_settings_preferences(
    preferences_data: SettingsPreferencesUpdate,
    db: Session = Depends(get_db_session),
) -> SettingsPreferencesResponse:
    return update_settings_preferences_controller(db, preferences_data)
