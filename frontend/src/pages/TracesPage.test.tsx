import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { TracesPage } from "./TracesPage";
import { renderWithProviders } from "../tests/render";

const mockUseTraces = vi.fn();

vi.mock("../hooks", () => ({
  useTraces: (...args: unknown[]) => mockUseTraces(...args),
}));

describe("TracesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state while traces are loading", () => {
    mockUseTraces.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    renderWithProviders(<TracesPage />);

    expect(screen.getByText("Loading traces...")).toBeInTheDocument();
  });

  it("shows an error notice when traces fail to load", () => {
    mockUseTraces.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
      isFetching: false,
    });

    renderWithProviders(<TracesPage />);

    expect(
      screen.getByText(
        "Traces data is unavailable. Check that the backend is running.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an empty state when no traces exist", () => {
    mockUseTraces.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    renderWithProviders(<TracesPage />);

    expect(screen.getByText("No traces found yet.")).toBeInTheDocument();
  });

  it("shows a filtered empty state when no traces match the search", () => {
    mockUseTraces.mockReturnValue({
      data: [
        {
          id: "trace-001",
          agent_id: "agent-support",
          status: "success",
          started_at: "2026-07-01T10:00:00Z",
          latency_ms: 850,
          total_tokens: 1200,
          total_cost: "0.04",
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    renderWithProviders(<TracesPage />);

    fireEvent.change(
      screen.getByPlaceholderText("Search by trace ID, agent, or status..."),
      {
        target: { value: "nothing-will-match" },
      },
    );

    expect(
      screen.getByText("No traces match the current filters."),
    ).toBeInTheDocument();
  });

  it("renders trace rows when data exists", () => {
    mockUseTraces.mockReturnValue({
      data: [
        {
          id: "trace-001",
          agent_id: "agent-support",
          status: "success",
          started_at: "2026-07-01T10:00:00Z",
          latency_ms: 850,
          total_tokens: 1200,
          total_cost: "0.04",
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });

    renderWithProviders(<TracesPage />);

    expect(screen.getByText("trace-001")).toBeInTheDocument();
    expect(screen.getAllByText("agent-support")).toHaveLength(2);
    expect(screen.getAllByText("Success")).toHaveLength(2);
  });
});
