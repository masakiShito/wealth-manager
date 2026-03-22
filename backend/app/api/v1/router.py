from fastapi import APIRouter

from app.api.v1 import auth, assets, cashflows, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(assets.router, tags=["assets"])
api_router.include_router(cashflows.router, tags=["cashflows"])
