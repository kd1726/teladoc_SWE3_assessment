from Models.Tenants.models import Tenants
from Models.Events.models import Events
from Schemas.v1.events_schemas import EventPost
from fastapi import HTTPException, status
from datetime import datetime
from .redis_service import RedisService
from celery.result import AsyncResult
from Tasks.tasks import *
from celery import chain
from celery_provider import celery_provider
from Loggers.base_logger import BaseLogger
from ipdb import set_trace

class EventService:
  def __init__(self, user: Tenants, event_data: EventPost):
    self.user = user

    self.event_data = event_data

    self.event_data["status"] = "PENDING"

    self.redis_client = RedisService()
    
    self.idempotency_key = event_data.get("idempotency_key")

    if not self.idempotency_key:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Idempotency key not submitted")

  def no_more_quota(self):
    if self.user.allow_overage:
      return True
    return (self.user.month_to_date_usage + self.event_data.get("token_cost")) > self.user.monthly_quota
  
  def event_is_pending(self):
    response = celery_provider.AsyncResult(self.idempotency_key)
    
    if response.state in ['SUCCESS', 'FAILURE', 'REVOKED']:
        return False
        
    if response.state == 'STARTED':
        return True
    return response.result is not None

  def event_is_complete(self):
    response = celery_provider.AsyncResult(self.idempotency_key)
    if response.state in ['SUCCESS', 'FAILURE', 'REVOKED']:
        return True
    return response.result is None
  
  def event_exists(self):
    try:
      logged_event = db.execute(select(Events).where(Events.idempotency_key == self.idempotency_key)).scalars().first()
      if logged_event:
        return logged_event
      return False
    except Exception:
      return False

  def call(self) -> EventPost:
    response_data = {}
    match self.event_data.get("prompt_type"):
      case "CALCULATE":
        response_data = self.__handle_calcaulte_event()

      case "MCP_REQUEST":
        response_data = self.__handle_mcp_request_event()

      case "LLM_REQUEST":
        response_data = self.__handle_llm_request_event()
      case _:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Unsupported prompt type")
    return response_data

  def __handle_calcaulte_event(self) -> EventPost:
    try:
      duration_to_complete = 5
      self.redis_client.create_entry(self.idempotency_key, self.event_data)
      task_job = calculate_event_job.s(self.user.tenant_id, duration_to_complete)
      self.__task_chainer(task_job).apply_async(task_id=self.idempotency_key)
      return self.event_data
    except Exception as e:
      self.redis_client.delete_entry(self.idempotency_key)
      BaseLogger.exception(str(e))
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

  def __handle_mcp_request_event(self) -> EventPost:
    try:
      duration_to_complete = 10
      self.redis_client.create_entry(self.idempotency_key, self.event_data)
      task_job = mcp_request_event_job.s(self.user.tenant_id, duration_to_complete)
      result = self.__task_chainer(task_job).apply_async(task_id=self.idempotency_key)
      print(f"Backend type: {type(result.backend)}")
      return self.event_data
    except Exception as e:
      self.redis_client.delete_entry(self.idempotency_key)
      BaseLogger.exception(str(e))
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

  def __handle_llm_request_event(self) -> EventPost:
    try:
      duration_to_complete = 15
      self.redis_client.create_entry(self.idempotency_key, self.event_data)
      task_job = llm_request_event_job.s(self.user.tenant_id, duration_to_complete)
      self.__task_chainer(task_job).apply_async(task_id=self.idempotency_key)
      return self.event_data
    except Exception as e:
      self.redis_client.delete_entry(self.idempotency_key)
      BaseLogger.exception(str(e))
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

  def __task_chainer(self, func):
    chainer = chain(
      func, 
      save_event_to_db_and_update_user.si(self.event_data)
      )
    return chainer