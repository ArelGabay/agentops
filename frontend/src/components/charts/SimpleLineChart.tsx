export type SimpleLineChartPoint = {
  label: string;
  value: number | null;
};

type SimpleLineChartProps = {
  ariaLabel: string;
  points: SimpleLineChartPoint[];
  tone?: "violet" | "blue" | "red" | "emerald";
};

export function SimpleLineChart({
  ariaLabel,
  points,
  tone = "violet",
}: SimpleLineChartProps) {
  const strokeStyles = {
    violet: "stroke-violet-400",
    blue: "stroke-blue-400",
    red: "stroke-red-400",
    emerald: "stroke-emerald-400",
  };

  const fillStyles = {
    violet: "fill-violet-500/15",
    blue: "fill-blue-500/15",
    red: "fill-red-500/15",
    emerald: "fill-emerald-500/15",
  };

  const values = points
    .map((point) => point.value)
    .filter((value): value is number => value !== null);

  if (values.length === 0 || values.every((value) => value === 0)) {
    return (
      <div className="grid h-56 place-items-center rounded-lg border border-app-border bg-white/[0.03] px-4 text-center text-sm text-slate-400">
        Time-series chart data is not available yet.
      </div>
    );
  }

  const maxValue = Math.max(...values);
  const chartPoints = points.map((point, index) => {
    const x = 20 + index * (600 / Math.max(points.length - 1, 1));
    const normalizedValue = point.value ?? 0;
    const y = 180 - (normalizedValue / maxValue) * 120;

    return { x, y };
  });

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L620 220 L20 220 Z`;

  return (
    <div className="h-56">
      <svg
        aria-label={ariaLabel}
        className="h-full w-full"
        role="img"
        viewBox="0 0 640 220"
      >
        <path
          className="stroke-slate-700/60"
          d="M20 40H620 M20 85H620 M20 130H620 M20 175H620"
          fill="none"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
        <path className={fillStyles[tone]} d={areaPath} />
        <path
          className={strokeStyles[tone]}
          d={linePath}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
