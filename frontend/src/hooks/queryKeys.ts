export const queryKeys = {
  traces: (limit: number) => ["traces", { limit }] as const,
  traceDetail: (traceId: string) => ["trace-detail", traceId] as const,
  evaluations: (limit: number) => ["evaluations", { limit }] as const,
};
