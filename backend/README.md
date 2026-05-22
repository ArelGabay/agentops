# AgentOps Backend

FastAPI backend foundation for the AgentOps observability platform.

## Local Setup

From the `backend/` directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

The API runs at:

```txt
http://127.0.0.1:8000
```

## Health Check

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok","service":"agentops-api","version":"0.1.0"}
```

## Trace Ingestion

Create a trace with `POST /traces`.

The request must reference an existing `agent_id` from the `agents` table.

```bash
curl -X POST http://127.0.0.1:8000/traces \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent-demo-1",
    "status": "success",
    "input_text": "Where is my order?",
    "output_text": "Your order has been delivered.",
    "latency_ms": 1420,
    "total_tokens": 2341,
    "total_cost": 0.081,
    "started_at": "2026-05-21T12:00:00Z",
    "ended_at": "2026-05-21T12:00:01Z"
  }'
```

The response returns the created trace, including its generated `id` and `created_at` timestamp.

## Span Ingestion

Create a span with `POST /spans`.

The request must reference an existing `trace_id` from the `traces` table.

```bash
curl -X POST http://127.0.0.1:8000/spans \
  -H "Content-Type: application/json" \
  -d '{
    "trace_id": "existing-trace-id",
    "name": "LLM Call",
    "span_type": "llm",
    "status": "success",
    "input_text": "Where is my order?",
    "output_text": "Your order has been delivered.",
    "latency_ms": 980,
    "started_at": "2026-05-21T12:00:00Z",
    "ended_at": "2026-05-21T12:00:01Z"
  }'
```

The response returns the created span, including its generated `id` and `created_at` timestamp.

## Evaluation Ingestion

Create an evaluation with `POST /evaluations`.

The request must reference an existing `trace_id` from the `traces` table. Evaluation `score` and `hallucination_score` use a `0-100` scale; values outside that range are rejected by schema validation.

```bash
curl -X POST http://127.0.0.1:8000/evaluations \
  -H "Content-Type: application/json" \
  -d '{
    "trace_id": "existing-trace-id",
    "evaluator_name": "Answer Quality",
    "score": 92.5,
    "result": "pass",
    "hallucination_score": 4.0,
    "feedback": "Answer was accurate and grounded."
  }'
```

The response returns the created evaluation, including its generated `id` and `created_at` timestamp.

## SDK Demo

The local Python SDK foundation lives under `sdk/agentops`.

It currently supports:

- `AgentOpsClient` for `POST /traces` and `POST /spans`
- `SpanTracker` and `TraceTracker` timing helpers
- a local demo script that creates one trace and one span

Before running the demo, make sure PostgreSQL and the FastAPI backend are running, and that `agent-demo-1` exists in the `agents` table.

From the `backend/` directory:

```bash
PYTHONPATH=sdk python sdk/demo.py
```

Expected output:

```txt
Created trace: <trace-id>
Created span: <span-id>
```

The SDK is local-only for now and is not packaged for `pip install` yet.

## Database Setup

From the repository root:

```bash
docker compose up -d
docker compose ps
```

The local PostgreSQL database uses:

```txt
DATABASE_URL=postgresql+psycopg://agentops:agentops@localhost:5432/agentops
```

Local database values:

- database: `agentops`
- user: `agentops`
- password: `agentops`
- port: `5432`

## Migrations

From the `backend/` directory with the virtual environment active:

```bash
alembic upgrade head
```

Current schema tables:

- `agents`
- `traces`
- `spans`
- `evaluations`
- `tool_calls`

## Architecture

The backend follows the MVC rules from `AGENTS.md`:

- `routes/` registers endpoints and calls controllers.
- `controllers/` handle request/response flow.
- `services/` contain application logic.
- `repositories/` isolate database access.
- `schemas/` define validation and response shapes.
- `models/` define SQLAlchemy database tables.
- `database/` contains SQLAlchemy engine, session, and base setup.
