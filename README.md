# AgentOps

AgentOps is a full-stack AI agent observability platform for monitoring, tracing, debugging, and evaluating AI agent workflows.

The goal of the project is to help developers understand how their agents behave in production-like environments by collecting traces, spans, prompts, responses, latency, token usage, tool calls, errors, evaluation scores, and execution metadata.

This is a portfolio-grade engineering project focused on clean architecture, modern product design, and practical AI infrastructure concepts.

## Current Status

AgentOps is in the early foundation stage.

Completed:

- Repository structure initialized
- Frontend app initialized with React, TypeScript, Vite, and Tailwind CSS
- Frontend routing foundation added
- Shared `MainLayout` shell added
- Sidebar navigation added
- Placeholder pages added for Dashboard, Traces, Trace Details, Evaluations, and Settings
- First reusable frontend UI primitives added
- Backend MVC foundation added with FastAPI health check
- PostgreSQL database foundation added with Docker Compose, SQLAlchemy models, and Alembic migrations
- Trace ingestion API added with MVC flow and PostgreSQL persistence
- Span ingestion API added with MVC flow and PostgreSQL persistence
- Evaluation ingestion API added with score validation and PostgreSQL persistence
- Lightweight local Python SDK foundation added with trace/span submission demo
- Demo AI agent workflow added for trace, span, and evaluation telemetry
- Frontend typed API services and React Query data hooks added
- Mockups added as the visual source of truth

Not built yet:

- Packaged SDK distribution
- LangChain integration
- Real dashboard data
- Authentication
- Production deployment

## Product Vision

AgentOps will provide a dashboard for AI agent observability, including:

- Agent performance monitoring
- Trace timelines
- Span inspection
- Prompt and response debugging
- Tool call visibility
- Latency and token analytics
- Error tracking
- Evaluation score tracking
- Execution metadata analysis

The product direction is dark-mode-first, SaaS-like, and inspired by tools such as Datadog, Grafana, Linear, Vercel, and Stripe dashboards.

## MVP Scope

### Backend

- FastAPI backend
- MVC-style architecture
- Health check endpoint
- PostgreSQL database
- SQLAlchemy models
- Alembic migrations
- Trace ingestion API
- Span ingestion API
- Evaluation ingestion API

### Frontend

In progress:

- Dashboard page
- Traces list page
- Trace details page
- Evaluations page
- Settings page

### SDK

Foundation complete:

- Lightweight Python SDK
- Trace start/end tracking
- Basic span tracking
- Latency measurement
- Telemetry submission to the backend API
- Local demo script

Planned:

- LangChain integration
- Error capture improvements
- Packaged installation flow

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- lucide-react

Planned later:

- Recharts

### Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic

### Development

- Docker Compose
- GitHub Actions

## Repository Structure

```txt
agentops/
  backend/       FastAPI backend
  docs/          planned architecture and database documentation
  frontend/      React TypeScript frontend
  mockups/       UI reference screenshots
  AGENTS.md      project instructions and architecture rules
  README.md      project documentation
  LICENSE
```

Backend structure:

```txt
backend/
  app/
    main.py       FastAPI application entrypoint
    routes/       endpoint registration
    controllers/  request/response flow
    services/     application logic
    repositories/ future persistence access
    schemas/      validation and response shapes
    models/       future database entities
    config/       app configuration
    database/     SQLAlchemy database setup
    middleware/   future middleware
    utils/        shared backend helpers
```

Frontend structure:

```txt
frontend/
  src/
    app/          routing and app providers
    layouts/      shared page shells
    pages/        route-level views
    components/   reusable UI and layout components
    hooks/        reusable frontend logic
    services/     API communication
    store/        future client state helpers
    types/        shared TypeScript types
    utils/        formatting and frontend helpers
    styles/       shared style assets
```

## Frontend Setup

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The local frontend dev server runs at:

```txt
http://127.0.0.1:5173/
```

Useful frontend commands:

```bash
npm run dev
npm run build
npm run lint
```

## Backend Setup

From the repository root:

```bash
docker compose up -d
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

The local backend API runs at:

```txt
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok","service":"agentops-api","version":"0.1.0"}
```

Create a trace:

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

For local testing, the `agent_id` must already exist in the `agents` table.

Create a span:

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

For local testing, the `trace_id` must already exist in the `traces` table.

Create an evaluation:

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

For local testing, the `trace_id` must already exist in the `traces` table. Evaluation `score` and `hallucination_score` use a `0-100` scale.

Database:

```txt
DATABASE_URL=postgresql+psycopg://agentops:agentops@localhost:5432/agentops
```

Current database tables:

- `agents`
- `traces`
- `spans`
- `evaluations`
- `tool_calls`

## SDK Demo

The local SDK foundation lives under `backend/sdk/agentops`.

It is not packaged for `pip install` yet. Run it locally with `PYTHONPATH=sdk` from the `backend/` directory.

Before running the demo, make sure PostgreSQL and the backend API are running, and that `agent-demo-1` exists in the `agents` table.

```bash
cd backend
source .venv/bin/activate
PYTHONPATH=sdk python sdk/demo.py
```

The demo simulates a customer-support agent workflow with an order lookup step, answer generation step, and rule-based evaluation.

Expected output:

```txt
Created trace: <trace-id>
Created span: <span-id>
Created span: <span-id>
Created evaluation: <evaluation-id>
```

## Architecture Principles

AgentOps is designed to use MVC architecture on the backend.

Backend responsibilities will be separated as:

- Routes register endpoints and connect requests to controllers
- Controllers manage request and response flow
- Services contain application and business logic
- Repositories isolate persistence and database access
- Models define database entities
- Schemas define validation and serialization

Frontend responsibilities are separated as:

- Pages compose route-level views
- Layouts define shared application shells
- Components handle reusable presentation UI
- Hooks contain reusable frontend logic
- Services handle API communication
- Types define shared TypeScript contracts

The project favors simple, readable, beginner-friendly architecture that can scale without becoming over-engineered.

## Mockups

The `mockups/` folder contains the visual reference screenshots for the frontend.

Current mockups include:

- Dashboard
- Trace list
- Trace details
- Evaluations
- Settings
- Reusable UI components

These mockups are the primary design reference for layout, spacing, component patterns, and dark-mode SaaS styling.

## MVP Progress

- [x] Mockups added
- [x] Frontend foundation
- [x] Static frontend page UIs
- [x] Reusable frontend UI components
- [x] Backend MVC foundation
- [x] Database schema
- [x] Trace ingestion API
- [x] Span ingestion API
- [x] Evaluation storage
- [x] Lightweight Python SDK
- [x] Demo AI agent integration
- [x] Backend read APIs
- [x] Frontend API services
- [x] React Query data wiring
- [x] Dashboard real metrics
- [x] Trace details real data
- [x] Traces list real data
- [ ] Evaluations real data
- [ ] Dashboard aggregation and time-series metrics
- [ ] SDK packaging and LangChain integration

## Next Milestone

Traces list real data is complete. The next engineering milestone is Evaluations real data:

- load evaluations from `GET /evaluations`
- replace static evaluations page metrics and rows with React Query data
- keep the existing evaluations visual design and layout
- add loading, error, and empty states for the evaluations route

Evaluations data wiring should use the typed service and hook layers instead of adding fetch logic inside page components.

After evaluations, the planned frontend data milestone is:

- Dashboard aggregation and time-series metrics

## Project Philosophy

AgentOps is intentionally scoped as a polished V1 product, not an enterprise observability platform.

V1 should avoid:

- Microservices
- Kafka
- Kubernetes
- Advanced RBAC
- Billing
- OpenTelemetry integration
- Distributed tracing
- Multi-framework SDK support

The priority is to demonstrate strong full-stack fundamentals, clean architecture, thoughtful product design, and practical understanding of AI agent observability.
