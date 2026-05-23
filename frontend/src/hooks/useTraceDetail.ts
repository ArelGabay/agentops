import { useQuery } from "@tanstack/react-query";

import { getTraceDetail } from "../services";
import { queryKeys } from "./queryKeys";

export function useTraceDetail(traceId: string) {
  return useQuery({
    queryKey: queryKeys.traceDetail(traceId),
    queryFn: () => getTraceDetail(traceId),
    enabled: traceId.length > 0,
  });
}
