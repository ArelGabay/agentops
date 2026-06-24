import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center",
        className,
      ].join(" ")}
    >
      {icon && (
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-lg bg-white/[0.04] text-slate-400">
          {icon}
        </div>
      )}

      <p className="text-sm font-medium text-slate-300">{title}</p>

      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
