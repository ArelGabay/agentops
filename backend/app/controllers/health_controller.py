from app.schemas.health_schema import HealthResponse
from app.services.health_service import get_health_status


def health_check() -> HealthResponse:
    return get_health_status()