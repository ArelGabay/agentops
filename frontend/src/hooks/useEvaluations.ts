import { useQuery } from "@tanstack/react-query";

import { getEvaluations } from "../services";
import { queryKeys } from "./queryKeys";

export function useEvaluations(limit = 25) {
  return useQuery({
    queryKey: queryKeys.evaluations(limit),
    queryFn: () => getEvaluations(limit),
  });
}
