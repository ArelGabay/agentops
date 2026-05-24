export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatScore(value: number) {
  return `${value.toFixed(1)} / 100`;
}

export function formatLatency(milliseconds: number | null) {
  if (milliseconds === null) {
    return "N/A";
  }

  if (milliseconds >= 1000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }

  return `${Math.round(milliseconds)}ms`;
}

export function formatCurrency(value: string | number | null) {
  if (value === null) {
    return "N/A";
  }

  return `$${Number(value).toFixed(2)}`;
}

export function formatDateTime(value: string | null) {
  if (value === null) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
