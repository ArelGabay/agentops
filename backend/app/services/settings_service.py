from sqlalchemy.orm import Session

from app.config.settings import settings
from app.repositories import (
    create_settings_preference,
    get_settings_preference,
    update_settings_preference,
)
from app.schemas import (
    SettingsAppResponse,
    SettingsCapabilityResponse,
    SettingsPreferencesResponse,
    SettingsPreferencesUpdate,
    SettingsSummaryResponse,
    SettingsUnavailableFeatureResponse,
)


def _build_default_preferences() -> SettingsPreferencesResponse:
    return SettingsPreferencesResponse(
        workspace_name=settings.app_name,
        timezone="UTC",
        theme_preference="dark",
        accent_color="violet",
    )


def get_settings_summary(db: Session) -> SettingsSummaryResponse:
    preference = get_settings_preference(db)

    preferences = (
        SettingsPreferencesResponse(
            workspace_name=preference.workspace_name,
            timezone=preference.timezone,
            theme_preference=preference.theme_preference,
            accent_color=preference.accent_color,
        )
        if preference is not None
        else _build_default_preferences()
    )

    return SettingsSummaryResponse(
        app=SettingsAppResponse(
            name=settings.app_name,
            environment=settings.app_env,
            version="0.1.0",
        ),
        preferences=preferences,
        capabilities=[
            SettingsCapabilityResponse(
                name="Trace ingestion",
                status="available",
                description="The backend stores trace telemetry through POST /traces.",
            ),
            SettingsCapabilityResponse(
                name="Span ingestion",
                status="available",
                description="The backend stores span telemetry through POST /spans.",
            ),
            SettingsCapabilityResponse(
                name="Evaluations",
                status="available",
                description="The backend stores and lists evaluation results.",
            ),
            SettingsCapabilityResponse(
                name="Dashboard summary",
                status="available",
                description="Dashboard metrics are aggregated through GET /dashboard/summary.",
            ),
            SettingsCapabilityResponse(
                name="Python SDK",
                status="available",
                description="The local SDK is installable with pip install -e ./sdk.",
            ),
            SettingsCapabilityResponse(
                name="LangChain callback",
                status="optional",
                description="The SDK includes an optional LangChain callback when LangChain is installed.",
            ),
        ],
        unavailable_features=[
            SettingsUnavailableFeatureResponse(
                name="API key management",
                reason="Authentication and API key storage are not implemented yet.",
            ),
            SettingsUnavailableFeatureResponse(
                name="Billing",
                reason="Billing is outside the V1 scope.",
            ),
            SettingsUnavailableFeatureResponse(
                name="Notification delivery",
                reason="Alert delivery channels are not implemented yet.",
            ),
            SettingsUnavailableFeatureResponse(
                name="Evaluation configuration",
                reason="Evaluation model, frequency, and threshold settings are not persisted yet.",
            ),
            SettingsUnavailableFeatureResponse(
                name="Evaluation dimensions",
                reason="Evaluation dimensions are not configurable yet.",
            ),
        ],
    )


def save_settings_preferences(
    db: Session,
    preferences_data: SettingsPreferencesUpdate,
) -> SettingsPreferencesResponse:
    preference = get_settings_preference(db)

    if preference is None:
        preference = create_settings_preference(
            db,
            workspace_name=preferences_data.workspace_name,
            timezone=preferences_data.timezone,
            theme_preference=preferences_data.theme_preference,
            accent_color=preferences_data.accent_color,
        )
    else:
        preference = update_settings_preference(
            db,
            preference,
            workspace_name=preferences_data.workspace_name,
            timezone=preferences_data.timezone,
            theme_preference=preferences_data.theme_preference,
            accent_color=preferences_data.accent_color,
        )

    return SettingsPreferencesResponse(
        workspace_name=preference.workspace_name,
        timezone=preference.timezone,
        theme_preference=preference.theme_preference,
        accent_color=preference.accent_color,
    )
