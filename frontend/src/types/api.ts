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
