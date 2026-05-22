from agentops import AgentOpsClient, SpanTracker
from agentops.utils import latency_ms, to_iso, utc_now


def retrieve_order(question: str) -> str:
    return "Order #A1001 status: delivered"


def generate_answer(question: str, order_context: str) -> str:
    return "Your order has been delivered."


def evaluate_answer(answer: str) -> dict[str, object]:
    if "delivered" in answer.lower():
        return {
            "score": 95,
            "result": "pass",
            "hallucination_score": 3,
            "feedback": "Demo answer matched the expected delivery status.",
        }

    return {
        "score": 60,
        "result": "fail",
        "hallucination_score": 40,
        "feedback": "Demo answer did not match the expected delivery status.",
    }


def main() -> None:
    client = AgentOpsClient()

    question = "Where is my order?"
    trace_started_at = utc_now()

    order_context = retrieve_order(question)
    answer = generate_answer(question, order_context)

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
        name="Retrieve Order",
        span_type="tool",
        input_text=question,
    ) as span:
        span.set_output(order_context)

    print(f"Created span: {span.id}")

    with SpanTracker(
        client,
        trace_id=trace["id"],
        name="Generate Answer",
        span_type="llm",
        input_text=order_context,
    ) as span:
        span.set_output(answer)

    print(f"Created span: {span.id}")

    evaluation = evaluate_answer(answer)
    created_evaluation = client.create_evaluation(
        trace_id=trace["id"],
        evaluator_name="Demo Rule Evaluator",
        **evaluation,
    )

    print(f"Created evaluation: {created_evaluation['id']}")


if __name__ == "__main__":
    main()