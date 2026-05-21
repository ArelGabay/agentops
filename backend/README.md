# AgentOps Backend

FastAPI backend foundation for the AgentOps observability platform.

## Local Setup

From the `backend/` directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
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
- `repositories/` will isolate database access later.
- `schemas/` define validation and response shapes.
- `models/` define SQLAlchemy database tables.
- `database/` contains SQLAlchemy engine, session, and base setup.
