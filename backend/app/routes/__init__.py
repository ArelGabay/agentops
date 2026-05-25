from app.routes.health_routes import router as health_router
from app.routes.evaluation_routes import router as evaluation_router
from app.routes.span_routes import router as span_router
from app.routes.trace_routes import router as trace_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.settings_routes import router as settings_router

__all__ = [
    "health_router",
    "evaluation_router",
    "span_router",
    "trace_router",
    "dashboard_router",
    "settings_router",
]
