from app.config.settings import settings
from app.schemas import (
    SettingsAppResponse,
    SettingsCapabilityResponse,
    SettingsUnavailableFeatureResponse,
    SettingsSummaryResponse,
)


def get_settings_summary() -> SettingsSummaryResponse:
    return SettingsSummaryResponse(
        app=SettingsAppResponse(
            name=settings.app_name,
            environment=settings.app_env,
            version="0.1.0",
        ),
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
            SettingsUnavailableFeatureResponse(
                name="Editable workspace preferences",
                reason="Workspace settings are read-only until persisted settings exist.",
            ),
        ],
    )
