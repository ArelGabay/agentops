from app.routes.health_routes import router as health_router
from app.routes.trace_routes import router as trace_router

__all__ = ["health_router", "trace_router"]
