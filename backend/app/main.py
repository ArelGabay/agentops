from fastapi import FastAPI

from app.routes.health_routes import router as health_router

app = FastAPI(
    title="AgentOps API",
    version="0.1.0",
    description="Backend API for the AgentOps observability platform.",
)

app.include_router(health_router)
