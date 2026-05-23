import type { EvaluationRead, TraceDetail, TraceListItem } from "../types";

import { apiGet } from "./apiClient";

export function getTraces(limit = 25) {
  return apiGet<TraceListItem[]>(`/traces?limit=${limit}`);
}

export function getTraceDetail(traceId: string) {
  return apiGet<TraceDetail>(`/traces/${traceId}`);
}

export function getEvaluations(limit = 25) {
  return apiGet<EvaluationRead[]>(`/evaluations?limit=${limit}`);
}
