from fastapi import APIRouter, Request, status, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from Models.events_model import EventsDB
from Schemas.v1.events_schemas import EventPost
import uuid

router = APIRouter()

@router.post("/{tenent_id}/usage/event")
async def post_event(tenant_id: str, event_data: EventPost, status_code=status.HTTP_201_CREATED):
  if not event_data.allow_overage:
    tenant = db.query(TenantsDB).filter(TenantsDB.tenant_id == tenant_id).first()
    if tenant and tenant.current_usage + event_data.token_cost > tenant.monthly_quota:
      raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail="Quota exceeded. Enable overage or upgrade plan."
      )
  
  new_event = EventsDB(
    event_id=uuid.uuid4(),
    tenant_id=tenant_id,
    prompt_type=event_data.prompt_type,
    token_cost=event_data.token_cost,
    timestamp=event_data.timestamp or datetime.utcnow(),
    idempotency_key=event_data.idempotency_key
  )
  try:
    db.add(new_event)

    db.query(TenantsDB).filter(TenantsDB.tenant_id == tenant_id).update({
      "current_usage": TenantsDB.current_usage + event_in.token_cost
    })
          
    db.commit()
    return {"status": "recorded", "event_id": new_event.event_id}

  except Exception as e:
    db.rollback()
    if "unique constraint" in str(e).lower():
      raise HTTPException(status_code=409, detail="Duplicate event (Idempotency Key)")
    raise HTTPException(status_code=500, detail="Internal Server Error")