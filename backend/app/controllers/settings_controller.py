from app.schemas import SettingsSummaryResponse
from app.services import get_settings_summary


def get_settings_summary_controller() -> SettingsSummaryResponse:
    return get_settings_summary()
