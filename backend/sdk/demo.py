from agentops import AgentOpsClient, SpanTracker
from agentops.utils import latency_ms, to_iso, utc_now


def main() -> None:
    client = AgentOpsClient()

    question = "Where is my order?"
    trace_started_at = utc_now()

    answer = "Your order has been delivered."

    trace_ended_at = utc_now()
    trace = client.create_trace(
        agent_id="agent-demo-1",
        status="success",
        input_text=question,
        output_text=answer,
        latency_ms=latency_ms(trace_started_at, trace_ended_at),
        total_tokens=2341,
        total_cost=0.081,
        started_at=to_iso(trace_started_at),
        ended_at=to_iso(trace_ended_at),
    )

    print(f"Created trace: {trace['id']}")

    with SpanTracker(
        client,
        trace_id=trace["id"],
        name="LLM Call",
        span_type="llm",
        input_text=question,
    ) as span:
        span.set_output(answer)

    print(f"Created span: {span.id}")


if __name__ == "__main__":
    main()