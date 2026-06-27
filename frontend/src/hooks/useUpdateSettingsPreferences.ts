import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SettingsPreferencesUpdate } from "../types";
import { updateSettingsPreferences } from "../services";
import { queryKeys } from "./queryKeys";

export function useUpdateSettingsPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: SettingsPreferencesUpdate) =>
      updateSettingsPreferences(preferences),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.settingsSummary(),
      });
    },
  });
}
