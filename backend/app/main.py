from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    dashboard_router,
    health_router,
    evaluation_router,
    span_router,
    trace_router,
    settings_router,
)

app = FastAPI(
    title="AgentOps API",
    version="0.1.0",
    description="Backend API for the AgentOps observability platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(dashboard_router)
app.include_router(trace_router)
app.include_router(span_router)
app.include_router(evaluation_router)
app.include_router(settings_router)
