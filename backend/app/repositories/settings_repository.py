from sqlalchemy.orm import Session

from app.models import SettingsPreference

def get_settings_preference(db: Session) -> SettingsPreference | None:
    return db.query(SettingsPreference).first()


def create_settings_preference(
    db: Session,
    *,
    workspace_name: str,
    timezone: str,
    theme_preference: str,
    accent_color: str,
) -> SettingsPreference:
    preference = SettingsPreference(
        workspace_name=workspace_name,
        timezone=timezone,
        theme_preference=theme_preference,
        accent_color=accent_color,
    )
    db.add(preference)
    db.commit()
    db.refresh(preference)
    return preference


def update_settings_preference(
    db: Session,
    preference: SettingsPreference,
    *,
    workspace_name: str,
    timezone: str,
    theme_preference: str,
    accent_color: str,
) -> SettingsPreference:
    preference.workspace_name = workspace_name
    preference.timezone = timezone
    preference.theme_preference = theme_preference
    preference.accent_color = accent_color

    db.commit()
    db.refresh(preference)
    return preference
