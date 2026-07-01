import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { EvaluationsPage } from "./EvaluationsPage";
import { renderWithProviders } from "../tests/render";

const mockUseEvaluations = vi.fn();

vi.mock("../hooks", () => ({
  useEvaluations: (...args: unknown[]) => mockUseEvaluations(...args),
}));

describe("EvaluationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error notice when evaluations fail to load", () => {
    mockUseEvaluations.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<EvaluationsPage />);

    expect(
      screen.getByText(
        "Evaluations data is unavailable. Check that the backend is running.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a loading table state while evaluations are loading", () => {
    mockUseEvaluations.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<EvaluationsPage />);

    expect(screen.getByText("Loading evaluations...")).toBeInTheDocument();
  });

  it("shows an empty state when no evaluations exist", () => {
    mockUseEvaluations.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<EvaluationsPage />);

    expect(screen.getByText("No evaluations found yet.")).toBeInTheDocument();
  });

  it("shows honest empty analytics states for unsupported sections", () => {
    mockUseEvaluations.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<EvaluationsPage />);

    expect(
      screen.getByText("No score time-series data is available yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Failing dimension data is not available yet."),
    ).toBeInTheDocument();
  });

  it("shows a filtered empty state when no evaluations match the search", () => {
    mockUseEvaluations.mockReturnValue({
      data: [
        {
          id: "eval-001",
          trace_id: "trace-001",
          evaluator_name: "quality-review",
          score: "92",
          result: "pass",
          hallucination_score: "4",
          created_at: "2026-07-01T10:00:00Z",
          feedback: "Looks good",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<EvaluationsPage />);

    fireEvent.change(screen.getByPlaceholderText("Search evaluations..."), {
      target: { value: "nothing-will-match" },
    });

    expect(
      screen.getByText("No evaluations match the current filters."),
    ).toBeInTheDocument();
  });

  it("renders evaluation rows when data exists", () => {
    mockUseEvaluations.mockReturnValue({
      data: [
        {
          id: "eval-001",
          trace_id: "trace-001",
          evaluator_name: "quality-review",
          score: "92",
          result: "pass",
          hallucination_score: "4",
          created_at: "2026-07-01T10:00:00Z",
          feedback: "Looks good",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<EvaluationsPage />);

    expect(screen.getByText("eval-001")).toBeInTheDocument();
    expect(screen.getByText("trace-001")).toBeInTheDocument();
    expect(screen.getAllByText("quality-review")).toHaveLength(2);
  });
});
