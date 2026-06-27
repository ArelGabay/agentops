from sqlalchemy.orm import Session

from app.schemas import (
    SettingsPreferencesResponse,
    SettingsPreferencesUpdate,
    SettingsSummaryResponse,
)
from app.services import get_settings_summary, save_settings_preferences


def get_settings_summary_controller(db: Session) -> SettingsSummaryResponse:
    return get_settings_summary(db)


def update_settings_preferences_controller(
    db: Session,
    preferences_data: SettingsPreferencesUpdate,
) -> SettingsPreferencesResponse:
    return save_settings_preferences(db, preferences_data)
