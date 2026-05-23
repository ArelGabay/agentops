import { useQuery } from "@tanstack/react-query";

import { getTraces } from "../services";
import { queryKeys } from "./queryKeys";

export function useTraces(limit = 25) {
  return useQuery({
    queryKey: queryKeys.traces(limit),
    queryFn: () => getTraces(limit),
  });
}
