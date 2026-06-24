import type { ReactNode } from "react";

import { Card } from "./Card";

type NoticeCardProps = {
  children: ReactNode;
  tone?: "info" | "error";
  className?: string;
};

const toneStyles = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-200",
  error: "border-red-500/20 bg-red-500/10 text-red-200",
};

export function NoticeCard({
  children,
  tone = "info",
  className = "",
}: NoticeCardProps) {
  return (
    <Card className={["p-4 text-sm", toneStyles[tone], className].join(" ")}>
      {children}
    </Card>
  );
}
