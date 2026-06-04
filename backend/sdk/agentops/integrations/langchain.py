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
        self.run_names: dict[str, str] = {}
        self.run_parent_ids: dict[str, str | None] = {}
        self.root_run_ids: dict[str, str] = {}
        self.trace_ids: dict[str, str] = {}
        self.pending_span_payloads: dict[str, list[dict[str, Any]]] = {}

    def on_chain_start(
        self,
        serialized: dict[str, Any] | None,
        inputs: dict[str, Any],
        *,
        run_id: UUID,
        parent_run_id: UUID | None = None,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        parent_key = str(parent_run_id) if parent_run_id else None

        self.run_started_at[run_key] = utc_now()
        self.run_inputs[run_key] = inputs
        self.run_names[run_key] = self._run_name(serialized)
        self.run_parent_ids[run_key] = parent_key
        self.root_run_ids[run_key] = (
            self.root_run_ids.get(parent_key, parent_key) if parent_key else run_key
        )

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
        run_name = self.run_names.pop(run_key, "LangChain run")
        parent_key = self.run_parent_ids.pop(run_key, None)
        root_key = self.root_run_ids.pop(run_key, run_key)
        ended_at = utc_now()

        if parent_key is None:
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
            self._flush_pending_spans(run_key)
            return

        self._create_or_queue_span(
            root_key=root_key,
            payload={
                "name": run_name,
                "span_type": "chain",
                "status": "success",
                "input_text": str(inputs),
                "output_text": str(outputs),
                "latency_ms": latency_ms(started_at, ended_at),
                "started_at": to_iso(started_at),
                "ended_at": to_iso(ended_at),
            },
        )

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
        run_name = self.run_names.pop(run_key, "LangChain run")
        parent_key = self.run_parent_ids.pop(run_key, None)
        root_key = self.root_run_ids.pop(run_key, run_key)
        ended_at = utc_now()

        if parent_key is None:
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
            self._flush_pending_spans(run_key)
            return

        self._create_or_queue_span(
            root_key=root_key,
            payload={
                "name": run_name,
                "span_type": "chain",
                "status": "error",
                "input_text": str(inputs),
                "output_text": str(error),
                "latency_ms": latency_ms(started_at, ended_at),
                "started_at": to_iso(started_at),
                "ended_at": to_iso(ended_at),
            },
        )

    def _create_or_queue_span(
        self,
        root_key: str,
        payload: dict[str, Any],
    ) -> None:
        trace_id = self.trace_ids.get(root_key)

        if trace_id is None:
            self.pending_span_payloads.setdefault(root_key, []).append(payload)
            return

        self.client.create_span(trace_id=trace_id, **payload)

    def _flush_pending_spans(self, root_key: str) -> None:
        trace_id = self.trace_ids.get(root_key)

        if trace_id is None:
            return

        pending_payloads = self.pending_span_payloads.pop(root_key, [])

        for payload in pending_payloads:
            self.client.create_span(trace_id=trace_id, **payload)

    def _run_name(self, serialized: dict[str, Any] | None) -> str:
        if serialized is None:
            return "LangChain run"

        name = serialized.get("name")

        if isinstance(name, str) and name:
            return name

        serialized_id = serialized.get("id")

        if isinstance(serialized_id, list) and serialized_id:
            return str(serialized_id[-1])

        return "LangChain run"
