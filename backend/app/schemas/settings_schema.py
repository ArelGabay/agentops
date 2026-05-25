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


class SettingsSummaryResponse(BaseModel):
    app: SettingsAppResponse
    capabilities: list[SettingsCapabilityResponse]
    unavailable_features: list[SettingsUnavailableFeatureResponse]
