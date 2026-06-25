import { RefreshCw } from "lucide-react";

import { Button } from "./Button";

type RefreshButtonProps = {
  isRefreshing?: boolean;
  onRefresh: () => void;
};

export function RefreshButton({
  isRefreshing = false,
  onRefresh,
}: RefreshButtonProps) {
  return (
    <Button disabled={isRefreshing} onClick={onRefresh} variant="secondary">
      <RefreshCw
        className={["h-4 w-4", isRefreshing ? "animate-spin" : ""].join(" ")}
      />
      {isRefreshing ? "Refreshing" : "Refresh"}
    </Button>
  );
}
