export type TraceListItem = {
  id: string;
  agent_id: string;
  status: string;
  started_at: string;
  created_at: string;
  input_text: string | null;
  output_text: string | null;
  latency_ms: number | null;
  total_tokens: number | null;
  total_cost: string | null;
  ended_at: string | null;
};

export type SpanRead = {
  id: string;
  trace_id: string;
  name: string;
  span_type: string;
  status: string;
  started_at: string;
  created_at: string;
  input_text: string | null;
  output_text: string | null;
  latency_ms: number | null;
  ended_at: string | null;
};

export type EvaluationRead = {
  id: string;
  trace_id: string;
  evaluator_name: string;
  score: string;
  result: string;
  created_at: string;
  hallucination_score: string | null;
  feedback: string | null;
};

export type TraceDetail = TraceListItem & {
  spans: SpanRead[];
  evaluations: EvaluationRead[];
};

export type DashboardSummary = {
  metrics: DashboardMetrics;
  status_counts: DashboardStatusCounts;
  top_agents: DashboardTopAgent[];
  recent_traces: TraceListItem[];
  time_series: DashboardTimeSeriesPoint[];
};

export type DashboardMetrics = {
  total_traces: number;
  success_rate: number;
  average_latency_ms: number | null;
  total_tokens: number;
  total_cost: string;
};

export type DashboardStatusCounts = {
  success: number;
  error: number;
  timeout: number;
  canceled: number;
  in_progress: number;
};

export type DashboardTopAgent = {
  agent_id: string;
  trace_count: number;
};

export type DashboardTimeSeriesPoint = {
  date: string;
  trace_count: number;
  error_count: number;
  average_latency_ms: number | null;
};

export type SettingsSummary = {
  app: SettingsApp;
  preferences: SettingsPreferences;
  capabilities: SettingsCapability[];
  unavailable_features: SettingsUnavailableFeature[];
};

export type SettingsApp = {
  name: string;
  environment: string;
  version: string;
};

export type SettingsPreferences = {
  workspace_name: string;
  timezone: string;
  theme_preference: "dark";
  accent_color: "violet" | "blue" | "emerald" | "amber";
};

export type SettingsPreferencesUpdate = {
  workspace_name: string;
  timezone: string;
  theme_preference: "dark";
  accent_color: "violet" | "blue" | "emerald" | "amber";
};

export type SettingsCapability = {
  name: string;
  status: "available" | "unavailable" | "optional";
  description: string;
};

export type SettingsUnavailableFeature = {
  name: string;
  reason: string;
};
