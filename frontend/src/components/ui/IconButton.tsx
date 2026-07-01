import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
};

export function IconButton({
  children,
  className = "",
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={[
        "grid h-8 w-8 place-items-center rounded-lg border border-app-border bg-white/[0.03] text-slate-300 transition hover:border-slate-600 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050914]",
        className,
      ].join(" ")}
      title={label}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
