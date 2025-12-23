from fastapi import APIRouter
from app.api.endpoints import flights

api_router = APIRouter()

api_router.include_router(flights.router, prefix="/flights", tags=["flights"])
