from __future__ import annotations

from typing import Any
from uuid import UUID

from agentops.client import AgentOpsClient
from agentops.utils import latency_ms, to_iso, utc_now

try:
    from langchain_core.callbacks import BaseCallbackHandler
except ImportError:
    BaseCallbackHandler = object  # type: ignore[misc,assignment]


class AgentOpsLangChainCallbackHandler(BaseCallbackHandler):
    def __init__(
        self,
        client: AgentOpsClient,
        agent_id: str,
    ) -> None:
        if BaseCallbackHandler is object:
            raise ImportError(
                "LangChain is not installed. Install LangChain separately to use "
                "AgentOpsLangChainCallbackHandler."
            )

        self.client = client
        self.agent_id = agent_id
        self.run_started_at: dict[str, Any] = {}
        self.run_inputs: dict[str, Any] = {}
        self.trace_ids: dict[str, str] = {}

    def on_chain_start(
        self,
        serialized: dict[str, Any],
        inputs: dict[str, Any],
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        self.run_started_at[run_key] = utc_now()
        self.run_inputs[run_key] = inputs

    def on_chain_end(
        self,
        outputs: dict[str, Any],
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        started_at = self.run_started_at.pop(run_key, utc_now())
        inputs = self.run_inputs.pop(run_key, {})
        ended_at = utc_now()

        trace = self.client.create_trace(
            agent_id=self.agent_id,
            status="success",
            input_text=str(inputs),
            output_text=str(outputs),
            latency_ms=latency_ms(started_at, ended_at),
            started_at=to_iso(started_at),
            ended_at=to_iso(ended_at),
        )

        self.trace_ids[run_key] = str(trace["id"])


    def on_chain_error(
        self,
        error: BaseException,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        started_at = self.run_started_at.pop(run_key, utc_now())
        inputs = self.run_inputs.pop(run_key, {})
        ended_at = utc_now()

        trace = self.client.create_trace(
            agent_id=self.agent_id,
            status="error",
            input_text=str(inputs),
            output_text=str(error),
            latency_ms=latency_ms(started_at, ended_at),
            started_at=to_iso(started_at),
            ended_at=to_iso(ended_at),
        )

        self.trace_ids[run_key] = str(trace["id"])
