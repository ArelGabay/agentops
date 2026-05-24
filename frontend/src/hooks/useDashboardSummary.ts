import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "../services";
import { queryKeys } from "./queryKeys";

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary(),
    queryFn: getDashboardSummary,
  });
}
