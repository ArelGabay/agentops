from fastapi import APIRouter

from app.controllers.health_controller import health_check
from app.schemas.health_schema import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return health_check()