# AgentOps

AgentOps is a full-stack AI agent observability platform for monitoring, tracing, debugging, and evaluating AI agent workflows.

The goal of the project is to help developers understand how their agents behave in production-like environments by collecting traces, spans, prompts, responses, latency, token usage, tool calls, errors, evaluation scores, and execution metadata.

This is a portfolio-grade engineering project focused on clean architecture, modern product design, and practical AI infrastructure concepts.

## Current Status

AgentOps is a working V1 observability product foundation.

Completed:

- FastAPI backend with MVC-style route, controller, service, repository, schema, and model layers
- PostgreSQL persistence for agents, traces, spans, evaluations, and tool calls
- Trace, span, evaluation, list, detail, and dashboard summary API endpoints
- React dashboard, traces list, trace details, evaluations, and settings pages
- Typed frontend API services and React Query hooks for backend-backed data
- Dashboard aggregation endpoint with summary metrics, status counts, top agents, recent traces, and time-series data
- Local editable Python SDK package with trace/span helpers and optional LangChain callback integration
- Real screenshots and mockups for portfolio presentation

Not built yet:

- Authentication and user/project isolation
- Production deployment
- Automated CI checks
- Advanced SDK behavior such as batching, retries, OpenTelemetry, or multi-framework integrations

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

## Product Screenshots

These screenshots are captured from the current running app with backend-backed data.

| Dashboard | Traces |
| --- | --- |
| ![AgentOps dashboard showing trace metrics, charts, status counts, and top agents](docs/screenshots/dashboard.png) | ![AgentOps traces table showing real trace rows, filters, status, latency, and costs](docs/screenshots/traces.png) |

| Trace Details | Evaluations |
| --- | --- |
| ![AgentOps trace details page showing a real trace, timeline area, spans, evaluations, and honest empty states](docs/screenshots/trace-details.png) | ![AgentOps evaluations page showing real evaluation metrics and honest unsupported analytics empty states](docs/screenshots/evaluations.png) |

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
- Trace list and trace detail APIs
- Evaluation list API
- Dashboard summary aggregation API

### Frontend

- Dashboard page
- Traces list page
- Trace details page
- Evaluations page
- Settings page
- Real backend data wiring for dashboard, traces, trace details, and evaluations
- Honest loading, error, empty, and unsupported-data states

### SDK

- Lightweight Python SDK
- Editable local install with `pip install -e ./sdk`
- Trace start/end tracking
- Basic span tracking
- Latency measurement
- Telemetry submission to the backend API
- Local demo script
- Optional LangChain callback integration

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- lucide-react

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
    repositories/ persistence access
    schemas/      validation and response shapes
    models/       database entities
    config/       app configuration
    database/     SQLAlchemy database setup
    middleware/   future middleware
    utils/        shared backend helpers
  sdk/            local Python SDK package and examples
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

Useful read endpoints:

```txt
GET /dashboard/summary
GET /settings/summary
GET /traces?limit=100
GET /traces/{trace_id}
GET /evaluations?limit=100
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

## Demo Data

Seed realistic local demo data from the `backend/` directory:

```bash
cd backend
source .venv/bin/activate
python -m app.utils.seed_demo_data
```

The command resets only known demo rows and recreates demo agents, traces, spans, and evaluations for dashboards, trace details, and screenshots.

Expected output:

```txt
Seeded demo data: 5 agents, 12 traces, 28 spans, 7 evaluations.
```

## SDK Demo

The local SDK lives under `backend/sdk/agentops`.

Install it locally in editable mode from the `backend/` directory:

```bash
cd backend
source .venv/bin/activate
pip install -e ./sdk
```

Before running the SDK demo, make sure PostgreSQL and the backend API are running. Use the demo seed command first if `agent-demo-1` does not exist yet.

```bash
cd backend
source .venv/bin/activate
python sdk/demo.py
```

The demo simulates a customer-support agent workflow with an order lookup step, answer generation step, and rule-based evaluation.

Expected output:

```txt
Created trace: <trace-id>
Created span: <span-id>
Created span: <span-id>
Created evaluation: <evaluation-id>
```

The SDK also includes an optional LangChain callback integration under `agentops.integrations.langchain`. LangChain is not installed by default; install it separately in the application that uses it. The V1 callback is intentionally lightweight and reports LangChain run events to the backend without adding batching, retries, OpenTelemetry, or automatic global instrumentation.

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

- [x] SDK packaging and LangChain integration
- [x] Documentation, screenshots, and portfolio polish
- [x] Settings page real configuration states
- [x] Trace detail span selection and richer span drawer
- [x] SDK single-trace LangChain run grouping
- [x] Better backend error handling for missing foreign keys
- [x] Demo seed command for agents, traces, spans, and evaluations
- [x] Frontend loading and empty-state polish pass
- [x] API tests for ingestion and dashboard summary
- [x] GitHub Actions build and lint workflow
- [ ] V1 release checklist and demo script
- [ ] Production deployment notes and environment guide
- [ ] Settings persistence and editable workspace preferences
- [ ] Trace detail tabs for input, output, and attributes
- [ ] SDK error reporting and developer-friendly ingestion failures
- [ ] Backend ingestion validation and status normalization
- [ ] Demo data reset safeguards and seed customization
- [ ] Frontend accessibility and keyboard navigation pass
- [ ] Test coverage expansion for frontend data states
- [ ] Portfolio case study write-up

## Next Milestone

GitHub Actions build and lint workflow is complete. The next engineering milestone is V1 release checklist and demo script:

- create a repeatable local demo flow from fresh setup to seeded data
- document the final V1 verification checklist
- prepare a concise walkthrough script for portfolio reviews

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
