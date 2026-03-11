from celery import shared_task
from celery_provider import celery_provider
import time
from Loggers.base_logger import BaseLogger
from Models.Tenants.models import Tenants
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import select
from Services.redis_service import RedisService
from fastapi import Depends
from typing import Annotated
from Models.Events.models import Events
from Schemas.v1.events_schemas import EventPost

@celery_provider.task(name="handle_calculate_event", ignore_result=False)
def calculate_event_job(tenant_id: str, duration_to_complete: int=5):
  if duration_to_complete < 5:
    raise Exception("This takes at least 5 seconds to finish")
  BaseLogger.info("Starting Calculate Job")
  time.sleep(duration_to_complete)

  BaseLogger.info("Calculate Job Complete. Saving to DB...")
  return tenant_id

@celery_provider.task(name="handle_mcp_request_event", ignore_result=False)
def mcp_request_event_job(tenant_id: str, duration_to_complete: int=10):
  if duration_to_complete < 10:
    raise Exception("This takes at least 10 seconds to finish")
  BaseLogger.info("Starting mcp_request Job")
  time.sleep(duration_to_complete)
  BaseLogger.info("mcp_request Job Complete. Saving to DB...")
  return tenant_id


@celery_provider.task(name="handle_llm_request_event", ignore_result=False)
def llm_request_event_job(tenant_id: str, duration_to_complete: int=15):
  if duration_to_complete < 15:
    raise Exception("This takes at least 15 seconds to finish")

  BaseLogger.info("Starting llm_request Job")
  time.sleep(duration_to_complete)
  BaseLogger.info("llm_request Job Complete. Saving to DB...")
  return tenant_id

@shared_task(bind=True)
def save_event_to_db_and_update_user(self, event_data: dict):
  with SessionLocal() as db:
    try:
      BaseLogger.info("Updating User monthly quota usage and logging event.")

      event_data.pop("status", None)

      new_event = Events(**event_data, status="COMPLETE")

      BaseLogger.info("Logging new event...")
      
      db.add(new_event)
      db.commit()
      db.refresh(new_event)
      BaseLogger.info("Event save and monthly quota update Successful!")
      return {"status": "successful!"}
    except Exception as e:
      BaseLogger.warning("Updating and Save request failed.. Rolling back DB changes")
      db.rollback()
      if "unique constraint" in str(e).lower():
        BaseLogger.error("Duplicate event (Idempotency Key)")
      BaseLogger.exception(str(e))
      raise e