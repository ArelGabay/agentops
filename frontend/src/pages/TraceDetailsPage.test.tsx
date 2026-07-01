import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { TraceDetailsPage } from "./TraceDetailsPage";
import { renderWithRoute } from "../tests/render";

const mockUseTraceDetail = vi.fn();

vi.mock("../hooks", () => ({
  useTraceDetail: (...args: unknown[]) => mockUseTraceDetail(...args),
}));

describe("TraceDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderTraceDetailsPage() {
    return renderWithRoute(<TraceDetailsPage />, {
      path: "/traces/:traceId",
      route: "/traces/trace-001",
    });
  }

  it("shows a loading state while trace details are loading", () => {
    mockUseTraceDetail.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderTraceDetailsPage();

    expect(screen.getByText("Loading trace details...")).toBeInTheDocument();
  });

  it("shows an error state when trace details fail to load", () => {
    mockUseTraceDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderTraceDetailsPage();

    expect(screen.getByText("Trace details unavailable.")).toBeInTheDocument();
  });

  it("shows empty states when spans and evaluations are missing", () => {
    mockUseTraceDetail.mockReturnValue({
      data: {
        id: "trace-001",
        agent_id: "agent-support",
        status: "success",
        started_at: "2026-07-01T10:00:00Z",
        ended_at: "2026-07-01T10:00:01Z",
        created_at: "2026-07-01T10:00:00Z",
        latency_ms: 1200,
        total_tokens: 900,
        total_cost: "0.04",
        input_text: null,
        output_text: null,
        spans: [],
        evaluations: [],
      },
      isLoading: false,
      isError: false,
    });

    renderTraceDetailsPage();

    expect(
      screen.getByText("No spans found for this trace."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Evaluations" }));

    expect(
      screen.getByText("No evaluations found for this trace."),
    ).toBeInTheDocument();
  });

  it("switches main tabs and shows trace input/output content", () => {
    mockUseTraceDetail.mockReturnValue({
      data: {
        id: "trace-001",
        agent_id: "agent-support",
        status: "success",
        started_at: "2026-07-01T10:00:00Z",
        ended_at: "2026-07-01T10:00:01Z",
        created_at: "2026-07-01T10:00:00Z",
        latency_ms: 1200,
        total_tokens: 900,
        total_cost: "0.04",
        input_text: "User asked for shipping help",
        output_text: "Agent provided the shipping answer",
        spans: [
          {
            id: "span-001",
            trace_id: "trace-001",
            name: "Retrieve order",
            span_type: "tool",
            status: "success",
            started_at: "2026-07-01T10:00:01Z",
            ended_at: "2026-07-01T10:00:02Z",
            created_at: "2026-07-01T10:00:01Z",
            latency_ms: 300,
            input_text: "order lookup input",
            output_text: "order lookup output",
          },
        ],
        evaluations: [],
      },
      isLoading: false,
      isError: false,
    });

    renderTraceDetailsPage();

    fireEvent.click(screen.getAllByRole("tab", { name: "Input" })[0]);
    expect(
      screen.getByText("User asked for shipping help"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("tab", { name: "Output" })[0]);
    expect(
      screen.getByText("Agent provided the shipping answer"),
    ).toBeInTheDocument();
  });

  it("selects a span and switches sidebar tabs", () => {
    mockUseTraceDetail.mockReturnValue({
      data: {
        id: "trace-001",
        agent_id: "agent-support",
        status: "success",
        started_at: "2026-07-01T10:00:00Z",
        ended_at: "2026-07-01T10:00:01Z",
        created_at: "2026-07-01T10:00:00Z",
        latency_ms: 1200,
        total_tokens: 900,
        total_cost: "0.04",
        input_text: "User asked for shipping help",
        output_text: "Agent provided the shipping answer",
        spans: [
          {
            id: "span-001",
            trace_id: "trace-001",
            name: "Retrieve order",
            span_type: "tool",
            status: "success",
            started_at: "2026-07-01T10:00:01Z",
            ended_at: "2026-07-01T10:00:02Z",
            created_at: "2026-07-01T10:00:01Z",
            latency_ms: 300,
            input_text: "order lookup input",
            output_text: "order lookup output",
          },
        ],
        evaluations: [],
      },
      isLoading: false,
      isError: false,
    });

    renderTraceDetailsPage();

    fireEvent.click(screen.getByRole("tab", { name: "Spans" }));
    fireEvent.click(screen.getByRole("button", { name: /Retrieve order/i }));

    fireEvent.click(screen.getAllByRole("tab", { name: "Input" })[1]);
    expect(screen.getByText("order lookup input")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("tab", { name: "Output" })[1]);
    expect(screen.getByText("order lookup output")).toBeInTheDocument();
  });
});
