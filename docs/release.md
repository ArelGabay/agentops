# AgentOps V1 Local Demo Guide

AgentOps is a full-stack observability platform for AI agents.

It helps developers collect and inspect:

- traces
- spans
- latency
- token usage
- cost
- evaluation scores
- errors and execution status

The V1 demo runs locally and shows the full telemetry loop:

```txt
AI workflow runs -> SDK reports telemetry -> backend stores it -> frontend displays it
```

AgentOps does not run the AI agent itself. The user application runs the agent, and AgentOps observes what happened.

---

## Stable V1 Version

AgentOps V1 is intended to be available as a stable GitHub release.

After the V1 release is tagged, the safest way to review the exact V1 project is:

```bash
git clone https://github.com/ArelGabay/agentops.git
cd agentops
git checkout v1.0.0
```

You can also download the V1 source code from the GitHub Releases page:

```txt
https://github.com/ArelGabay/agentops/releases
```

This keeps the V1 demo stable even as new development continues on `main`.

---

## What Is Included In V1

This local demo includes:

- FastAPI backend with MVC structure
- PostgreSQL database through Docker Compose
- React + TypeScript frontend
- Dashboard with backend aggregation data
- Traces table with search and filters
- Trace details page with spans
- Evaluations page with real backend data
- Settings page with backend-backed capability state
- Lightweight Python SDK
- Optional LangChain callback integration
- Backend API tests
- GitHub Actions CI

---

## Prerequisites

Before running the project, install:

- Docker Desktop
- Python 3.13
- Node.js 20 or newer
- npm

---

## Quick Start

Use two terminals.

---

## Terminal 1: Backend

From the repository root:

```bash
docker compose up -d
cd backend
source .venv/bin/activate
python -m pip install -r requirements.txt
alembic upgrade head
python -m app.utils.seed_demo_data
uvicorn app.main:app --reload
```

Expected seed output:

```txt
Seeded demo data: 5 agents, 12 traces, 28 spans, 7 evaluations.
```

Backend URL:

```txt
http://127.0.0.1:8000
```

Optional backend check:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok","service":"agentops-api","version":"0.1.0"}
```

---

## Terminal 2: Frontend

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://127.0.0.1:5173
```

Open that URL in the browser.

---

## Pages To Review

After the backend and frontend are running, review these pages.

### Dashboard

```txt
http://127.0.0.1:5173/dashboard
```

The dashboard shows:

- total traces
- success rate
- average latency
- token usage
- total cost
- status breakdown
- top agents
- recent traces
- time-series charts

The dashboard data comes from:

```txt
GET /dashboard/summary
```

---

### Traces

```txt
http://127.0.0.1:5173/traces
```

The traces page shows:

- trace rows from the backend
- search
- filters
- status badges
- latency
- token usage
- cost
- start time
- links to trace details

---

### Trace Details

Open a seeded trace:

```txt
http://127.0.0.1:5173/traces/trace-demo-support-001
```

Useful seeded trace IDs:

```txt
trace-demo-support-001
trace-demo-code-001
trace-demo-data-001
```

The trace details page shows:

- trace status
- agent ID
- start time
- duration
- token usage
- cost
- spans table
- selected span details
- honest empty states for unsupported V1 data

---

### Evaluations

```txt
http://127.0.0.1:5173/evaluations
```

The evaluations page shows:

- evaluation rows from the backend
- average score
- pass rate
- fail rate
- hallucination rate
- evaluator name
- linked trace IDs
- result filtering

---

### Settings

```txt
http://127.0.0.1:5173/settings
```

The settings page shows:

- backend-backed platform state
- capability status
- workspace/environment summary
- unavailable V1 features clearly labeled as unavailable

---

## Optional SDK Demo

The SDK is how an application sends telemetry into AgentOps.

From the repository root:

```bash
cd backend
source .venv/bin/activate
pip install -e ./sdk
python sdk/demo.py
```

Expected output shape:

```txt
Created trace: <trace-id>
Created span: <span-id>
Created span: <span-id>
Created evaluation: <evaluation-id>
```

After running the SDK demo, refresh:

```txt
http://127.0.0.1:5173/traces
```

The new SDK-created telemetry should be available through the backend and visible in the product UI.

---

## Optional Verification Commands

Backend checks:

```bash
cd backend
source .venv/bin/activate
python -m compileall app sdk tests
pytest
```

Frontend checks:

```bash
cd frontend
npm run build
npm run lint
```

Expected backend test result:

```txt
8 passed
```

---

## API Endpoints Used By The Demo

Important V1 endpoints:

```txt
GET  /health
GET  /dashboard/summary
GET  /traces
GET  /traces/{trace_id}
POST /traces
POST /spans
GET  /evaluations
POST /evaluations
GET  /settings/summary
```

---

## Known V1 Scope

AgentOps V1 intentionally does not include:

- authentication
- hosted production deployment
- user/project isolation
- editable settings persistence
- billing
- RBAC
- OpenTelemetry support
- SDK batching or offline queueing
- advanced alerting
- advanced evaluation analytics

These are future roadmap items. V1 is focused on the core observability loop: ingest telemetry, store it, and make it visible in the UI.
