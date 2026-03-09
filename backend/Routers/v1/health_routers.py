from fastapi import APIRouter, status
from Services.redis_service import RedisService
from Services.db_health_service import is_ready_to_connect
from contextlib import asynccontextmanager

router = APIRouter()

@router.get("/health")
def health():

  pass

@router.get("/ready", status_code=status.HTTP_200_OK)
@asynccontextmanager
async def ready():
  redis_ready = await RedisService().redis_ready()
  db_ready = await is_ready_to_connect()

  if db_ready and redis_ready:
    return {message: "Application is ready"}
  pass