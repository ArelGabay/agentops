from typing import Literal

from pydantic import BaseModel


class SettingsAppResponse(BaseModel):
    name: str
    environment: str
    version: str


class SettingsCapabilityResponse(BaseModel):
    name: str
    status: Literal["available", "unavailable", "optional"]
    description: str


class SettingsUnavailableFeatureResponse(BaseModel):
    name: str
    reason: str


class SettingsPreferencesResponse(BaseModel):
    workspace_name: str
    timezone: str
    theme_preference: Literal["dark"]
    accent_color: Literal["violet", "blue", "emerald", "amber"]


class SettingsPreferencesUpdate(BaseModel):
    workspace_name: str
    timezone: str
    theme_preference: Literal["dark"]
    accent_color: Literal["violet", "blue", "emerald", "amber"]


class SettingsSummaryResponse(BaseModel):
    app: SettingsAppResponse
    preferences: SettingsPreferencesResponse
    capabilities: list[SettingsCapabilityResponse]
    unavailable_features: list[SettingsUnavailableFeatureResponse]
