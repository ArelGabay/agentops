import {
  DashboardSummary,
  EvaluationRead,
  SettingsSummary,
  TraceDetail,
  TraceListItem,
  SettingsPreferences,
  SettingsPreferencesUpdate,
} from "../types";

import { apiGet, apiPut } from "./apiClient";

export function getTraces(limit = 25) {
  return apiGet<TraceListItem[]>(`/traces?limit=${limit}`);
}

export function getTraceDetail(traceId: string) {
  return apiGet<TraceDetail>(`/traces/${traceId}`);
}

export function getEvaluations(limit = 25) {
  return apiGet<EvaluationRead[]>(`/evaluations?limit=${limit}`);
}

export function getDashboardSummary() {
  return apiGet<DashboardSummary>("/dashboard/summary");
}

export function getSettingsSummary() {
  return apiGet<SettingsSummary>("/settings/summary");
}

export function updateSettingsPreferences(
  preferences: SettingsPreferencesUpdate,
) {
  return apiPut<SettingsPreferences>("/settings/preferences", preferences);
}
