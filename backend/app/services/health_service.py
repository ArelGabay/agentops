from app.schemas.health_schema import HealthResponse


def get_health_status() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="agentops-api",
        version="0.1.0",
    )
