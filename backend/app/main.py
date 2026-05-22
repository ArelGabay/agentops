from fastapi import FastAPI

from app.routes import health_router, evaluation_router, span_router, trace_router

app = FastAPI(
    title="AgentOps API",
    version="0.1.0",
    description="Backend API for the AgentOps observability platform.",
)

app.include_router(health_router)
app.include_router(trace_router)
app.include_router(span_router)
app.include_router(evaluation_router)
