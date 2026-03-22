from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/health")
def api_health_check():
    return {"status": "ok", "version": "v1"}
