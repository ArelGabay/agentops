# AgentOps Backend

FastAPI backend foundation for the AgentOps observability platform.

## Local Setup

From the `backend/` directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
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

## Architecture

The backend follows the MVC rules from `AGENTS.md`:

- `routes/` registers endpoints and calls controllers.
- `controllers/` handle request/response flow.
- `services/` contain application logic.
- `repositories/` will isolate database access later.
- `schemas/` define validation and response shapes.
