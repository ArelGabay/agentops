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
- Mockups added as the visual source of truth

Not built yet:

- Span ingestion endpoints
- Evaluation ingestion endpoints
- SDK
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

Planned:

- Span ingestion API
- Evaluation storage

### Frontend

In progress:

- Dashboard page
- Traces list page
- Trace details page
- Evaluations page
- Settings page

### SDK

Planned:

- Lightweight Python SDK
- LangChain integration
- Trace start/end tracking
- Basic span tracking
- Latency measurement
- Error capture
- Telemetry submission to the backend API

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- lucide-react

Planned later:

- React Query
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

- [x] Repository initialized
- [x] Mockups added
- [x] Frontend app initialized
- [x] Frontend folder architecture defined
- [x] Main layout shell added
- [x] Placeholder frontend routes added
- [x] Reusable frontend UI components
- [x] Dashboard UI
- [x] Traces list UI
- [x] Trace details UI
- [x] Evaluations UI
- [x] Settings UI
- [x] Backend MVC foundation
- [x] Database schema
- [ ] Trace ingestion API
- [ ] Span ingestion API
- [ ] Evaluation storage
- [ ] Lightweight Python SDK
- [ ] Demo AI agent integration

## Next Milestone

The database foundation is complete. The next engineering milestone is the trace ingestion API:

- request/response schemas for trace creation
- repository methods for storing traces
- service logic for trace ingestion
- controller and route for `POST /traces`

The trace ingestion milestone should follow MVC boundaries: routes register endpoints, controllers manage request flow, services contain application logic, and repositories isolate database writes.

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
