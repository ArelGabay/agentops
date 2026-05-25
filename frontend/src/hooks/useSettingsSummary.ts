import { useQuery } from "@tanstack/react-query";

import { getSettingsSummary } from "../services";
import { queryKeys } from "./queryKeys";

export function useSettingsSummary() {
  return useQuery({
    queryKey: queryKeys.settingsSummary(),
    queryFn: getSettingsSummary,
  });
}
