from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
from Models.Events.models import Events
from Models.Tenants.models import Tenants
from Schemas.v1.events_schemas import EventPost, EventGranularitResponse
from Schemas.v1.tenants_schemas import TenantGetPrivate
from typing import Annotated
from Services.auth_service import AuthService
from Services.event_service import EventService
import uuid
from Services.redis_service import RedisService
from Loggers.base_logger import BaseLogger
from ipdb import set_trace

router = APIRouter()

@router.post("/{tenent_id}/usage/event", status_code=status.HTTP_201_CREATED, response_model=EventPost)
def post_event(tenent_id: str, event_data: EventPost, db:Annotated[Session, Depends(get_db)], current_user:Annotated[Tenants, Depends(AuthService().get_current_user)]):
  current_user = TenantGetPrivate.model_validate(current_user)
  event_data = event_data.model_dump(mode="json")

  try:
    event_service = EventService(current_user, event_data)
    r = RedisService()
    response = None

    # set_trace()
    if event_service.no_more_quota():
      BaseLogger.error("Quota exceeded. Enable overage or upgrade plan.")
      raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Quota exceeded. Enable overage or upgrade plan."
        )

    if event_service.event_is_complete() and event_service.event_exists():
      # When users already made a request that was complete, we'll generate a new idempotency key and save it in the react state
      BaseLogger.info("Previous Job Complete. Starting a new one...")
      idempotency_key = uuid.uuid4()
      new_event_data = event_data.copy().model_dump() if not isinstance(event_data, dict) else event_data.copy()
      new_event_data["idempotency_key"] = str(idempotency_key)
      response = EventService(current_user, new_event_data).call()
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=response)

    # When user already made a request that's pending search via idempotency key
    if event_service.event_is_pending():
      BaseLogger.warning("Event already in progress. Returning response")
      idempotency_key = event_data.get("idempotency_key")
      response = r.get_entry(idempotency_key)
      return response

    else:
      # when user is making their first request just call event service and return the temporary redis hash while in progress
      response = event_service.call()
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=response)

    if not response:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No response given")
  except Exception as e:
    # In prod I wouldn't pass e to the exception
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))