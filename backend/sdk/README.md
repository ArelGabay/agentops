# AgentOps SDK

Lightweight local Python SDK for sending traces, spans, and evaluations to the AgentOps backend.

## Local Development Install

From `backend/sdk`:

```bash
pip install -e .
```

This installs the SDK in editable mode, so changes inside `backend/sdk/agentops` are available immediately without reinstalling.

## Basic Usage

```python
from agentops import AgentOpsClient, TraceTracker

client = AgentOpsClient(base_url="http://127.0.0.1:8000")

with TraceTracker(
    client=client,
    agent_id="agent-demo-1",
    input_text="Where is my order?",
) as trace:
    trace.set_output("Your order is out for delivery.")

print(trace.id)
```

## Error Handling

The SDK raises AgentOps-specific exceptions when ingestion fails.

```python
from agentops import AgentOpsAPIError, AgentOpsClient, TraceTracker

client = AgentOpsClient(base_url="http://127.0.0.1:8000")

try:
    with TraceTracker(
        client=client,
        agent_id="missing-agent",
        input_text="Where is my order?",
    ) as trace:
        trace.set_output("Your order is out for delivery.")
except AgentOpsAPIError as error:
    print(error)
    print(error.status_code)
    print(error.path)
    print(error.detail)
```

Example output:

```txt
POST /traces failed with 404: Agent not found
```

Use `AgentOpsRequestError` for connectivity problems such as:

- backend not running
- wrong `base_url`
- request timeout or connection failure

## LangChain Callback

LangChain support is optional. Install LangChain separately in the application that uses it.

```python
from agentops import AgentOpsClient
from agentops.integrations.langchain import AgentOpsLangChainCallbackHandler

client = AgentOpsClient(base_url="http://127.0.0.1:8000")
callback = AgentOpsLangChainCallbackHandler(
    client=client,
    agent_id="agent-demo-1",
)

response = chain.invoke(
    {"question": "Where is my order?"},
    config={"callbacks": [callback]},
)
```

If LangChain is not installed, the callback raises a clear `ImportError` explaining that LangChain must be installed separately.

## Scope

The SDK observes and reports telemetry. It does not run agents, orchestrate workflows, retry failed requests, batch events, or replace an AI framework.
