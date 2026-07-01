import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { DashboardPage } from "./DashboardPage";
import { renderWithProviders } from "../tests/render";

const mockUseDashboardSummary = vi.fn();

vi.mock("../hooks", () => ({
  useDashboardSummary: () => mockUseDashboardSummary(),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading notice while dashboard data is loading", () => {
    mockUseDashboardSummary.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
  });

  it("shows an error notice when dashboard data fails to load", () => {
    mockUseDashboardSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<DashboardPage />);

    expect(
      screen.getByText(
        "Dashboard data is unavailable. Check that the backend is running.",
      ),
    ).toBeInTheDocument();
  });

  it("shows honest empty states when there is no dashboard data", () => {
    mockUseDashboardSummary.mockReturnValue({
      data: {
        metrics: {
          total_traces: 0,
          success_rate: 0,
          average_latency_ms: null,
          total_tokens: 0,
          total_cost: "0.00",
        },
        status_counts: {
          success: 0,
          error: 0,
          timeout: 0,
          canceled: 0,
          in_progress: 0,
        },
        top_agents: [],
        recent_traces: [],
        time_series: [],
      },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("No agent activity yet.")).toBeInTheDocument();
    expect(screen.getByText("No traces found yet.")).toBeInTheDocument();
    expect(
      screen.getAllByText("Time-series chart data is not available yet."),
    ).not.toHaveLength(0);
  });

  it("renders dashboard metrics and recent traces when data exists", () => {
    mockUseDashboardSummary.mockReturnValue({
      data: {
        metrics: {
          total_traces: 12,
          success_rate: 83.3,
          average_latency_ms: 1450,
          total_tokens: 18240,
          total_cost: "1.24",
        },
        status_counts: {
          success: 10,
          error: 1,
          timeout: 1,
          canceled: 0,
          in_progress: 0,
        },
        top_agents: [
          {
            agent_id: "agent-support",
            trace_count: 6,
          },
        ],
        recent_traces: [
          {
            id: "trace-001",
            agent_id: "agent-support",
            status: "success",
            started_at: "2026-07-01T10:00:00Z",
            latency_ms: 1450,
            total_tokens: 1200,
            total_cost: "0.04",
          },
        ],
        time_series: [
          {
            date: "2026-07-01",
            trace_count: 12,
            error_count: 2,
            average_latency_ms: 1450,
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("From latest 100 traces")).toBeInTheDocument();
    expect(screen.getByText("83.3%")).toBeInTheDocument();
    expect(screen.getByText("trace-001")).toBeInTheDocument();
    expect(screen.getAllByText("agent-support")).not.toHaveLength(0);
  });
});
