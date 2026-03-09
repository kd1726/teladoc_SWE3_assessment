from database import engine
from contextlib import asynccontextmanager
from fastapi import FastAPI
from Loggers.db_health_service_logger import DbHealthServiceLogger
import time

@asynccontextmanager
async def is_ready_to_connect(app: FastAPI):
  logger = DbHealthServiceLogger()
  logger.info("Checkinging postgres conenection")
  retries = 5

  while retries > 0:
    if retries < 5:
      logger.info("Attempting connection again.")
    try:
      with engine.connect() as conenection:
        logger.info("Postgresql is ready to connect!")
        return true
    except Exception:
      prev_retry = retries
      retries-1
      logger.error(f"Connection failed.. {retries} left...")
      time.sleep(2*2**prev_retry-retries)
  
  if retries==0:
    logger.critical("Could not connect to DB")
    raise Exception("Could not connect to DB")